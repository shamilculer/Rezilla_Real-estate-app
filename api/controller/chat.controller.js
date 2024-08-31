import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

const findOrCreateChat = async (req, res) => {
    const { participants } = req.query;
    try {
        if (participants && participants.length > 1) {
            const chat = await Chat.findOne({ participants: { $all: participants } });
            if (chat) {
                return res.status(200).json({ message: "Chat already exists", chat });
            }
            const newChat = new Chat({ participants });
            await newChat.save();
            return res.status(201).json({ message: "Created new chat", chat: newChat });
        } else {
            res.status(404).json({ message: "Participants must be provided" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to find or create chat" });
    }
}


const getChat = async (req, res) => {
    const { chatId } = req.params;
    const userId = req.userId

    try {
        const chat = await Chat.findById(chatId);
        if (chat) {

            await chat.populate("participants", "username email profileImage")
            await chat.populate("messages")

            const reciever = chat.participants.find( p => p._id.toString() !== userId.toString() );

            const responseChat = {
                ...chat._doc,
                messager : userId,
                reciever
            }

            return res.status(200).json({ message: "Chat fetched successfully", responseChat });
        } else {
            res.status(404).json({ message: "Chat not found" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to fetch chat" });
    }
}

const getChats = async (req, res) => {
    const { userId } = req.params;
    try {
        const userchats = await Chat.find({ participants: { $in: [userId] } })
        .populate("participants", "username email profileImage")
        .populate("lastMessage")
        .populate("messages")
        .sort({ updatedAt: -1 })

        const chats = userchats.map(chat => {
            const messager = chat.participants.find(
              p => p._id.toString() !== userId
            );
            const { _id, createdAt, updatedAt, lastMessage, messages, unreadCounts } = chat
            return {
              _id,
              messager,
              messages,
              createdAt,
              updatedAt,
              lastMessage,
              unreadCounts  
            };
        }); 

        return res.status(200).json({ message: "Chats fetched successfully", chats });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to fetch chats" });
    }
}

const addMessgae = async (req, res) => {
    const { message } = req.body
    const { chatId } = req.params
    const  userId = req.userId

    if(!userId){
        res.status(401).json({ message: "Unauthorized"})
        return; 
    }

    try {
        const chat = await Chat.findById({ _id : chatId, participants : { $in : [userId] } })

        if(!chat){
            res.status(404).json({ message: "chat not found"})
            return;
        }

        const newMessage = new Message({
            message,
            sender: userId,
            chat : chatId
        })

        await newMessage.save()

        chat.messages.push(newMessage._id)
        chat.lastMessage = newMessage._id

        await chat.populate("messages")
        await chat.populate('lastMessage')
        await chat.populate("participants", "username email profileImage")

        const reciever = chat.participants.find(p => p._id.toString() !== userId.toString());

        chat.participants.forEach(async (participant) => {
            if (participant._id.toString() === reciever._id.toString()) {
              chat.unreadCounts.set(participant._id.toString(), (chat.unreadCounts.get(participant._id.toString()) || 0) + 1);
            }
        });

        await chat.save()

        const responseChat = {
            ...chat._doc,
            messager : userId,
            reciever
        }

        res.status(201).json({ message: "message added successfully", responseChat })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to add message" })
    }
}

export { findOrCreateChat, getChat, getChats, addMessgae }