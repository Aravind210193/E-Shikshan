import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, 
  Code, Languages, Plus, Trash2, Download, Eye, EyeOff, FileText,
  Linkedin, Github, Globe, Calendar, Building, X, Check, Upload,
  ArrowRight, ArrowLeft, CheckCircle, Layout, Palette
} from 'lucide-react';

const ResumeBuilding = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Upload/Create, 2: Fill Details, 3: Choose Template, 4: Preview
  const [activeSection, setActiveSection] = useState('personal');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [uploadMethod, setUploadMethod] = useState(null); // 'create' or 'upload'
  const resumeRef = useRef(null);
  const fileInputRef = useRef(null);

  // Form state
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: ''
  });

  const [experience, setExperience] = useState([
    {
      id: 1,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
  ]);

  const [education, setEducation] = useState([
    {
      id: 1,
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    }
  ]);

  const [skills, setSkills] = useState({
    technical: [],
    languages: [],
    tools: []
  });

  const [skillInput, setSkillInput] = useState({
    technical: '',
    languages: '',
    tools: ''
  });

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: '',
      description: '',
      technologies: '',
      link: ''
    }
  ]);

  const [certifications, setCertifications] = useState([
    {
      id: 1,
      name: '',
      issuer: '',
      date: '',
      credentialId: ''
    }
  ]);

  // Navigation sections
  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: Award },
    { id: 'certifications', label: 'Certifications', icon: FileText }
  ];

  // Templates with more variety
  const templates = [
    { 
      id: 'modern', 
      name: 'Modern Professional', 
      color: 'blue',
      description: 'Clean and modern design with blue accents',
      preview: '🔷'
    },
    { 
      id: 'professional', 
      name: 'Classic Professional', 
      color: 'slate',
      description: 'Traditional format perfect for corporate roles',
      preview: '⬛'
    },
    { 
      id: 'creative', 
      name: 'Creative Designer', 
      color: 'purple',
      description: 'Stand out with bold purple styling',
      preview: '🟣'
    },
    { 
      id: 'minimal', 
      name: 'Minimalist', 
      color: 'gray',
      description: 'Simple and elegant minimal design',
      preview: '⚪'
    },
    { 
      id: 'executive', 
      name: 'Executive', 
      color: 'emerald',
      description: 'Sophisticated design for senior positions',
      preview: '🟢'
    },
    { 
      id: 'tech', 
      name: 'Tech Specialist', 
      color: 'cyan',
      description: 'Perfect for developers and tech professionals',
      preview: '🔵'
    }
  ];

  // Helper functions
  const addExperience = () => {
    setExperience([...experience, {
      id: Date.now(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }]);
  };

  const removeExperience = (id) => {
    setExperience(experience.filter(exp => exp.id !== id));
  };

  const updateExperience = (id, field, value) => {
    setExperience(experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addEducation = () => {
    setEducation([...education, {
      id: Date.now(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    }]);
  };

  const removeEducation = (id) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const updateEducation = (id, field, value) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const addSkill = (category) => {
    const value = skillInput[category].trim();
    if (value) {
      setSkills({
        ...skills,
        [category]: [...skills[category], value]
      });
      setSkillInput({ ...skillInput, [category]: '' });
    }
  };

  const removeSkill = (category, index) => {
    setSkills({
      ...skills,
      [category]: skills[category].filter((_, i) => i !== index)
    });
  };

  const addProject = () => {
    setProjects([...projects, {
      id: Date.now(),
      name: '',
      description: '',
      technologies: '',
      link: ''
    }]);
  };

  const removeProject = (id) => {
    setProjects(projects.filter(proj => proj.id !== id));
  };

  const updateProject = (id, field, value) => {
    setProjects(projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  const addCertification = () => {
    setCertifications([...certifications, {
      id: Date.now(),
      name: '',
      issuer: '',
      date: '',
      credentialId: ''
    }]);
  };

  const removeCertification = (id) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
  };

  const updateCertification = (id, field, value) => {
    setCertifications(certifications.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const downloadResume = () => {
    window.print();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Here you would parse the uploaded resume (PDF/DOCX)
      // For now, we'll just move to the next step
      alert('File uploaded! You can now edit the details or proceed to template selection.');
      setCurrentStep(2);
    }
  };

  const canProceedToTemplateSelection = () => {
    // Check if at least basic info is filled
    return personalInfo.fullName && personalInfo.email && personalInfo.phone;
  };

  const steps = [
    { number: 1, title: 'Upload or Create', icon: Upload },
    { number: 2, title: 'Fill Details', icon: FileText },
    { number: 3, title: 'Choose Template', icon: Palette },
    { number: 4, title: 'Preview & Download', icon: Eye }
  ];

  // Resume Preview Component
  const ResumePreview = () => {
    const getTemplateColors = () => {
      switch (selectedTemplate) {
        case 'modern':
          return {
            primary: 'bg-blue-600',
            secondary: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-200'
          };
        case 'professional':
          return {
            primary: 'bg-slate-700',
            secondary: 'bg-slate-50',
            text: 'text-slate-700',
            border: 'border-slate-200'
          };
        case 'creative':
          return {
            primary: 'bg-purple-600',
            secondary: 'bg-purple-50',
            text: 'text-purple-600',
            border: 'border-purple-200'
          };
        case 'minimal':
          return {
            primary: 'bg-gray-700',
            secondary: 'bg-gray-50',
            text: 'text-gray-700',
            border: 'border-gray-200'
          };
        case 'executive':
          return {
            primary: 'bg-emerald-700',
            secondary: 'bg-emerald-50',
            text: 'text-emerald-700',
            border: 'border-emerald-200'
          };
        case 'tech':
          return {
            primary: 'bg-cyan-600',
            secondary: 'bg-cyan-50',
            text: 'text-cyan-600',
            border: 'border-cyan-200'
          };
        default:
          return {
            primary: 'bg-blue-600',
            secondary: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-200'
          };
      }
    };

    const colors = getTemplateColors();

    return (
      <div ref={resumeRef} className="bg-white text-gray-900 p-8 shadow-lg h-full overflow-auto" style={{ minHeight: '297mm' }}>
        {/* Header */}
        <div className={`${colors.primary} text-white p-6 rounded-lg mb-6`}>
          <h1 className="text-3xl font-bold mb-2">{personalInfo.fullName || 'Your Name'}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
            {personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail size={14} />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone size={14} />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-sm mt-2">
            {personalInfo.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin size={14} />
                <span className="truncate">{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-1">
                <Github size={14} />
                <span className="truncate">{personalInfo.github}</span>
              </div>
            )}
            {personalInfo.portfolio && (
              <div className="flex items-center gap-1">
                <Globe size={14} />
                <span className="truncate">{personalInfo.portfolio}</span>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h2 className={`text-xl font-bold ${colors.text} mb-3 pb-2 border-b-2 ${colors.border}`}>
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.some(exp => exp.company || exp.position) && (
          <div className="mb-6">
            <h2 className={`text-xl font-bold ${colors.text} mb-3 pb-2 border-b-2 ${colors.border}`}>
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.filter(exp => exp.company || exp.position).map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.position || 'Position'}</h3>
                      <p className={`${colors.text} font-semibold`}>{exp.company || 'Company'}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>{exp.location}</p>
                      <p>
                        {exp.startDate && `${exp.startDate} - `}
                        {exp.current ? 'Present' : exp.endDate || 'End Date'}
                      </p>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-sm mt-2 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.some(edu => edu.institution || edu.degree) && (
          <div className="mb-6">
            <h2 className={`text-xl font-bold ${colors.text} mb-3 pb-2 border-b-2 ${colors.border}`}>
              Education
            </h2>
            <div className="space-y-4">
              {education.filter(edu => edu.institution || edu.degree).map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-900">{edu.institution || 'Institution'}</h3>
                      <p className={`${colors.text} font-semibold`}>
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </p>
                      {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>{edu.location}</p>
                      <p>{edu.startDate && `${edu.startDate} - `}{edu.endDate}</p>
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-gray-700 text-sm mt-2">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {(skills.technical.length > 0 || skills.languages.length > 0 || skills.tools.length > 0) && (
          <div className="mb-6">
            <h2 className={`text-xl font-bold ${colors.text} mb-3 pb-2 border-b-2 ${colors.border}`}>
              Skills
            </h2>
            <div className="space-y-2">
              {skills.technical.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-800">Technical Skills: </span>
                  <span className="text-gray-700">{skills.technical.join(', ')}</span>
                </div>
              )}
              {skills.tools.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-800">Tools & Technologies: </span>
                  <span className="text-gray-700">{skills.tools.join(', ')}</span>
                </div>
              )}
              {skills.languages.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-800">Languages: </span>
                  <span className="text-gray-700">{skills.languages.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.some(proj => proj.name) && (
          <div className="mb-6">
            <h2 className={`text-xl font-bold ${colors.text} mb-3 pb-2 border-b-2 ${colors.border}`}>
              Projects
            </h2>
            <div className="space-y-3">
              {projects.filter(proj => proj.name).map(proj => (
                <div key={proj.id}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900">{proj.name}</h3>
                    {proj.link && (
                      <a href={proj.link} className={`${colors.text} text-sm hover:underline`}>
                        View Project
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-gray-700 text-sm mt-1">{proj.description}</p>
                  )}
                  {proj.technologies && (
                    <p className="text-gray-600 text-sm mt-1">
                      <span className="font-semibold">Technologies:</span> {proj.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.some(cert => cert.name) && (
          <div className="mb-6">
            <h2 className={`text-xl font-bold ${colors.text} mb-3 pb-2 border-b-2 ${colors.border}`}>
              Certifications
            </h2>
            <div className="space-y-2">
              {certifications.filter(cert => cert.name).map(cert => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                    <p className={`text-sm ${colors.text}`}>{cert.issuer}</p>
                    {cert.credentialId && (
                      <p className="text-xs text-gray-600">Credential ID: {cert.credentialId}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-400" size={32} />
              <div>
                <h1 className="text-2xl font-bold">Resume Builder</h1>
                <p className="text-sm text-slate-400">Create your professional resume</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 transition-colors"
              >
                {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              <button
                onClick={downloadResume}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors font-semibold"
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-semibold text-slate-300">Choose Template:</span>
          <div className="flex gap-2">
            {templates.map(template => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedTemplate === template.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex gap-6">
          {/* Form Section */}
          <div className={`${showPreview ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
            {/* Navigation Tabs */}
            <div className="bg-slate-800 rounded-lg p-2 mb-4 flex flex-wrap gap-2">
              {sections.map(section => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors flex-1 min-w-[140px] justify-center ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-semibold">{section.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form Content */}
            <div className="bg-slate-800 rounded-lg p-6">
              <AnimatePresence mode="wait">
                {activeSection === 'personal' && (
                  <motion.div
                    key="personal"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <User className="text-blue-400" />
                      Personal Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Full Name *</label>
                        <input
                          type="text"
                          value={personalInfo.fullName}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Email *</label>
                          <input
                            type="email"
                            value={personalInfo.email}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                            placeholder="john@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Phone *</label>
                          <input
                            type="tel"
                            value={personalInfo.phone}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                            placeholder="+1 234 567 8900"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Location</label>
                        <input
                          type="text"
                          value={personalInfo.location}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                          placeholder="City, Country"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">LinkedIn</label>
                          <input
                            type="text"
                            value={personalInfo.linkedin}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                            placeholder="linkedin.com/in/..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">GitHub</label>
                          <input
                            type="text"
                            value={personalInfo.github}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                            placeholder="github.com/..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Portfolio</label>
                          <input
                            type="text"
                            value={personalInfo.portfolio}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, portfolio: e.target.value })}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                            placeholder="yourwebsite.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Professional Summary</label>
                        <textarea
                          value={personalInfo.summary}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 h-32"
                          placeholder="Brief summary of your professional background and goals..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'experience' && (
                  <motion.div
                    key="experience"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Briefcase className="text-blue-400" />
                        Work Experience
                      </h2>
                      <button
                        onClick={addExperience}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Plus size={18} />
                        Add Experience
                      </button>
                    </div>
                    <div className="space-y-6">
                      {experience.map((exp, index) => (
                        <div key={exp.id} className="bg-slate-700/50 rounded-lg p-4 relative">
                          {experience.length > 1 && (
                            <button
                              onClick={() => removeExperience(exp.id)}
                              className="absolute top-4 right-4 text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                          <h3 className="font-semibold mb-4 text-blue-300">Experience #{index + 1}</h3>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-semibold mb-1">Position *</label>
                                <input
                                  type="text"
                                  value={exp.position}
                                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                  placeholder="Software Engineer"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold mb-1">Company *</label>
                                <input
                                  type="text"
                                  value={exp.company}
                                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                  placeholder="Tech Corp"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-1">Location</label>
                              <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                placeholder="San Francisco, CA"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label className="block text-sm font-semibold mb-1">Start Date</label>
                                <input
                                  type="month"
                                  value={exp.startDate}
                                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold mb-1">End Date</label>
                                <input
                                  type="month"
                                  value={exp.endDate}
                                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                  disabled={exp.current}
                                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm disabled:opacity-50"
                                />
                              </div>
                              <div className="flex items-end">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={exp.current}
                                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-sm">Current Job</span>
                                </label>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-1">Description</label>
                              <textarea
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm h-24"
                                placeholder="Describe your responsibilities and achievements..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeSection === 'education' && (
                  <motion.div
                    key="education"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <GraduationCap className="text-blue-400" />
                        Education
                      </h2>
                      <button
                        onClick={addEducation}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Plus size={18} />
                        Add Education
                      </button>
                    </div>
                    <div className="space-y-6">
                      {education.map((edu, index) => (
                        <div key={edu.id} className="bg-slate-700/50 rounded-lg p-4 relative">
                          {education.length > 1 && (
                            <button
                              onClick={() => removeEducation(edu.id)}
                              className="absolute top-4 right-4 text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                          <h3 className="font-semibold mb-4 text-blue-300">Education #{index + 1}</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-semibold mb-1">Institution *</label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                placeholder="University Name"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-semibold mb-1">Degree *</label>
                                <input
                                  type="text"
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                  placeholder="Bachelor's, Master's, etc."
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold mb-1">Field of Study</label>
                                <input
                                  type="text"
                                  value={edu.field}
                                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                  placeholder="Computer Science"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label className="block text-sm font-semibold mb-1">Location</label>
                                <input
                                  type="text"
                                  value={edu.location}
                                  onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                  placeholder="City, State"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold mb-1">Start Date</label>
                                <input
                                  type="month"
                                  value={edu.startDate}
                                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold mb-1">End Date</label>
                                <input
                                  type="month"
                                  value={edu.endDate}
                                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-1">GPA (Optional)</label>
                              <input
                                type="text"
                                value={edu.gpa}
                                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                placeholder="3.8/4.0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-1">Description</label>
                              <textarea
                                value={edu.description}
                                onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm h-20"
                                placeholder="Relevant coursework, honors, activities..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeSection === 'skills' && (
                  <motion.div
                    key="skills"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <Code className="text-blue-400" />
                      Skills
                    </h2>
                    <div className="space-y-6">
                      {/* Technical Skills */}
                      <div>
                        <label className="block text-sm font-semibold mb-2">Technical Skills</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={skillInput.technical}
                            onChange={(e) => setSkillInput({ ...skillInput, technical: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && addSkill('technical')}
                            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                            placeholder="e.g., JavaScript, Python, React"
                          />
                          <button
                            onClick={() => addSkill('technical')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skills.technical.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-blue-600/20 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                            >
                              {skill}
                              <button
                                onClick={() => removeSkill('technical', index)}
                                className="hover:text-red-400"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Tools & Technologies */}
                      <div>
                        <label className="block text-sm font-semibold mb-2">Tools & Technologies</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={skillInput.tools}
                            onChange={(e) => setSkillInput({ ...skillInput, tools: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && addSkill('tools')}
                            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                            placeholder="e.g., Git, Docker, AWS"
                          />
                          <button
                            onClick={() => addSkill('tools')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skills.tools.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-purple-600/20 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                            >
                              {skill}
                              <button
                                onClick={() => removeSkill('tools', index)}
                                className="hover:text-red-400"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Languages */}
                      <div>
                        <label className="block text-sm font-semibold mb-2">Languages</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={skillInput.languages}
                            onChange={(e) => setSkillInput({ ...skillInput, languages: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && addSkill('languages')}
                            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                            placeholder="e.g., English (Native), Spanish (Fluent)"
                          />
                          <button
                            onClick={() => addSkill('languages')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skills.languages.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-green-600/20 border border-green-500/30 text-green-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                            >
                              {skill}
                              <button
                                onClick={() => removeSkill('languages', index)}
                                className="hover:text-red-400"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'projects' && (
                  <motion.div
                    key="projects"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Award className="text-blue-400" />
                        Projects
                      </h2>
                      <button
                        onClick={addProject}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Plus size={18} />
                        Add Project
                      </button>
                    </div>
                    <div className="space-y-6">
                      {projects.map((proj, index) => (
                        <div key={proj.id} className="bg-slate-700/50 rounded-lg p-4 relative">
                          {projects.length > 1 && (
                            <button
                              onClick={() => removeProject(proj.id)}
                              className="absolute top-4 right-4 text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                          <h3 className="font-semibold mb-4 text-blue-300">Project #{index + 1}</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-semibold mb-1">Project Name *</label>
                              <input
                                type="text"
                                value={proj.name}
                                onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                placeholder="E-commerce Website"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-1">Description</label>
                              <textarea
                                value={proj.description}
                                onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm h-20"
                                placeholder="Describe the project, your role, and key achievements..."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-1">Technologies Used</label>
                              <input
                                type="text"
                                value={proj.technologies}
                                onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                placeholder="React, Node.js, MongoDB"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-1">Project Link (Optional)</label>
                              <input
                                type="url"
                                value={proj.link}
                                onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                placeholder="https://github.com/..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeSection === 'certifications' && (
                  <motion.div
                    key="certifications"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FileText className="text-blue-400" />
                        Certifications
                      </h2>
                      <button
                        onClick={addCertification}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Plus size={18} />
                        Add Certification
                      </button>
                    </div>
                    <div className="space-y-6">
                      {certifications.map((cert, index) => (
                        <div key={cert.id} className="bg-slate-700/50 rounded-lg p-4 relative">
                          {certifications.length > 1 && (
                            <button
                              onClick={() => removeCertification(cert.id)}
                              className="absolute top-4 right-4 text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                          <h3 className="font-semibold mb-4 text-blue-300">Certification #{index + 1}</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-semibold mb-1">Certification Name *</label>
                              <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                placeholder="AWS Certified Solutions Architect"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-semibold mb-1">Issuing Organization</label>
                                <input
                                  type="text"
                                  value={cert.issuer}
                                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                  placeholder="Amazon Web Services"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold mb-1">Date Obtained</label>
                                <input
                                  type="month"
                                  value={cert.date}
                                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-1">Credential ID (Optional)</label>
                              <input
                                type="text"
                                value={cert.credentialId}
                                onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                placeholder="ABC123XYZ"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="w-1/2">
              <div className="sticky top-24">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Eye className="text-blue-400" />
                  Live Preview
                </h2>
                <div className="bg-white rounded-lg shadow-2xl overflow-hidden" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                  <ResumePreview />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-preview, #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumeBuilding;