import React, { useState } from 'react';

export const ATSScoreCard = ({ score = 85 }) => (
    <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-indigo-600">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">ATS Compatibility Score</h3>
                <p className="text-sm text-gray-600">How well your resume works with applicant tracking systems</p>
            </div>
            <div className="text-4xl font-bold text-indigo-600">{score}%</div>
        </div>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
            <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${score}%` }}
            />
        </div>
    </div>
);

export const ImprovementsCard = ({ improvements }) => (
    <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Improvements Applied
        </h3>
        <p className="text-sm text-gray-600 mb-3">{improvements.summary}</p>
        <ul className="space-y-2">
            {improvements.key_changes?.map((change, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span className="text-gray-700">{change}</span>
                </li>
            ))}
        </ul>
    </div>
);

export const ProfessionalSummaryCard = ({ summary }) => (
    <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">💼 Professional Summary</h3>
        <p className="text-gray-700 leading-relaxed">{summary}</p>
    </div>
);

export const CoreCompetenciesCard = ({ competencies }) => (
    <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🛠 Core Competencies</h3>
        <div className="flex flex-wrap gap-2">
            {competencies?.map((skill, idx) => (
                <span
                    key={idx}
                    className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                >
                    {skill}
                </span>
            ))}
        </div>
    </div>
);

export const EnhancedWorkExperienceCard = ({ experiences }) => (
    <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💼 Enhanced Work Experience</h3>
        <div className="space-y-6">
            {experiences?.map((exp, idx) => (
                <div key={idx} className="border-l-4 border-indigo-600 pl-4 pb-4 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-bold text-gray-800 text-base">{exp.title}</h4>
                            <p className="text-indigo-600 font-medium">{exp.company}</p>
                            {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                        </div>
                        <span className="text-sm text-gray-600 whitespace-nowrap ml-4">{exp.duration}</span>
                    </div>
                    <ul className="space-y-2 mt-3">
                        {exp.achievements?.map((achievement, i) => (
                            <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                                <span className="text-indigo-600 font-bold mt-0.5">•</span>
                                <span>{achievement}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </div>
);

export const EnhancedEducationCard = ({ education }) => (
    <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🎓 Education</h3>
        <div className="space-y-4">
            {education?.map((edu, idx) => (
                <div key={idx} className="pb-4 border-b last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                            <p className="text-gray-600">{edu.institution}</p>
                        </div>
                        <span className="text-sm text-gray-600">{edu.year}</span>
                    </div>
                    {edu.highlights && edu.highlights.length > 0 && (
                        <ul className="mt-2 space-y-1">
                            {edu.highlights.map((h, i) => (
                                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span>•</span>
                                    <span>{h}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    </div>
);

export const DownloadButton = ({ onClick }) => (
    <button
        onClick={onClick}
        className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
    >
        <span>⬇</span>
        Download Enhanced CV
    </button>
);
