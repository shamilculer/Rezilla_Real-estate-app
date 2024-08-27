import { Server } from "socket.io";

const setupSocketServer = (httpServer) => {

    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    const onlineUsers = new Map();

    const addUser = function (userId, socketId) {
        const user = onlineUsers.get(userId);
        if(!user){
            onlineUsers.set(userId, socketId);
        }
    }

    const getUser = function (recieverId){
        const reciever = onlineUsers.get(recieverId);
        return reciever;
    }

    const removeUser = function (socketToRemove) {
        for( let [ userId, socketId ] of onlineUsers.entries()){
            if(socketId === socketToRemove){
                onlineUsers.delete(userId);
            }
        }
    }


    io.on("connection", (socket) => {
        socket.on("newUser", (userId) => {
            addUser(userId, socket.id)
        })

        socket.on("sendMessage", ({recieverId, data}) => {
            const reciever = getUser(recieverId)
            io.to(reciever).emit("recieveMessage", {
                recieverId,
                data
            })
        })

        socket.on("disconnect", () => {
           removeUser(socket.id)
        });
    })

    return io
}

export default setupSocketServer;