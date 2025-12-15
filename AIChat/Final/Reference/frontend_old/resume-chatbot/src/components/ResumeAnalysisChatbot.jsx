import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInputArea from './ChatInputArea';
import useFileUpload from '../hooks/useFileUpload';
import useChatFormatter from '../hooks/useChatFormatter';
import useResumePipeline from '../hooks/useResumePipeline';

const ResumeAnalysisChatbot = () => {
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: "Hello! 👋 I'm your AI Powered Career Assistant. Upload your resume (PDF) and I'll provide insights including skill analysis, job matching, and recommendations.",
            timestamp: new Date(),
        },
    ]);

    const { file, setFile, handleFileSelect, resetFileInput } = useFileUpload();
    const { formatText } = useChatFormatter();
    const { analyzeResume, isAnalyzing, currentStage } = useResumePipeline({ setMessages, resetFileInput, formatText });

    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleAnalyzeClick = () => {
        if (!file) return alert('Please select a resume file first');
        analyzeResume(file);
        setFile(null);
    };

    return (
        <div className="flex flex-col h-screen bg-green-50 font-sans">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-6 mt-4">
                <ChatMessages messages={messages} isAnalyzing={isAnalyzing} currentStage={currentStage} />
                <div ref={messagesEndRef} />
            </div>

            <ChatInputArea
                file={file}
                fileInputRef={resetFileInput.ref}
                handleFileSelect={handleFileSelect}
                analyzeResume={handleAnalyzeClick}
                isAnalyzing={isAnalyzing}
            />
        </div>
    );
};

export default ResumeAnalysisChatbot;
