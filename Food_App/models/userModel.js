// Server <--> Mongoose <--> MongoDB

const mongoose = require('mongoose');
let { DB_LINK } = require('../secrets');

// connect server to the Mongoose       
                                        // now we dont need this
mongoose.connect(DB_LINK, {})           // previous parameters -> useNewUrlParser : true, useCreateIndex : true, useUnifiedTopology: true;
.then(function(database){
    console.log(database);
})
.catch(function(error){
    console.log("Error: ", error);
})

// Moogoose is an async function which provides you a promise on which we use then and catch function. 





