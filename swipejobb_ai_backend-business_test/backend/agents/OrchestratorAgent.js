// agents/OrchestratorAgent.js

import BaseAgent from './BaseAgent.js';
import ExtractorAgent from './ExtractorAgent.js';
import AnalyzerAgent from './AnalyzerAgent.js';
import MatcherAgent from './MatcherAgent.js';
import ScreenerAgent from './ScreenerAgent.js';
import RecommenderAgent from './RecommenderAgent.js';
import CVBuilderAgent from './CVBuilderAgent.js';

class OrchestratorAgent extends BaseAgent {
    constructor() {
        super(
            "Orchestrator",
            `Coordinate the recruitment and career assistance workflows.
            Dynamically decide which agents to call depending on the mode (application, CV building, interview practice, etc.).`
        );
        this._setupAgents();
    }

    _setupAgents() {
        this.extractor = new ExtractorAgent();
        this.analyzer = new AnalyzerAgent();
        this.matcher = new MatcherAgent();
        this.screener = new ScreenerAgent();
        this.recommender = new RecommenderAgent();
        this.cvBuilder = new CVBuilderAgent();
    }

    /**
     * Unified orchestration entry point
     * @param {Object} resumeData - File buffer or path or raw text
     * @param {string} mode - 'application' | 'cv_builder'
     */
    async process(resumeData, mode = "application") {
        console.log(`🎯 Orchestrator: Starting process in mode: ${mode}`);

        let context = {
            status: "initiated",
            mode,
            resume_data: resumeData,
            current_stage: "extraction"
        };

        try {
            // 1️⃣ Extract resume info
            console.log(" -> Running ExtractorAgent...");
            const extractedData = await this.extractor.run([
                { role: "user", content: JSON.stringify(resumeData) }
            ]);
            context.extracted_data = extractedData;

            // === CV BUILDER MODE ===
            if (mode === "cv_builder") {
                console.log(" -> Running CVBuilderAgent...");
                const cvResult = await this.cvBuilder.run([
                    { role: "user", content: JSON.stringify(extractedData) }
                ]);
                context.cv_build = cvResult;
                context.status = "completed";
                console.log("✅ CV Builder pipeline completed.");
                return context;
            }

            // === APPLICATION MODE ===
            console.log(" -> Running AnalyzerAgent...");
            const analysisResults = await this.analyzer.run([
                { role: "user", content: JSON.stringify(extractedData) }
            ]);
            context.analysis_results = analysisResults;

            console.log(" -> Running MatcherAgent...");
            const jobMatches = await this.matcher.run([
                { role: "user", content: JSON.stringify(analysisResults) }
            ]);
            context.job_matches = jobMatches;

            console.log(" -> Running ScreenerAgent...");
            const screeningResults = await this.screener.run([
                { role: "user", content: JSON.stringify(context) }
            ]);
            context.screening_results = screeningResults;

            console.log(" -> Running RecommenderAgent...");
            const finalRecommendation = await this.recommender.run([
                { role: "user", content: JSON.stringify(context) }
            ]);
            context.final_recommendation = finalRecommendation;
            context.status = "completed";

            console.log("🎯 Orchestrator: Application process completed successfully.");
            return context;
        } catch (err) {
            console.error(`❌ Orchestrator failed during stage: ${context.current_stage}`, err);
            context.status = "failed";
            context.error = err.message;
            throw new Error(`Pipeline failure in ${context.current_stage}: ${err.message}`);
        }
    }
}

export default OrchestratorAgent;
