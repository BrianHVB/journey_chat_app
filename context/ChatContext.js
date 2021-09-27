import React from 'react';

const ChatContext = React.createContext({
  messages: {
    public: [],
  },

  currentRoom: 'public',
  setCurrentRoom: (room) => {},
  emitMessage: (message) => {},
})

export default ChatContext;