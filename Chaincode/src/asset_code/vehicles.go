package main

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"encoding/json"
	"regexp"
)

var logger = shim.NewLogger("CLDChaincode")

//==============================================================================================================================
//	 Participant types - Each participant type is mapped to an integer which we use to compare to the value stored in a
//						 user's eCert
//==============================================================================================================================
//CURRENT WORKAROUND USES ROLES CHANGE WHEN OWN USERS CAN BE CREATED SO THAT IT READ 1, 2, 3, 4, 5
const   MINER      =  "miner"
const   DISTRIBUTOR   =  "distributor"
const   DEALERSHIP =  "dealership"
const   BUYER  =  "buyer"
const   TRADER =  "trader"
const   CUTTER =  "cutter"
const   JEWELLERY_MAKER =  "jewellery_maker"
const   SCRAP_MERCHANT =  "scrap_merchant"


//==============================================================================================================================
//	 Status types - Asset lifecycle is broken down into 5 statuses, this is part of the business logic to determine what can
//					be done to the vehicle at points in it's lifecycle
//==============================================================================================================================
const   STATE_MINING  			=  0
const   STATE_DISTRIBUTING  			=  1
const   STATE_INTER_DEALING 	=  2
const   STATE_BUYING 			=  3
const   STATE_TRADING  		=  4
const   STATE_CUTTING  		=  5
const   STATE_JEWEL_MAKING  		=  6
const   STATE_PURCHASING  		=  7
const   STATE_BEING_SCRAPPED  		=  8

//==============================================================================================================================
//	 Structure Definitions
//==============================================================================================================================
//	Chaincode - A blank struct for use with Shim (A HyperLedger included go file used for get/put state
//				and other HyperLedger functions)
//==============================================================================================================================
type  SimpleChaincode struct {
}

//==============================================================================================================================
//	Vehicle - Defines the structure for a car object. JSON on right tells it what JSON fields to map to
//			  that element when reading a JSON object into the struct e.g. JSON make -> Struct Make.
//==============================================================================================================================
type Diamond struct {
	Clarity            string `json:"clarity"`
	Diamondat           string `json:"diamondat"`
	Cut             string `json:"cut"`
	Symmetry             string    `json:"symmetry"`
	Owner           string `json:"owner"`
	Polish        string   `json:"polish"`
	Status          int    `json:"status"`
	Colour          string `json:"colour"`
	AssetID           string `json:"assetID"`
	Location string `json:"location"`
	Date string `json:"date"`
	Timestamp string `json:"timestamp"`
	JewelleryType string `json:"jewellerytype"`
	Scrapped bool `json:"scrapped"`
}


//==============================================================================================================================
//	V5C Holder - Defines the structure that holds all the v5cIDs for vehicles that have been created.
//				Used as an index when querying all vehicles.
//==============================================================================================================================

type Asset_Holder struct {
	Assetids 	[]string `json:"assetids"`
}

//==============================================================================================================================
//	User_and_eCert - Struct for storing the JSON of a user and their ecert
//==============================================================================================================================

type User_and_eCert struct {
	Identity string `json:"identity"`
	eCert string `json:"ecert"`
}

//==============================================================================================================================
//	Init Function - Called when the user deploys the chaincode
//==============================================================================================================================
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {

	//Args
	//				0
	//			peer_address

	var assetIDs Asset_Holder

	bytes, err := json.Marshal(assetIDs)

    if err != nil { return nil, errors.New("Error creating Asset_Holder record") }

	err = stub.PutState("assetIDs", bytes)

	for i:=0; i < len(args); i=i+2 {
		t.add_ecert(stub, args[i], args[i+1])
	}

	return nil, nil
}

//==============================================================================================================================
//	 General Functions
//==============================================================================================================================
//	 get_ecert - Takes the name passed and calls out to the REST API for HyperLedger to retrieve the ecert
//				 for that user. Returns the ecert as retrived including html encoding.
//==============================================================================================================================
func (t *SimpleChaincode) get_ecert(stub shim.ChaincodeStubInterface, name string) ([]byte, error) {

	ecert, err := stub.GetState(name)

	if err != nil { return nil, errors.New("Couldn't retrieve ecert for user " + name) }

	return ecert, nil
}

//==============================================================================================================================
//	 add_ecert - Adds a new ecert and user pair to the table of ecerts
//==============================================================================================================================

func (t *SimpleChaincode) add_ecert(stub shim.ChaincodeStubInterface, name string, ecert string) ([]byte, error) {


	err := stub.PutState(name, []byte(ecert))

	if err == nil {
		return nil, errors.New("Error storing eCert for user " + name + " identity: " + ecert)
	}

	return nil, nil

}

//==============================================================================================================================
//	 get_caller - Retrieves the username of the user who invoked the chaincode.
//				  Returns the username as a string.
//==============================================================================================================================

func (t *SimpleChaincode) get_username(stub shim.ChaincodeStubInterface) (string, error) {

    username, err := stub.ReadCertAttribute("username");
	if err != nil { return "", errors.New("Couldn't get attribute 'username'. Error: " + err.Error()) }
	return string(username), nil
}

//==============================================================================================================================
//	 check_affiliation - Takes an ecert as a string, decodes it to remove html encoding then parses it and checks the
// 				  		certificates common name. The affiliation is stored as part of the common name.
//==============================================================================================================================

func (t *SimpleChaincode) check_affiliation(stub shim.ChaincodeStubInterface) (string, error) {
    affiliation, err := stub.ReadCertAttribute("role");
	if err != nil { return "", errors.New("Couldn't get attribute 'role'. Error: " + err.Error()) }
	return string(affiliation), nil

}

//==============================================================================================================================
//	 get_caller_data - Calls the get_ecert and check_role functions and returns the ecert and role for the
//					 name passed.
//==============================================================================================================================

func (t *SimpleChaincode) get_caller_data(stub shim.ChaincodeStubInterface) (string, string, error){

	user, err := t.get_username(stub)

    // if err != nil { return "", "", err }

	// ecert, err := t.get_ecert(stub, user);

    // if err != nil { return "", "", err }

	affiliation, err := t.check_affiliation(stub);

    if err != nil { return "", "", err }

	return user, affiliation, nil
}

//==============================================================================================================================
//	 retrieve_v5c - Gets the state of the data at v5cID in the ledger then converts it from the stored
//					JSON into the Vehicle struct for use in the contract. Returns the Vehcile struct.
//					Returns empty v if it errors.
//==============================================================================================================================
func (t *SimpleChaincode) retrieve_assetID(stub shim.ChaincodeStubInterface, assetID string) (Diamond, error) {

	var d Diamond

	bytes, err := stub.GetState(assetID);

	if err != nil {	fmt.Printf("RETRIEVE_AssetID: Failed to invoke diamond_code: %s", err); return d, errors.New("RETRIEVE_AssetID: Error retrieving diamond with assetID = " + assetID) }

	err = json.Unmarshal(bytes, &d);

    if err != nil {	fmt.Printf("RETRIEVE_AssetID: Corrupt asset record "+string(bytes)+": %s", err); return d, errors.New("RETRIEVE_AssetID: Corrupt diamond record"+string(bytes))	}

	return d, nil
}

//==============================================================================================================================
// save_changes - Writes to the ledger the Vehicle struct passed in a JSON format. Uses the shim file's
//				  method 'PutState'.
//==============================================================================================================================
func (t *SimpleChaincode) save_changes(stub shim.ChaincodeStubInterface, d Diamond) (bool, error) {

	bytes, err := json.Marshal(d)

	if err != nil { fmt.Printf("SAVE_CHANGES: Error converting diamond record: %s", err); return false, errors.New("Error converting diamond record") }

	err = stub.PutState(d.AssetID, bytes)

	if err != nil { fmt.Printf("SAVE_CHANGES: Error storing diamond record: %s", err); return false, errors.New("Error storing asset record") }

	return true, nil
}

//==============================================================================================================================
//	 Router Functions
//==============================================================================================================================
//	Invoke - Called on chaincode invoke. Takes a function name passed and calls that function. Converts some
//		  initial arguments passed to other things for use in the called function e.g. name -> ecert
//==============================================================================================================================
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {

	caller, caller_affiliation, err := t.get_caller_data(stub)

	if err != nil { return nil, errors.New("Error retrieving caller information")}


	if function == "create_diamond" {
        return t.create_diamond(stub, caller, caller_affiliation, args[0])
	} else if function == "ping" {
        return t.ping(stub)
    } else { 																				// If the function is not a create then there must be a car so we need to retrieve the car.
		argPos := 1

		if function == "scrap_diamond" {																// If its a scrap vehicle then only two arguments are passed (no update value) all others have three arguments and the v5cID is expected in the last argument
			argPos = 0
		}

		d, err := t.retrieve_assetID(stub, args[argPos])

        if err != nil { fmt.Printf("INVOKE: Error retrieving assetID: %s", err); return nil, errors.New("Error retrieving assetID") }


        if strings.Contains(function, "update") == false && function != "scrap_diamond"    { 									// If the function is not an update or a scrappage it must be a transfer so we need to get the ecert of the recipient.


				if 		   function == "miner_to_distributor" { return t.miner_to_distributor(stub, d, caller, caller_affiliation, args[0], "distributor")
				} else if  function == "distributor_to_dealership"   { return t.distributor_to_dealership(stub, d, caller, caller_affiliation, args[0], "dealership")
				} else if  function == "dealership_to_buyer" 	   { return t.dealership_to_buyer(stub, d, caller, caller_affiliation, args[0], "buyer")
				} else if  function == "buyer_to_trader"  { return t.buyer_to_trader(stub, d, caller, caller_affiliation, args[0], "trader")
				} else if  function == "trader_to_cutter"  { return t.trader_to_cutter(stub, d, caller, caller_affiliation, args[0], "cutter")
				} else if  function == "cutter_to_jewellery_maker" { return t.cutter_to_jewellery_maker(stub, d, caller, caller_affiliation, args[0], "jewellery_maker")
				} else if  function == "jewellery_maker_to_customer" { return t.jewellery_maker_to_customer(stub, d, caller, caller_affiliation, args[0], "customer")
				} else if  function == "customer_to_scrap_merchant" { return t.customer_to_scrap_merchant(stub, d, caller, caller_affiliation, args[0], "scrap_merchant")
				}

		} else if function == "update_clarity"  	    { return t.update_clarity(stub, d, caller, caller_affiliation, args[0])
		} else if function == "update_diamondat"        { return t.update_diamondat(stub, d, caller, caller_affiliation, args[0])
		} else if function == "update_cut" { return t.update_cut(stub, d, caller, caller_affiliation, args[0])
		} else if function == "update_symmetry" 			{ return t.update_symmetry(stub, d, caller, caller_affiliation, args[0])
        } else if function == "update_colour" 		{ return t.update_colour(stub, d, caller, caller_affiliation, args[0])
		} else if function == "update_polish" 		{ return t.update_polish(stub, d, caller, caller_affiliation, args[0])
		} else if function == "update_location" 		{ return t.update_location(stub, d, caller, caller_affiliation, args[0])
		} else if function == "update_timestamp" 		{ return t.update_timestamp(stub, d, caller, caller_affiliation, args[0])
		} else if function == "update_jewellery_type" 		{ return t.update_jewellery_type(stub, d, caller, caller_affiliation, args[0])
		} else if function == "update_date" 		{ return t.update_date(stub, d, caller, caller_affiliation, args[0])
		} else if function == "scrap_diamond" 		{ return t.scrap_diamond(stub, d, caller, caller_affiliation) }

		return nil, errors.New("Function of the name "+ function +" doesn't exist.")

	}
}
//=================================================================================================================================
//	Query - Called on chaincode query. Takes a function name passed and calls that function. Passes the
//  		initial arguments passed are passed on to the called function.
//=================================================================================================================================
func (t *SimpleChaincode) Query(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {

	caller, caller_affiliation, err := t.get_caller_data(stub)
	if err != nil { fmt.Printf("QUERY: Error retrieving caller details", err); return nil, errors.New("QUERY: Error retrieving caller details: "+err.Error()) }

    logger.Debug("function: ", function)
    logger.Debug("caller: ", caller)
    logger.Debug("affiliation: ", caller_affiliation)

	if function == "get_diamond_details" {
		if len(args) != 1 { fmt.Printf("Incorrect number of arguments passed"); return nil, errors.New("QUERY: Incorrect number of arguments passed") }
		d, err := t.retrieve_assetID(stub, args[0])
		if err != nil { fmt.Printf("QUERY: Error retrieving assetID: %s", err); return nil, errors.New("QUERY: Error retrieving assetID "+err.Error()) }
		return t.get_diamond_details(stub, d, caller, caller_affiliation)
	} else if function == "check_unique_assetID" {
		return t.check_unique_assetID(stub, args[0], caller, caller_affiliation)
	} else if function == "get_diamonds" {
		return t.get_diamonds(stub, caller, caller_affiliation)
	} else if function == "get_ecert" {
		return t.get_ecert(stub, args[0])
	} else if function == "ping" {
		return t.ping(stub)
	}

	return nil, errors.New("Received unknown function invocation " + function)

}

//=================================================================================================================================
//	 Ping Function
//=================================================================================================================================
//	 Pings the peer to keep the connection alive
//=================================================================================================================================
func (t *SimpleChaincode) ping(stub shim.ChaincodeStubInterface) ([]byte, error) {
	return []byte("Hello, world!"), nil
}

//=================================================================================================================================
//	 Create Function
//=================================================================================================================================
//	 Create Vehicle - Creates the initial JSON for the vehcile and then saves it to the ledger.
//=================================================================================================================================
func (t *SimpleChaincode) create_diamond(stub shim.ChaincodeStubInterface, caller string, caller_affiliation string, assetID string) ([]byte, error) {
	var d Diamond

	asset_ID         := "\"assetID\":\""+assetID+"\", "							// Variables to define the JSON
	symmetry            := "\"Symmetry\", "
	clarity           := "\"Clarity\":\"UNDEFINED\", "
	diamondat         := "\"Diamondat\":\"UNDEFINED\", "
	cut            := "\"Cut\":\"UNDEFINED\", "
	owner          := "\"Owner\":\""+caller+"\", "
	colour         := "\"Colour\":\"UNDEFINED\", "
	jewellery_type         := "\"Jewellery_type\":\"UNDEFINED\", "
	timestamp         := "\"Timestamp\":\"UNDEFINED\", "
	polish         := "\"Polish\":\"UNDEFINED\", "
	date         := "\"Date\":\"UNDEFINED\", "
	location  := "\"Location\":\"UNDEFINED\", "
	status         := "\"Status\":0, "
	scrapped       := "\"Scrapped\":false"

	diamond_json := "{"+asset_ID+symmetry+clarity+diamondat+cut+owner+colour+location+status+jewellery_type+polish+timestamp+date+scrapped+"}" 	// Concatenates the variables to create the total JSON object

	matched, err := regexp.Match("^[A-z][A-z][0-9]{7}", []byte(assetID))  				// matched = true if the v5cID passed fits format of two letters followed by seven digits

												if err != nil { fmt.Printf("CREATE_DIAMOND: Invalid assetID: %s", err); return nil, errors.New("Invalid assetID") }

	if 				asset_ID  == "" 	 ||
					matched == false    {
																		fmt.Printf("CREATE_DIAMOND: Invalid assetID provided");
																		return nil, errors.New("Invalid assetID provided")
	}

	err = json.Unmarshal([]byte(diamond_json), &d)							// Convert the JSON defined above into a vehicle object for go

																		if err != nil { return nil, errors.New("Invalid JSON object") }

	record, err := stub.GetState(d.AssetID) 								// If not an error then a record exists so cant create a new car with this V5cID as it must be unique

																		if record != nil { return nil, errors.New("Vehicle already exists") }

	if 	caller_affiliation != MINER {							// Only the regulator can create a new v5c

		return nil, errors.New(fmt.Sprintf("Permission Denied. create_diamond. %d === %d", caller_affiliation, MINER))

	}

	_, err  = t.save_changes(stub, d)

																		if err != nil { fmt.Printf("CREATE_DIAMOND: Error saving changes: %s", err); return nil, errors.New("Error saving changes") }

	bytes, err := stub.GetState("assetIDs")

																		if err != nil { return nil, errors.New("Unable to get assetIDs") }

	var assetIDs Asset_Holder

	err = json.Unmarshal(bytes, &assetIDs)

																		if err != nil {	return nil, errors.New("Corrupt Asset_Holder record") }

	assetIDs.AssetIDs = append(assetIDs.AssetIDs, assetID)


	bytes, err = json.Marshal(assetIDs)

															if err != nil { fmt.Print("Error creating Asset_Holder record") }

	err = stub.PutState("assetIDs", bytes)

															if err != nil { return nil, errors.New("Unable to put the state") }

	return nil, nil

}

//=================================================================================================================================
//	 Transfer Functions
//=================================================================================================================================
//	 miner_to_distributor
//=================================================================================================================================
func (t *SimpleChaincode) miner_to_distributor(stub shim.ChaincodeStubInterface, d Diamond, caller string, caller_affiliation string, recipient_name string, recipient_affiliation string) ([]byte, error) {

	if     	d.Status				== STATE_MINING	&&
			d.Owner					== caller			&&
			caller_affiliation		== MINER		&&
			recipient_affiliation	== DISTRIBUTOR		&&
			d.Scrapped				== false			{		// If the roles and users are ok

					d.Owner  = recipient_name		// then make the owner the new owner
					d.Status = STATE_DISTRIBUTING			// and mark it in the state of manufacture

	} else {									// Otherwise if there is an error
															fmt.Printf("MINER_TO_DISTRIBUTOR: Permission Denied");
                                                            return nil, errors.New(fmt.Sprintf("Permission Denied. miner_to_distributor. %d %d === %d, %d === %d, %d === %d, %d === %d, %d === %d", d, d.Status, STATE_INTER_DEALING, d.Owner, caller, caller_affiliation, DEALERSHIP, recipient_affiliation, SCRAP_MERCHANT, d.Scrapped, false))


	}

	_, err := t.save_changes(stub, d)						// Write new state

															if err != nil {	fmt.Printf("MINER_TO_DISTRIBUTOR: Error saving changes: %s", err); return nil, errors.New("Error saving changes")	}

	return nil, nil									// We are Done

}

//=================================================================================================================================
//	 manufacturer_to_private
//=================================================================================================================================
func (t *SimpleChaincode) distributor_to_dealership(stub shim.ChaincodeStubInterface, d Diamond, caller string, caller_affiliation string, recipient_name string, recipient_affiliation string) ([]byte, error) {

	if 		d.Clarity 	 == "UNDEFINED" ||
			d.Diamondat  == "UNDEFINED" ||
			d.Cut 	 == "UNDEFINED" ||
			d.Colour == "UNDEFINED" ||
			d.Symmetry == "UNDEFINED"				{					//If any part of the car is undefined it has not bene fully manufacturered so cannot be sent
															fmt.Printf("DISTRIBUTOR_TO_DEALERSHIP: Diamond not fully defined")
															return nil, errors.New(fmt.Sprintf("Diamond not fully defined. %d", d))
	}

	if 		d.Status				== STATE_DISTRIBUTING	&&
			d.Owner					== caller				&&
			caller_affiliation		== DISTRIBUTOR			&&
			recipient_affiliation	== DEALERSHIP		&&
			d.Scrapped     == false							{

					d.Owner = recipient_name
					d.Status = STATE_INTER_DEALING

	} else {
        return nil, errors.New(fmt.Sprintf("Permission Denied. distributor_to_dealership. %d %d === %d, %d === %d, %d === %d, %d === %d, %d === %d", d, d.Status, STATE_INTER_DEALING, d.Owner, caller, caller_affiliation, DEALERSHIP, recipient_affiliation, SCRAP_MERCHANT, d.Scrapped, false))
    }

	_, err := t.save_changes(stub, d)

	if err != nil { fmt.Printf("DISTRIBUTOR_TO_DEALERSHIP: Error saving changes: %s", err); return nil, errors.New("Error saving changes") }

	return nil, nil

}

//=================================================================================================================================
//	 private_to_private
//=================================================================================================================================
func (t *SimpleChaincode) dealership_to_buyer(stub shim.ChaincodeStubInterface, d Diamond, caller string, caller_affiliation string, recipient_name string, recipient_affiliation string) ([]byte, error) {

	if 		d.Status				== STATE_BUYING	&&
			d.Owner					== caller					&&
			caller_affiliation		== DEALERSHIP			&&
			recipient_affiliation	== BUYER			&&
			d.Scrapped				== false					{

					d.Owner = recipient_name

	} else {
        return nil, errors.New(fmt.Sprintf("Permission Denied. dealership_to_buyer. %d %d === %d, %d === %d, %d === %d, %d === %d, %d === %d", d, d.Status, STATE_INTER_DEALING, d.Owner, caller, caller_affiliation, DEALERSHIP, recipient_affiliation, SCRAP_MERCHANT, d.Scrapped, false))
	}

	_, err := t.save_changes(stub, d)

															if err != nil { fmt.Printf("DEALERSHIP_TO_BUYER: Error saving changes: %s", err); return nil, errors.New("Error saving changes") }

	return nil, nil

}

//=================================================================================================================================
//	 private_to_lease_company
//=================================================================================================================================
func (t *SimpleChaincode) buyer_to_trader(stub shim.ChaincodeStubInterface, d Diamond, caller string, caller_affiliation string, recipient_name string, recipient_affiliation string) ([]byte, error) {

	if 		d.Status				== STATE_TRADING	&&
			d.Owner					== caller					&&
			caller_affiliation		== BUYER			&&
			recipient_affiliation	== TRADER			&&
            d.Scrapped     			== false					{

					d.Owner = recipient_name

	} else {
        return nil, errors.New( fmt.Sprintf("Permission denied. buyer_to_trader. %d === %d, %d === %d, %d === %d, %d === %d, %d === %d", d.Status, STATE_INTER_DEALING, d.Owner, caller, caller_affiliation, DEALERSHIP, recipient_affiliation, SCRAP_MERCHANT, d.Scrapped, false))

	}

	_, err := t.save_changes(stub, d)
															if err != nil { fmt.Printf("BUYER_TO_TRADER: Error saving changes: %s", err); return nil, errors.New("Error saving changes") }

	return nil, nil

}

//=================================================================================================================================
//	 lease_company_to_private
//=================================================================================================================================
func (t *SimpleChaincode) trader_to_cutter(stub shim.ChaincodeStubInterface, d Diamond, caller string, caller_affiliation string, recipient_name string, recipient_affiliation string) ([]byte, error) {

	if		d.Status				== STATE_CUTTING	&&
			d.Owner  				== caller					&&
			caller_affiliation		== TRADER			&&
			recipient_affiliation	== CUTTER			&&
			d.Scrapped				== false					{

				d.Owner = recipient_name

	} else {
		return nil, errors.New(fmt.Sprintf("Permission Denied. trader_to_cutter. %d %d === %d, %d === %d, %d === %d, %d === %d, %d === %d", d, d.Status, STATE_INTER_DEALING, d.Owner, caller, caller_affiliation, DEALERSHIP, recipient_affiliation, SCRAP_MERCHANT, d.Scrapped, false))
	}

	_, err := t.save_changes(stub, d)
															if err != nil { fmt.Printf("TRADER_TO_CUTTER: Error saving changes: %s", err); return nil, errors.New("Error saving changes") }

	return nil, nil

}

//=================================================================================================================================
//	 private_to_scrap_merchant
//=================================================================================================================================
func (t *SimpleChaincode) cutter_to_jewellery_maker(stub shim.ChaincodeStubInterface, d Diamond, caller string, caller_affiliation string, recipient_name string, recipient_affiliation string) ([]byte, error) {

	if		d.Status				== STATE_JEWEL_MAKING	&&
			d.Owner					== caller					&&
			caller_affiliation		== CUTTER			&&
			recipient_affiliation	== JEWELLERY_MAKER			&&
			d.Scrapped				== false					{

					d.Owner = recipient_name
					d.Status = STATE_JEWEL_MAKING

	} else {
        return nil, errors.New(fmt.Sprintf("Permission Denied. cutter_to_jewellery_maker. %d %d === %d, %d === %d, %d === %d, %d === %d, %d === %d", d, d.Status, STATE_INTER_DEALING, d.Owner, caller, caller_affiliation, DEALERSHIP, recipient_affiliation, SCRAP_MERCHANT, d.Scrapped, false))
	}

	_, err := t.save_changes(stub, d)

															if err != nil { fmt.Printf("CUTTER_TO_JEWELLERY_MAKER: Error saving changes: %s", err); return nil, errors.New("Error saving changes") }

	return nil, nil

}
//=================================================================================================================================
//	 private_to_scrap_merchant
//=================================================================================================================================
func (t *SimpleChaincode) jewellery_maker_to_customer(stub shim.ChaincodeStubInterface, d Diamond, caller string, caller_affiliation string, recipient_name string, recipient_affiliation string) ([]byte, error) {

	if		d.Status				== STATE_PURCHASING	&&
			d.Owner					== caller					&&
			caller_affiliation		== JEWELLERY_MAKER			&&
			recipient_affiliation	== CUSTOMER			&&
			d.Scrapped				== false					{

					d.Owner = recipient_name
					d.Status = STATE_PURCHASING

	} else {
        return nil, errors.New(fmt.Sprintf("Permission Denied. jewellery_maker_to_customer. %d %d === %d, %d === %d, %d === %d, %d === %d, %d === %d", d, d.Status, STATE_INTER_DEALING, d.Owner, caller, caller_affiliation, DEALERSHIP, recipient_affiliation, SCRAP_MERCHANT, d.Scrapped, false))
	}

	_, err := t.save_changes(stub, d)

															if err != nil { fmt.Printf("JEWELLERY_MAKER_TO_CUSTOMER: Error saving changes: %s", err); return nil, errors.New("Error saving changes") }

	return nil, nil

}
//=================================================================================================================================
//	 private_to_scrap_merchant
//=================================================================================================================================
func (t *SimpleChaincode) customer_to_scrap_merchant(stub shim.ChaincodeStubInterface, d Diamond, caller string, caller_affiliation string, recipient_name string, recipient_affiliation string) ([]byte, error) {

	if		d.Status				== STATE_BEING_SCRAPPED	&&
			d.Owner					== caller					&&
			caller_affiliation		== CUSTOMER			&&
			recipient_affiliation	== SCRAP_MERCHANT			&&
			d.Scrapped				== false					{

					d.Owner = recipient_name
					d.Status = STATE_BEING_SCRAPPED

	} else {
        return nil, errors.New(fmt.Sprintf("Permission Denied. customer_to_scrap_merchant. %d %d === %d, %d === %d, %d === %d, %d === %d, %d === %d", d, d.Status, STATE_INTER_DEALING, d.Owner, caller, caller_affiliation, DEALERSHIP, recipient_affiliation, SCRAP_MERCHANT, d.Scrapped, false))
	}

	_, err := t.save_changes(stub, d)

															if err != nil { fmt.Printf("CUSTOMER_TO_SCRAP_MERCHANT: Error saving changes: %s", err); return nil, errors.New("Error saving changes") }

	return nil, nil

}

//=================================================================================================================================
//	 Update Functions
//=================================================================================================================================
//	 update_diamondat
//=================================================================================================================================
func (t *SimpleChaincode) update_diamondat(stub shim.ChaincodeStubInterface, d Diamond, caller string, caller_affiliation string, new_value string) ([]byte, error) {

	new_diamondat, err := strconv.Atoi(string(new_value)) 		                // will return an error if the new vin contains non numerical chars

															if err != nil || len(string(new_value)) != 15 { return nil, errors.New("Invalid value passed for new Diamondat") }

	if 		d.Status			== STATE_DISTRIBUTING	&&
			d.Owner				== caller				&&
			caller_affiliation	== DISTRIBUTOR			&&
			d.Diamondat				== 0					&&			// Can't change the VIN after its initial assignment
			d.Scrapped			== false				{

					d.Diamondat = new_diamondat					// Update to the new value
	} else {

        return nil, errors.New(fmt.Sprintf("Permission denied. update_diamondat %d %d %d %d %d", d.Status, STATE_DISTRIBUTING, d.Owner, caller, d.Diamondat, d.Scrapped))

	}

	_, err  = t.save_changes(stub, d)						// Save the changes in the blockchain

															if err != nil { fmt.Printf("UPDATE_DIAMONDAT: Error saving changes: %s", err); return nil, errors.New("Error saving changes") }

	return nil, nil

}


//=================================================================================================================================
//	 update_symmetry
//=================================================================================================================================
func (t *SimpleChaincode) update_registration(stub shim.ChaincodeStubInterface, d Diamond, caller string, caller_affiliation string, new_value string) ([]byte, error) {


	if		d.Owner				== caller			&&
			caller_affiliation	!= SCRAP_MERCHANT	&&
			d.Scrapped			== false			{

					d.Symmetry = new_value

	} else {
        return nil, errors.New(fmt.Sprint("Permission denied. update_symmetry"))
	}

	_, err := t.save_changes(stub, d)

															if err != nil { fmt.Printf("UPDATE_SYMMETRY: Error saving changes: %s", err); return nil, errors.New("Error saving changes") }

	return nil, nil

}

//=================================================================================================================================
//	 update_colour
//=================================================================================================================================
func (t *SimpleChaincode) update_colour(stub shim.ChaincodeStubInterface, d Diamond, caller string, caller_affiliation string, new_value string) ([]byte, error) {

	if 		d.Owner				== caller				&&
			caller_affiliation	== DISTRIBUTOR			&&/*((d.Owner				== caller			&&
			caller_affiliation	== DISTRIBUTOR)		||
			caller_affiliation	== MINER)			&&*/
			d.Scrapped			== false				{

					d.Colour = new_value
	} else {

		return nil, errors.New(fmt.Sprint("Permission denied. update_colour %t %t %t" + d.Owner == caller, caller_affiliation == DISTRIBUTOR, d.Scrapped))
	}

	_, err := t.save_changes(stub, d)

		if err != nil { fmt.Printf("UPDATE_COLOUR: Error saving changes: %s", err); return nil, errors.New("Error saving changes") }

	return nil, nil

}

//=================================================================================================================================
//	 update_clarity
//=================================================================================================================================
func (t *SimpleChaincode) update_clarity(stub shim.ChaincodeStubInterface, d Diamond, caller string, caller_affiliation string, new_value string) ([]byte, error) {

	if 		d.Status			== STATE_DISTRIBUTING	&&
			d.Owner				== caller				&&
			caller_affiliation	== DISTRIBUTOR			&&
			d.Scrapped			== false				{

					d.Make = new_value
	} else {

        return nil, errors.New(fmt.Sprint("Permission denied. update_clarity %t %t %t" + d.Owner == caller, caller_affiliation == DISTRIBUTOR, d.Scrapped))


	}

	_, err := t.save_changes(stub, d)

															if err != nil { fmt.Printf("UPDATE_CLARITY: Error saving changes: %s", err); return nil, errors.New("Error saving changes") }

	return nil, nil

}

//=================================================================================================================================
//	 update_cut
//=================================================================================================================================
func (t *SimpleChaincode) update_cut(stub shim.ChaincodeStubInterface, d Diamond, caller string, caller_affiliation string, new_value string) ([]byte, error) {

	if 		d.Status			== STATE_DISTRIBUTING	&&
			d.Owner				== caller				&&
			caller_affiliation	== DISTRIBUTOR			&&
			d.Scrapped			== false				{

					d.Cut = new_value

	} else {
        return nil, errors.New(fmt.Sprint("Permission denied. update_cut %t %t %t" + d.Owner == caller, caller_affiliation == DISTRIBUTOR, d.Scrapped))

	}

	_, err := t.save_changes(stub, d)

															if err != nil { fmt.Printf("UPDATE_CUT: Error saving changes: %s", err); return nil, errors.New("Error saving changes") }

	return nil, nil

}
//=================================================================================================================================
//	 update_Polish
//=================================================================================================================================
func (t *SimpleChaincode) update_polish(stub shim.ChaincodeStubInterface, d Diamond, caller string, caller_affiliation string, new_value string) ([]byte, error) {

	if 		d.Owner				== caller				&&
			caller_affiliation	== DISTRIBUTOR			&&/*((d.Owner				== caller			&&
			caller_affiliation	== DISTRIBUTOR)		||
			caller_affiliation	== MINER)			&&*/
			d.Scrapped			== false				{

					d.Polish = new_value
	} else {

		return nil, errors.New(fmt.Sprint("Permission denied. update_polish %t %t %t" + d.Owner == caller, caller_affiliation == DISTRIBUTOR, d.Scrapped))
	}

	_, err := t.save_changes(stub, d)

		if err != nil { fmt.Printf("UPDATE_POLISH: Error saving changes: %s", err); return nil, errors.New("Error saving changes") }

	return nil, nil

}
//=================================================================================================================================
//	 scrap_Diamond
//=================================================================================================================================
func (t *SimpleChaincode) scrap_diamond(stub shim.ChaincodeStubInterface, d Diamond, caller string, caller_affiliation string) ([]byte, error) {

	if		d.Status			== STATE_BEING_SCRAPPED	&&
			d.Owner				== caller				&&
			caller_affiliation	== SCRAP_MERCHANT		&&
			d.Scrapped			== false				{

					d.Scrapped = true

	} else {
		return nil, errors.New("Permission denied. scrap_diamond")
	}

	_, err := t.save_changes(stub, d)

															if err != nil { fmt.Printf("SCRAP_DIAMOND: Error saving changes: %s", err); return nil, errors.New("SCRAP_DIAMOND Error saving changes") }

	return nil, nil

}

//=================================================================================================================================
//	 Read Functions
//=================================================================================================================================
//	 get_diamond_details
//=================================================================================================================================
func (t *SimpleChaincode) get_diamond_details(stub shim.ChaincodeStubInterface, d Diamond, caller string, caller_affiliation string) ([]byte, error) {

	bytes, err := json.Marshal(d)

																if err != nil { return nil, errors.New("GET_DIAMOND_DETAILS: Invalid diamond object") }

	if 		d.Owner				== caller		||
			caller_affiliation	== MINER	{

					return bytes, nil
	} else {
																return nil, errors.New("Permission Denied. get_diamond_details")
	}

}

//=================================================================================================================================
//	 get_diamonds
//=================================================================================================================================

func (t *SimpleChaincode) get_diamonds(stub shim.ChaincodeStubInterface, caller string, caller_affiliation string) ([]byte, error) {
	bytes, err := stub.GetState("assetIDs")

																			if err != nil { return nil, errors.New("Unable to get assetIDs") }

	var assetIDs Asset_Holder

	err = json.Unmarshal(bytes, &assetIDs)

																			if err != nil {	return nil, errors.New("Corrupt Asset_Holder") }

	result := "["

	var temp []byte
	var d Diamond

	for _, assetID := range assetIDs.AssetIDs {

		d, err = t.retrieve_assetIDs(stub, assetID)

		if err != nil {return nil, errors.New("Failed to retrieve AssetID")}

		temp, err = t.get_diamond_details(stub, d, caller, caller_affiliation)

		if err == nil {
			result += string(temp) + ","
		}
	}

	if len(result) == 1 {
		result = "[]"
	} else {
		result = result[:len(result)-1] + "]"
	}

	return []byte(result), nil
}

//=================================================================================================================================
//	 check_unique_assetID
//=================================================================================================================================
func (t *SimpleChaincode) check_unique_assetID(stub shim.ChaincodeStubInterface, assetID string, caller string, caller_affiliation string) ([]byte, error) {
	_, err := t.retrieve_assetID(stub, assetID)
	if err == nil {
		return []byte("false"), errors.New("AssetID is not unique")
	} else {
		return []byte("true"), nil
	}
}

//=================================================================================================================================
//	 Main - main - Starts up the chaincode
//=================================================================================================================================
func main() {

	err := shim.Start(new(SimpleChaincode))

															if err != nil { fmt.Printf("Error starting Chaincode: %s", err) }
}
