// Assuming BaseAgent.js exists and provides standard agent functionality
import BaseAgent from './BaseAgent.js';
import { DateTime } from 'luxon';

/**
 * The ProfileEnhancerAgent enhances the candidate's profile based on extracted data.
 */
class ProfileEnhancerAgent extends BaseAgent {
    constructor() {
        super(
            "Profile Enhancer",
            `Enhance the candidate's profile based on the extracted information, 
            focusing on generating a concise, impactful professional summary 
            and ensuring all numerical data (like total experience) is calculated and ready for the next phase.`,
            // Note: In JS agents, the model might be defined globally or in the BaseAgent
            // We'll skip the model="llama3.2" line but you can add it if your BaseAgent supports it.
        );
    }

    /**
     * The core function that calculates the total experience and generates the summary.
     * This mirrors the logic of profile_enhancer_agent_function in Python.
     * * @param {Object} extractedInfo - The structured data output from the ExtractorAgent.
     * @returns {Object} The enhanced profile object.
     */
    _enhanceProfile(extractedInfo) {
        // Create a copy of the input object
        const enhancedProfile = { ...extractedInfo };

        // 1. Calculate total experience (sum of 'years' in the 'experience' array)
        // Assume extractedInfo.experience is an array like [{title: "...", years: 5}, ...]
        const totalExperienceYears = extractedInfo.experience
            ? extractedInfo.experience.reduce((sum, item) => sum + (item.years || 0), 0)
            : 0;

        // Ensure skills is an array for joining
        const skillsList = Array.isArray(extractedInfo.skills) ? extractedInfo.skills : [];
        const name = extractedInfo.name || "Candidate";

        // 2. Generate the enhanced summary
        enhancedProfile.summary = `${name} has ${totalExperienceYears} years of professional experience in roles 
            possessing core skills in ${skillsList.join(', ')}.`;

        // Add calculated total experience explicitly
        enhancedProfile.total_experience_years = totalExperienceYears;

        return enhancedProfile;
    }

    /**
     * Executes the profile enhancement process.
     * @param {Array<Object>} messages - The list of messages from the pipeline.
     * @returns {Promise<Object>} The enhanced profile data.
     */
    async run(messages) {
        console.log("🛠️ Profile Enhancer: Enhancing candidate profile");

        let extractedData;
        const inputStr = messages.at(-1)?.content;

        try {
            // Safely parse the JSON input from the previous agent (ExtractorAgent)
            if (!inputStr) {
                throw new Error("Empty input content from previous agent.");
            }
            extractedData = JSON.parse(inputStr);

        } catch (e) {
            console.error(`ERROR: Failed to decode JSON input for ProfileEnhancerAgent: ${e.message}`);
            return this._getFailureResult(`Invalid JSON input: ${e.message}`);
        }

        try {
            const enhancedProfile = this._enhanceProfile(extractedData);

            return {
                enhanced_profile: enhancedProfile,
                enhancement_timestamp: DateTime.now().toISO(),
                status: "success",
            };

        } catch (e) {
            console.error(`ERROR: Profile enhancement failed: ${e.message}`);
            return this._getFailureResult(`Processing error: ${e.message}`);
        }
    }

    /**
     * Helper to return a standardized failure output.
     * @param {string} reason - The reason for failure.
     * @returns {Object}
     */
    _getFailureResult(reason) {
        return {
            enhanced_profile: { error: reason },
            enhancement_timestamp: DateTime.now().toISO(),
            status: "failed",
        };
    }
}

export default ProfileEnhancerAgent;