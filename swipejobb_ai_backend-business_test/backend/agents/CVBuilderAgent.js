// agents/CVBuilderAgent.js
import BaseAgent from './BaseAgent.js';

class CVBuilderAgent extends BaseAgent {
  constructor() {
    super(
      "CVBuilder",
      `You are an expert resume consultant specializing in modern, ATS-optimized resumes.
Your goal: Transform raw resume data into a polished, professional format that highlights achievements and passes ATS systems.`,
      "meta-llama/llama-4-scout-17b-16e-instruct"
    );
  }

  async run(messages) {
    console.log("🧾 CVBuilder: Enhancing resume...");

    let inputData = {};
    try {
      inputData = JSON.parse(messages.at(-1)?.content || '{}');
    } catch {
      return { error: "Invalid JSON input" };
    }

    if (!inputData.structured_data) {
      return { error: "Missing structured resume data", raw_input: inputData };
    }

    const prompt = `Transform the following resume data into a modern, ATS-friendly format.
Use STAR internally for achievements but do NOT include S/T/A/R labels in the output.

INPUT RESUME DATA:
${JSON.stringify(inputData.structured_data, null, 2)}

OUTPUT EXACT JSON:
{
  "professional_summary": "...",
  "core_competencies": ["skill1", "skill2"],
  "work_experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Jan 2020 - Present",
      "location": "City, Country",
      "achievements": ["Achievement with metrics"]
    }
  ],
  "education": [{"degree":"Degree Name","institution":"School Name","year":"2020","highlights":["Honor/Award"]}],
  "certifications": ["cert1", "cert2"]
}`;

    const response = await this._queryGroq(prompt, true);
    const parsed = this._parseJsonSafely(response);

    if (!parsed.professional_summary || !parsed.work_experience) {
      console.error("Invalid CV builder response structure");
      return {
        error: "Failed to generate valid CV structure",
        raw_response: response,
        fallback: this._generateFallbackCV(inputData.structured_data)
      };
    }

    return {
      success: true,
      enhanced_cv: parsed,
      original_data: inputData.structured_data,
      confidence_score: this._calculateConfidenceScore(parsed)
    };
  }

  _generateFallbackCV(originalData) {
    return {
      professional_summary: originalData.summary || "Experienced professional",
      core_competencies: originalData.skills || [],
      work_experience: (originalData.work_experience || []).map(exp => ({
        ...exp,
        achievements: [`Worked as ${exp.title} at ${exp.company}`]
      })),
      education: originalData.education || [],
      certifications: originalData.certifications || []
    };
  }

  _calculateConfidenceScore(cvData) {
    let score = 70;
    if (cvData.work_experience?.length > 0) score += 10;
    if (cvData.professional_summary?.length > 50) score += 10;
    if (cvData.core_competencies?.length >= 5) score += 10;
    return Math.min(score, 100);
  }
}

export default CVBuilderAgent;
