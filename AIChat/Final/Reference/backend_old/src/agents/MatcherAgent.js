import { JobDatabase } from '../../db/database.js';
import { DateTime } from 'luxon';

class MatcherAgent {
    constructor() {
        this.name = "Matcher";
        this.instructions = `Match candidate profiles with job positions.
            Consider: skills match, experience level, location preferences.
            Return matches in JSON format with title, company, match_score (number), location, and salary_range.`;

        this.db = new JobDatabase();
    }

    async run(messages) {
        console.log("🎯 Matcher: Finding suitable job matches");

        let analysisResults = {};
        const content = messages.at(-1)?.content || "{}";

        try {
            analysisResults = JSON.parse(content);
        } catch {
            // fallback if single quotes are used
            analysisResults = JSON.parse(content.replace(/'/g, '"'));
        }

        const skillsAnalysis = analysisResults.skills_analysis || {};
        const skills = skillsAnalysis.technical_skills || [];
        let experienceLevel = skillsAnalysis.experience_level || "Mid-level";

        const validLevels = new Set(["Junior", "Mid-level", "Senior", "Expert"]);
        if (!validLevels.has(experienceLevel)) experienceLevel = "Mid-level";

        const matchingJobs = await this.searchJobs(skills, experienceLevel);

        const scoredJobs = matchingJobs
            .map(job => {
                let requiredSkills = new Set();
                try {
                    requiredSkills = new Set(Array.isArray(job.requirements) ? job.requirements : JSON.parse(job.requirements));
                } catch {
                    requiredSkills = new Set(job.requirements.split(',').map(s => s.trim()));
                }

                // Find matched skills
                const skillsMatched = skills.filter(skill => requiredSkills.has(skill));

                // Calculate numeric match score
                const matchScore = requiredSkills.size > 0 ? Math.floor((skillsMatched.length / requiredSkills.size) * 100) : 0;

                return {
                    title: `${job.title} @ ${job.company}`,
                    match_score: matchScore,
                    location: job.location || 'N/A',
                    salary_range: job.salary_range || 'N/A',
                    requirements: Array.from(requiredSkills),
                    benefits: job.benefits || [],
                    skills_matched: skillsMatched,  // <-- Add matched skills here
                };
            })
            .filter(job => job.match_score >= 30);

        scoredJobs.sort((a, b) => b.match_score - a.match_score);


        return {
            matched_jobs: scoredJobs.slice(0, 3), // send top 3 matches
            match_timestamp: DateTime.now().toISO(),
            number_of_matches: scoredJobs.length,
        };
    }

    async searchJobs(skills, experienceLevel) {
        return this.db.findJobs(skills, experienceLevel);
    }

    _getFailureResult() {
        return {
            matched_jobs: [],
            match_timestamp: DateTime.now().toISO(),
            number_of_matches: 0,
        };
    }
}

export default MatcherAgent;