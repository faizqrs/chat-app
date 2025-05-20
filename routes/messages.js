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

// Read Global Message api
routes.get('/globalmessage', async (req, res) => {
  // in this way sender name is missing
  // let messages = await GlobalMessage.find(); // read all message from database
  // res.send(messages);
  // in this way sender name is available
  let messages = await GlobalMessage.aggregate([ // aggregate function to perform data finding task
    {
      $lookup: {   // it is used to lookup in database
        from: 'users', // from which collection
        localField:'from', // localfield name in collection
        foreignField:'_id', // field name in foreign collection
        as:'userObj' // finding these thing as userObj
      }
    }
  ])
  // it will send response like this
  //  {
  //       "_id": "682b312462bc8bce978b2df5",
  //       "from": "68231fa0e9d3c1c245da7a14",
  //       "body": "hii this is message api",
  //       "date": "1747661092427",
  //       "__v": 0,
  //       "userObj": [
  //           {
  //               "_id": "68231fa0e9d3c1c245da7a14",
  //               "name": "noraiz",
  //               "userName": "noraiz02",
  //               "password": "$2b$10$EHY/egGOL/h2NmTZtsDgveFdiNmAIVIN9UyljkcgilhCs6GPnVQFa",
  //               "date": "1747132238328",
  //               "__v": 0
  //           }
  //       ]
  //   },

  // so now we need to hide few things in response
  .project({
    'userObj.password':0, // hiding from userObj
    'userObj.date':0,
    'userObj.__v':0,
    '__v':0           // hiding from response
  })
  res.send(messages);
})





module.exports = routes;