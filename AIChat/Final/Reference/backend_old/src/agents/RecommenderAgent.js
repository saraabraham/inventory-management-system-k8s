import BaseAgent from './BaseAgent.js';
import { DateTime } from 'luxon';

/**
 * The RecommenderAgent generates final recommendations based on the entire pipeline's results.
 */
class RecommenderAgent extends BaseAgent {
    constructor() {
        super(
            "Recommender",
            `Generate final recommendations for the candidate and internal HR based on the complete recruitment workflow context provided below.
            The context includes the extracted profile, skills analysis, top job matches, and the screening report.
            Your final recommendation must:
            1. Suggest the top 1-2 jobs for interview priority.
            2. Provide clear next steps for the candidate (e.g., skill gap closing).
            3. Highlight the candidate's strongest selling points.
            4. Provide a final summary status (e.g., 'Proceed to Interview', 'Hold', 'Reject').`
        );
    }

    /**
     * Generates final recommendations by prompting the LLM with the full workflow context.
     * @param {Array<Object>} messages - The list of messages containing the full workflow context.
     * @returns {Promise<Object>} The final recommendation results.
     */
    async run(messages) {
        console.log("💡 Recommender: Generating final recommendations");

        let workflowContext;
        const contextStr = messages.at(-1)?.content;

        try {
            // 1. FIX: Use JSON.parse() for SAFE deserialization (Replaces Python's unsafe eval())
            if (!contextStr) {
                throw new Error("Empty input content from previous agent.");
            }
            workflowContext = JSON.parse(contextStr);

        } catch (e) {
            console.error(`ERROR: Failed to decode JSON input for RecommenderAgent: ${e.message}`);
            return this._getFailureResult(`Invalid JSON input from previous agent: ${e.message}`);
        }

        // 2. Construct the detailed prompt for the LLM
        const prompt = `
        ${this.instructions}

        --- FULL WORKFLOW CONTEXT ---
        ${JSON.stringify(workflowContext, null, 2)}

        Generate the final recommendation report based on this data.
        `;

        try {
            // 3. Query the LLM (Ollama) with the full context
            // Assumes this.queryLlm is an async method in BaseAgent that returns a text report
            const recommendation = await this._queryGroq(prompt);

            // 4. Return the results
            return {
                final_recommendation: recommendation,
                recommendation_timestamp: DateTime.now().toISO(),
                confidence_level: "high", // Confidence is high if LLM call succeeds
            };

        } catch (e) {
            console.error(`ERROR: LLM query failed for RecommenderAgent: ${e.message}`);
            return this._getFailureResult(`LLM query failed: ${e.message}`);
        }
    }

    /**
     * Helper to return a standardized failure output.
     * @param {string} reason - The reason for failure.
     * @returns {Object}
     */
    _getFailureResult(reason) {
        return {
            final_recommendation: `RECOMMENDATION FAILED: ${reason}`,
            recommendation_timestamp: DateTime.now().toISO(),
            confidence_level: "low",
        };
    }
}

export default RecommenderAgent;