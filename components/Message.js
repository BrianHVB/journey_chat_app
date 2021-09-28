import styled from "styled-components";

export default function Message(props) {
  const {name, content, type = 'chat'} = props;

  const messageContent = type === 'status'
    ? (
        <StatusMessageContent>{content}</StatusMessageContent>
      )
    : (
        <>
          <MessageName>{name}</MessageName>
          <ChatMessageContent>{content}</ChatMessageContent>
        </>
      )

  return (
    <MessageContainer>
      {messageContent}
    </MessageContainer>
  )
}

const MessageContainer = styled.div`
  display: block;  
`;

const MessageName = styled.span`
  display: inline;
  color: lightblue;
`;

const ChatMessageContent = styled.span`
  color: #39FF14;
  padding-left: 10px;
`;

const StatusMessageContent = styled.span`
  color: palegoldenrod;
  font-style: italic;
  
`;