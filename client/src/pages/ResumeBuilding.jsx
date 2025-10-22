import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, 
  Code, Languages, Plus, Trash2, Download, Eye, EyeOff, FileText,
  Linkedin, Github, Globe, Calendar, Building, X, Check, Upload,
  ArrowRight, ArrowLeft, CheckCircle, Layout, Palette, Sparkles
} from 'lucide-react';

const ResumeBuilding = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Upload/Create, 2: Choose Template, 3: Choose Sub-Template, 4: Fill Details, 5: Preview
  const [activeSection, setActiveSection] = useState('personal');
  const [uploadMethod, setUploadMethod] = useState(null); // 'upload' or 'create'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedSubTemplate, setSelectedSubTemplate] = useState(null);
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

  // AI Suggestions Data
  const aiSuggestions = {
    summary: [
      "Results-driven professional with 5+ years of experience in software development, specializing in full-stack web applications and cloud solutions.",
      "Innovative software engineer with expertise in building scalable applications, passionate about clean code and user-centric design.",
      "Dynamic IT professional with proven track record in delivering high-quality software solutions and leading cross-functional teams."
    ],
    experienceDescriptions: [
      "Led development of responsive web applications using React and Node.js, improving user engagement by 40%",
      "Implemented CI/CD pipelines using Jenkins and Docker, reducing deployment time by 60%",
      "Collaborated with cross-functional teams to deliver projects on time and within budget",
      "Mentored junior developers and conducted code reviews to maintain high code quality standards",
      "Optimized database queries and API endpoints, reducing response time by 50%"
    ],
    skills: {
      technical: ["JavaScript", "Python", "React", "Node.js", "TypeScript", "Java", "C++", "SQL"],
      tools: ["Git", "Docker", "Kubernetes", "AWS", "Azure", "MongoDB", "PostgreSQL", "VS Code"],
      languages: ["English", "Spanish", "French", "German", "Mandarin", "Hindi"]
    },
    projectDescriptions: [
      "Developed a full-stack e-commerce platform with real-time inventory management and payment integration",
      "Built a machine learning model for predictive analytics, achieving 95% accuracy",
      "Created a mobile-responsive dashboard for data visualization using React and D3.js",
      "Implemented microservices architecture for a high-traffic application serving 1M+ users"
    ]
  };

  // AI Suggestion Handler
  const getAISuggestion = (type, field = null) => {
    if (type === 'summary') {
      const randomSummary = aiSuggestions.summary[Math.floor(Math.random() * aiSuggestions.summary.length)];
      setPersonalInfo({ ...personalInfo, summary: randomSummary });
    } else if (type === 'experienceDescription' && field !== null) {
      const randomDesc = aiSuggestions.experienceDescriptions[Math.floor(Math.random() * aiSuggestions.experienceDescriptions.length)];
      const updatedExperience = experience.map(exp => 
        exp.id === field ? { ...exp, description: randomDesc } : exp
      );
      setExperience(updatedExperience);
    } else if (type === 'skills' && field) {
      const suggestions = aiSuggestions.skills[field] || [];
      const randomSkills = suggestions.slice(0, 5);
      setSkills({ ...skills, [field]: randomSkills });
    } else if (type === 'projectDescription' && field !== null) {
      const randomDesc = aiSuggestions.projectDescriptions[Math.floor(Math.random() * aiSuggestions.projectDescriptions.length)];
      const updatedProjects = projects.map(proj => 
        proj.id === field ? { ...proj, description: randomDesc } : proj
      );
      setProjects(updatedProjects);
    }
  };

  // Navigation sections
  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: Award },
    { id: 'certifications', label: 'Certifications', icon: FileText }
  ];

  // Templates with sub-templates
  const templates = [
    { 
      id: 'modern', 
      name: 'Modern Professional', 
      color: 'blue',
      description: 'Clean and modern designs with contemporary styling',
      preview: '🔷',
      subTemplates: [
        { id: 'modern-1', name: 'Modern Classic', description: 'Two-column layout with blue accents', colorScheme: 'blue' },
        { id: 'modern-2', name: 'Modern Elegant', description: 'Single column with gradient header', colorScheme: 'indigo' },
        { id: 'modern-3', name: 'Modern Bold', description: 'Bold typography with sidebar', colorScheme: 'sky' },
        { id: 'modern-4', name: 'Modern Minimal', description: 'Clean lines with plenty of white space', colorScheme: 'slate' }
      ]
    },
    { 
      id: 'professional', 
      name: 'Classic Professional', 
      color: 'slate',
      description: 'Traditional formats perfect for corporate roles',
      preview: '⬛',
      subTemplates: [
        { id: 'professional-1', name: 'Executive', description: 'Traditional single-column layout', colorScheme: 'slate' },
        { id: 'professional-2', name: 'Corporate', description: 'Two-column with experience focus', colorScheme: 'gray' },
        { id: 'professional-3', name: 'Business', description: 'Timeline-based layout', colorScheme: 'zinc' },
        { id: 'professional-4', name: 'Formal', description: 'Classic academic style', colorScheme: 'neutral' }
      ]
    },
    { 
      id: 'creative', 
      name: 'Creative Designer', 
      color: 'purple',
      description: 'Stand out with bold and creative styling',
      preview: '🟣',
      subTemplates: [
        { id: 'creative-1', name: 'Designer Pro', description: 'Portfolio-style with visual elements', colorScheme: 'purple' },
        { id: 'creative-2', name: 'Artistic', description: 'Unique layout with color blocks', colorScheme: 'violet' },
        { id: 'creative-3', name: 'Vibrant', description: 'Eye-catching with bold colors', colorScheme: 'fuchsia' },
        { id: 'creative-4', name: 'Innovative', description: 'Non-traditional structure', colorScheme: 'pink' }
      ]
    },
    { 
      id: 'minimal', 
      name: 'Minimalist', 
      color: 'gray',
      description: 'Simple and elegant minimal designs',
      preview: '⚪',
      subTemplates: [
        { id: 'minimal-1', name: 'Simple Clean', description: 'Ultra-minimal with focus on content', colorScheme: 'gray' },
        { id: 'minimal-2', name: 'Elegant Lines', description: 'Minimal with subtle borders', colorScheme: 'stone' },
        { id: 'minimal-3', name: 'Pure White', description: 'Maximum white space, minimal text', colorScheme: 'slate' },
        { id: 'minimal-4', name: 'Refined', description: 'Sophisticated minimalism', colorScheme: 'zinc' }
      ]
    },
    { 
      id: 'executive', 
      name: 'Executive', 
      color: 'emerald',
      description: 'Sophisticated designs for senior positions',
      preview: '🟢',
      subTemplates: [
        { id: 'executive-1', name: 'Senior Leader', description: 'Professional with emphasis on achievements', colorScheme: 'emerald' },
        { id: 'executive-2', name: 'C-Level', description: 'Executive summary focused', colorScheme: 'green' },
        { id: 'executive-3', name: 'Director', description: 'Leadership-oriented layout', colorScheme: 'teal' },
        { id: 'executive-4', name: 'VP Style', description: 'Strategic accomplishments focus', colorScheme: 'cyan' }
      ]
    },
    { 
      id: 'tech', 
      name: 'Tech Specialist', 
      color: 'cyan',
      description: 'Perfect for developers and tech professionals',
      preview: '🔵',
      subTemplates: [
        { id: 'tech-1', name: 'Developer', description: 'Code-like styling with monospace fonts', colorScheme: 'cyan' },
        { id: 'tech-2', name: 'Engineer', description: 'Technical skills highlighted', colorScheme: 'blue' },
        { id: 'tech-3', name: 'Data Scientist', description: 'Analytics and projects focus', colorScheme: 'indigo' },
        { id: 'tech-4', name: 'Tech Lead', description: 'Technical leadership emphasis', colorScheme: 'sky' }
      ]
    }
  ];

  // Progress steps
  const steps = [
    { number: 1, title: 'Upload/Create', icon: Upload },
    { number: 2, title: 'Choose Category', icon: Palette },
    { number: 3, title: 'Select Template', icon: Layout },
    { number: 4, title: 'Fill Details', icon: FileText },
    { number: 5, title: 'Preview & Download', icon: Eye }
  ];

  // Dummy data for template preview
  const dummyData = {
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndoe',
    summary: 'Results-driven professional with 5+ years of experience in software development. Passionate about creating innovative solutions and leading high-performing teams.',
    experience: [
      {
        position: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        startDate: '2020-01',
        endDate: 'Present',
        description: 'Led development of scalable web applications serving 1M+ users.'
      }
    ],
    education: [
      {
        institution: 'Stanford University',
        degree: "Bachelor's of Science",
        field: 'Computer Science',
        location: 'Stanford, CA',
        startDate: '2015-09',
        endDate: '2019-06',
        gpa: '3.8/4.0'
      }
    ],
    skills: {
      technical: ['JavaScript', 'Python', 'React', 'Node.js'],
      tools: ['Git', 'Docker', 'AWS', 'MongoDB'],
      languages: ['English (Native)', 'Spanish (Fluent)']
    }
  };

  // Mini template preview component
  const TemplatePreview = ({ template }) => {
    const getTemplateColors = () => {
      const colorScheme = template.colorScheme || template.color;
      
      const colorMap = {
        blue: { primary: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-200' },
        indigo: { primary: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-200' },
        sky: { primary: 'bg-sky-600', text: 'text-sky-600', border: 'border-sky-200' },
        slate: { primary: 'bg-slate-700', text: 'text-slate-700', border: 'border-slate-200' },
        gray: { primary: 'bg-gray-700', text: 'text-gray-700', border: 'border-gray-200' },
        zinc: { primary: 'bg-zinc-700', text: 'text-zinc-700', border: 'border-zinc-200' },
        neutral: { primary: 'bg-neutral-700', text: 'text-neutral-700', border: 'border-neutral-200' },
        stone: { primary: 'bg-stone-700', text: 'text-stone-700', border: 'border-stone-200' },
        purple: { primary: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-200' },
        violet: { primary: 'bg-violet-600', text: 'text-violet-600', border: 'border-violet-200' },
        fuchsia: { primary: 'bg-fuchsia-600', text: 'text-fuchsia-600', border: 'border-fuchsia-200' },
        pink: { primary: 'bg-pink-600', text: 'text-pink-600', border: 'border-pink-200' },
        emerald: { primary: 'bg-emerald-700', text: 'text-emerald-700', border: 'border-emerald-200' },
        green: { primary: 'bg-green-700', text: 'text-green-700', border: 'border-green-200' },
        teal: { primary: 'bg-teal-600', text: 'text-teal-600', border: 'border-teal-200' },
        cyan: { primary: 'bg-cyan-600', text: 'text-cyan-600', border: 'border-cyan-200' }
      };

      return colorMap[colorScheme] || colorMap.blue;
    };

    const colors = getTemplateColors();

    return (
      <div className="bg-white text-gray-900 p-4 rounded shadow-lg text-xs h-[320px] overflow-hidden">
        {/* Mini Header */}
        <div className={`${colors.primary} text-white p-3 rounded mb-3`}>
          <h3 className="font-bold text-sm">{dummyData.fullName}</h3>
          <p className="text-[10px] mt-1">{dummyData.email} • {dummyData.phone}</p>
        </div>

        {/* Mini Summary */}
        <div className="mb-3">
          <h4 className={`font-bold ${colors.text} text-xs mb-1 pb-1 border-b ${colors.border}`}>
            Summary
          </h4>
          <p className="text-gray-600 text-[10px] leading-tight">
            {dummyData.summary.substring(0, 100)}...
          </p>
        </div>

        {/* Mini Experience */}
        <div className="mb-3">
          <h4 className={`font-bold ${colors.text} text-xs mb-1 pb-1 border-b ${colors.border}`}>
            Experience
          </h4>
          <div className="text-[10px]">
            <p className="font-semibold">{dummyData.experience[0].position}</p>
            <p className={colors.text}>{dummyData.experience[0].company}</p>
          </div>
        </div>

        {/* Mini Education */}
        <div className="mb-3">
          <h4 className={`font-bold ${colors.text} text-xs mb-1 pb-1 border-b ${colors.border}`}>
            Education
          </h4>
          <div className="text-[10px]">
            <p className="font-semibold">{dummyData.education[0].institution}</p>
            <p className={colors.text}>{dummyData.education[0].degree}</p>
          </div>
        </div>

        {/* Mini Skills */}
        <div>
          <h4 className={`font-bold ${colors.text} text-xs mb-1 pb-1 border-b ${colors.border}`}>
            Skills
          </h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {dummyData.skills.technical.slice(0, 4).map((skill, idx) => (
              <span key={idx} className="bg-gray-200 text-gray-700 px-1 py-0.5 rounded text-[9px]">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

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

  // Resume Preview Component
  const ResumePreview = () => {
    const getTemplateColors = () => {
      // Find the selected sub-template to get its color scheme
      const mainTemplate = templates.find(t => t.id === selectedTemplate);
      const subTemplate = mainTemplate?.subTemplates.find(st => st.id === selectedSubTemplate);
      const colorScheme = subTemplate?.colorScheme || 'blue';
      
      // Color map for all possible color schemes
      const colorMap = {
        blue: { primary: 'bg-blue-600', secondary: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
        indigo: { primary: 'bg-indigo-600', secondary: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
        sky: { primary: 'bg-sky-600', secondary: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200' },
        slate: { primary: 'bg-slate-700', secondary: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
        gray: { primary: 'bg-gray-700', secondary: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
        zinc: { primary: 'bg-zinc-700', secondary: 'bg-zinc-50', text: 'text-zinc-700', border: 'border-zinc-200' },
        neutral: { primary: 'bg-neutral-700', secondary: 'bg-neutral-50', text: 'text-neutral-700', border: 'border-neutral-200' },
        stone: { primary: 'bg-stone-700', secondary: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200' },
        purple: { primary: 'bg-purple-600', secondary: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
        violet: { primary: 'bg-violet-600', secondary: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
        fuchsia: { primary: 'bg-fuchsia-600', secondary: 'bg-fuchsia-50', text: 'text-fuchsia-600', border: 'border-fuchsia-200' },
        pink: { primary: 'bg-pink-600', secondary: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
        emerald: { primary: 'bg-emerald-700', secondary: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
        green: { primary: 'bg-green-600', secondary: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
        teal: { primary: 'bg-teal-600', secondary: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
        cyan: { primary: 'bg-cyan-600', secondary: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' }
      };
      
      return colorMap[colorScheme] || colorMap.blue;
    };

    const colors = getTemplateColors();

    return (
      <div ref={resumeRef} id="resume-preview" className="bg-white text-gray-900 p-8 shadow-lg h-full overflow-auto" style={{ minHeight: '297mm' }}>
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

  // Form sections content (Personal Info section as example, others follow similar pattern)
  const renderPersonalInfoSection = () => (
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold">Professional Summary</label>
            <button
              onClick={() => getAISuggestion('summary')}
              className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-xs font-semibold transition-all"
            >
              <Sparkles size={14} />
              AI Suggest
            </button>
          </div>
          <textarea
            value={personalInfo.summary}
            onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 h-32"
            placeholder="Brief summary of your professional background and goals..."
          />
        </div>
      </div>
    </motion.div>
  );

  // Experience Section
  const renderExperienceSection = () => (
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold">Description</label>
                  <button
                    onClick={() => getAISuggestion('experienceDescription', exp.id)}
                    className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded text-xs font-semibold transition-all"
                  >
                    <Sparkles size={12} />
                    AI Suggest
                  </button>
                </div>
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
  );

  // Education Section
  const renderEducationSection = () => (
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
  );

  // Skills Section
  const renderSkillsSection = () => (
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold">Technical Skills</label>
            <button
              onClick={() => getAISuggestion('skills', 'technical')}
              className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-xs font-semibold transition-all"
            >
              <Sparkles size={14} />
              AI Suggest
            </button>
          </div>
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold">Tools & Technologies</label>
            <button
              onClick={() => getAISuggestion('skills', 'tools')}
              className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-xs font-semibold transition-all"
            >
              <Sparkles size={14} />
              AI Suggest
            </button>
          </div>
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold">Languages</label>
            <button
              onClick={() => getAISuggestion('skills', 'languages')}
              className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-xs font-semibold transition-all"
            >
              <Sparkles size={14} />
              AI Suggest
            </button>
          </div>
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
  );

  // Projects Section
  const renderProjectsSection = () => (
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold">Description</label>
                  <button
                    onClick={() => getAISuggestion('projectDescription', proj.id)}
                    className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded text-xs font-semibold transition-all"
                  >
                    <Sparkles size={12} />
                    AI Suggest
                  </button>
                </div>
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
  );

  // Certifications Section
  const renderCertificationsSection = () => (
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
  );

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
                <p className="text-sm text-slate-400">Create your professional resume in 4 easy steps</p>
              </div>
            </div>
            {currentStep === 4 && (
              <button
                onClick={downloadResume}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors font-semibold"
              >
                <Download size={18} />
                Download PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isCompleted ? 'bg-green-600' : isActive ? 'bg-blue-600' : 'bg-slate-700'
                  }`}>
                    {isCompleted ? <CheckCircle size={24} /> : <Icon size={24} />}
                  </div>
                  <p className={`text-sm mt-2 font-semibold ${
                    isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 mt-[-20px] transition-all ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-slate-700'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Choose Template Category */}
          {/* Step 1: Upload/Create */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-slate-800 rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-4 text-center">Let's Build Your Resume</h2>
                <p className="text-slate-300 text-center mb-8">
                  Choose how you want to start building your professional resume
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Upload Resume Option */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`bg-slate-700 rounded-lg p-8 cursor-pointer border-2 transition-all ${
                      uploadMethod === 'upload' ? 'border-blue-500 ring-4 ring-blue-500/30' : 'border-transparent hover:border-slate-600'
                    }`}
                    onClick={() => {
                      setUploadMethod('upload');
                      fileInputRef.current?.click();
                    }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-blue-500/20 p-6 rounded-full mb-4">
                        <Upload className="text-blue-400" size={48} />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Upload Resume</h3>
                      <p className="text-slate-400 mb-4">
                        Have an existing resume? Upload it and we'll help you enhance it with our professional templates
                      </p>
                      <div className="text-sm text-slate-500">
                        Supports PDF, DOC, DOCX
                      </div>
                    </div>
                  </motion.div>

                  {/* Create from Scratch Option */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`bg-slate-700 rounded-lg p-8 cursor-pointer border-2 transition-all ${
                      uploadMethod === 'create' ? 'border-blue-500 ring-4 ring-blue-500/30' : 'border-transparent hover:border-slate-600'
                    }`}
                    onClick={() => {
                      setUploadMethod('create');
                      setCurrentStep(2);
                    }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-green-500/20 p-6 rounded-full mb-4">
                        <FileText className="text-green-400" size={48} />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Create from Scratch</h3>
                      <p className="text-slate-400 mb-4">
                        Start fresh and build a professional resume from the ground up with our guided process
                      </p>
                      <div className="text-sm text-slate-500">
                        Step-by-step guidance
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Handle file upload logic here
                      console.log('File uploaded:', file.name);
                      setCurrentStep(2);
                    }
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Choose Category */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto"
            >
              <div className="bg-slate-800 rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-4 text-center">Choose Your Resume Style</h2>
                <p className="text-slate-300 text-center mb-8">
                  Select a category that matches your professional style. Each category has multiple template variations.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  {templates.map(template => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`bg-slate-700 rounded-lg p-6 cursor-pointer border-2 transition-all ${
                        selectedTemplate === template.id ? 'border-blue-500 ring-4 ring-blue-500/30' : 'border-transparent hover:border-slate-600'
                      }`}
                      onClick={() => {
                        setSelectedTemplate(template.id);
                      }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="text-6xl mb-4">{template.preview}</div>
                        <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                        <p className="text-slate-400 text-sm mb-4">
                          {template.description}
                        </p>
                        <div className="text-xs text-slate-500">
                          {template.subTemplates.length} templates available
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <ArrowLeft size={18} />
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors font-semibold"
                  >
                    Next
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Choose Sub-Template */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-slate-800 rounded-lg p-8">
                {selectedTemplate ? (
                  <>
                    <h2 className="text-3xl font-bold mb-4 text-center">
                      {templates.find(t => t.id === selectedTemplate)?.name} Templates
                    </h2>
                    <p className="text-slate-300 text-center mb-8">
                      Choose your preferred template design. Preview shows sample layout with dummy data.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {templates.find(t => t.id === selectedTemplate)?.subTemplates.map(subTemplate => (
                        <motion.div
                          key={subTemplate.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-slate-700 rounded-lg p-4 cursor-pointer border-2 border-transparent hover:border-slate-600 transition-all"
                          onClick={() => {
                            setSelectedSubTemplate(subTemplate.id);
                            setCurrentStep(4);
                          }}
                        >
                          {/* Mini Template Preview */}
                          <TemplatePreview template={{ id: subTemplate.id, ...subTemplate }} />
                          
                          {/* Template Info */}
                          <div className="mt-4 text-center">
                            <h3 className="text-base font-bold mb-1">{subTemplate.name}</h3>
                            <p className="text-slate-400 text-xs mb-3">
                              {subTemplate.description}
                            </p>
                            <div className="text-xs text-blue-400">
                              Click to select
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h2 className="text-2xl font-bold mb-4">No Category Selected</h2>
                    <p className="text-slate-300 mb-6">
                      You haven't selected a template category yet. You can go back to choose one, or continue to fill in your details.
                    </p>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => {
                      setCurrentStep(2);
                      setSelectedSubTemplate(null);
                    }}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <ArrowLeft size={18} />
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors font-semibold"
                  >
                    Next
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Fill Details */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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

              <div className="bg-slate-800 rounded-lg p-6">
                <AnimatePresence mode="wait">
                  {activeSection === 'personal' && renderPersonalInfoSection()}
                  {activeSection === 'experience' && renderExperienceSection()}
                  {activeSection === 'education' && renderEducationSection()}
                  {activeSection === 'skills' && renderSkillsSection()}
                  {activeSection === 'projects' && renderProjectsSection()}
                  {activeSection === 'certifications' && renderCertificationsSection()}
                </AnimatePresence>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors font-semibold"
                >
                  Next
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Preview & Download */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-6">
                <div className="flex-1">
                  <div className="bg-slate-800 rounded-lg p-6 mb-4">
                    <h2 className="text-2xl font-bold mb-4">Your Resume is Ready!</h2>
                    <p className="text-slate-300 mb-4">
                      Preview your resume below. You can go back to edit details or change the template if needed.
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setCurrentStep(4)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <ArrowLeft size={18} />
                        Back
                      </button>
                      <button
                        onClick={() => setCurrentStep(4)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <FileText size={18} />
                        Edit Details
                      </button>
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Palette size={18} />
                        Change Template
                      </button>
                      <button
                        onClick={downloadResume}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 transition-colors font-semibold ml-auto"
                      >
                        <Download size={18} />
                        Download PDF
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-2xl overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                    <ResumePreview />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
