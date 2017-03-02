

const hfc = require('hfc');
const Asset = require(__dirname+'/../../../tools/utils/asset');

let tracing = require(__dirname+'/../../../tools/traces/trace.js');
let map_ID = require(__dirname+'/../../../tools/map_ID/map_ID.js');
var reload = require('require-reload')(require),
 initial_assets = reload(__dirname+'/../../../blockchain/assets/assets/initial_assets.js');
let fs = require('fs');

const TYPES = [
    'miner_to_distributor',
    'distributor_to_dealership',
    'dealership_to_buyer',
    'buyer_to_trader',
    'trader_to_cutter',
'cutter_to_jewellery_maker',
'jewellery_maker_to_customer'

];

let assetData;
let assetIDResults;
function create(req, res, next, usersToSecurityContext) {
    try {
		assetIDResults=[];
		initial_assets = reload(__dirname+'/../../../blockchain/assets/assets/initial_assets.js');
        let chain = hfc.getChain('myChain');
        assetData = new Asset(usersToSecurityContext);

        let diamonds;
        res.write(JSON.stringify({message:'Creating assets'})+'&&');
        fs.writeFileSync(__dirname+'/../../../logs/demo_status.log', '{"logs": []}');

        tracing.create('ENTER', 'POST admin/demo', req.body);

        let scenario = req.body.scenario;

        if(scenario === 'simple' || scenario === 'full') {
            diamonds = initial_assets[scenario];
        } else {
            let error = {};
            error.message = 'Scenario type not recognised';
            error.error = true;
            res.end(JSON.stringify(error));
            return;
        }

        if(diamonds.hasOwnProperty('diamonds')) {
            tracing.create('INFO', 'Demo', 'Found diamonds');
            let diamondVal = diamonds.diamonds;
                updateDemoStatus({message: 'Creating assets'});
            //chain.getEventHub().connect();
            return createAssets(diamondVal)
            .then(function() {
				console.log('got assets');
                return assetIDResults.reduce(function(prev, assetID, index) {
                   
					let Diamond = diamondVal[index];
					 
                  let seller = map_ID.user_to_id('Kollur');
                    let buyer = map_ID.user_to_id(Diamond.Owners[1]);
                     return prev.then(function() {
                        return transferAsset(assetID, seller, buyer, 'miner_to_distributor');
                    });
                }, Promise.resolve());
            })
            .then(function() {
				
                updateDemoStatus({message: 'Updating assets'});
                return assetIDResults.reduce(function(prev, assetID, index){
                    let Diamond = diamondVal[index];
                    return prev.then(function() {
                        return populateAsset(assetID, Diamond);
                    });
                }, Promise.resolve());
            })
            .then(function() {
                updateDemoStatus({message: 'Transfering assets between owners'});
                return assetIDResults.reduce(function(prev, assetID, index) {
                    let Diamond = diamondVal[index];
                    return prev.then(function() {
                        return transferBetweenOwners(assetID, Diamond);
                    });
                }, Promise.resolve());
            })
            .then(function() {
                updateDemoStatus({message: 'Demo setup'});
                //chain.getEventHub().disconnect();
                res.end(JSON.stringify({message: 'Demo setup'}));
            })
            .catch(function(err) {
                tracing.create('ERROR   DEMO', JSON.stringify(err), '');
                updateDemoStatus({'message: ': JSON.stringify(err), error: true});
               tracing.create('ERROR', 'POST admin/demo', err.stack);
                //chain.getEventHub().disconnect();
                res.end(JSON.stringify(err));
            });
        } else {
            let error = {};
            error.message = 'Initial assets not found';
            error.error = true;
            updateDemoStatus({'message: ': JSON.parse(error), error: true});
            res.end(JSON.stringify(error));
            return;
        }
    } catch (e) {
        console.log(e);
    }
}

function transferBetweenOwners(assetID, Diamond, results) {
    let functionName;
    let newDiamond = JSON.parse(JSON.stringify(Diamond));
    if (!results) {
        results = [];
    }
    if (newDiamond.Owners.length > 2) {
		 
        let seller = map_ID.user_to_id(newDiamond.Owners[1]); // First after Kollur
        let buyer = map_ID.user_to_id(newDiamond.Owners[2]); // Second after Kollur
        functionName = TYPES[results.length + 1];
		console.log('transferAsset============><',assetID, seller, buyer, functionName,'<><><>');
        return transferAsset(assetID, seller, buyer, functionName)
        .then(function(result) {
            console.log('[#] Transfer asset ' + assetID + ' between ' + seller + ' -> ' + buyer);
            results.push(result);
            newDiamond.Owners.shift();
            return transferBetweenOwners(assetID, newDiamond, results);
			})
        .catch((err) => {
            console.log('[X] Unable to transfer Diamond', err);
        });
    } else {
        return Promise.resolve(results);
    }
}

// Uses recurision because Promise.all() breaks HFC
function createAssets(diamonds) {
 
	
	return diamonds.reduce(function(prev, diamond, index) {
        return prev.then(function() {
            return createAsset()
            .then(function(result) {
                assetIDResults.push(result);
            });
        });
    }, Promise.resolve());
}

function createAsset() {
    console.log('[#] Creating Asset');
    return assetData.create('Kollur');
}

function populateAssetProperty(assetID, ownerId, propertyName, propertyValue) {
    let normalisedPropertyName = propertyName.toLowerCase();
	console.log('[#] populateAsset',ownerId, 'update_'+normalisedPropertyName, propertyValue, assetID);
    
    return assetData.updateAttribute(ownerId, 'update_'+normalisedPropertyName, propertyValue, assetID);
}

function populateAsset(assetID, Diamond) {
    console.log('[#] Populating Asset');
    let result = Promise.resolve();
    for(let propertyName in Diamond) {
        let normalisedPropertyName = propertyName.toLowerCase();
        let propertyValue = Diamond[propertyName];
        if (propertyName !== 'Owners') {
            result = result.then(function() {
                return populateAssetProperty(assetID, map_ID.user_to_id(Diamond.Owners[1]), normalisedPropertyName, propertyValue);
            });
        }
    }
    return result;
}

function transferAsset(assetID, seller, buyer, functionName) {
    console.log('[#] Transfering Asset to ' + buyer);
    return assetData.transfer(seller, buyer, functionName, assetID);
}

function updateDemoStatus(status) {
    try {
        let statusFile = fs.readFileSync(__dirname+'/../../../logs/demo_status.log');
        let demoStatus = JSON.parse(statusFile);
        demoStatus.logs.push(status);
        fs.writeFileSync(__dirname+'/../../../logs/demo_status.log', JSON.stringify(demoStatus));

        if(!status.hasOwnProperty('error')) {
            if(status.message === 'Demo setup') {
                tracing.create('EXIT', 'POST admin/demo', status);
            } else {
                tracing.create('INFO', 'POST admin/demo', status.message);
            }
        } else {
            tracing.create('ERROR', 'POST admin/demo', status);
        }
    } catch (e) {
        console.log(e);
    }
}

exports.create = create;
