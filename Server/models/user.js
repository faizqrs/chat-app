const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    date:{        // this is for storing date of user when was created
        type:String,
        default:Date.now()
    }
})

const Users = mongoose.model('users', UsersSchema);
module.exports = Users;