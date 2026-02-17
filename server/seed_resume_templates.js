const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const AdminResume = require('./src/models/AdminResume');
const Admin = require('./src/models/Admin');

dotenv.config({ path: path.join(__dirname, '.env') });

const templates = [
    {
        name: 'FAANG Optimized',
        category: 'faang',
        color: 'rose',
        description: '⭐ ATS-friendly templates accepted by Google, Microsoft, Amazon, Meta & top tech companies',
        preview: '⭐',
        recommended: true,
        subTemplates: [
            {
                id: 'faang-1',
                name: 'Google Standard',
                description: 'ATS-optimized, clean layout preferred by Google recruiters. Single-column, quantified achievements.',
                colorScheme: 'rose',
                features: ['ATS-Friendly', 'Quantifiable Metrics', 'Achievement-Focused', 'Simple Format']
            },
            {
                id: 'faang-2',
                name: 'Microsoft Professional',
                description: 'Classic format with emphasis on technical skills and impact metrics.',
                colorScheme: 'blue',
                features: ['Clean Design', 'Skills Matrix', 'Impact-Driven', 'Tech-Focused']
            },
            {
                id: 'faang-3',
                name: 'Meta Modern',
                description: 'Contemporary layout highlighting innovation and product impact.',
                colorScheme: 'indigo',
                features: ['Modern Layout', 'Product-Focused', 'Innovation Highlights', 'Results-Oriented']
            },
            {
                id: 'faang-4',
                name: 'Amazon Leadership',
                description: 'Leadership principles focused with STAR method accomplishments.',
                colorScheme: 'amber',
                features: ['Leadership Principles', 'STAR Format', 'Metrics-Heavy', 'Action-Focused']
            }
        ]
    },
    {
        name: 'Student Classic',
        category: 'student',
        color: 'sky',
        description: '🎓 Perfect for students, freshers, and entry-level positions. Clean, professional, and easy to fill.',
        preview: '🎓',
        recommended: true,
        subTemplates: [
            {
                id: 'student-1',
                name: 'College Classic',
                description: 'Clean and simple layout perfect for students and recent graduates. Emphasizes education and projects.',
                colorScheme: 'sky',
                features: ['Education-Focused', 'Projects Highlighted', 'Clean Layout', 'Easy to Read']
            },
            {
                id: 'student-2',
                name: 'Internship Ready',
                description: 'Professional format ideal for internship applications. Highlights coursework and skills.',
                colorScheme: 'blue',
                features: ['Internship-Friendly', 'Skills Showcase', 'Coursework Section', 'Modern Design']
            },
            {
                id: 'student-3',
                name: 'Fresher Professional',
                description: 'Entry-level friendly template with emphasis on academic achievements and certifications.',
                colorScheme: 'indigo',
                features: ['Beginner-Friendly', 'Academic Focus', 'Certifications', 'Professional Look']
            },
            {
                id: 'student-4',
                name: 'Campus Placement',
                description: 'Optimized for campus recruitment drives. Clear sections for education, skills, and extracurriculars.',
                colorScheme: 'teal',
                features: ['Campus-Optimized', 'Extracurriculars', 'Clear Sections', 'Professional Format']
            }
        ]
    },
    {
        name: 'Modern Professional',
        category: 'modern',
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
        name: 'Classic Professional',
        category: 'professional',
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
        name: 'Creative Designer',
        category: 'creative',
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
        name: 'Minimalist',
        category: 'minimal',
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
        name: 'Executive',
        category: 'executive',
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
        name: 'Tech Specialist',
        category: 'tech',
        color: 'cyan',
        description: 'Perfect for developers and tech professionals',
        preview: '🔵',
        subTemplates: [
            { id: 'tech-1', name: 'Developer', description: 'Code-like styling with monospace fonts', colorScheme: 'cyan' },
            { id: 'tech-2', name: 'Engineer', description: 'Technical skills highlighted', colorScheme: 'blue' },
            { id: 'tech-3', name: 'Data Scientist', description: 'Analytics and projects focus', colorScheme: 'indigo' },
            { id: 'tech-4', name: 'Tech Lead', description: 'Technical leadership emphasis', colorScheme: 'sky' }
        ]
    },
    {
        name: 'Academic & Research',
        category: 'academic',
        color: 'indigo',
        description: 'Professional templates for academic positions, research roles, and scholarly applications',
        preview: '📚',
        subTemplates: [
            {
                id: 'academic-1',
                name: 'Research Scholar',
                description: 'LaTeX-style academic CV with publications, conferences, and research focus',
                colorScheme: 'indigo',
                features: ['Publications Section', 'Conference Presentations', 'Research Experience', 'Academic Format']
            },
            {
                id: 'academic-2',
                name: 'PhD Candidate',
                description: 'Comprehensive CV format for doctoral students with emphasis on research and teaching',
                colorScheme: 'violet',
                features: ['Research Projects', 'Teaching Experience', 'Academic Achievements', 'Grant Applications']
            },
            {
                id: 'academic-3',
                name: 'Faculty Position',
                description: 'Professional academic CV for faculty applications with detailed publication list',
                colorScheme: 'purple',
                features: ['Publications List', 'Grants & Funding', 'Committee Work', 'Service Activities']
            },
            {
                id: 'academic-4',
                name: 'Post-Doc Researcher',
                description: 'Research-focused CV highlighting publications, collaborations, and technical expertise',
                colorScheme: 'blue',
                features: ['Research Impact', 'Collaborations', 'Technical Skills', 'Lab Experience']
            }
        ]
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Find the resume instructor
        let instructor = await Admin.findOne({ role: 'resume_instructor' });
        if (!instructor) {
            console.log('Resume instructor not found, finding any admin');
            instructor = await Admin.findOne();
        }

        if (!instructor) {
            console.error('No admin found to assign templates to.');
            process.exit(1);
        }

        console.log(`Assigning templates to ${instructor.email}`);

        // Clear existing
        await AdminResume.deleteMany({});
        console.log('Cleared existing templates');

        // Insert new
        const docs = templates.map(t => ({
            ...t,
            createdBy: instructor._id,
            isActive: true,
            sections: [
                { key: 'personal', label: 'Personal Info', fields: ['fullName', 'email', 'phone', 'location', 'linkedin', 'github', 'portfolio'] },
                { key: 'experience', label: 'Experience', fields: ['company', 'position', 'location', 'startDate', 'endDate', 'description'] },
                { key: 'education', label: 'Education', fields: ['institution', 'degree', 'field', 'location', 'startDate', 'endDate', 'gpa'] },
                { key: 'skills', label: 'Skills', fields: ['technical', 'languages', 'tools'] },
                { key: 'projects', label: 'Projects', fields: ['name', 'description', 'technologies', 'link'] },
                { key: 'certifications', label: 'Certifications', fields: ['name', 'issuer', 'date', 'credentialId'] }
            ]
        }));

        await AdminResume.insertMany(docs);
        console.log(`Inserted ${docs.length} templates.`);

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

seed();
