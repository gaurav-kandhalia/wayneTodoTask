import { io } from "socket.io-client";

const socket = io("http://localhost:5911");


socket.on("connect", () => {

    console.log("Connected:", socket.id);
   
const listId =  "6a06178d2c3c5d6dc75ec9f3"
    
    // JOIN ROOM

    socket.emit(
      "join-list",
      listId
    );

});


socket.on("todo-created", (data) => {

    console.log("TODO CREATED:", data);

});


socket.on("todo-updated", (data) => {

    console.log("TODO UPDATED:", data);

});


socket.on("todo-deleted", (data) => {

    console.log("TODO DELETED:", data);

});