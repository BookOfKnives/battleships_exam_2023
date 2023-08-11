//0208 2023 021  
import express from "express";
const APP = express();
const APP_PORT = 8080;

import cors from "cors";
APP.use(cors());
APP.use(express.static("../vite_battleships/dist"));

import http from "http";

import { Server } from "socket.io";
const IO_PORT = 8081;

const IO_SERVER = http.createServer(APP);
const IO_HANDLER = new Server(IO_SERVER, {
    cors:  {
        origin: "*",
        methods: ["*"],
    }
});

IO_HANDLER.on("connection", (socket) => {
    console.log("IO connected in 021, socket ID:", socket.id);
    
    socket.on("room_input", () => {
        socket.join("room1");
        doRoom1Check();
    });
    
   socket.on("connect_error", (err) => {
     console.log(`connect_error due to ${err.message}`);
    });
  
   socket.on("room_input_leave", () => {
    //when you have a room you want to join, you enter it.
    //how do you broadcoast to it?
       socket.leave("room1");
       console.log("in appjs, socket has left room1, socket id:", socket.id);
   });

   socket.on("message", (data) =>  {
        console.log("this is message data:", data)
   });
    
   socket.on("get_own_name", () =>  {
        console.log("This is socket get own name in app js, and socket.name:", socket.name);
        IO_HANDLER.emit("send_own_name", socket.name);
   });
    
    socket.on('disconnect', () => { 
        console.log('user disconnected'); 
    });

    socket.on("start_game", () => {
        console.log("start_game hit");
        newGame(socket);
    }); 

    socket.on("submitting_player_name", (data) => {
        socket.name = data.data;
        console.log("this is name of socket:", socket.name);
    });
});

//jwt verification & session management here

//log games to mongodb here

//import REST API here

function newGame(socket) {
    if (!socket.name) {console.log("error: no name present, stopping...")}
    else { 
        let gameState = {
            description: "this object is the game-state of a game of battleship. two players, A and B.",
            player_a: socket.name,
            player_b: null,
            grid: [],
        };
       let gameRoomName = gameState.player_a.trim().replace(/\s+/g, '').slice(0, 5);
       gameRoomName += "-room";
       //console.log("game room made in app js:", gameRoomName);
       gameState.gameRoomName = gameRoomName;
       socket.join(gameRoomName);
         IO_HANDLER.emit("new_battleRoom_ready", { data: gameState.gameRoomName });
    };
};

IO_SERVER.listen(IO_PORT, () => {
    console.log("IO 021 online at poorty:", IO_PORT);
});

APP.listen(APP_PORT, () => {
    console.log("APP 021 online at poorty:", APP_PORT);
});

