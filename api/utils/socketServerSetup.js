import { Server } from "socket.io";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

const setupSocketServer = (httpServer) => {

    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    const onlineUsers = new Map();

    const addUser = function (userId, socketId) {
        const user = onlineUsers.get(userId);
        if (!user) {
            onlineUsers.set(userId, socketId);
        }
    }

    const getUser = function (recieverId) {
        const reciever = onlineUsers.get(recieverId);
        return reciever;
    }

    const removeUser = function (socketToRemove) {
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socketToRemove) {
                onlineUsers.delete(userId);
            }
        }
    }


    io.on("connection", (socket) => {
        socket.on("newUser", (userId) => {
            addUser(userId, socket.id);
        });

        socket.on("sendMessage", ({ recieverId, data }) => {
            const reciever = getUser(recieverId);
            if (reciever) {
                io.to(reciever).emit("recieveMessage", {
                    recieverId,
                    data
                });
            }
        });

        socket.on('markMessagesAsRead', async ({ chatId, userId }) => {

            const chat = await Chat.findById(chatId);
            if (!chat) return

            const unreadMessages = await Message.find({
                chat: chatId,
                sender: { $ne: userId },
                read: false
            });

            await Message.updateMany(
                { _id: { $in: unreadMessages.map(m => m._id) } },
                { $set: { read: true } }
            );

            chat.unreadCounts.set(userId, 0);
            await chat.save()

            chat.participants.forEach(participantId => {
                const participantSocket = getUser(participantId.toString());
                if (participantSocket) {
                    io.to(participantSocket).emit("messagesMarkedAsRead", { chatId, userId });
                }
            });
        });

        socket.on("disconnect", () => {
            removeUser(socket.id);
        });
    })

    return io
}

export default setupSocketServer;