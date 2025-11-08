const ResumeTemplate2 = ({ data }) => {
  const { personalInfo, objective, education, experience, skills, projects, certifications, languages } = data;

  return (
    <div className="resume-template-2 bg-white text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header - Classic Style */}
      <div className="text-center border-b-4 border-gray-800 pb-4 mb-6">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">{personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.address && <span>| {personalInfo.address}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm mt-2">
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline">
              LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline">
              GitHub
            </a>
          )}
          {personalInfo.website && (
            <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline">
              Portfolio
            </a>
          )}
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Objective */}
        {objective && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-2 border-b border-gray-400 pb-1">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">{objective}</p>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-400 pb-1">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div key={index} className="pl-4 border-l-2 border-gray-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base">{edu.degree || 'Degree'}</h3>
                      <p className="text-gray-700 text-sm">{edu.institution || 'Institution'}</p>
                      {edu.description && (
                        <p className="text-gray-600 text-xs mt-1 italic">{edu.description}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      {edu.year && <p>{edu.year}</p>}
                      {edu.gpa && <p className="text-xs">GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-400 pb-1">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index} className="pl-4 border-l-2 border-gray-300">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-base">{exp.position || 'Position'}</h3>
                      <p className="text-gray-700 text-sm font-semibold">{exp.company || 'Company'}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      {exp.startDate && <span>{exp.startDate}</span>}
                      {exp.endDate && <span> - {exp.endDate}</span>}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-xs mt-1 whitespace-pre-line leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-400 pb-1">
              Technical Skills
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {skills.map((skill, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">{skill.name}</span>
                  <span className="text-gray-500 italic">({skill.level})</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-400 pb-1">
              Projects
            </h2>
            <div className="space-y-3">
              {projects.map((project, index) => (
                <div key={index} className="pl-4 border-l-2 border-gray-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base">{project.name || 'Project Name'}</h3>
                      {project.technologies && (
                        <p className="text-gray-600 text-xs italic">{project.technologies}</p>
                      )}
                      {project.description && (
                        <p className="text-gray-700 text-xs mt-1">{project.description}</p>
                      )}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:underline text-xs"
                      >
                        Link →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-400 pb-1">
              Certifications
            </h2>
            <div className="space-y-1">
              {certifications.map((cert, index) => (
                <div key={index} className="flex justify-between text-sm pl-4">
                  <div>
                    <span className="font-semibold text-gray-900">{cert.name || 'Certification'}</span>
                    {cert.issuer && <span className="text-gray-600"> - {cert.issuer}</span>}
                  </div>
                  {cert.date && <span className="text-gray-500 text-xs">{cert.date}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-400 pb-1">
              Languages
            </h2>
            <div className="flex flex-wrap gap-4 text-sm pl-4">
              {languages.map((lang, index) => (
                <span key={index} className="text-gray-700">
                  {lang.name} <span className="text-gray-500 italic">({lang.proficiency})</span>
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ResumeTemplate2;

