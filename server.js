import { log } from "console";
import express from "express";
import { Server } from 'socket.io';
import http from 'http';
import ACTIONS from "./src/Actions.js";
const app = express()
const server  = http.createServer(app); 
const io = new Server(server);
//which saoked id for which user 
const userSocketMap ={}


function getALlConnectedClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) ||  []).map((socketId)=>{
            return {
                socketId,
                username: userSocketMap[socketId],
            }
    });
}

io.on('connection',(socket)=>{
    console.log('socket connected',socket.id);

    socket.on(ACTIONS.JOIN,({roomId,username})=>{
       userSocketMap[socket.id] = username;
       socket.join(roomId);
       const clients = getALlConnectedClients(roomId);
      clients.forEach((socketId)=>{
         io.to(socket.id).emit(ACTIONS.JOINED,{
            clients,
            username,
            socketId:socket.id,
         });
      });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        console.log(code);
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code }); 
    });
});

const port  = process.env.PORT || 5600
server.listen(port,()=>{
    console.log(`listning on port ${port}`)
})