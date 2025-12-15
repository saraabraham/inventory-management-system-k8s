import { DateTime } from 'luxon';
import Groq from "groq-sdk/index.js";
import dotenv from "dotenv";

dotenv.config({ path: "../backend/config/config.env" });

const groq = new Groq(process.env.GROQ_API_KEY);

class ChatAgent {
    constructor(name, instructions, prompt, model = "meta-llama/llama-4-scout-17b-16e-instruct") {
        this.name = name;
        this.instructions = instructions;
        this.model = model;
        this.groqClient = groq;
        this.prompt = prompt;
    }

    async run(input) {
        try {
            // Validate input is a string
            // if (typeof input !== 'string') {
            //     console.error('Invalid input type:', typeof input, input);
            //     throw new Error('Input must be a string');
            // }

            const response = await groq.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: "system",
                        content: "You are a career instructor",
                    },
                    {
                        role: "user",
                        content: input, // Remove trailing comma
                    },
                ],
            });
            return response.choices[0]?.message?.content || "";
        } catch (error) {
            console.error('Error in ChatAgent.run():', error);
            throw error;
        }
    }

    getErrorResponse(error) {
        return {
            role: 'assistant',
            content: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.',
            error: error.message
        };
    }
}

export default ChatAgent;