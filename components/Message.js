import styled from "styled-components";

export default function Message(props) {
  const {name, content} = props;

  return (
    <SMessageContainer>
      <SMessageName>{name}</SMessageName>
      <SMessageContent>{content}</SMessageContent>
    </SMessageContainer>
  )
}

const SMessageContainer = styled.div`
  display: block;  
`;

const SMessageName = styled.span`
  display: inline;
  color: lightblue;
`;

const SMessageContent = styled.span`
  color: #39FF14;
  padding-left: 10px;
`;