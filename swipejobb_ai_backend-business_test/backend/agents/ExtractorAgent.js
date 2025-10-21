import BaseAgent from './BaseAgent.js';
import fs from 'fs';
import PDFParser from 'pdf2json';

class ExtractorAgent extends BaseAgent {
    constructor() {
        super(
            "Extractor",
            `You are a highly detail-oriented Data Extractor. Your task is to extract all significant data from the provided resume text, which may be in any language. You must **TRANSLATE ALL TEXTUAL CONTENT** into **ENGLISH** and transform it into a single, comprehensive JSON object. Strictly adhere to the requested JSON structure and provide ONLY the JSON object.`,
            "meta-llama/llama-4-scout-17b-16e-instruct"
        );
    }

    // --- PDF text extraction ---
    async _extractTextFromPdf(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at path: ${filePath}`);
        }

        return new Promise((resolve, reject) => {
            const pdfParser = new PDFParser(this, 1);

            pdfParser.on("pdfParser_dataReady", pdfData => {
                let fullText = "";
                pdfData.Pages.forEach(page => {
                    page.Texts.forEach(text => {
                        fullText += decodeURIComponent(text.R[0].T) + ' ';
                    });
                });
                resolve(fullText.replace(/(\s\s+|\n)/g, ' ').trim());
            });

            pdfParser.on("pdfParser_dataError", errData => {
                reject(new Error(`PDF parsing error: ${errData.data}`));
            });

            pdfParser.loadPDF(filePath);
        });
    }

    // --- Helper: compute years from work_experience ---
    _computeYearsOfExperience(workExps) {
        if (!workExps || workExps.length === 0) return 0;
        let totalMonths = 0;
        workExps.forEach(job => {
            if (!job.duration) return;
            const match = job.duration.match(/(\d{4})/g);
            if (match && match.length >= 2) {
                const startYear = parseInt(match[0]);
                const endYear = parseInt(match[1]);
                if (!isNaN(startYear) && !isNaN(endYear)) {
                    totalMonths += (endYear - startYear) * 12;
                }
            }
        });
        return Math.round(totalMonths / 12);
    }

    // --- Helper: fallback extraction from text ---
    _extractYearsFromText(rawText) {
        const match = rawText.match(/Years of Experience:\s*(\d+)/i);
        return match ? parseInt(match[1]) : 0;
    }

    // --- Main agent execution ---
    async run(messages) {
        console.log("📄 Extractor: Processing resume");

        let inputData;
        try {
            inputData = JSON.parse(messages.at(-1)?.content || '{}');
        } catch (e) {
            console.error("❌ Input message content is not valid JSON.");
            return { error: "Invalid input format to ExtractorAgent" };
        }

        let rawText = "";

        if (inputData.text) {
            rawText = inputData.text;
            console.log("✅ Using text directly from input message.");
        } else if (inputData.file_path) {
            try {
                console.log(`⏳ Extracting text from PDF path: ${inputData.file_path}`);
                rawText = await this._extractTextFromPdf(inputData.file_path);
                console.log("✅ PDF extraction complete.");
            } catch (e) {
                console.error(`❌ PDF Extraction failed: ${e.message}`);
                return { error: `PDF Extraction failed: ${e.message}` };
            }
        } else if (inputData.file_buffer) {
            const tmpFilePath = `./tmp_${Date.now()}.pdf`;
            fs.writeFileSync(tmpFilePath, Buffer.from(inputData.file_buffer.data));
            try {
                console.log("⏳ Extracting text from PDF buffer...");
                rawText = await this._extractTextFromPdf(tmpFilePath);
                console.log("✅ PDF extraction complete.");
            } catch (e) {
                console.error(`❌ PDF Extraction failed: ${e.message}`);
                return { error: `PDF Extraction failed: ${e.message}` };
            } finally {
                fs.unlinkSync(tmpFilePath);
            }
        } else {
            rawText = "No valid resume text or file path provided.";
            console.error("❌ No text or file path provided.");
        }

        // --- Groq prompt for JSON extraction ---
        const extractionPrompt = `
Transform the following raw resume text into a single JSON object.

Your JSON object must contain these keys:
{
    "personal_info": { "name": "...", "email": "...", "phone": "..." },
    "summary": "...",
    "work_experience": [
        { "title": "...", "company": "...", "duration": "...", "description": "..." }
    ],
    "education": [
        { "degree": "...", "institution": "...", "year": "..." }
    ],
    "technical_skills": ["skill1", "skill2"],
    "certifications": ["cert1", "cert2"]
}

Raw Resume Text:
---
${rawText}
---

Return ONLY the JSON object.
`;

        let extractedInfo;
        try {
            const extractedInfoRaw = await this._queryGroq(extractionPrompt, true);
            extractedInfo = this._parseJsonSafely(extractedInfoRaw);
        } catch (apiError) {
            console.error(`❌ Extractor Agent failed due to Groq API error: ${apiError.message}`);
            extractedInfo = { error: `API Failure: ${apiError.message}` };
        }

        // --- Compute years_of_experience ---
        if (extractedInfo && !extractedInfo.error) {
            const yearsFromWork = this._computeYearsOfExperience(extractedInfo.work_experience);
            const yearsFromText = this._extractYearsFromText(rawText);
            extractedInfo.years_of_experience = yearsFromWork || yearsFromText || 0;
            console.log(`✅ Computed Years of Experience: ${extractedInfo.years_of_experience}`);
        }

        if ("error" in extractedInfo) {
            return {
                raw_text: rawText,
                structured_data: extractedInfo,
                extraction_status: "failed",
                confidence_score: 0.2
            };
        }

        return {
            raw_text: rawText,
            structured_data: extractedInfo,
            extraction_status: "completed",
            confidence_score: 0.95
        };
    }
}

export default ExtractorAgent;