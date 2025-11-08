import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../utils/toast';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ResumeTemplate1 from '../components/resume/ResumeTemplate1';
import ResumeTemplate2 from '../components/resume/ResumeTemplate2';
import ResumeForm from '../components/resume/ResumeForm';
import SmartSuggestions from '../components/resume/SmartSuggestions';

const ResumeBuilder = () => {
  const { user, isAuthenticated } = useAuth();
  const { success } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      website: '',
    },
    objective: '',
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
  });

  useEffect(() => {
    // Load saved resume from localStorage
    const savedResume = localStorage.getItem('resumeData');
    if (savedResume) {
      try {
        const parsed = JSON.parse(savedResume);
        setResumeData(parsed);
      } catch (error) {
        console.error('Error loading resume:', error);
      }
    }

    // Load saved template preference
    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate) {
      setSelectedTemplate(parseInt(savedTemplate));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    localStorage.setItem('selectedTemplate', selectedTemplate.toString());
    success('Resume saved successfully!');
  };

  const handleExport = () => {
    const printWindow = window.open('', '_blank');
    const templateContent = document.getElementById('resume-template').innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume - ${resumeData.personalInfo.fullName || 'My Resume'}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
              .no-print { display: none; }
            }
            body { font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          ${templateContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleDownloadPDF = () => {
    handleExport(); // For now, use print to PDF. Can integrate html2pdf library later
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="no-print">
        <Navbar />
      </div>
      <div className="flex">
        <div className="no-print">
          <Sidebar />
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            <div className="no-print flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Resume Builder</h1>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowSuggestions(true)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  ✨ Smart Suggestions
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  💾 Save Resume
                </button>
                <button
                  onClick={handleExport}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  🖨️ Print/Export
                </button>
              </div>
            </div>

            {/* Template Selection */}
            <div className="no-print mb-6 bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Choose Template</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedTemplate(1)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedTemplate === 1
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📄</div>
                    <p className="font-semibold">Template 1</p>
                    <p className="text-sm text-gray-600">Modern Professional</p>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedTemplate(2)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedTemplate === 2
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📋</div>
                    <p className="font-semibold">Template 2</p>
                    <p className="text-sm text-gray-600">Classic Traditional</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Resume Form */}
              <div className="no-print bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Resume</h2>
                <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
              </div>

              {/* Resume Preview */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="no-print text-xl font-bold text-gray-800 mb-4">Preview</h2>
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-white" id="resume-template">
                  {selectedTemplate === 1 ? (
                    <ResumeTemplate1 data={resumeData} />
                  ) : (
                    <ResumeTemplate2 data={resumeData} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Smart Suggestions Modal */}
      {showSuggestions && (
        <SmartSuggestions
          resumeData={resumeData}
          setResumeData={setResumeData}
          onClose={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};

export default ResumeBuilder;

