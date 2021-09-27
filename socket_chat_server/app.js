const express = require('express');
const http = require('http');
const messageStore = require('./controllers/MessageStore');

const app = express();
const server = http.createServer(app);
const { Server: SocketServer } = require('socket.io');
const io = new SocketServer(server, {
  cors: {
    origin: ["http://localhost:80", "http://localhost"],
    methods: ["GET", "POST"]
  }
});


io.on('connection', socket => {
  console.log('new connection');

  socket.on('client.chat.message', data => {
    broadcastToRoom(data);
  })


  socket.on('client.room.join', data => {
    const { name, room } = data;

    socket.join(room);
    console.log(`${name} joined ${room}`)
    broadcastToRoom({name, room, content: `_joined the room_`}, socket);

    const messages = messageStore.getMessages(room);
    socket.emit('server.room.history', {room, messages});
  })

  socket.on('client.room.leave', data => {
    const {name, room} = data;

    socket.leave(room);
    console.log(`${name} left ${room}`);
    broadcastToRoom({name, room, content: `left the room_`}, socket);
  })
})

function broadcastToRoom(data, socket) {
  /**
   * Send a message to a room.
   * If socket is provided, then all clients in the room EXCEPT the sender will receive the event.
   * If socket is not provided, then all clients in the room INCLUDING the sender will recevie the event
   */
  const {name, room, content} = data;
  const context = socket || io;

  context.in(room)
    .emit('server.chat.message', {
      name,
      room,
      content,
      id: Date.now()
    })

  messageStore.addMessage(data);
}




server.listen(4000, () => {
  console.log('SocketIO server listening on 4000')
})