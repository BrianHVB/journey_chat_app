import { signIn, signOut, useSession } from "next-auth/client";
import {useEffect, useContext, useRef} from "react";
import styled from 'styled-components';

import ChatContext from '../context/ChatContext';
import {AutoScroller} from "../components/AutoScroller";
import Message from "../components/Message";

export default function App() {
  const [session, loading] = useSession();

  const context = useContext(ChatContext);

  const chatInputRef = useRef(null);


  function handleSignIn() {
    signIn('google', {callbackUrl: 'http://localhost/'})
  }

  function handleSignOut() {
    signOut();
  }

  function handleChatSubmit() {
    const content = chatInputRef.current.value;
    context.sendMessage(content);
    chatInputRef.current.value = '';
  }

  function handleInputKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleChatSubmit();
    }
  }

  const signInPrompt = (
    <>
      <div>You are not signed in</div>
      <button onClick={handleSignIn}>Sign in with Google</button>
    </>
  )

  const signOutPrompt = (
    <>
      <div>You are signed in as {session?.user?.name}</div>
      <button onClick={handleSignOut}>Sign Out</button>
    </>
  )

  const displayMessages = context
    .messages[context.currentRoom]
    .map(msg => {
      return <Message key={msg.id} name={msg.name} content={msg.content}/>
    })

  return (
    <Body>

      <Header>
        <Session>
          {loading && <p>Loading...</p>}
          {session && signOutPrompt}
          {!session && signInPrompt}
        </Session>
        <Room>
          <span className={'label'}>Room: <span className={'name'}>{context.currentRoom}</span></span>
        </Room>
      </Header>

      <MessagesContainer>
        <AutoScroller tolerance={25} alwaysScroll={false}>
          <Messages>
            {displayMessages}
          </Messages>
        </AutoScroller>
      </MessagesContainer>


      <ChatInputContainer>
        <ChatInput ref={chatInputRef} onKeyPress={handleInputKeyPress}/>
        <ChatSubmitButton onClick={handleChatSubmit}>
          send
        </ChatSubmitButton>
      </ChatInputContainer>

    </Body>
  )
}

const Body = styled.div`
  margin: 20px 10px;
  padding: 20px 10px;
`;


const Header = styled.div`
  height: auto;
  width: 100%;
  display: grid;
  background-color: lightgrey;
  margin-bottom: 10px;
  padding: 5px;
  grid-template-columns: 250px 1fr;
  grid-template-areas: 'session room';
`;

const Session = styled.span`
  grid-area: session;
  justify-self: center;
`;

const Room = styled.span`
  grid-area: room;
  justify-self: center;
  align-self: center;
  font-size: 16pt;
  
  .label {
    color: darkBlue
  }
  
  .name{
    color: darkRed;
  }
`;


const MessagesContainer = styled.div`
  height: 40em;
  overflow: auto;
  border: 1px solid gray;
  padding: 5px;
  background-color: black
`;

const Messages = styled.pre`
  font-family: 'Source Code Pro', Monaco, monospace;
  line-height: 1.4em;
  color: lightcyan;
  background-color: black;
  overflow-x: visible;
  scrollbar-width: none;
  padding-left: 10px;
`;


const ChatInputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 75px;
  grid-column-gap: 10px;
  width: 100%;
  height: 40px;
  margin-top: 5px;
`;

const ChatInput = styled.input`
  height: 100%;
  float: left;
  background-color: darkblue;
  color: bisque;
  font-size: 14pt;
  padding: 0 5px;
`;

const ChatSubmitButton = styled.button`
  height: 100%;
  float: right;
  background-color: darkblue;
  color: white;
  font-size: 14pt;
`;