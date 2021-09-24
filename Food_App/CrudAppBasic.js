// random route -> browser se request -> browser reponse karta hai -> take from that server (reqired file/folder)
// const { json } = require("express");
const express = require("express");

const app=express(); // server is created
app.use(express.json());

// profile is used as users
let profile={

}

// posting the data to server
app.post("/user", function(request, response){
    profile=request.body;
    console.log("request Data", request.body);
    
    response.status(200).send(profile);

})

// getting the data from users object from the database.
app.get("/user", function(request, response){
    console.log(profile);
    response.json(profile);
})

// updating the data in the server
app.patch("/user", function(request, response){
    let object = request.body;
    for(let key in object){
        
        profile[key] = object[key];
    }
    response.status(200).json(profile);
})

// delete the user in server
app.delete("/user", function(request, response){
    let profile = {};
    response.status(200).json(profile);
})

// template route
app.get("/user/:id", function(request, response){
    // req.params -> provide the parameters to the server present in the url 
    // keep everything unique
    console.log(request.params);
    // response.send(request.params);
    response.status(200).send("Id displayed!");
})

app.listen(8081, function(){
    console.log("Here the server is started");
})



        