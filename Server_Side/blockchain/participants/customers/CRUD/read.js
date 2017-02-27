'use strict';

let tracing = require(__dirname+'/../../../../tools/traces/trace.js');
let participants = require(__dirname+'/../../participants_info.js');

let read = function(req, res)
{
    tracing.create('ENTER', 'GET blockchain/participants/customers', {});

    if(!participants.hasOwnProperty('customers'))
    {
        res.status(404);
        let error = {};
        error.message = 'Unable to retrieve customers';
        error.error = true;
        tracing.create('ERROR', 'GET blockchain/participants/customers', error);
        res.send(error);
    }
    else
    {
        tracing.create('EXIT', 'GET blockchain/participants/customers', {'result':participants.customers});
        res.send({'result':participants.customers});
    }

};
exports.read = read;
