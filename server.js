import { log } from "console";
import express from "express";
import { Server } from 'socket.io';
import http from 'http';
import pg from "pg";
import cors from "cors"
import bcrypt from "bcrypt";
// import { Strategy } from "passport-local";
// import session from "express-session";
import bodyParser from "body-parser";
import ACTIONS from "./src/Actions.js";


const port  = process.env.PORT || 5600
const app = express()
const saltRounds = 10;
const server  = http.createServer(app); 
const io = new Server(server);
//which saoked id for which user 
const userSocketMap ={}
app.use(cors());
//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const db = new pg.Client({
    user: 'sai',
    host: '127.0.0.1',
    database: 'CoWork',
    password: '1445',
    port: 5432, 
  });

  db.connect();

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
         io.to(roomId).emit(ACTIONS.JOINED,{
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

//level 1 auth
app.post("/signup", async (req, res) => {
    const name = req.body.firstname;
    const email = req.body.email;
    const password = req.body.password;
     console.log(password);
    if (!name || !email || !password) {
        return res.status(400).send("Please provide name, email, and password");
    }

    try {
        const exist = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (exist.rows.length > 0) {
            return res.send("User already exists");
        }

        await db.query("INSERT INTO users (email, name, password) VALUES ($1, $2, $3)", [email, name, password]);
        return res.send("User successfully registered");
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).send("Internal server error");
    }
});



// app.post("/signup", async (req, res) => {
//     const name = req.body.firstname;
//     const email = req.body.email;
//     const password = req.body.password;

//     try {
//         const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

//         if (checkResult.rows.length > 0) {
//             res.send("user already exists")
//         } else {
//             // Hash the password using bcrypt
//             bcrypt.hash(password, saltRounds, async (err, hash) => {
//                 if (err) {
//                     console.error("Error hashing password:", err);
//                     res.status(500).send("Error hashing password");
//                 } else {
//                     // Insert the user into the database with the hashed password
//                     const result = await db.query(
//                         "INSERT INTO users (email,name,password) VALUES ($1, $2 ,$3) RETURNING *",
//                         [email, name, hash]
//                     );
//                     const user = result.rows[0];
//                     req.login(user, (err) => {
//                         if (err) {
//                             console.error("Error logging in user:", err);
//                             res.status(500).send("Error logging in user");
//                         } else {
//                             console.log("User successfully registered");
//                             res.send("User successfully registered");
//                         }
//                     });
//                 }
//             });
//         }
//     } catch (err) {
//         console.log(err);
//         res.status(500).send("Internal server error");
//     }
// });

server.listen(port,()=>{
    console.log(`listning on port ${port}`)
})
