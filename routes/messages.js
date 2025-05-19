const express = require('express');
const jwt = require('jsonwebtoken');
const GlobalMessage = require('../models/GlobalMessage');



const routes = express.Router();

let jwtuser;
routes.use(async (req,res,next)=> {
const token = req.headers.authorization;

    // checking if user have token or not
    if(!token) {
        return res.status(400).json("unauthorized")
    }
    // verify token
     jwtuser = await jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    // check if user is  or not
    if(!jwtuser) {
        return res.status(400).json("no token");
      } else 
      next();
})

//send global message api
routes.post('/global', async (req, res) =>{
    
      let message = new GlobalMessage(
        {
            from:jwtuser.id,
            body:req.body.message
        }
      )
      //save message & send response to client
      let response = await message.save();
      res.send(response);

})





module.exports = routes;