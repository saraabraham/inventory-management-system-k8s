// tests/testRecommender.js
import RecommenderAgent from '../agents/RecommenderAgent.js';

async function testRecommender() {
    const recommender = new RecommenderAgent();

    // Using the ScreenerAgent output as input
    const screenerOutput = {
        "screening_report": "**Candidate Screening Report**\n================================\n\nBased on the provided job matching results, we have identified two potential job matches for the candidate...",
        "screening_timestamp": "2025-10-07T11:37:18.453+02:00",
        "screening_score": 66,
        "data_source": {
            "matched_jobs": [
                {
                    "title": "Senior Cloud Architect at Innovatech Solutions",
                    "match_score": "66%",
                    "location": "Remote",
                    "salary_range": "$150k-$180k",
                    "requirements": [
                        "Java",
                        "Python",
                        "JavaScript",
                        "SQL",
                        "AWS",
                        "Kubernetes"
                    ],
                    "benefits": [
                        "Health Insurance",
                        "401k",
                        "Remote Work"
                    ]
                },
                {
                    "title": "Principal Machine Learning Engineer at Global Data Corp",
                    "match_score": "50%",
                    "location": "San Francisco, CA",
                    "salary_range": "$160k-$200k",
                    "requirements": [
                        "Python",
                        "Java",
                        "SQL",
                        "TensorFlow",
                        "PyTorch",
                        "C++"
                    ],
                    "benefits": [
                        "Stock Options",
                        "Health Insurance",
                        "Gym Membership"
                    ]
                }
            ],
            "match_timestamp": "2025-10-07T11:27:52.350+02:00",
            "number_of_matches": 2
        }
    };

    // Wrap in a message array as expected by RecommenderAgent
    const messages = [{ role: 'system', content: JSON.stringify(screenerOutput) }];

    const result = await recommender.run(messages);

    console.log("=== Recommender Output ===");
    console.log(JSON.stringify(result, null, 2));
}

testRecommender();
