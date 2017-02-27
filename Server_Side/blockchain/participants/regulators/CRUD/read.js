'use strict';

let tracing = require(__dirname+'/../../../../tools/traces/trace.js');
let participants = require(__dirname+'/../../participants_info.js');

let read = function(req, res)
{
    tracing.create('ENTER', 'GET blockchain/participants/miners', {});

    if(!participants.hasOwnProperty('miners'))
    {
        res.status(404);
        let error = {};
        error.message = 'Unable to retrieve miners';
        error.error = true;
        tracing.create('ERROR', 'GET blockchain/participants/miners', error);
        res.send(error);
    }
    else
    {
        tracing.create('EXIT', 'GET blockchain/participants/miners', {'result':participants.miners});
        res.send({'result':participants.miners});
    }
};
exports.read = read;
