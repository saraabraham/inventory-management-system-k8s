// testExtractor.js
import ExtractorAgent from '../agents/ExtractorAgent.js';
import fs from 'fs';

async function main() {
    // Provide either raw text or a PDF file path
    const mockMessages = [
        {
            role: "user",
            content: JSON.stringify({
                file_path: "./uploads/test_resume3.pdf" // <-- Replace with your PDF path
                // Or you can use: text: "Your raw resume text here"
            })
        }
    ];

    const agent = new ExtractorAgent();

    try {
        const result = await agent.run(mockMessages);

        console.log("\n--- Extractor Agent Output ---");
        console.log(JSON.stringify(result, null, 2));

    } catch (err) {
        console.error("❌ Extractor test failed:", err.message);
    }
}

main();
