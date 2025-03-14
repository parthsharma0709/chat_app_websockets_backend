// {
//   "type": "join",
//   "payload": {
//     "roomID": "xyz",
//     "name": "Ty"
//   }
// } 

import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
}

let allSockets: User[] = [];


wss.on("connection", (socket) => {

    socket.on("message", (message) => {
      
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type == "join") {
            console.log("user joined room " + parsedMessage.payload.roomId);
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }

        if (parsedMessage.type == "chat") {
            console.log("user wants to chat");
            // const currentUserRoom = allSockets.find((x) => x.socket == socket).room
            let currentUserRoom = null;
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].socket == socket) {
                    currentUserRoom = allSockets[i].room
                }
            }

            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].room == currentUserRoom) {
                    allSockets[i].socket.send(parsedMessage.payload.message)
                }
            }
        }

    })

})
// const http = require('http');

// const server = http.createServer((req: any, res: { writeHead: (arg0: number, arg1: { 'Content-Type': string; }) => void; end: (arg0: string) => void; }) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end('Hello from Node.js server!');
// });

// server.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });
