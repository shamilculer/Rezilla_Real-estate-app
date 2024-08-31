import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required : true }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    unreadCounts: {
        type: Map,
        of: Number,
        default: {}
    },
},
{ timestamps : true }
)

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;