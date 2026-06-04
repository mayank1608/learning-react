import React, { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'
import './ChatMessages.css';

const ChatMessages = ({ chatMessages }) => {
    const chatMessagesRef = useRef(null);
    useEffect(() => {
        const containerElement = chatMessagesRef.current
        if (containerElement) {
            containerElement.scrollTop = containerElement.scrollHeight
        }
    }, [chatMessages])


    return (
        <div className="chat-messages-container" ref={chatMessagesRef}>
            {
                chatMessages.map((chatmessage) =>
                    <ChatMessage
                        message={chatmessage.message}
                        sender={chatmessage.sender}
                        key={chatmessage.id}
                    />
                )
            }
        </div>
    )
}

export default ChatMessages