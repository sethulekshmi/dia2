$(document).ready(function(){
    loadLogo(pgNm);
});



let config = {};

/******* Images *******/

// Variable Setup
config.logo = {};
config.logo.main = {};
config.logo.miner = {};
config.logo.distributor = {};
config.logo.dealership = {};
config.logo.buyer = {};
config.logo.trader = {};
config.logo.cutter = {};
config.logo.jewellery_maker = {};
config.logo.customer = {};

// Logo size
config.logo.width = '317px';
config.logo.height = '118px';

//Main Logo
config.logo.logo = 'Icons/logo.png';


/******* Participants *******/
//This is where we define the details of the users for each company (name and password)

// Variable Setup
config.participants = {};
config.participants.users = {};
config.participants.users.miners = [];
config.participants.users.distributors = [];
config.participants.users.dealerships = [];
config.participants.users.buyers = [];
config.participants.users.traders = [];
config.participants.users.cutters = [];
config.participants.users.jewellery_makers = {};
config.participants.users.customers = {};
config.participants.miner = {};
config.participants.distributor = {};
config.participants.dealership = {};
config.participants.buyer = {};
config.participants.trader = {};
config.participants.cutter = {};
config.participants.jewellery_maker = {};
config.participants.customer = {};





// Miners
config.participants.users.miners[0]= {};
config.participants.users.miners[0].company = 'Kollur';
config.participants.users.miners[0].type = 'Miner';
config.participants.users.miners[0].user = 'Ronald';

// Distributors
config.participants.users.distributors[0] = {};
config.participants.users.distributors[0].company = 'Soham_Industrial_Diamonds';
config.participants.users.distributors[0].type = 'Distributor';
config.participants.users.distributors[0].user = 'Martin';

config.participants.users.distributors[1] = {};
config.participants.users.distributors[1].company = 'Laxmi_Impex';
config.participants.users.distributors[1].type = 'Distributor';
config.participants.users.distributors[1].user = 'Maria';

config.participants.users.distributors[2] = {};
config.participants.users.distributors[2].company = 'Harshal_diamonds';
config.participants.users.distributors[2].type = 'Distributor';
config.participants.users.distributors[2].user = 'Mandy';

// Dealerships
config.participants.users.dealerships[0] = {};
config.participants.users.dealerships[0].company = 'Beon_ Group';
config.participants.users.dealerships[0].type = 'Dealership';
config.participants.users.dealerships[0].user = 'Deborah';

config.participants.users.dealerships[1] = {};
config.participants.users.dealerships[1].company = 'Milescape';
config.participants.users.dealerships[1].type = 'Dealership';
config.participants.users.dealerships[1].user = 'Dennis';

config.participants.users.dealerships[2] = {};
config.participants.users.dealerships[2].company = 'Viewers Alfa Romeo';
config.participants.users.dealerships[2].type = 'Dealership';
config.participants.users.dealerships[2].user = 'Delia';

// Buyers
config.participants.users.buyers[0] = {};
config.participants.users.buyers[0].company = 'Shah';
config.participants.users.buyers[0].type = 'Buyer';
config.participants.users.buyers[0].user = 'Lesley';

config.participants.users.buyers[1] = {};
config.participants.users.buyers[1].company = 'Kothari';
config.participants.users.buyers[1].type = 'Buyer';
config.participants.users.buyers[1].user = 'Larry';

config.participants.users.buyers[2] = {};
config.participants.users.buyers[2].company = 'Agarwal';
config.participants.users.buyers[2].type = 'Buyer';
config.participants.users.buyers[2].user = 'Luke';

// Traders
config.participants.users.traders[0] = {};
config.participants.users.traders[0].company = 'Ajay_Gosh';
config.participants.users.traders[0].type = 'Trader';
config.participants.users.traders[0].user = 'Joe';

config.participants.users.traders[1] = {};
config.participants.users.traders[1].company = 'Andrew Hurt';
config.participants.users.traders[1].type = 'Trader';
config.participants.users.traders[1].user = 'Andrew';

config.participants.users.traders[2] = {};
config.participants.users.traders[2].company = 'Rahul Ajay Gandhi';
config.participants.users.traders[2].type = 'Trader';
config.participants.users.traders[2].user = 'Rahul';

// Cutters
config.participants.users.cutters[0] = {};
config.participants.users.cutters[0].company = 'Cray Bros (London) Ltd';
config.participants.users.cutters[0].type = 'Cutter';
config.participants.users.cutters[0].user = 'Sandy';

config.participants.users.cutters[1] = {};
config.participants.users.cutters[1].company = 'Aston Cutting Centre';
config.participants.users.cutters[1].type = 'Cutter';
config.participants.users.cutters[1].user = 'Scott';

config.participants.users.cutters[2] = {};
config.participants.users.cutters[2].company = 'ScrapIt! UK';
config.participants.users.cutters[2].type = 'Cutter';
config.participants.users.cutters[2].user = 'Sid';

// Jewellery_makers
config.participants.users.jewellery_makers[0] = {};
config.participants.users.jewellery_makers[0].company = 'Adora';
config.participants.users.jewellery_makers[0].type = 'Jewellery_maker';
config.participants.users.jewellery_makers[0].user = 'Sandy';

config.participants.users.jewellery_makers[1] = {};
config.participants.users.jewellery_makers[1].company = 'Tanishq';
config.participants.users.jewellery_makers[1].type = 'Jewellery_maker';
config.participants.users.jewellery_makers[1].user = 'Scott';

config.participants.users.jewellery_makers[2] = {};
config.participants.users.jewellery_makers[2].company = 'Kiah';
config.participants.users.jewellery_makers[2].type = 'Jewellery_maker';
config.participants.users.jewellery_makers[2].user = 'Sid';

// Customers
config.participants.users.customers[0] = {};
config.participants.users.customers[0].user = 'Gaurav Singh';
config.participants.users.customers[0].type = 'Customer';
config.participants.users.customers[0].user = 'Sandy';

config.participants.users.customers[1] = {};
config.participants.users.customers[1].user = 'Adwaith';
config.participants.users.customers[1].type = 'Customer';
config.participants.users.customers[1].user = 'Scott';

config.participants.users.customers[2] = {};
config.participants.users.customers[2].user = 'Amardev';
config.participants.users.customers[2].type = 'Customer';
config.participants.users.customers[2].user = 'Sid';




/******* Used Particpants *******/
//This is where we select which participants will be used for the pages

// Miner
config.participants.miner = config.participants.users.miners[0];

// Distributor
config.participants.distributor = config.participants.users.distributors[0];

// Dealership
config.participants.dealership = config.participants.users.dealerships[0];

// Buyer
config.participants.buyer = config.participants.users.buyers[0];

// Trader
config.participants.trader = config.participants.users.traders[0];

// Cutter
config.participants.cutter = config.participants.users.cutters[0];

// Jewellery_maker
config.participants.jewellery_maker = config.participants.users.jewellery_makers[0];

// Customer
config.participants.customer = config.participants.users.customers[0];







function loadLogo(pageType)
{
    $('#logo').attr('src', config.logo.logo);
    $('#logo').css('width', config.logo.width);
    $('#logo').css('height', config.logo.height);
}

function loadParticipant(pageType)
{
    $('#username').html(config.participants[pageType].user);
    $('#company').html(config.participants[pageType].company);
}

