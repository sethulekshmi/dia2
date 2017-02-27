'use strict';

// let request = require('request');
// let configFile = require(__dirname+'/../../../../configurations/configuration.js');
let tracing = require(__dirname+'/../../../../tools/traces/trace');
let map_ID = require(__dirname+'/../../../../tools/map_ID/map_ID');
let Util = require(__dirname+'/../../../../tools/utils/util');

let user_id;
let securityContext;

function get_all_diamonds(req, res, next, usersToSecurityContext)
{

    tracing.create('ENTER', 'GET blockchain/assets/assets', {});

    if(typeof req.cookies.user !== 'undefined')
    {
        req.session.user = req.cookies.user;
		console.log("map user id",req.cookies.user);
    
        req.session.identity = map_ID.user_to_id(req.cookies.user);
    }
    user_id = req.session.identity;
    securityContext = usersToSecurityContext[user_id];
	console.log("user id",user_id);
    return Util.queryChaincode(securityContext, 'get_diamonds', [])
    .then(function(data) {
        let diamonds = JSON.parse(data.toString());
        console.log(diamonds);
        diamonds.forEach(function(diamond) {
            tracing.create('INFO', 'GET blockchain/assets/assets', JSON.stringify(diamond));
            res.write(JSON.stringify(diamond)+'&&');
        });
        tracing.create('EXIT', 'GET blockchain/assets/assets', {});
        res.end('');
    })
    .catch(function(err) {
        res.status(400);
        let error = {};
        error.error = true;
        error.message = err;
        tracing.create('ERROR', 'GET blockchain/assets/assets', err);
        res.end(JSON.stringify(error));
    });
}

exports.read = get_all_diamonds;
