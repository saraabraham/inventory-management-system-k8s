// tests/testAnalyzer.js
import AnalyzerAgent from '../src/agents/AnalyzerAgent.js';

const runAnalyzerTest = async () => {
    // Mock message array containing the ExtractorAgent output
    const mockMessages = [
        {
            role: "user",
            content: JSON.stringify({
                raw_text: "Resume - John Doe Personal Information John Doe Email: john.doe@example.com Phone: (123) 456-7890 LinkedIn: linkedin.com/in/johndoe Technical Skills Python, SQL, Machine Learning, Statistics, Data Analysis, JavaScript, React, AWS, Kubernetes Professional Experience Experience Level: Mid-level Years of Experience: 5 years Key Achievements: - Developed and deployed predictive analytics models for business optimization. - Led frontend development for a responsive React application. - Automated cloud infrastructure using AWS and Kubernetes. Education Bachelor's in Computer Science Page 1",
                structured_data: {
                    personal_info: {
                        name: "John Doe",
                        email: "john.doe@example.com",
                        phone: "(123) 456-7890"
                    },
                    summary: "Mid-level professional with 5 years of experience in technical fields including predictive analytics, frontend development, and cloud infrastructure automation.",
                    work_experience: [
                        {
                            title: "Mid-level Professional",
                            company: "",
                            duration: "5 years",
                            description: "Key Achievements:\n- Developed and deployed predictive analytics models for business optimization.\n- Led frontend development for a responsive React application.\n- Automated cloud infrastructure using AWS and Kubernetes."
                        }
                    ],
                    education: [
                        {
                            degree: "Bachelor's in Computer Science",
                            institution: "",
                            year: ""
                        }
                    ],
                    technical_skills: [
                        "Python",
                        "SQL",
                        "Machine Learning",
                        "Statistics",
                        "Data Analysis",
                        "JavaScript",
                        "React",
                        "AWS",
                        "Kubernetes"
                    ],
                    certifications: []
                },
                extraction_status: "completed",
                confidence_score: 0.95
            })
        }
    ];

    const analyzer = new AnalyzerAgent();

    try {
        const result = await analyzer.run(mockMessages);
        console.log("\n--- Analyzer Agent Output ---");
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Analyzer test failed:", error.message);
    }
};

runAnalyzerTest();
