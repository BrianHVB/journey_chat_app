require('dotenv').config();
const express = require('express');
const http = require('http');
const messageStore = require('./controllers/MessageStore');
const sessionManager = require('./controllers/SessionManager')

const app = express();
const server = http.createServer(app);
const { Server: SocketServer } = require('socket.io');
const io = new SocketServer(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"]
  }
});


io.on('connection', socket => {
  console.log('new connection');

  socket.on('client.chat.message', data => {
    broadcastToRoom(data);
  })


  socket.on('client.room.join', async (data, callback) => {
    const { name, room, token } = data;
    console.dir({name, room, token});

    const { result: canJoin, reason} = await canJoinRoom(room, token);

    if (!canJoin) {
      emitStatusMessageToSocket({content: reason}, socket);
      console.log(`${name} failed to join ${room}: ${reason}`)
      callback(false);
      return;
    }

    socket.join(room);
    console.log(`${name} joined ${room}`)
    callback(true);
    broadcastToRoom({name, room, content: `_joined the room_`}, socket);

    const messages = messageStore.getMessages(room);
    socket.emit('server.room.history', {room, messages});
  })

  socket.on('client.room.leave', data => {
    const {name, room} = data;

    socket.leave(room);
    console.log(`${name} left ${room}`);
    broadcastToRoom({name, room, content: `_left the room_`}, socket);
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

function emitStatusMessageToSocket(data, socket) {
  socket.emit('server.status.message', data);
}


async function canJoinRoom(room, token) {

  if (room.toLowerCase().startsWith('public')) {
    return {result: true}
  }

  if (!token) {
    return {
      result: false,
      reason: 'You must be logged in to join non-public rooms'
    }
  }

  if (sessionManager.isAuthenticated) {
    return {result: true}
  }

  const isAuthenticated = await sessionManager.authenticate(token);
  return {
    result: isAuthenticated,
    reason: isAuthenticated ? null : 'Unable to verify session token. You may need to log in again'
  }

}

server.listen(4000, () => {
  console.log('SocketIO server listening on 4000')
})