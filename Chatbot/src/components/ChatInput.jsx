import React, { useState } from 'react';
import { Chatbot } from 'supersimpledev';
import './ChatInput.css';

const ChatInput = ({ chatMessages, setChatMessages }) => {
    const [inputText, setInputText] = useState('');

    const sendMessage = () => {
        setChatMessages((prev) => [
            ...chatMessages,
            {
                message: inputText,
                sender: 'user',
                id: crypto.randomUUID()
            }
        ]);
        const response = Chatbot.getResponse(inputText);
        setChatMessages((prev) => [
            ...prev,
            {
                message: response,
                sender: 'robot',
                id: crypto.randomUUID()
            }
        ])
        setInputText('');
        console.log('chatMessages', chatMessages)
    }

    return (
        <div className="chat-input-container">
            <input
                placeholder="Send a message to Chatbot"
                size="30"
                onChange={(e) => setInputText(e.target.value)}
                value={inputText}
                className="chat-input"
            />
            <button
                onClick={sendMessage}
                className="send-button"
            >Send</button>
        </div>
    )
}

export default ChatInput