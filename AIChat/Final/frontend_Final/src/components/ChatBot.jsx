import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import '../styles/ChatBot.css';
import NavbarChat from './NavbarChat';
import Sidebar from './Sidebar';

export default function ChatBot() {
    const location = useLocation();
    const messagesEndRef = useRef(null);


    // Get initial prompt and API response from navigation state
    const initialPrompt = location.state?.initialPrompt || '';
    const initialResponse = location.state?.initialResponse || '';



    const [messages, setMessages] = useState(() => {
        const msgs = [];

        // Add initial prompt and response if provided
        if (initialPrompt) {
            msgs.push({
                role: 'user',
                content: initialPrompt,
                timestamp: new Date().toISOString()
            });
        }
        if (initialResponse) {
            msgs.push({
                role: 'assistant',
                content: initialResponse,
                timestamp: new Date().toISOString()
            });
        }

        return msgs;
    });

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Function to send message to API
    const sendMessage = async (msgParam) => {
        const messageToSend = msgParam ?? input;
        if (!messageToSend.trim()) return;

        // Add user message
        if (!msgParam) setMessages(prev => [
            ...prev,
            { role: 'user', content: messageToSend, timestamp: new Date().toISOString() }
        ]);


        if (!msgParam) setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageToSend })
            });

            const data = await response.json();

            if (!data.success) throw new Error(data.error || 'Failed to fetch response');

            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: data.message, timestamp: new Date().toISOString() }
            ]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date().toISOString() }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chatbot-container">
            <div> <NavbarChat /></div>

            {/* Messages */}
            <div className="messages-container">
                <div className="messages-container2"> {messages.map((msg, idx) => (
                    <div key={idx} className={`message-wrapper ${msg.role}`}>
                        <div className={`message-bubble ${msg.role}`}>
                            <p className="message-content">{msg.content}</p>
                            <span className="message-timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        </div>
                    </div>
                ))}
                    {isLoading && (
                        <div className="message-wrapper assistant">
                            <div className="loading-bubble">
                                <div className="loading-spinner"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} /></div>

            </div>

            {/* Input Area */}
            <div className="input-container">
                <div className="input-wrapper">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="chat-input2"
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isLoading}
                        className="send-button"
                    >
                        <Send className="send-icon" />
                    </button>
                </div>
            </div>
        </div>
    );
}
