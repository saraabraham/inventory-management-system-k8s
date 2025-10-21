import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInputArea from './ChatInputArea';
import useFileUpload from '../hooks/useFileUpload';
import useChatFormatter from '../hooks/useChatFormatter';

// Import Candidate & HR components
import CandidateCards from './CandidateCards';
import HRCards from './HRCards';

const ResumeAnalysisChatbot = () => {
    const [messages, setMessages] = useState([
        { type: 'bot', content: "Hello! 👋 Upload your resume (PDF) and I'll provide insights.", timestamp: new Date() }
    ]);
    const [workflowMode, setWorkflowMode] = useState('candidate');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentStage, setCurrentStage] = useState('');
    const { file, setFile, handleFileSelect, resetFileInput } = useFileUpload();
    const { formatText } = useChatFormatter();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleToggleWorkflow = () => {
        setWorkflowMode(prev => prev === 'candidate' ? 'hr' : 'candidate');
        setMessages(prev => [
            ...prev,
            { type: 'bot', content: `⚡ Switched to ${workflowMode === 'candidate' ? 'HR workflow' : 'CV Builder workflow'} mode`, timestamp: new Date() }
        ]);
    };

    const handleAnalyzeClick = async () => {
        if (!file) return alert('Please select a resume file first');
        setIsAnalyzing(true);
        setCurrentStage('📤 Uploading resume...');
        const formData = new FormData();
        formData.append('resume', file);

        try {
            setMessages(prev => [...prev, { type: 'bot', content: '🔄 Starting pipeline...', timestamp: new Date() }]);
            const endpoint = workflowMode === 'candidate'
                ? 'http://localhost:3001/api/cv-builder'
                : 'http://localhost:3001/api/analyze-resume';

            setCurrentStage('🔍 Processing resume...');
            const response = await fetch(endpoint, { method: 'POST', body: formData });
            const result = await response.json();
            if (!result.success) throw new Error(result.error || 'Pipeline failed');
            const data = result.data;

            const structuredMessages = workflowMode === 'candidate'
                ? CandidateCards(data, handleDownloadCV)
                : HRCards(data);

            setMessages(prev => [...prev, ...structuredMessages]);
        } catch (error) {
            console.error('Pipeline error:', error);
            setMessages(prev => [...prev, { type: 'bot', content: `❌ Error: ${error.message}`, timestamp: new Date(), isError: true }]);
        } finally {
            setIsAnalyzing(false);
            setCurrentStage('');
            setFile(null);
            resetFileInput();
        }
    };

    const handleDownloadCV = (cvData) => {
        const cvText = `
PROFESSIONAL RESUME
${'='.repeat(50)}

PROFESSIONAL SUMMARY
${cvData.professional_summary}

CORE COMPETENCIES
${cvData.core_competencies?.join(' • ') || 'N/A'}

WORK EXPERIENCE
${cvData.work_experience?.map(exp => `
${exp.title} | ${exp.company}
${exp.duration} | ${exp.location || ''}
${exp.achievements?.map(a => `• ${a}`).join('\n') || ''}
`).join('\n') || 'N/A'}

EDUCATION
${cvData.education?.map(edu => `
${edu.degree}
${edu.institution} | ${edu.year}
${edu.highlights?.map(h => `• ${h}`).join('\n') || ''}
`).join('\n') || 'N/A'}

${cvData.certifications?.length > 0 ? `CERTIFICATIONS\n${cvData.certifications.join(' • ')}` : ''}
        `.trim();

        const blob = new Blob([cvText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'enhanced-resume.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col h-screen bg-green-50 font-sans">
            <ChatHeader />
            <div className="flex justify-center mt-2">
                <button
                    onClick={handleToggleWorkflow}
                    className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                    Switch to {workflowMode === 'candidate' ? 'HR Workflow' : 'CV Builder Workflow'}
                </button>
            </div>
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
