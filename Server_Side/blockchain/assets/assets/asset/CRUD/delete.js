'use strict';
let request = require('request');
let configFile = require(__dirname+'/../../../../../configurations/configuration.js');
let tracing = require(__dirname+'/../../../../../tools/traces/trace.js');
let map_ID = require(__dirname+'/../../../../../tools/map_ID/map_ID.js');
let Util = require(__dirname+'/../../../../../tools/utils/util');

let user_id;
let securityContext;
let user;

let update = function(req, res, next, usersToSecurityContext)
{
    if(typeof req.cookies.user !== 'undefined')
    {
        req.session.user = req.cookies.user;
        req.session.identity = map_ID.user_to_id(req.cookies.user);
    }

    user_id = req.session.identity;

    let assetID = req.params.assetID;

    tracing.create('ENTER', 'DELETE blockchain/assets/assets/asset/'+assetID+'/scrap', {});

    res.write('{"message":"Formatting request"}&&');

    let securityContext = usersToSecurityContext[user_id];

    return Util.invokeChaincode(securityContext, 'scrap_asset', [ assetID ])
    .then(function(data) {
        tracing.create('INFO', 'DELETE blockchain/assets/assets/asset/'+assetID+'/scrap', 'Achieving consensus');
        res.write('{"message":"Achieving consensus"}&&');
        let result = {};
        result.message = 'Scrap updated';
        tracing.create('EXIT', 'DELETE blockchain/assets/assets/asset/'+assetID+'/scrap', result);
        res.end(JSON.stringify(result));
    })
    .catch(function(err) {
        res.status(400);
        tracing.create('ERROR', 'DELETE blockchain/assets/assets/asset/'+assetID+'/scrap', 'Unable to update scrap. assetID: '+ assetID);
        let error = {};
        error.error = true;
        error.message = 'Unable to update scrap. ' + err;
        error.assetID = assetID;
        tracing.create('ERROR', 'DELETE blockchain/assets/assets/asset/'+assetID+'/scrap', error);
        res.end(JSON.stringify(error));
    });
};
exports.delete = update;
