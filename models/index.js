const mongoose = require("mongoose");

const url = process.env.DB_URL;

mongoose.set("debug", true);
// Just to prevent warning for the useCreateIndex deprecation
mongoose.set('useCreateIndex', true);
// To avoid the deprecation warning
mongoose.set('useFindAndModify', false);

mongoose.connect(url, { useNewUrlParser: true});

// Check for any connection problem
mongoose.connection.once('open', function(){
    console.log('Connection established!');
}).on('error', function(err){
    console.log('Connection Error', err.name);
});

mongoose.Promise = Promise;

module.exports.Ingot = require("./ingot");
module.exports.Wheel = require("./wheel");
module.exports.User = require("./user");