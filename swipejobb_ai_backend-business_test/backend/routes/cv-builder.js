// routes/cv-builder.js
import express from 'express';
import multer from 'multer';
import OrchestratorAgent from '../agents/OrchestratorAgent.js';
import puppeteer from 'puppeteer';

const router = express.Router();
const upload = multer();

router.post('/', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

        console.log("📄 Candidate CV Builder received file:", req.file.originalname);

        const orchestrator = new OrchestratorAgent();

        // Process resume with orchestrator
        const result = await orchestrator.process({ structured_data: req.file.buffer }, 'cv_builder');

        console.log("🧾 CVBuilder output:", result);

        if (!result.enhanced_cv) {
            console.error("❌ No enhanced CV generated");
            return res.status(500).json({ success: false, error: 'CVBuilder failed to generate enhanced CV' });
        }

        // Generate HTML using the formatter
        const html = orchestrator.formatter.generateHTML(result.enhanced_cv, {
            name: result.enhanced_cv.name || 'Candidate Name'
        });

        console.log("📄 HTML snippet for PDF:", html.slice(0, 500)); // first 500 chars

        // Puppeteer launch with sandbox flags
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        let pdfBuffer;
        try {
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '20px', bottom: '20px', left: '15px', right: '15px' }
            });
        } catch (err) {
            console.error("❌ PDF generation failed:", err);
            await browser.close();
            return res.status(500).json({ success: false, error: "Failed to generate PDF" });
        }

        await browser.close();

        // Return the PDF as downloadable file
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="enhanced-resume.pdf"',
            'Content-Length': pdfBuffer.length
        });
        res.send(pdfBuffer);

        console.log("✅ PDF successfully generated and sent");

    } catch (err) {
        console.error("❌ /api/cv-builder error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
