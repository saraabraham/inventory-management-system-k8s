import React from 'react';
import {
    ATSScoreCard,
    ImprovementsCard,
    ProfessionalSummaryCard,
    CoreCompetenciesCard,
    EnhancedWorkExperienceCard,
    EnhancedEducationCard,
    CertificationsCard,
    DownloadButton
} from './CandidateCardComponents';

const CandidateCards = (data, handleDownloadCV) => {
    const messages = [];
    const cvData = data.cv_build?.enhanced_cv;

    if (!cvData) return messages;

    if (cvData.improvements_made?.ats_score_estimate) messages.push({ type: 'bot', content: <ATSScoreCard score={cvData.improvements_made.ats_score_estimate} />, timestamp: new Date() });
    if (cvData.improvements_made) messages.push({ type: 'bot', content: <ImprovementsCard improvements={cvData.improvements_made} />, timestamp: new Date() });
    if (cvData.professional_summary) messages.push({ type: 'bot', content: <ProfessionalSummaryCard summary={cvData.professional_summary} />, timestamp: new Date() });
    if (cvData.core_competencies?.length > 0) messages.push({ type: 'bot', content: <CoreCompetenciesCard competencies={cvData.core_competencies} />, timestamp: new Date() });
    if (cvData.work_experience?.length > 0) messages.push({ type: 'bot', content: <EnhancedWorkExperienceCard experiences={cvData.work_experience} />, timestamp: new Date() });
    if (cvData.education?.length > 0) messages.push({ type: 'bot', content: <EnhancedEducationCard education={cvData.education} />, timestamp: new Date() });
    if (cvData.certifications?.length > 0) messages.push({ type: 'bot', content: <CertificationsCard certifications={cvData.certifications} />, timestamp: new Date() });

    messages.push({ type: 'bot', content: <DownloadButton onClick={() => handleDownloadCV(cvData)} />, timestamp: new Date() });

    return messages;
};

export default CandidateCards;
