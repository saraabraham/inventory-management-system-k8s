import MatcherAgent from '../agents/MatcherAgent.js';

async function testMatcher() {
    const matcher = new MatcherAgent();

    // Example analysis output (from AnalyzerAgent)
    const analyzerOutput = {
        skills_analysis: {
            technical_skills: ["Java", "Python", "JavaScript", "SQL"],
            experience_level: "Senior",
        }
    };

    const messages = [
        { role: 'system', content: 'Candidate analysis data.' },
        { role: 'user', content: JSON.stringify(analyzerOutput) }
    ];

    const result = await matcher.run(messages);

    console.log("\n--- Matcher Agent Output ---");
    console.log(JSON.stringify(result, null, 2));
}

testMatcher();
