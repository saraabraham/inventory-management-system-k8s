// agents/TraditionalResumeFormatter.js
class TraditionalResumeFormatter {
    static generateHTML(cvData, contactInfo = {}) {
        const { name = "Candidate", location = "", email = "", phone = "", linkedin = "" } = contactInfo;

        return `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <title>${name} - Resume</title>
  <style>
  body { font-family: 'Calibri', sans-serif; padding: 30px; }
  h1 { font-size: 26px; }
  h2 { font-size: 14px; margin-top: 20px; border-bottom: 1px solid #000; padding-bottom: 5px; }
  p, li { font-size: 12px; line-height: 1.5; }
  ul { padding-left: 20px; }
  </style>
  </head>
  <body>
  <h1>${name}</h1>
  <p>${[location, email, phone, linkedin].filter(Boolean).join(' • ')}</p>
  <h2>Professional Summary</h2>
  <p>${cvData.professional_summary}</p>
  <h2>Core Competencies</h2>
  <p>${cvData.core_competencies.join(' • ')}</p>
  <h2>Work Experience</h2>
  ${cvData.work_experience.map(exp => `
  <h3>${exp.title} | ${exp.company}</h3>
  <p>${exp.duration}${exp.location ? ` | ${exp.location}` : ''}</p>
  <ul>${exp.achievements.map(a => `<li>${a}</li>`).join('')}</ul>
  `).join('')}
  <h2>Education</h2>
  ${cvData.education.map(edu => `
  <h3>${edu.degree}</h3>
  <p>${edu.institution} | ${edu.year}</p>
  <ul>${edu.highlights?.map(h => `<li>${h}</li>`).join('')}</ul>
  `).join('')}
  <h2>Certifications</h2>
  <p>${cvData.certifications.join(' • ')}</p>
  </body>
  </html>`;
    }
}

export default TraditionalResumeFormatter;
