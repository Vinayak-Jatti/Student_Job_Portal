import { useState } from 'react';

const ResumeForm = ({ resumeData, setResumeData }) => {
  const [activeSection, setActiveSection] = useState('personal');

  const updatePersonalInfo = (field, value) => {
    setResumeData({
      ...resumeData,
      personalInfo: { ...resumeData.personalInfo, [field]: value },
    });
  };

  const addItem = (section) => {
    const newItem = getDefaultItem(section);
    setResumeData({
      ...resumeData,
      [section]: [...resumeData[section], newItem],
    });
  };

  const updateItem = (section, index, field, value) => {
    const updated = [...resumeData[section]];
    updated[index] = { ...updated[index], [field]: value };
    setResumeData({ ...resumeData, [section]: updated });
  };

  const removeItem = (section, index) => {
    setResumeData({
      ...resumeData,
      [section]: resumeData[section].filter((_, i) => i !== index),
    });
  };

  const getDefaultItem = (section) => {
    const defaults = {
      education: { degree: '', institution: '', year: '', gpa: '', description: '' },
      experience: { company: '', position: '', startDate: '', endDate: '', description: '' },
      projects: { name: '', technologies: '', description: '', link: '' },
      certifications: { name: '', issuer: '', date: '', link: '' },
      skills: { name: '', level: 'Intermediate' },
      languages: { name: '', proficiency: 'Intermediate' },
    };
    return defaults[section] || {};
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'objective', label: 'Objective', icon: '🎯' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'skills', label: 'Skills', icon: '🛠️' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'certifications', label: 'Certifications', icon: '🏆' },
    { id: 'languages', label: 'Languages', icon: '🌐' },
  ];

  return (
    <div className="space-y-4">
      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === section.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {section.icon} {section.label}
          </button>
        ))}
      </div>

      {/* Personal Info */}
      {activeSection === 'personal' && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name *"
            value={resumeData.personalInfo.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="email"
            placeholder="Email *"
            value={resumeData.personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={resumeData.personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Address"
            value={resumeData.personalInfo.address}
            onChange={(e) => updatePersonalInfo('address', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="LinkedIn URL"
            value={resumeData.personalInfo.linkedin}
            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="GitHub URL"
            value={resumeData.personalInfo.github}
            onChange={(e) => updatePersonalInfo('github', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Website/Portfolio"
            value={resumeData.personalInfo.website}
            onChange={(e) => updatePersonalInfo('website', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      )}

      {/* Objective */}
      {activeSection === 'objective' && (
        <textarea
          placeholder="Write your career objective or summary..."
          value={resumeData.objective}
          onChange={(e) => setResumeData({ ...resumeData, objective: e.target.value })}
          rows="6"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      )}

      {/* Education */}
      {activeSection === 'education' && (
        <div className="space-y-4">
          {resumeData.education.map((edu, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Education #{index + 1}</h4>
                <button
                  onClick={() => removeItem('education', index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                placeholder="Degree (e.g., B.Tech Computer Science)"
                value={edu.degree}
                onChange={(e) => updateItem('education', index, 'degree', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => updateItem('education', index, 'institution', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Year (e.g., 2020-2024)"
                  value={edu.year}
                  onChange={(e) => updateItem('education', index, 'year', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="GPA/CGPA"
                  value={edu.gpa}
                  onChange={(e) => updateItem('education', index, 'gpa', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <textarea
                placeholder="Additional details (optional)"
                value={edu.description}
                onChange={(e) => updateItem('education', index, 'description', e.target.value)}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}
          <button
            onClick={() => addItem('education')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Education
          </button>
        </div>
      )}

      {/* Experience */}
      {activeSection === 'experience' && (
        <div className="space-y-4">
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Experience #{index + 1}</h4>
                <button
                  onClick={() => removeItem('experience', index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                placeholder="Position/Job Title"
                value={exp.position}
                onChange={(e) => updateItem('experience', index, 'position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Company Name"
                value={exp.company}
                onChange={(e) => updateItem('experience', index, 'company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Start Date (e.g., Jan 2022)"
                  value={exp.startDate}
                  onChange={(e) => updateItem('experience', index, 'startDate', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="End Date (e.g., Present)"
                  value={exp.endDate}
                  onChange={(e) => updateItem('experience', index, 'endDate', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <textarea
                placeholder="Job description and achievements..."
                value={exp.description}
                onChange={(e) => updateItem('experience', index, 'description', e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}
          <button
            onClick={() => addItem('experience')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Experience
          </button>
        </div>
      )}

      {/* Skills */}
      {activeSection === 'skills' && (
        <div className="space-y-4">
          {resumeData.skills.map((skill, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Skill name"
                value={skill.name}
                onChange={(e) => updateItem('skills', index, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <select
                value={skill.level}
                onChange={(e) => updateItem('skills', index, 'level', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button
                onClick={() => removeItem('skills', index)}
                className="px-3 py-2 text-red-600 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => addItem('skills')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Skill
          </button>
        </div>
      )}

      {/* Projects */}
      {activeSection === 'projects' && (
        <div className="space-y-4">
          {resumeData.projects.map((project, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Project #{index + 1}</h4>
                <button
                  onClick={() => removeItem('projects', index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                placeholder="Project Name"
                value={project.name}
                onChange={(e) => updateItem('projects', index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Technologies Used"
                value={project.technologies}
                onChange={(e) => updateItem('projects', index, 'technologies', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <textarea
                placeholder="Project description..."
                value={project.description}
                onChange={(e) => updateItem('projects', index, 'description', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Project Link (optional)"
                value={project.link}
                onChange={(e) => updateItem('projects', index, 'link', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}
          <button
            onClick={() => addItem('projects')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Project
          </button>
        </div>
      )}

      {/* Certifications */}
      {activeSection === 'certifications' && (
        <div className="space-y-4">
          {resumeData.certifications.map((cert, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Certification #{index + 1}</h4>
                <button
                  onClick={() => removeItem('certifications', index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                placeholder="Certification Name"
                value={cert.name}
                onChange={(e) => updateItem('certifications', index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Issuing Organization"
                value={cert.issuer}
                onChange={(e) => updateItem('certifications', index, 'issuer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Date"
                  value={cert.date}
                  onChange={(e) => updateItem('certifications', index, 'date', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Credential Link (optional)"
                  value={cert.link}
                  onChange={(e) => updateItem('certifications', index, 'link', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => addItem('certifications')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Certification
          </button>
        </div>
      )}

      {/* Languages */}
      {activeSection === 'languages' && (
        <div className="space-y-4">
          {resumeData.languages.map((lang, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Language"
                value={lang.name}
                onChange={(e) => updateItem('languages', index, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <select
                value={lang.proficiency}
                onChange={(e) => updateItem('languages', index, 'proficiency', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Native">Native</option>
              </select>
              <button
                onClick={() => removeItem('languages', index)}
                className="px-3 py-2 text-red-600 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => addItem('languages')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Language
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeForm;

