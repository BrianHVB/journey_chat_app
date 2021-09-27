

class MessageStore {
  constructor(options = {}) {
    const {messageLimit = 100} = options;

    this.messageLimit = messageLimit;
    this.messages = {};
  }

  addMessage(messageData) {
    const { room } = messageData;
    const currentRoomMessages = this.messages[room]

    // no messages exist yet, init an empty array with the first message
    if (!currentRoomMessages) {
      this.messages[room] = [messageData];
      return;
    }

    // capacity for messages has been reached, delete the oldest
    if (currentRoomMessages.length >= this.messageLimit) {
      currentRoomMessages.pop()
    }

    // add the new message
    currentRoomMessages.push(messageData);
    this.messages[room] = currentRoomMessages;

    console.dir({room, messages: this.messages[room]})
  }

  getMessages(room) {
    return this.messages[room] || [];
  }

  getRooms() {
    return Object.values(this.messages);
  }
}


module.exports = new MessageStore();