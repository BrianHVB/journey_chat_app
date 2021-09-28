import React, {useEffect, useState} from "react";
import { io } from 'socket.io-client';
import ChatContext from "./ChatContext";
import {useSession} from "next-auth/client";


const socket = io(null, {
  closeOnBeforeunload: true,
  autoConnect: false,
})

function generateAnonymousName() {
  return `Anonymous(${Math.random().toString().slice(2, 6)})`;
}

export default function ChatContextProvider(props) {
  const { children } = props;

  const [session, loading] = useSession();

  const [messages, setMessages] = useState({public: []});
  const [currentRoom, setCurrentRoom] = useState('public');
  const [name, setName] = useState(null);


  useEffect(function updateName() {
    const newName = session?.user?.name || generateAnonymousName();

    console.log('session change', {name, session, loading})
    if (newName !== name && !loading) {
      setName(newName);
    }
  }, [session, loading])

  useEffect(function joinRoomOnNameChange() {
    !loading && name && joinRoom(currentRoom);
  }, [name, loading])

  useEffect(function connectSocket() {
    registerHandlers();
    fetch('/api/getSocketServer')
      .then(res => res.text())
      .then(wsHost => {
        socket.io.uri = wsHost;
        if (!socket.connected) {
          socket.connect()
        }
      })
  }, [])

  function registerHandlers() {

    socket.on('connect', () => {
    })

    socket.on('server.chat.message', payload => {
      const {room, name, content} = payload;

      setMessages(prevVal => {
        const existingRoomMessages = prevVal[room] || [];
        const newRoomMessages = [...existingRoomMessages, payload];
        const newMessages = {
          ...prevVal,
          [room]: newRoomMessages
        }
        console.log('setMessages', {prevVal, existingRoomMessages, newRoomMessages, newMessages})
        return newMessages;
      })
    })

    socket.on('server.status.message', payload => {
      setMessages(prevVal => {
        const existingMessages = prevVal[currentRoom] || [];
        const newMessages = [...existingMessages, payload];
        return {
          ...prevVal,
          [currentRoom]: newMessages
        }
      })
    });

    socket.on('server.room.history', data => {
      const {room, messages} = data;
      setMessages(prevVal => ({
        ...prevVal,
        [room]: messages,
      }))
    })
  }

  function processMessage(content) {
    if (content.startsWith('/')) {
      processCommand(content.substr(1));
    }
    else {
      emitChatMessage(content)
    }
  }

  function emitChatMessage(content) {
    const payload = {
      name: name,
      room: currentRoom,
      content: content
    }
    socket.emit('client.chat.message', payload)
  }

  async function joinRoom(room) {
    const cookieResp = await fetch('/api/auth/getCookies');
    const cookies = await cookieResp.json();
    const token = cookies['next-auth.session-token'];

    const payload = {name, room, token};
    socket.emit('client.room.join', payload, (result) => {
      console.log('join room callback result', result);
      if (result) {
        messages[room] == null && setMessages(prevVal => ({...prevVal, [room]: []}));
        setCurrentRoom(room);
      }
    });
  }

  function processCommand(command) {
    const [cmd, ...cmdArgs] = command.split(' ');
    console.log('processCommand', cmd, cmdArgs)
    switch(cmd) {
      case 'join':
        const [room] = cmdArgs
        room && joinRoom(room);
    }
  }


  const contextValue = {
    messages: messages,
    currentRoom: currentRoom,
    sendMessage: processMessage,
  }


  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  )
}