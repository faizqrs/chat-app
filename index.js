// third party packages
const express = require('express');
const dotenv = require('dotenv').config();
const cors =require('cors');
const mongoose = require('mongoose');


// Own import for routes
const users = require('./routes/users');



const app = express();
const mongodbURI = process.env.MONGOOSE_URI;
const port = process.env.PORT || 8080;
// server 
const server = app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})

// database configuration
mongoose.connect(mongodbURI)
.then(()=> console.log("Successfully Connected"))
.catch(err => console.log(err));

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
 
app.use("/users", users);