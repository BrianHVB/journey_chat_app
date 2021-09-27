import { signIn, signOut, useSession } from "next-auth/client";
import {useEffect, useContext, useRef} from "react";
import styled from 'styled-components';

import ChatContext from '../context/ChatContext';

export default function App() {
  const [session, loading] = useSession();

  const context = useContext(ChatContext);

  const chatInputRef = useRef(null);

  useEffect(function logMessageChange() {
    console.log('messages change', context.messages);
  }, [context])

  function handleSignIn() {
    signIn('google', {callbackUrl: 'http://localhost/'})
  }

  function handleSignOut() {
    signOut();
  }

  function handleChatSubmit() {
    const content = chatInputRef.current.value;
    context.emitMessage(content);
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

  console.log('displayMessages', {messages: context.messages, currentRoom: context.currentRoom, displayMessages})

  return (

    <SBody>
      <SSession>
        {loading && <p>Loading...</p>}
        {session && signOutPrompt}
        {!session && signInPrompt}
      </SSession>

      <SMessages>
        {displayMessages}
      </SMessages>

      <SChatInputContainer>
        <SChatInput ref={chatInputRef} onKeyPress={handleInputKeyPress}/>
        <SChatSubmitButton onClick={handleChatSubmit}>
          send
        </SChatSubmitButton>
      </SChatInputContainer>
    </SBody>

  )
}

function Message(props) {
  const {name, content} = props;

  return (
    <SMessageContainer>
      <SMessageName>{name}</SMessageName>
      <SMessageContent>{content}</SMessageContent>
    </SMessageContainer>
  )
}

const SSession = styled.div`
  background-color: lightgrey;
  width: 500px;
  margin-bottom: 10px;
  padding: 5px;
`

const SMessages = styled.div`
  width: 500px;
  height: 80vh;
  border: 1px solid white;
  background-color: black;
`

const SMessageContainer = styled.div`
  display: block;  
`

const SMessageName = styled.span`
  display: inline;
  color: lightblue;
`

const SMessageContent = styled.span`
  color: #39FF14;
  padding-left: 10px;
`

const SBody = styled.div`
  margin: 20px 10px;
  padding: 20px 10px;
`

const SChatInputContainer = styled.div`
  width: 500px;
  height: 30px;
  margin-top: 5px;
  
`

const SChatInput = styled.input`
  width: 400px;
  height: 100%;
  float: left;
  background-color: darkblue;
  color: bisque;
  font-size: 14pt;
  padding: 0 5px;
  
`

const SChatSubmitButton = styled.button`
  width: 75px;
  height: 100%;
  float: right;
  background-color: darkblue;
  color: white;
  font-size: 14pt;
`