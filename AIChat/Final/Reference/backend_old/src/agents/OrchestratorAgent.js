// Import all specialized agents and the base agent
import BaseAgent from './BaseAgent.js';
import ExtractorAgent from './ExtractorAgent.js';
import AnalyzerAgent from './AnalyzerAgent.js';
import MatcherAgent from './MatcherAgent.js';
import ScreenerAgent from './ScreenerAgent.js';
import RecommenderAgent from './RecommenderAgent.js';

class OrchestratorAgent extends BaseAgent {
    constructor() {
        super(
            "Orchestrator",
            `Coordinate the recruitment workflow and delegate tasks to specialized agents.
            Ensure proper flow of information between extraction, analysis, matching, screening, and recommendation phases.
            Maintain context and aggregate results from each stage.`
        );
        this._setupAgents();
    }

    /**
     * Initialize all specialized agents
     */
    _setupAgents() {
        this.extractor = new ExtractorAgent();
        this.analyzer = new AnalyzerAgent();
        this.matcher = new MatcherAgent();
        this.screener = new ScreenerAgent();
        this.recommender = new RecommenderAgent();
    }

    /**
     * Generic run method for direct LLM interaction (if needed).
     * @param {Array<Object>} messages - The list of messages.
     * @returns {Promise<Object>} The parsed JSON response.
     */
    async run(messages) {
        const prompt = messages.at(-1)?.content;
        if (!prompt) {
            return { error: "No prompt provided to Orchestrator LLM." };
        }
        // Assuming this.queryLlm is available and returns a JSON string
        const response = await this.queryLlm(prompt);
        return this.parseJsonSafely(response); // Assuming BaseAgent has this utility
    }

    /**
     * Main workflow orchestrator for processing job applications
     * @param {Object} resumeData - The raw data or file path of the resume.
     * @returns {Promise<Object>} The final aggregated workflow context.
     */
    async processApplication(resumeData) {
        console.log("🎯 Orchestrator: Starting application process");

        let workflowContext = {
            "resume_data": resumeData,
            "status": "initiated",
            "current_stage": "extraction",
        };

        try {
            // --- 1. Extract resume information ---
            console.log(" -> Running ExtractorAgent...");
            const extractedData = await this.extractor.run(
                [{ "role": "user", "content": JSON.stringify(resumeData) }]
            );
            workflowContext.extracted_data = extractedData;
            workflowContext.current_stage = "analysis";

            // --- 2. Analyze candidate profile ---
            console.log(" -> Running AnalyzerAgent...");
            // Pass the EXTRACTOR output JSON string as content for the next agent
            const analysisResults = await this.analyzer.run(
                [{ "role": "user", "content": JSON.stringify(extractedData) }]
            );
            workflowContext.analysis_results = analysisResults;
            workflowContext.current_stage = "matching";

            // --- 3. Match with jobs ---
            console.log(" -> Running MatcherAgent...");
            // Pass the ANALYZER output JSON string
            const jobMatches = await this.matcher.run(
                [{ "role": "user", "content": JSON.stringify(analysisResults) }]
            );
            workflowContext.job_matches = jobMatches;
            workflowContext.current_stage = "screening";

            // --- 4. Screen candidate ---
            console.log(" -> Running ScreenerAgent...");
            // Pass the entire workflow context for a complete view
            const screeningResults = await this.screener.run(
                [{ "role": "user", "content": JSON.stringify(workflowContext) }]
            );
            workflowContext.screening_results = screeningResults;
            workflowContext.current_stage = "recommendation";

            // --- 5. Generate recommendations ---
            console.log(" -> Running RecommenderAgent...");
            // Pass the updated workflow context
            const finalRecommendation = await this.recommender.run(
                [{ "role": "user", "content": JSON.stringify(workflowContext) }]
            );
            workflowContext.final_recommendation = finalRecommendation;
            workflowContext.status = "completed";

            console.log("🎯 Orchestrator: Application process completed successfully.");
            return workflowContext;

        } catch (e) {
            console.error(`Orchestrator failed during stage: ${workflowContext.current_stage}`, e);
            workflowContext.status = "failed";
            workflowContext.error = e.message;

            // Re-throw the error to be handled by the external API caller
            throw new Error(`Pipeline failure during ${workflowContext.current_stage}: ${e.message}`);
        }
    }
}

export default OrchestratorAgent;