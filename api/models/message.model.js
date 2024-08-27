import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    message : { type : String, required: true },
    sender : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chat : { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    read : { type : Boolean, default: false }
    },
    { timestamps : true }
)

const Message = mongoose.model('Message', messageSchema)

export default Message;