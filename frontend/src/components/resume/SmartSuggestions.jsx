import { useState, useEffect } from 'react';
import { getSuggestionsForRole, getAvailableJobRoles } from '../../utils/resumeSuggestions';
import { useToast } from '../../utils/toast';

const SmartSuggestions = ({ resumeData, setResumeData, onClose }) => {
  const [jobRole, setJobRole] = useState('');
  const [suggestions, setSuggestions] = useState({ skills: [], achievements: [] });
  const [selectedSkills, setSelectedSkills] = useState(new Set());
  const [selectedAchievements, setSelectedAchievements] = useState(new Set());
  const { success } = useToast();

  const availableRoles = getAvailableJobRoles();

  useEffect(() => {
    if (jobRole) {
      const roleSuggestions = getSuggestionsForRole(jobRole);
      setSuggestions(roleSuggestions);
      setSelectedSkills(new Set());
      setSelectedAchievements(new Set());
    }
  }, [jobRole]);

  const toggleSkill = (skill) => {
    const newSelected = new Set(selectedSkills);
    if (newSelected.has(skill)) {
      newSelected.delete(skill);
    } else {
      newSelected.add(skill);
    }
    setSelectedSkills(newSelected);
  };

  const toggleAchievement = (achievement) => {
    const newSelected = new Set(selectedAchievements);
    if (newSelected.has(achievement)) {
      newSelected.delete(achievement);
    } else {
      newSelected.add(achievement);
    }
    setSelectedAchievements(newSelected);
  };

  const addSelectedSkills = () => {
    const newSkills = Array.from(selectedSkills).map(skill => ({
      name: skill,
      level: 'Intermediate'
    }));

    // Filter out duplicates
    const existingSkillNames = new Set(resumeData.skills.map(s => s.name.toLowerCase()));
    const uniqueSkills = newSkills.filter(s => !existingSkillNames.has(s.name.toLowerCase()));

    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, ...uniqueSkills]
    });

    success(`Added ${uniqueSkills.length} skill(s) to your resume!`);
    setSelectedSkills(new Set());
  };

  const addSelectedAchievements = () => {
    // Add achievements to experience descriptions or create a new achievements section
    // For now, we'll add them to the first experience entry or create a note
    if (resumeData.experience.length > 0) {
      const firstExp = resumeData.experience[0];
      const achievementsText = Array.from(selectedAchievements).join('\n• ');
      const updatedDescription = firstExp.description 
        ? `${firstExp.description}\n\nKey Achievements:\n• ${achievementsText}`
        : `Key Achievements:\n• ${achievementsText}`;
      
      const updatedExperience = [...resumeData.experience];
      updatedExperience[0] = { ...firstExp, description: updatedDescription };
      
      setResumeData({
        ...resumeData,
        experience: updatedExperience
      });
    } else {
      // If no experience, add to objective or create first experience entry
      const achievementsText = Array.from(selectedAchievements).join('\n• ');
      const newExperience = {
        company: 'Your Company',
        position: 'Your Position',
        startDate: '',
        endDate: '',
        description: `Key Achievements:\n• ${achievementsText}`
      };
      
      setResumeData({
        ...resumeData,
        experience: [newExperience]
      });
    }

    success(`Added ${selectedAchievements.size} achievement(s) to your resume!`);
    setSelectedAchievements(new Set());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">✨ Smart Suggestions</h2>
              <p className="text-gray-600 text-sm mt-1">
                Get AI-powered suggestions for skills and achievements based on your job role
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Job Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select or Enter Job Role
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                list="job-roles"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g., Software Engineer, Frontend Developer..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <datalist id="job-roles">
                {availableRoles.map((role) => (
                  <option key={role} value={role} />
                ))}
              </datalist>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Available roles: {availableRoles.join(', ')}
            </p>
          </div>

          {jobRole && suggestions.skills.length > 0 && (
            <>
              {/* Skills Suggestions */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-gray-800">
                    Suggested Skills ({suggestions.skills.length})
                  </h3>
                  {selectedSkills.size > 0 && (
                    <button
                      onClick={addSelectedSkills}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Add {selectedSkills.size} Selected
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {suggestions.skills.map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedSkills.has(skill)
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                      {selectedSkills.has(skill) && ' ✓'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Achievements Suggestions */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-gray-800">
                    Suggested Achievements ({suggestions.achievements.length})
                  </h3>
                  {selectedAchievements.size > 0 && (
                    <button
                      onClick={addSelectedAchievements}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                    >
                      Add {selectedAchievements.size} Selected
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {suggestions.achievements.map((achievement, index) => (
                    <button
                      key={index}
                      onClick={() => toggleAchievement(achievement)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${
                        selectedAchievements.has(achievement)
                          ? 'bg-green-100 border-2 border-green-600 text-gray-800'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span>{achievement}</span>
                        {selectedAchievements.has(achievement) && (
                          <span className="text-green-600 font-bold ml-2">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {jobRole && suggestions.skills.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No specific suggestions found for "{jobRole}"</p>
              <p className="text-sm mt-2">Try selecting from the available roles or use generic suggestions</p>
            </div>
          )}

          {!jobRole && (
            <div className="text-center py-8 text-gray-500">
              <p>Enter or select a job role to get smart suggestions</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartSuggestions;

