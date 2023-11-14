import React, { useEffect, useRef, useState } from "react";
import {
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
  } from "@chatscope/chat-ui-kit-react";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import io from 'socket.io-client';
import Linkify from 'react-linkify';

function ChatComponent({roomId, username}) {
    const chatSocketRef = useRef();
    const inputRef = useRef();
    const [msgInputValue, setMsgInputValue] = useState("");
    const [messages, setMessages] = useState([]);


    const sendMessage = (message) => {
      message = message.replace(/&nbsp;/g,'');
      const updatedMessages = [...messages, {
        message,
        direction: 'outgoing',
        isNotification: false
      }];
      setMessages(updatedMessages);
      setMsgInputValue("");
      sessionStorage.setItem(`chat_${roomId}`, JSON.stringify(updatedMessages));
      inputRef.current.focus();
      chatSocketRef.current.emit('send-message', message, roomId, username);
    }

    const receiveMessage = (message) => {
      message = message.replace(/&nbsp;/g,'');
      const updatedMessages = [...messages, {
        message,
        direction: 'incoming',
        isNotification: false
      }];
      setMessages(updatedMessages);
      sessionStorage.setItem(`chat_${roomId}`, JSON.stringify(updatedMessages));
    }

    const sendNotification = (message) => {
      const updatedMessages = [...messages, {
        message,
        isNotification: true
      }];
      setMessages(updatedMessages);
    }

    useEffect(() => {
      const chatHistory = sessionStorage.getItem(`chat_${roomId}`);
      if (chatHistory) {
        console.log('loaded chat history');
        setMessages(JSON.parse(chatHistory));
      }
      chatSocketRef.current = io('http://localhost:5003',  { transports : ['websocket'] });
      chatSocketRef.current.emit('join-chat', roomId, username);

      return () => {
        chatSocketRef.current.emit('leave-chat');
      }
    }, [roomId, username]);


    useEffect(() => {
        chatSocketRef.current.on('receive-message', (message) => {
            receiveMessage(message);
        });

        chatSocketRef.current.on('inform-connect', (username) => {
          sendNotification(`${username} joined the chat`);
        });

        chatSocketRef.current.on('inform-disconnect', (username) => {
          sendNotification(`${username} left the chat`);
        });

    })

    return (
        <ChatContainer>
          <MessageList scrollBehavior="smooth">
            {messages.map((m, i) => 
              m.isNotification 
              ? <Message key={i} model={{
                direction:"incoming",
                type: "custom"
              }}>
                  <Message.CustomContent>
                    <strong>{m.message}</strong>
                </Message.CustomContent>
                  </Message>
              : <Message key={i} model={{ direction: m.direction}} >
                <Message.CustomContent>
                  <Linkify>
                    {m.message}
                  </Linkify>
                </Message.CustomContent>
              </Message>)}
          </MessageList >
          <MessageInput attachButton={false} placeholder="Type message here" onSend={sendMessage} onChange={setMsgInputValue} value={msgInputValue} ref={inputRef}/>
        </ChatContainer>
          )
}

export default ChatComponent;
