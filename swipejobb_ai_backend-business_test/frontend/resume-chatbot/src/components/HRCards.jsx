import React from 'react';
import {
    PersonalInfoCard,
    SummaryCard,
    SkillsCard,
    ExperienceCard,
    JobMatchesCard,
    CollapsibleCard
} from './HRCardComponents';

const HRCards = (data) => {
    const messages = [];

    const personal = data.extracted_data?.structured_data?.personal_info;
    const summary = data.extracted_data?.structured_data?.summary;
    if (personal) messages.push({ type: 'bot', content: <PersonalInfoCard info={personal} />, timestamp: new Date() });
    if (summary) messages.push({ type: 'bot', content: <SummaryCard summary={summary} />, timestamp: new Date() });

    const skillsAnalysis = data.analysis_results?.skills_analysis;
    if (skillsAnalysis) messages.push({ type: 'bot', content: <SkillsCard analysis={skillsAnalysis} />, timestamp: new Date() });

    const workExp = data.extracted_data?.structured_data?.work_experience || [];
    const education = data.extracted_data?.structured_data?.education || [];
    if (workExp.length || education.length) messages.push({ type: 'bot', content: <ExperienceCard workExp={workExp} education={education} />, timestamp: new Date() });

    const jobMatches = data.job_matches?.matched_jobs || [];
    if (jobMatches.length) messages.push({ type: 'bot', content: <JobMatchesCard matches={jobMatches} />, timestamp: new Date() });

    const screening = data.screening_results?.screening_report;
    if (screening) messages.push({ type: 'bot', content: <CollapsibleCard title="Screening Report" text={screening} />, timestamp: new Date() });

    const recommendation = data.final_recommendation?.final_recommendation;
    if (recommendation) messages.push({ type: 'bot', content: <CollapsibleCard title="Final Recommendation" text={recommendation} />, timestamp: new Date() });

    return messages;
};

export default HRCards;
