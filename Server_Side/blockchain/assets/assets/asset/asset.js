
var remove = require(__dirname+'/CRUD/delete.js');
exports.delete = remove.delete;

var read = require(__dirname+'/CRUD/read.js');
exports.read = read.read;


var colourFile = require(__dirname+'/colour/colour.js');
var colour = {};
colour.update = colourFile.update;
colour.read = colourFile.read;
exports.colour = colour;

var diamondatFile = require(__dirname+'/diamondat/diamondat.js');
var diamondat = {};
diamondat.update = diamondatFile.update;
diamondat.read = diamondatFile.read;
exports.diamondat = diamondat;

var cutFile = require(__dirname+'/cut/cut.js');
var cut = {};
cut.update = cutFile.update;
cut.read = cutFile.read;
exports.cut = cut;

var dateFile = require(__dirname+'/date/date.js');
var date = {};
date.update = dateFile.update;
date.read = dateFile.read;
exports.date = date;

var symmetryFile = require(__dirname+'/symmetry/symmetry.js');
var symmetry = {};
symmetry.update = symmetryFile.update;
symmetry.read = symmetryFile.read;
exports.symmetry = symmetry;

var timestampFile = require(__dirname+'/timestamp/timestamp.js');
var timestamp = {};
timestamp.update = timestampFile.update;
timestamp.read = timestampFile.read;
exports.timestamp = timestamp;

var polishFile = require(__dirname+'/polish/polish.js');
var polish = {};
polish.update = polishFile.update;
polish.read = polishFile.read;
exports.polish = polish;


var clarityFile = require(__dirname+'/clarity/clarity.js');
var clarity = {};
clarity.update = clarityFile.update;
clarity.read = clarityFile.read;
exports.clarity = clarity;

var JewelleryTypeFile = require(__dirname+'/JewelleryType/JewelleryType.js');
var JewelleryType = {};
JewelleryType.update = JewelleryTypeFile.update;
JewelleryType.read = JewelleryTypeFile.read;
exports.JewelleryType = JewelleryType;





var ownerFile = require(__dirname+'/owner/owner.js');
var owner = {};
owner.update = ownerFile.update;
owner.read = ownerFile.read;
exports.owner = owner;
