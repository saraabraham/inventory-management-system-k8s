// tests/testScreener.js
import ScreenerAgent from '../src/agents/ScreenerAgent.js';

async function testScreener() {
    const screener = new ScreenerAgent();

    // Use the matcher output you provided
    const matcherOutput = {
        matched_jobs: [
            {
                title: "Senior Cloud Architect at Innovatech Solutions",
                match_score: "66%",
                location: "Remote",
                salary_range: "$150k-$180k",
                requirements: [
                    "Java",
                    "Python",
                    "JavaScript",
                    "SQL",
                    "AWS",
                    "Kubernetes"
                ],
                benefits: [
                    "Health Insurance",
                    "401k",
                    "Remote Work"
                ]
            },
            {
                title: "Principal Machine Learning Engineer at Global Data Corp",
                match_score: "50%",
                location: "San Francisco, CA",
                salary_range: "$160k-$200k",
                requirements: [
                    "Python",
                    "Java",
                    "SQL",
                    "TensorFlow",
                    "PyTorch",
                    "C++"
                ],
                benefits: [
                    "Stock Options",
                    "Health Insurance",
                    "Gym Membership"
                ]
            }
        ],
        match_timestamp: "2025-10-07T11:27:52.350+02:00",
        number_of_matches: 2
    };

    // Simulate messages pipeline with the matcher output as the last message
    const messages = [
        { role: 'system', content: 'Candidate analysis pipeline' },
        { role: 'matcher', content: JSON.stringify(matcherOutput) }
    ];

    const result = await screener.run(messages);
    console.log("=== Screener Output ===");
    console.log(JSON.stringify(result, null, 2));
}

testScreener();
