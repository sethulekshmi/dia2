'use strict';
// let request = require('request');
// let configFile = require(__dirname+'/../../../../../configurations/configuration.js');
let tracing = require(__dirname+'/../../../../../tools/traces/trace.js');
let map_ID = require(__dirname+'/../../../../../tools/map_ID/map_ID.js');
let Util = require(__dirname+'/../../../../../tools/utils/util');

let user_id;
let securityContext;

let read = function (req,res,next,usersToSecurityContext)
{
    let assetID = req.params.assetID;

    tracing.create('ENTER', 'GET blockchain/assets/assets/asset/'+assetID, {});
    if(typeof req.cookies.user != 'undefined')
    {
        req.session.user = req.cookies.user;
        req.session.identity = map_ID.user_to_id(req.cookies.user);
    }

    user_id = req.session.identity;
    securityContext = usersToSecurityContext[user_id];

    return Util.queryChaincode(securityContext, 'get_asset_details', [ assetID ])
    .then(function(data) {
        let diamond = JSON.parse(data.toString());
        let result = {};
        result.asset = diamond;
        tracing.create('EXIT', 'GET blockchain/assets/assets/asset/'+assetID, result);
        res.send(result.asset);
    })
    .catch(function(err) {
        res.status(400);
        tracing.create('ERROR', 'GET blockchain/assets/assets/asset/'+assetID, 'Unable to get asset. assetID: '+ assetID);
        let error = {};
        error.message = err;
        error.assetID = assetID;
        error.error = true;
        tracing.create('ERROR', 'GET blockchain/assets/assets/asset/'+assetID, error);
        res.send(error);
    });
};

exports.read = read;
