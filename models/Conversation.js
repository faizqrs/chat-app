const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema(
    {
        recipents:[{
            
            type: Schema.Types.ObjectId,
            ref: 'users'
        }],  //keeping it in an array because recipent can be one or more users
        lastMessage: {
            
            type: String
            
        },
        date: {
            type: String,
            default: Date.now()
        },
    }
)

const Conversation = mongoose.model('conversations', ConversationSchema);
module.exports = Conversation;