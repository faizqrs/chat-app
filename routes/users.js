const express = require('express');
const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const routes = express.Router();



// dummy api for testing
routes.get('/dummyapi', (req, res) =>{
    res.send({message: 'dummy api is working'});
})

// user login api 
routes.post('/login', async (req, res) => {
    // validate user req body (username & password)
    console.log(req.body)
    if(!req.body.userName){
        res.send("username cannot be empty");
    } else if (!req.body.password){
        res.send("password cannot be empty");
    } else {
        // check if user exists in db   
        let user = await UserModel.findOne({userName:req.body.userName});
        if (!user){
            return res.status(400).json("Inavalid Cardentials");
        }
        // check if password is correct
        //req.body.password this password is which given by user & user.password is the one which
        // we have hashed before in signup api & compare mathod ll compare both passwords
        let isMatch = await bcrypt.compare(req.body.password, user.password);
        // if password is not matched then send error in response
        if(!isMatch){
            return res.status(400).json("Inavalid Cardentials");
        }
        // create payload for jwt token
            const payload={
                id:user._id,
                userName:req.body.name,
            }
            // create jwt token with promise 
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:31556926});
            console.log(token);
            // send token in response
            res.json({
                success : true,
                id : user._id,
                userName : user.userName,
                name: user.name,
                token:token
            })

    }
})

// user signup api 
// async for asynchronous api request
routes.post('/signup', async (req, res) => {
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

        // check user already exist

        let user = await UserModel.findOne({userName:req.body.userName});
        if (user){
            return res.status(400).json("Username Already Exist");
        }
 // it will create salt 
    // number is the salt round in numbers
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
// now mix password with salt
    const hash = await bcrypt.hash(req.body.password, salt);
//    console.log(hash);
//    res.send(hash)
        
        // create user if not exists
        const newUser = new UserModel({
            name: req.body.name,
            userName: req.body.userName,
            password: hash,
        }) 
        // socket.io for user registrarion live update in app
        req.io.socket.emit("users", req.body.userName);
        // save user to db
        newUser.save().then(user=>{
            console.log(user);
            //below line is sending the whole user
            // res.send(user);
            //filter

            // create payload for jwt token
            const payload={
                id:user._id,
                userName:req.body.name,
            }
            // create jwt token with promise 
            jwt.sign(payload,
                process.env.JWT_SECRET,
                {expiresIn:31556926},
                (err,token)=>{

                    res.json({
                success : true,
                id : user._id,
                userName : user.name,
                token:token
            })
                }
            )
            
            
        })
        //catch error if any error occur like if same user data sent
            .catch(err=>{
                res.send(err)
            })

    }
})

// API to check all signup users
routes.get('/', async (req,res) => {
    // from user api headers
    let token = req.headers.authorization; 
    //check token is present
    if(!token){
        return res.status(400).json("Unauthorized");
    }
    // if token is present then validate token 0=>payload, 1=>secret, 2=>expiry
    // here we are spliting token in 3 parts then we are checking secret of token & jwt scret both are same or not
    let jwtUser 
    try{
    jwtUser= await jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    } catch(err){
        console.log(err);
        return res.status(400).json("invalid token");
    }
    console.log({jwtUser});
    // check jwt user is a logged in user
    if(!jwtUser){
        return res.status(400).json("unauthorized")
    }
    // if user is logged in then fetch all users from database
    let users = await UserModel.aggregate()
    .project({
        password:0,
        date:0,
        __v:0
    })
    res.send(users);
})

module.exports = routes 