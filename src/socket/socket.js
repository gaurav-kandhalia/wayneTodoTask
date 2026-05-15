import { Server } from "socket.io";

let io;

const initSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        },
    });

    io.on("connection", (socket) => {

        console.log("NEW SOCKET CONNECTED");

    console.log(socket.id);
socket.onAny((event, ...args) => {

    console.log("EVENT RECEIVED:");

    console.log(event);

    console.log(args);

});

        // JOIN LIST ROOM

        socket.on("join-list", (listId) => {
                    console.log("..........listId.......",listId)
            socket.join(listId);
             console.log("----------------------------------------")
            console.log(`Socket ${socket.id} joined list ${listId}`);

        });


        // LEAVE LIST ROOM

        socket.on("leave-list", (listId) => {

            socket.leave(listId);

            console.log(`Socket ${socket.id} left list ${listId}`);

        });


        // DISCONNECT

        socket.on("disconnect", () => {

            console.log(`User disconnected: ${socket.id}`);

        });

    });

};


const getIO = () => {

    if (!io) {
        throw new Error("Socket.io not initialized");
    }

    return io;

};


export { initSocket, getIO };