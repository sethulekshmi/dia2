'use strict';

let tracing = require(__dirname+'/../../../../tools/traces/trace.js');
let participants = require(__dirname+'/../../participants_info.js');

let read = function(req, res)
{
    tracing.create('ENTER', 'GET blockchain/participants/traders', {});

    if(!participants.hasOwnProperty('traders'))
	{
        res.status(404);
        let error = {};
        error.message = 'Unable to retrieve traders';
        error.error = true;
        tracing.create('ERROR', 'GET blockchain/participants/traders', error);
        res.send(error);
    }
    else
	{
        tracing.create('EXIT', 'GET blockchain/participants/traders', {'result':participants.traders});
        res.send({'result':participants.traders});
    }
};
exports.read = read;
