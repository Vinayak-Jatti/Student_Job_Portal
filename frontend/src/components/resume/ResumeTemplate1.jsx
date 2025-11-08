const ResumeTemplate1 = ({ data }) => {
  const { personalInfo, objective, education, experience, skills, projects, certifications, languages } = data;

  return (
    <div className="resume-template-1 bg-white text-gray-800" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-2">{personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-4 text-sm">
          {personalInfo.email && <span>📧 {personalInfo.email}</span>}
          {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
          {personalInfo.address && <span>📍 {personalInfo.address}</span>}
        </div>
        <div className="flex flex-wrap gap-4 text-sm mt-2">
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
              LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
              GitHub
            </a>
          )}
          {personalInfo.website && (
            <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
              Portfolio
            </a>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Objective */}
        {objective && (
          <section>
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-3">
              Objective
            </h2>
            <p className="text-gray-700 leading-relaxed">{objective}</p>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-3">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{edu.degree || 'Degree'}</h3>
                      <p className="text-gray-700">{edu.institution || 'Institution'}</p>
                      {edu.description && (
                        <p className="text-gray-600 text-sm mt-1">{edu.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {edu.year && <p className="text-gray-600">{edu.year}</p>}
                      {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
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
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-3">
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{exp.position || 'Position'}</h3>
                      <p className="text-gray-700 font-semibold">{exp.company || 'Company'}</p>
                    </div>
                    <div className="text-right text-gray-600">
                      {exp.startDate && <span>{exp.startDate}</span>}
                      {exp.endDate && <span> - {exp.endDate}</span>}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-sm whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {skill.name} ({skill.level})
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-3">
              Projects
            </h2>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{project.name || 'Project Name'}</h3>
                      {project.technologies && (
                        <p className="text-gray-600 text-sm italic">{project.technologies}</p>
                      )}
                      {project.description && (
                        <p className="text-gray-700 text-sm mt-1">{project.description}</p>
                      )}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View →
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
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-3">
              Certifications
            </h2>
            <div className="space-y-2">
              {certifications.map((cert, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{cert.name || 'Certification'}</span>
                    {cert.issuer && <span className="text-gray-600"> - {cert.issuer}</span>}
                  </div>
                  {cert.date && <span className="text-gray-600 text-sm">{cert.date}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-3">
              Languages
            </h2>
            <div className="flex flex-wrap gap-3">
              {languages.map((lang, index) => (
                <span key={index} className="text-gray-700">
                  {lang.name} <span className="text-gray-500">({lang.proficiency})</span>
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ResumeTemplate1;

