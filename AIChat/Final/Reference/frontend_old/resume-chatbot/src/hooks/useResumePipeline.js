import { useState, useCallback } from 'react';

export default function useResumePipeline({ setMessages, resetFileInput, formatText }) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentStage, setCurrentStage] = useState('');

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    const analyzeResume = useCallback(async (file) => {
        if (!file) return;

        setIsAnalyzing(true);
        setCurrentStage('📤 Uploading resume...');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            setMessages(prev => [...prev, { type: 'bot', content: '🔄 Starting resume analysis pipeline...', timestamp: new Date() }]);
            await delay(500);

            setCurrentStage('🔍 Extracting resume data...');
            const response = await fetch('http://localhost:3001/api/analyze-resume', { method: 'POST', body: formData });
            const result = await response.json();
            if (!result.success) throw new Error(result.error || 'Analysis failed');

            const data = result.data;

            // --- Extraction stage ---
            setCurrentStage('✅ Extraction complete');
            setMessages(prev => [...prev, { type: 'bot', content: '📄 Resume successfully extracted!', timestamp: new Date() }]);
            await delay(500);

            // --- Job Matching ---
            setCurrentStage('🎯 Matching jobs...');
            const jobs = data.job_matches?.matched_jobs || [];
            if (jobs.length > 0) {
                setMessages(prev => [...prev, { type: 'bot', content: `🎯 Found ${jobs.length} job match${jobs.length > 1 ? 'es' : ''}!`, timestamp: new Date() }]);
            } else {
                setMessages(prev => [...prev, { type: 'bot', content: '⚠️ No suitable job matches found.', timestamp: new Date() }]);
            }
            await delay(500);

            // --- Screening ---
            setCurrentStage('👥 Screening candidate...');
            const screeningReport = data.screening_results?.screening_report || 'No screening data';
            setMessages(prev => [...prev, { type: 'bot', content: formatText(screeningReport), timestamp: new Date() }]);
            await delay(500);

            // --- Final Recommendation ---
            setCurrentStage('💡 Generating recommendation...');
            const recommendation = data.final_recommendation?.final_recommendation || 'No recommendation available';
            setMessages(prev => [...prev, { type: 'bot', content: formatText(recommendation), timestamp: new Date() }]);
            await delay(500);

        } catch (error) {
            console.error('Pipeline error:', error);
            setMessages(prev => [...prev, { type: 'bot', content: `❌ Error: ${error.message}`, timestamp: new Date(), isError: true }]);
        } finally {
            setIsAnalyzing(false);
            setCurrentStage('');
            resetFileInput();
        }
    }, [setMessages, resetFileInput, formatText]);

    return { analyzeResume, isAnalyzing, currentStage };
}
