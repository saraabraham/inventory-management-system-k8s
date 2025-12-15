import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import OrchestratorAgent from './src/agents/OrchestratorAgent.js';
import ChatAgent from './src/agents/ChatAgent.js';

// dotenv.config({path: "./src/config/config.env"});
dotenv.config({ path: "./config/config.env" });


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Initialize orchestrator
const orchestrator = new OrchestratorAgent();
const chat = new ChatAgent;

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'SwipeJobb Career AI Assistant is running!' });
});

// Resume upload and analysis endpoint
app.post('/api/analyze-resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(`📥 Received resume: ${req.file.originalname}`);

        const resumeData = {
            file_path: req.file.path,
            original_name: req.file.originalname
        };

        // Process the resume through the orchestrator
        const result = await orchestrator.processApplication(resumeData);

        // Clean up uploaded file after processing
        try {
            fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
            console.warn('Failed to delete temporary file:', cleanupError.message);
        }

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('❌ Analysis error:', error);

        // Clean up file on error
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupError) {
                console.warn('Failed to delete temporary file:', cleanupError.message);
            }
        }

        res.status(500).json({
            success: false,
            error: error.message || 'An error occurred during resume analysis'
        });
    }
});

// Get formatted insights endpoint
app.post('/api/get-insights', async (req, res) => {
    try {
        const { workflowData } = req.body;

        if (!workflowData) {
            return res.status(400).json({ error: 'No workflow data provided' });
        }

        const insights = formatInsights(workflowData);
        res.json({ success: true, insights });

    } catch (error) {
        console.error('❌ Insights error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate insights'
        });
    }
});

// Helper function to format insights for chat display
function formatInsights(workflowData) {
    const insights = [];

    // Extraction insights
    if (workflowData.extracted_data) {
        const extracted = workflowData.extracted_data;
        insights.push({
            stage: 'extraction',
            title: '📄 Resume Extracted',
            status: extracted.extraction_status,
            confidence: extracted.confidence_score,
            data: extracted.structured_data
        });
    }

    // Analysis insights
    if (workflowData.analysis_results) {
        const analysis = workflowData.analysis_results.skills_analysis;
        insights.push({
            stage: 'analysis',
            title: '🔍 Profile Analyzed',
            status: 'completed',
            confidence: workflowData.analysis_results.confidence_score,
            data: {
                experience: `${analysis.years_of_experience} years`,
                level: analysis.experience_level,
                skills: analysis.technical_skills,
                education: analysis.education,
                achievements: analysis.key_achievements
            }
        });
    }

    // Matching insights
    if (workflowData.job_matches) {
        insights.push({
            stage: 'matching',
            title: '🎯 Job Matches Found',
            status: 'completed',
            data: {
                total_matches: workflowData.job_matches.number_of_matches,
                top_matches: workflowData.job_matches.matched_jobs
            }
        });
    }

    // Screening insights
    if (workflowData.screening_results) {
        insights.push({
            stage: 'screening',
            title: '👥 Screening Complete',
            status: 'completed',
            data: {
                score: workflowData.screening_results.screening_score,
                report: workflowData.screening_results.screening_report
            }
        });
    }

    // Final recommendation
    if (workflowData.final_recommendation) {
        insights.push({
            stage: 'recommendation',
            title: '💡 Final Recommendation',
            status: 'completed',
            confidence: workflowData.final_recommendation.confidence_level,
            data: {
                recommendation: workflowData.final_recommendation.final_recommendation
            }
        });
    }

    return insights;
}


/// Chatting /api/chat
app.post('/api/chat', multer().none(), async (req, res) => {
    try {
        const { chat_input, conversation_history } = req.body;

        // Validate input
        if (!chat_input) {
            return res.status(400).json({
                status: "error",
                success: false,
                message: "chat_input is required"
            });
        }

        console.log('Chat input:', chat_input);


        // Process with ChatAgent
        const aiResponse = await chat.run(chat_input);

        // Extract response content
        const responseContent = typeof aiResponse === 'string'
            ? aiResponse
            : aiResponse.content || aiResponse.message || 'No response generated';

        res.status(200).json({
            status: "success",
            success: true,
            message: "Response received successfully",
            data: {
                chat_input: chat_input,
                response: responseContent,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            status: "error",
            success: false,
            message: error.message || "Failed to process chat"
        });
    }
});

// Optional: Endpoint to start a new conversation
app.post('/api/chat/new', async (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            success: true,
            message: "New conversation started",
            data: {
                conversation_id: Date.now().toString(), // Simple ID generation
                started_at: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error starting conversation:', error);
        res.status(500).json({
            status: "error",
            success: false,
            message: error.message || "Failed to start conversation"
        });
    }
});

// Optional: Endpoint to get conversation history
app.get('/api/chat/history/:conversationId', async (req, res) => {
    try {
        const { conversationId } = req.params;

        // TODO: Retrieve from your database
        // const history = await getConversationHistory(conversationId);

        res.status(200).json({
            status: "success",
            success: true,
            data: {
                conversation_id: conversationId,
                messages: [] // Your stored messages here
            }
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({
            status: "error",
            success: false,
            message: error.message || "Failed to fetch conversation history"
        });
    }
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);

    // Handle multer errors
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'File too large. Maximum size is 5MB.'
            });
        }
        return res.status(400).json({
            success: false,
            error: `Upload error: ${err.message}`
        });
    }

    // Handle other errors
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Resume Analysis API running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/`);
});

export default app;