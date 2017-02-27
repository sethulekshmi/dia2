'use strict';
let tracing = require(__dirname+'/../../../../tools/traces/trace.js');
let map_ID = require(__dirname+'/../../../../tools/map_ID/map_ID.js');
let Util = require(__dirname+'/../../../../tools/utils/util');
let Asset = require(__dirname+'/../../../../tools/utils/asset');

function create (req, res, next, usersToSecurityContext) {
    let user_id;

    if(typeof req.cookies.user !== 'undefined')
    {
        req.session.user = req.cookies.user;
        req.session.identity = map_ID.user_to_id(req.cookies.user);
    }
    user_id = req.session.identity;

    let assetData = new Asset(usersToSecurityContext);

    return assetData.create(user_id)
    .then(function(assetID) {
        tracing.create('INFO', 'POST blockchain/assets/assets', 'Created asset');
        let result = {};
        result.message = 'Creation Confirmed';
        result.assetID = assetID;
        res.end(JSON.stringify(result));
    })
    .catch(function(err) {
        tracing.create('ERROR', 'POST blockchain/assets/assets', err.stack);
        res.send(JSON.stringify({'message':err.stack}));
    });
}

exports.create = create;
