import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import OrchestratorAgent from './agents/OrchestratorAgent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Resume Analysis API is running' });
});

// Resume upload and analysis endpoint
app.post('/api/analyze-resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        console.log(`📥 Received resume: ${req.file.originalname}`);

        const resumeData = {
            file_path: req.file.path,
            original_name: req.file.originalname
        };

        // Call the orchestrator in application mode
        const result = await orchestrator.process(resumeData, 'application');

        // Cleanup uploaded file
        try { fs.unlinkSync(req.file.path); } catch (_) { }

        res.json({ success: true, data: result });

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Candidate CV Builder endpoint
app.post('/api/cv-builder', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        console.log(`📄 Candidate CV Builder received file: ${req.file.originalname}`);

        const resumeData = {
            file_path: req.file.path,
            original_name: req.file.originalname
        };

        // Call the orchestrator in CV builder mode
        const result = await orchestrator.process(resumeData, 'cv_builder');

        // Cleanup uploaded file
        try { fs.unlinkSync(req.file.path); } catch (_) { }

        res.json({
            success: true,
            mode: 'candidate',
            message: 'CV successfully analyzed and improved',
            data: result
        });

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({
            success: false,
            mode: 'candidate',
            error: error.message
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

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ error: err.message });
    }

    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`🚀 Resume Analysis API running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});

export default app;