'use strict';

let participants = require(__dirname+'/../../blockchain/participants/participants_info.js');


let id_to_user = function(data)
{
   let participant=participants.participants_info
   for(let role in participant)
    {
        for(let j = 0; j < participant[role].length; j++)
        {
            if(participant[role][j].identity === data)
            {
                return participant[role][j].name;
            }
        }
    }
};

let user_to_id = function(data)
{
	let participant=participants.participants_info
    for(let role in participant)
    {
		
        for(let j = 0; j < participant[role].length; j++)
        {
			
            if(participant[role][j].name === data)
            {
                return participant[role][j].identity;
            }
        }
    }
};

let get_password = function(partType, data)
{
    let participant=participants.participants_info
    for(let i = 0; i < participant[partType].length; i++)
    {
        if(participant[partType][i].name === data || participant[partType][i].identity === data)
        {
            return participant[partType][i].password;
        }
    }
};



exports.id_to_user = id_to_user;
exports.user_to_id = user_to_id;
exports.get_password = get_password;
