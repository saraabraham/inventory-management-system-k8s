import BaseAgent from './BaseAgent.js';

class AnalyzerAgent extends BaseAgent {
    constructor() {
        super(
            "Analyzer",
            `Analyze candidate profiles and extract technical skills, experience level, education, key achievements, and domain expertise. 
            Use the provided years_of_experience from the structured data instead of estimating it. 
            Format output strictly as JSON.`
        );
    }

    async run(messages) {
        console.log("🔍 Analyzer: Analyzing candidate profile");

        let extractedData;
        const lastMessage = messages.at(-1)?.content;

        try {
            if (!lastMessage) throw new Error("Empty input content from previous agent.");
            extractedData = JSON.parse(lastMessage);

            if (!extractedData.structured_data) {
                throw new Error("No structured_data found in input.");
            }
        } catch (e) {
            console.error(`[AnalyzerAgent] Invalid input: ${e.message}`);
            return this._getFailureResult(`Invalid input: ${e.message}`);
        }

        // Pull numeric experience from extractor output
        const actualYears = extractedData.structured_data.years_of_experience || 0;

        // Prepare prompt for LLM
        const analysisPrompt = `
Analyze this resume data and return a JSON object with the following structure:

{
    "technical_skills": ["skill1", "skill2", "..."],
    "years_of_experience": ${actualYears},
    "education": { "level": "...", "field": "..." },
    "experience_level": "Junior, Mid-level, or Senior",
    "key_achievements": ["achievement1", "..."],
    "domain_expertise": ["..."]
}

--- RESUME DATA ---
${JSON.stringify(extractedData.structured_data, null, 2)}

Return ONLY the JSON object.
`;

        try {
            const analysisResultsStr = await this._queryGroq(analysisPrompt, true);
            const parsedResults = this._parseJsonSafely(analysisResultsStr);

            if (!parsedResults || parsedResults.error) {
                throw new Error(parsedResults?.error || "LLM returned unparsable data.");
            }

            // Override years_of_experience just to be safe
            parsedResults.years_of_experience = actualYears;

            return {
                skills_analysis: parsedResults,
                analysis_timestamp: new Date().toISOString(),
                confidence_score: 0.95,
            };

        } catch (e) {
            console.error(`[AnalyzerAgent] LLM processing failed: ${e.message}`);
            return this._getFailureResult(`LLM processing error: ${e.message}`);
        }
    }

    _getFailureResult(reason) {
        return {
            skills_analysis: {
                error: reason,
                technical_skills: [],
                years_of_experience: 0,
                education: { level: "Unknown", field: "Unknown" },
                experience_level: "Junior",
                key_achievements: [],
                domain_expertise: [],
            },
            analysis_timestamp: new Date().toISOString(),
            confidence_score: 0.5,
        };
    }
}

export default AnalyzerAgent;