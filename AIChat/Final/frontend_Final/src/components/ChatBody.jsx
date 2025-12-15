import React, { useState } from 'react';
import SignupForm from './SignupForm';
import { useNavigate } from 'react-router-dom';
import '../styles/ChatBody.css'

const ChatBody = () => {

    const [showSignUp, setSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState('');
    const handleOpenSignUp = () => setSignUp(true);
    const handleCloseSignUp = () => setSignUp(false);
    const navigate = useNavigate();
    const handleSend = async () => {
        if (prompt.trim() === '' || loading) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: prompt }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch response');
            }

            // Navigate to ChatBot with initial message from API
            navigate('/chatbot', {
                state: {
                    initialPrompt: prompt,
                    initialResponse: data.message, // API reply
                },
            });

            setPrompt('');
        } catch (err) {
            console.error(err);
            alert('Failed to fetch response. Please try again.');
        } finally {
            setLoading(false);
        }

    };
    const handleInterviewPrep = async () => {
        const promptMessage = "Tips for interview preparation";
        if (promptMessage.trim() === '' || loading) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: promptMessage }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch response');
            }

            // Navigate to ChatBot with initial message from API
            navigate('/chatbot', {
                state: {
                    initialPrompt: promptMessage,
                    initialResponse: data.message, // API reply
                },
            });

            setPrompt('');
        } catch (err) {
            console.error(err);
            alert('Failed to fetch response. Please try again.');
        } finally {
            setLoading(false);
        }

    };

    const handleCompanyOverview = async () => {
        const companyName = prompt.trim(); // get the company from input
        if (!companyName) {
            alert("Please enter a company name");
            return;
        }
        const promptMessage2 = `Provide a detailed overview of a ${companyName}, including its history, products/services, headquarters, key achievements, and recent news.`;
        if (promptMessage2.trim() === '' || loading) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: promptMessage2 }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch response');
            }

            // Navigate to ChatBot with initial message from API
            navigate('/chatbot', {
                state: {
                    initialPrompt: promptMessage2,
                    initialResponse: data.message, // API reply
                },
            });

            setPrompt('');
        } catch (err) {
            console.error(err);
            alert('Failed to fetch response. Please try again.');
        } finally {
            setLoading(false);
        }

    };



    return (

        <div className="chat-body">
            <h1>The Career AI Assistant</h1>
            <h2>Ask SwipeJobb AI to create or analyze CV, check job posts compatibility, master interviews, and discover career programs instantly.</h2>
            <div className="chat-input">
                <textarea
                    placeholder="Ask about a job or career assistant ?"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="chat-func">
                    <button id="upload-btn"><img src="assets/icons/uploadDocs.svg" alt="upload files" /></button>
                    <div className="scrollFuncts">
                        <button><img src="/assets/icons/uploadCV.svg" alt="upload cv" />Upload CV</button>
                        <button><img src="/assets/icons/shareJob.svg" alt="share job" />Share Job Link</button>
                        <button id="company-overview" onClick={handleCompanyOverview}><img src="/assets/icons/companyOverview.svg" alt="company overview" />Company Overview</button>
                        <button id="interview-prep" onClick={handleInterviewPrep}><img src="/assets/icons/interviewPrep.svg" alt="interview prep" />Interview Preparation</button>
                    </div>

                    <button id="send-btn" onClick={handleSend}><img src="/assets/icons/sendPrompts.svg" alt="send prompt" /></button>

                </div>

            </div>

            {/* <SignupForm
                isOpen={showSignUp}
                onRequestClose={handleCloseSignUp}
            /> */}


            <div className="try-funct">
                <h2>Not sure where to start? Try one of these:</h2>
                <button><img src="/assets/images/createCV.png" alt="upload cv" />Create a CV</button>
                <button><img src="/assets/images/analyzeJob.png" alt="upload cv" />Analyze job post</button>
                <button><img src="/assets/images/compCheck.png" alt="upload cv" />Compatibilty check</button>

            </div>

        </div>
    );
};

export default ChatBody;