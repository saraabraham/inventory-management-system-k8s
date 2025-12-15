import BaseAgent from './BaseAgent.js';
import { DateTime } from 'luxon';

class ScreenerAgent extends BaseAgent {
    constructor() {
        super(
            "Screener",
            `Screen candidates based on job matching results.
Focus on:
- Qualification alignment (Experience level, salary range suitability)
- Skill match percentage (Analyzing overlap and seniority of required vs. held skills)
- Red flags or concerns (e.g., low confidence score, mismatched experience level)

Provide a comprehensive, well-structured screening report for the HR team.
Format your response with clear sections using markdown:
- Use ## for main section headers
- Use ### for subsections
- Use bullet points for lists
- Use tables where appropriate for job match comparisons

Do NOT include a score or "Screening Report" title in your response - that will be added separately.`
        );
    }

    async run(messages) {
        console.log("👥 Screener: Conducting initial screening");

        const matcherOutputStr = messages.at(-1)?.content;
        let workflowContext;

        try {
            if (!matcherOutputStr) {
                throw new Error("Empty input content from previous agent.");
            }
            workflowContext = JSON.parse(matcherOutputStr);
        } catch (e) {
            console.error(`ERROR: Failed to decode JSON input for ScreenerAgent: ${e.message}`);
            return this._getFailureResult(`Invalid JSON input: ${e.message}`);
        }

        // Calculate score FIRST to log it
        const screeningScore = this._calculateScreeningScore(workflowContext);
        console.log(`📊 Calculated Screening Score: ${screeningScore}/100`);

        let screeningReport;
        try {
            // Ask LLM to generate nicely formatted HR-friendly report
            screeningReport = await this._queryGroq(`
${this.instructions}

--- MATCHING DATA TO SCREEN ---
${JSON.stringify(workflowContext, null, 2)}

Generate a detailed screening report analyzing this candidate's fit for the matched positions.
`);
        } catch (e) {
            console.error(`ERROR: LLM query failed for ScreenerAgent: ${e.message}`);
            return this._getFailureResult(`LLM query failed: ${e.message}`);
        }

        return {
            screening_report: screeningReport.trim(),
            screening_timestamp: DateTime.now().toISO(),
            screening_score: screeningScore,
            data_source: workflowContext,
        };
    }

    /**
     * Calculate screening score based on the top job match
     * @param {Object} context - The MatcherAgent output
     * @returns {number} Score between 0-100
     */
    _calculateScreeningScore(context) {
        console.log("🔍 Analyzing workflow context for screening score...");

        // The context is the FULL WORKFLOW, so we need to navigate to job_matches
        let matchedJobs = [];

        // Try different possible paths in the workflow context
        if (context.job_matches?.matched_jobs) {
            matchedJobs = context.job_matches.matched_jobs;
            console.log("📍 Found matched_jobs in context.job_matches.matched_jobs");
        } else if (context.matched_jobs) {
            matchedJobs = context.matched_jobs;
            console.log("📍 Found matched_jobs in context.matched_jobs");
        } else if (Array.isArray(context)) {
            matchedJobs = context;
            console.log("📍 Context is already an array of jobs");
        }

        if (!matchedJobs || matchedJobs.length === 0) {
            console.warn("⚠️ No matched jobs found in context");
            console.log("Context keys:", Object.keys(context));
            return 0;
        }

        const topJob = matchedJobs[0];
        console.log("🎯 Top job match:", JSON.stringify(topJob, null, 2));

        // Get the match_score (should be a number from MatcherAgent)
        let score = topJob.match_score;

        console.log(`📌 Raw score value: ${score} (type: ${typeof score})`);

        // Handle different formats
        if (typeof score === 'number') {
            // Already a number, use it directly
            console.log("✅ Score is already a number");
        } else if (typeof score === 'string') {
            // Remove any non-numeric characters except decimal point
            const cleaned = score.replace(/[^\d.]/g, '');
            score = parseFloat(cleaned);
            console.log(`🧹 Cleaned score: "${cleaned}" -> ${score}`);
        } else {
            console.warn("⚠️ Score is neither number nor string, defaulting to 0");
            score = 0;
        }

        // Final validation
        if (isNaN(score) || score === null || score === undefined) {
            console.error(`❌ Could not parse score. Raw value was:`, topJob.match_score);
            score = 0;
        }

        // Clamp between 0-100
        const finalScore = Math.max(0, Math.min(100, Math.round(score)));
        console.log(`✅ Final screening score: ${finalScore}/100`);

        return finalScore;
    }

    /**
     * Helper to return a standardized failure output.
     * @param {string} reason - The reason for failure.
     * @returns {Object}
     */
    _getFailureResult(reason) {
        return {
            screening_report: `**Error:** ${reason}\n\nUnable to complete screening analysis. Please check the input data and try again.`,
            screening_timestamp: DateTime.now().toISO(),
            screening_score: 0,
            data_source: null,
        };
    }
}

export default ScreenerAgent;