const mongoose = require('mongoose');
const Conversation = require('./Conversation');
const Schema = mongoose.Schema;

const MessagesSchema = new schema(
    {
        Conversation:{  // we are using our conversation schema inside Messages Schema to save last message in chat
            type: Schema.Types.ObjectId,
            ref: 'Conversation'
        },
        from:[{
            
            type: Schema.Types.ObjectId,
            ref: 'users'
        }],  //keeping it in an array because recipent can be one or more users
        to: {
            
              type: Schema.Types.ObjectId,
            ref: 'users'
            
        },
        date: {
            type: string,
            default: Date.now()
        },
    }
)

const Messages = mongoose.model('Messages', MessagesSchema);
module.exports = Messages;