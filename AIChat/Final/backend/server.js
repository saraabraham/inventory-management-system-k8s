import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ChatAgent from './ChatAgent.js';

dotenv.config({ path: "./config/config.env" });  // Changed path

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Check if GROQ_API_KEY exists
console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);

// Initialize ChatAgent with error handling
let chatAgent;
try {
    chatAgent = new ChatAgent(
        "Career Instructor",
        "You are a helpful career instructor",
        "Help users with career guidance"
    );
    console.log('ChatAgent initialized successfully');
} catch (error) {
    console.error('Failed to initialize ChatAgent:', error);
    process.exit(1);
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                error: 'Invalid message format'
            });
        }

        const response = await chatAgent.run(message);

        res.json({
            success: true,
            message: response,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process chat message',
            message: chatAgent.getErrorResponse(error).content
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});