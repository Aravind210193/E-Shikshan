require('dotenv').config();
const connectDB = require('../config/db');
const AdminResumeTemplate = require('../models/AdminResume');

// Resume template data (from ResumeBuilding.jsx)
const templateData = [
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

// Standard resume sections
const standardSections = [
  { key: 'personalInfo', label: 'Personal Information', fields: ['fullName', 'email', 'phone', 'location', 'linkedin', 'github', 'portfolio'], order: 1 },
  { key: 'summary', label: 'Professional Summary', fields: ['summary'], order: 2 },
  { key: 'experience', label: 'Work Experience', fields: ['company', 'position', 'duration', 'location', 'responsibilities'], order: 3 },
  { key: 'education', label: 'Education', fields: ['institution', 'degree', 'field', 'duration', 'gpa'], order: 4 },
  { key: 'skills', label: 'Skills', fields: ['technicalSkills', 'softSkills'], order: 5 },
  { key: 'projects', label: 'Projects', fields: ['title', 'description', 'technologies', 'link'], order: 6 },
  { key: 'certifications', label: 'Certifications', fields: ['name', 'issuer', 'date', 'credentialId'], order: 7 },
  { key: 'languages', label: 'Languages', fields: ['language', 'proficiency'], order: 8 },
];

async function run() {
  await connectDB();

  // Clear existing
  await AdminResumeTemplate.deleteMany({});

  const docs = [];

  // Create a document for each subtemplate
  templateData.forEach(category => {
    category.subTemplates.forEach(subTemplate => {
      docs.push({
        name: subTemplate.name,
        description: `${category.description} - ${subTemplate.description}`,
        previewImage: category.preview,
        isActive: true,
        sections: standardSections,
        tags: [
          category.name,
          category.id,
          subTemplate.colorScheme,
          'resume',
          'template'
        ].filter(Boolean),
      });
    });
  });

  await AdminResumeTemplate.insertMany(docs);
  console.log(`✅ Seeded ${docs.length} resume templates with full details`);
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
