import React from 'react';

const ChatContext = React.createContext({
  messages: {
    public: [],
  },

  currentRoom: 'public',
  setCurrentRoom: (room) => {},
  sendMessage: (message) => {},
})

export default ChatContext;