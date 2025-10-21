import React, { useState } from 'react';

// Candidate Info
export const PersonalInfoCard = ({ info }) => (
    <div className="p-4 bg-white rounded shadow mb-2">
        <strong>👤 Candidate Info</strong>
        <p>Name: {info.name}</p>
        <p>Email: {info.email}</p>
        <p>Phone: {info.phone}</p>
    </div>
);

// Summary
export const SummaryCard = ({ summary }) => (
    <div className="p-4 bg-white rounded shadow mb-2">
        <strong>💼 Summary</strong>
        <p>{summary}</p>
    </div>
);

// Skills
export const SkillsCard = ({ analysis }) => (
    <div className="p-4 bg-white rounded shadow mb-2">
        <strong>🛠 Skills & Experience</strong>
        <p>Level: {analysis.experience_level}</p>
        <p>Years of Experience: {analysis.years_of_experience}</p>
        <div className="flex flex-wrap mt-1">
            {analysis.technical_skills.map(skill => (
                <span key={skill} className="mr-2 mb-1 px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">{skill}</span>
            ))}
        </div>
    </div>
);

// Work & Education
export const ExperienceCard = ({ workExp, education }) => (
    <div className="p-4 bg-white rounded shadow mb-2">
        <strong>📂 Work Experience</strong>
        {workExp.map((w, idx) => <p key={idx}>- {w.title} at {w.company} ({w.duration})</p>)}
        <strong className="mt-2 block">🎓 Education</strong>
        {education.map((e, idx) => <p key={idx}>- {e.degree} at {e.institution} ({e.year})</p>)}
    </div>
);

// Job Matches
export const JobMatchesCard = ({ matches }) => (
    <div className="p-4 bg-white rounded shadow mb-2">
        <strong>🎯 Job Matches</strong>
        {matches.map((j, idx) => (
            <div key={idx} className="border p-2 rounded mb-2 bg-gray-50">
                <p><strong>{j.title}</strong> [Score: {j.match_score}]</p>
                <p>Location: {j.location}</p>
                <p>Salary: {j.salary_range}</p>
                <div className="flex flex-wrap mt-1">
                    {j.skills_matched.map(skill => (
                        <span key={skill} className="mr-2 mb-1 px-2 py-1 bg-green-200 text-green-800 rounded-full text-sm">{skill}</span>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

// Collapsible Card
export const CollapsibleCard = ({ title, text }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="p-4 bg-white rounded shadow mb-2">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setOpen(!open)}>
                <strong>{title}</strong>
                <span>{open ? '▲' : '▼'}</span>
            </div>
            {open && <pre className="mt-2 text-sm whitespace-pre-wrap">{text}</pre>}
        </div>
    );
};
