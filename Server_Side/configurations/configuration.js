'use strict';

let fs = require('fs');

//TODO: Change this a be compatible with the Config npm module

let config = {};

//--------------------------------------------------------------------------------------------------------------------
//    Local Config
//--------------------------------------------------------------------------------------------------------------------
config.networkProtocol = 'https';                 // If deploying locally, this value needs to be changed to 'http'
config.appProtocol = 'https';                     // If deploying locally, this value needs to be changed to 'http'
config.hfcProtocol = 'grpcs';                    // If deploying locally, this value needs to be changed to 'grpc'

//--------------------------------------------------------------------------------------------------------------------
//    Tracing
//--------------------------------------------------------------------------------------------------------------------

config.trace        = true;
config.traceFile    = __dirname+'/../logs/app_trace.log';     // File where traces should be written to


//Settings for the nodeJS application server
config.offlineUrl = 'localhost';
config.appPort = (process.env.VCAP_APP_PORT) ? process.env.VCAP_APP_PORT : 8080;                         //Port that the NodeJS server is operating on


//--------------------------------------------------------------------------------------------------------------------
//    User information - These credentials are used for HFC to enroll this user and then set them as the registrar to create new users.
//--------------------------------------------------------------------------------------------------------------------
config.registrar_name = 'WebAppAdmin';
config.registrar_password = 'DJY27pEnl16d';

//--------------------------------------------------------------------------------------------------------------------
//    HFC configuration - Defines what protocol to use for communication, bluemix certificate location and key store location
//--------------------------------------------------------------------------------------------------------------------

//Protocol used by HFC to communicate with blockchain peers and CA, need to change this manually.
config.certificate_file_name    = 'certificate.pem';
config.key_store_location       = './keyValStore';

//--------------------------------------------------------------------------------------------------------------------
//    Chaincode
//--------------------------------------------------------------------------------------------------------------------
//Chaincode file location
config.asset = 'github.com/hyperledger/fabric/asset_code';

config.users = [
    {
        enrollmentID: 'Kollur',
        attributes: [
            {name: 'role', value: 'miner'},
            {name: 'username', value: 'Kollur'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'soham_industrial_diamonds',
        attributes: [
            {name: 'role', value: 'distributor'},
            {name: 'username', value: 'soham_industrial_diamonds'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'laxmi_impex',
        attributes: [
            {name: 'role', value: 'distributor'},
            {name: 'username', value: 'laxmi_impex'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'harshal_diamonds',
        attributes: [
            {name: 'role', value: 'distributor'},
            {name: 'username', value: 'harshal_diamonds'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'Beon_Group',
        attributes: [
            {name: 'role', value: 'dealer'},
            {name: 'username', value: 'Beon_Group'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'Milescape',
        attributes: [
            {name: 'role', value: 'dealer'},
            {name: 'username', value: 'Milescape'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'Viewers_laxmi_impex',
        attributes: [
            {name: 'role', value: 'dealer'},
            {name: 'username', value: 'Viewers_laxmi_impex'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'Shah',
        attributes: [
            {name: 'role', value: 'buyer'},
            {name: 'username', value: 'Shah'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'Kothari',
        attributes: [
            {name: 'role', value: 'buyer'},
            {name: 'username', value: 'Kothari'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'Agarwal',
        attributes: [
            {name: 'role', value: 'buyer'},
            {name: 'username', value: 'Agarwal'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'Ajay_Gosh',
        attributes: [
            {name: 'role', value: 'trader'},
            {name: 'username', value: 'Ajay_Gosh'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'Andrew_Hurt',
        attributes: [
            {name: 'role', value: 'trader'},
            {name: 'username', value: 'Andrew_Hurt'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'Rahul_Ajay_Gandhi',
        attributes: [
            {name: 'role', value: 'trader'},
            {name: 'username', value: 'Rahul_Ajay_Gandhi'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'Cray_Bros_London_Ltd',
        attributes: [
            {name: 'role', value: 'cutters'},
            {name: 'username', value: 'Cray_Bros_London_Ltd'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'Aston_Cutting_Centre',
        attributes: [
            {name: 'role', value: 'cutters'},
            {name: 'username', value: 'Aston_Scrap_Centre'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'ScrapIt_UK',
        attributes: [
            {name: 'role', value: 'cutters'},
            {name: 'username', value: 'ScrapIt_UK'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'Adora',
        attributes: [
            {name: 'role', value: 'jewellery_makers'},
            {name: 'username', value: 'Adora'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'Tanishq',
        attributes: [
            {name: 'role', value: 'jewellery_makers'},
            {name: 'username', value: 'Tanishq'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'Kiah',
        attributes: [
            {name: 'role', value: 'jewellery_makers'},
            {name: 'username', value: 'Kiah'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },

    {
        enrollmentID: 'Gaurav_Singh',
        attributes: [
            {name: 'role', value: 'customers'},
            {name: 'username', value: 'Gaurav_Singh'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'Adwaith',
        attributes: [
            {name: 'role', value: 'customers'},
            {name: 'username', value: 'Adwaith'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    },
    {
        enrollmentID: 'Amardev',
        attributes: [
            {name: 'role', value: 'customers'},
            {name: 'username', value: 'Amardev'}
        ],
        registrar: {},
        roles: [],
        affiliation: 'institution_a'
    }

];

//--------------------------------------------------------------------------------------------------------------------
//    Defines the exported values to be used by other fields for connecting to peers or the app. These will be overwritten on app.js being run if Bluemix is being used or Network JSON is defined
//--------------------------------------------------------------------------------------------------------------------
//IP and port configuration
// config.api_ip = config.peers[0].discovery_host; //IP of the peer attempting to be connected to. By default this is the first peer in the peers array.
let credentials;

if (process.env.VCAP_SERVICES) {
    credentials = JSON.parse(process.env.VCAP_SERVICES)['ibm-blockchain-5-prod'][0].credentials;
} else {
    credentials = fs.readFileSync(__dirname + '/../../credentials.json', 'utf8');
    credentials = JSON.parse(credentials);
}

//When using blockchain on bluemix, api_port_external and api_port_internal will be the same
config.api_port_external  = credentials.peers[0].api_port; //port number used when calling api from outside of the vagrant environment
config.api_port_internal  = credentials.peers[0].discovery_port; //port number used when calling api from inside vagrant environment - generally used for chaincode calling out to api
config.api_port_discovery = credentials.peers[0].discovery_port; //port number used for HFC

config.api_ip = credentials.peers[0].discovery_host;

let ca;
for(let key in credentials.ca) {
    ca = credentials.ca[key];
}

//IP and port configuration for the Certificate Authority. This is used for enrolling WebAppAdmin and creating all the user via HFC. Default values are for running Hyperledger locally.
config.ca_ip = ca.discovery_host;     //IP of the CA attempting to be connected to
config.ca_port = ca.discovery_port;         //Discovery port of the Certificate Authority. Used for HFC

if (credentials.users) {
    credentials.users.forEach(function(user) {
        if (user.username === config.registrar_name) {
            config.bluemix_registrar_password = user.secret;
        }
    });
}

exports.config = config; // Exports for use in other files that require this one
