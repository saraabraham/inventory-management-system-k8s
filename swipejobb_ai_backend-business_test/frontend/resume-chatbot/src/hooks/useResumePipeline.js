import { useState, useCallback } from 'react';

export default function useResumePipeline({ setMessages, resetFileInput, formatText }) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentStage, setCurrentStage] = useState('');

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    /**
     * Runs the pipeline for either candidate or HR workflow
     * @param {File} file - The uploaded resume
     * @param {'candidate'|'hr'} workflowMode
     */
    const runPipeline = useCallback(async (file, workflowMode = 'candidate') => {
        if (!file) return;

        setIsAnalyzing(true);
        setCurrentStage('📤 Uploading resume...');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            setMessages(prev => [
                ...prev,
                { type: 'bot', content: `🔄 Starting ${workflowMode === 'candidate' ? 'Candidate CV' : 'HR'} workflow pipeline...`, timestamp: new Date() }
            ]);
            await delay(300);

            setCurrentStage('🔍 Processing resume...');
            const endpoint = workflowMode === 'candidate'
                ? 'http://localhost:3001/api/cv-builder'
                : 'http://localhost:3001/api/analyze-resume';

            const response = await fetch(endpoint, { method: 'POST', body: formData });
            const result = await response.json();

            if (!result.success) throw new Error(result.error || 'Pipeline failed');

            setCurrentStage('✅ Pipeline completed');
            const displayData = workflowMode === 'candidate'
                ? result.data.cv_build || result.data
                : result.data;

            setMessages(prev => [
                ...prev,
                { type: 'bot', content: formatText(JSON.stringify(displayData, null, 2)), timestamp: new Date() }
            ]);

        } catch (error) {
            console.error('Pipeline error:', error);
            setMessages(prev => [
                ...prev,
                { type: 'bot', content: `❌ Error: ${error.message}`, timestamp: new Date(), isError: true }
            ]);
        } finally {
            setIsAnalyzing(false);
            setCurrentStage('');
            resetFileInput();
        }
    }, [setMessages, resetFileInput, formatText]);

    return { runPipeline, isAnalyzing, currentStage };
}
