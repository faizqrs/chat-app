const express = require('express');
const UserModel = require('../models/user');



const routes = express.Router();



// dummy api for testing
routes.get('/dummyapi', (req, res) =>{
    res.send({message: 'dummy api is working'});
})

// user login api 
routes.get('/login', (req, res) => {
    // validate user req body (username & password)
    console.log(req.body)
    if(!req.body.userName){
        res.send("username cannot be empty");
    } else if (!req.body.password){
        res.send("password cannot be empty");
    } else {
        // check if user exists in db   
    }
})

// user signup api 
routes.post('/signup', (req, res) => {
    // validate user req body (username & password)
    console.log(req.body)
    if(!req.body.name){
        res.send("name cannot be empty");
    }
     else if(!req.body.userName){
        res.send("username cannot be empty");
    } else if (!req.body.password){
        res.send("password cannot be empty");
    } else {
        // create user if not exists
        const newUser = new UserModel({
            name: req.body.name,
            userName: req.body.userName,
            password: req.body.password
        }) 
        // save user to db
        newUser.save().then(user=>{
            console.log(user);
            res.send(user);
        })
    }
})

module.exports = routes 