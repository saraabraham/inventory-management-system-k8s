// testBaseAgent.js

import BaseAgent from '../src/agents/BaseAgent.js';
import util from 'util';

// Minimal child class to test BaseAgent
class TestAgent extends BaseAgent {
    constructor() {
        super(
            "Tester",
            "You are a helpful assistant. Return results strictly as JSON.",
            "meta-llama/llama-4-scout-17b-16e-instruct"
        );
    }

    async run() {
        const testPrompt = `
      Summarize the benefits of using Llama 4 Scout model in 3 bullet points.
      Return a JSON object with this structure:
      {
        "model_name": "string",
        "benefits": ["benefit1", "benefit2", "benefit3"],
        "test_status": "SUCCESS"
      }
      Wrap the JSON in markdown fences like \`\`\`json ... \`\`\`
    `;

        try {
            const rawResponse = await this._queryGroq(testPrompt, true);
            console.log("\n--- Raw LLM Response ---\n", rawResponse);

            const parsed = this._parseJsonSafely(rawResponse);
            console.log("\n--- Parsed JSON ---\n", util.inspect(parsed, { depth: null, colors: true }));

            return parsed;
        } catch (err) {
            console.error("❌ Test failed:", err.message);
            return { error: err.message };
        }
    }
}

// Run the test
const agent = new TestAgent();
agent.run();
