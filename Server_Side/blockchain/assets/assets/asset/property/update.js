'use strict';
let tracing = require(__dirname+'/../../../../../tools/traces/trace.js');
let map_ID = require(__dirname+'/../../../../../tools/map_ID/map_ID.js');
let Util = require(__dirname+'/../../../../../tools/utils/util');
let Asset = require(__dirname+'/../../../../../tools/utils/asset');

let user_id;

let assetData;

let update = function(req, res, next, usersToSecurityContext, property)
{
    assetData = new Asset(usersToSecurityContext);

    let newValue = req.body.value;
    let functionName = req.body.function_name;
    functionName = (functionName) ? functionName : 'update_'+property.toLowerCase();
    let assetID = req.params.assetID;

    if(typeof req.cookies.user !== 'undefined')
    {
        req.session.user = req.cookies.user;
        req.session.identity = map_ID.user_to_id(req.cookies.user);
    }
    user_id = req.session.identity;

    tracing.create('ENTER', 'PUT blockchain/assets/assets/'+assetID+'/' + property, req.body);

    tracing.create('INFO', 'PUT blockchain/assets/assets/'+assetID+'/' + property, 'Formatting request');
    res.write('{"message":"Formatting request"}&&');

    return assetData.updateAttribute(user_id, functionName, newValue, assetID)
    .then(function(data) {
        tracing.create('ENTER SUCCESS', 'PUT blockchain/assets/assets/'+assetID+'/' + property);

        tracing.create('INFO', 'PUT blockchain/assets/assets/'+assetID+'/' + property, 'Updating '+property+' value');
        res.write('{"message":"Updating owner value"}&&');
        tracing.create('INFO', 'PUT blockchain/assets/assets/'+assetID+'/' + property, 'Achieving Consensus');
        res.write('{"message":"Achieving Consensus"}&&');
        let result = {};
        result.message = property + ' updated';
        tracing.create('EXIT', 'PUT blockchain/assets/assets/'+assetID+'/' + property, data);
        res.end(JSON.stringify(result));
    })
    .catch(function(err) {
        res.status(400);
        let error = {};
        error.error  = true;
        error.message = err;
        tracing.create('ERROR', 'PUT blockchain/assets/assets/'+assetID+'/' + property, JSON.parse(err));
        res.end(JSON.stringify(err));
    });

    // return Util.invokeChaincode(securityContext, functionName, [ newValue, assetID ])
    //     .then(function(data) {
    //         tracing.create('ENTER SUCCESS', 'PUT blockchain/assets/assets/'+assetID+'/' + property);
    //
    //         tracing.create('INFO', 'PUT blockchain/assets/assets/'+assetID+'/' + property, 'Updating '+property+' value');
    //         res.write('{"message":"Updating owner value"}&&');
    //         tracing.create('INFO', 'PUT blockchain/assets/assets/'+assetID+'/' + property, 'Achieving Consensus');
    //         res.write('{"message":"Achieving Consensus"}&&');
    //         let result = {};
    //         result.message = property + ' updated';
    //         tracing.create('EXIT', 'PUT blockchain/assets/assets/'+assetID+'/' + property, data);
    //         res.end(JSON.stringify(result));
    //     })
    //     .catch(function(err) {
    //         res.status(400);
    //         let error = {};
    //         error.error  = true;
    //         error.message = err;
    //         tracing.create('ERROR', 'PUT blockchain/assets/assets/'+assetID+'/' + property, JSON.parse(err));
    //         res.end(JSON.stringify(err));
    //     });
};

module.exports = update;
