require('dotenv').config();
const mongoose = require('mongoose');
const AdminContent = require('./src/models/AdminContent');
const connectDB = require('./src/config/db');
const fs = require('fs');
const path = require('path');

// Read the JSON data
const dataPath = path.join(__dirname, '../client/src/data/semesterData.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(rawData);

const seedFullContent = async () => {
    try {
        await connectDB();
        console.log('\n🚀 Seeding *FULL* AdminContent from semesterData.json...\n');

        // Optional: Clear existing content to avoid duplicates
        // await AdminContent.deleteMany({}); 

        let count = 0;

        // Helper to create content
        const createContent = async ({ title, type, branch, subject, semester, category, url, description, tags }) => {
            // Basic de-duplication
            const exists = await AdminContent.findOne({ title, branch, semester, type, subject });
            if (!exists) {
                await AdminContent.create({
                    title, type, branch, subject, semester, category, url, description, tags, status: 'published'
                });
                count++;
                // process.stdout.write('.');
            }
        };

        // 1. Process 10th Grade
        if (data['10th-grade']) {
            const gradeData = data['10th-grade'];
            const branchName = '10th-grade'; // Use this as branch identifier
            console.log(`Processing ${gradeData.name}...`);

            for (const [semKey, semData] of Object.entries(gradeData.semesters || {})) {
                for (const subj of semData.subjects || []) {
                    // Create GENERIC Subject Content
                    await createContent({
                        title: subj.name,
                        type: 'subject',
                        branch: branchName,
                        subject: subj.code || subj.name,
                        semester: semKey,
                        category: 'School',
                        description: `Type: ${subj.type}. Difficulty: ${subj.difficulty}`,
                        tags: ['10th', subj.type]
                    });

                    // Seed specifically for NCERT
                    await createContent({
                        title: `${subj.name} (NCERT)`,
                        type: 'subject',
                        branch: 'ncert',
                        subject: subj.code || subj.name,
                        semester: semKey,
                        category: 'School',
                        description: `NCERT Syllabus. Difficulty: ${subj.difficulty}`,
                        tags: ['10th', 'NCERT', subj.type]
                    });

                    // Seed specifically for State Board
                    await createContent({
                        title: `${subj.name} (State Board)`,
                        type: 'subject',
                        branch: 'state',
                        subject: subj.code || subj.name,
                        semester: semKey,
                        category: 'School',
                        description: `State Board Syllabus. Difficulty: ${subj.difficulty}`,
                        tags: ['10th', 'State', subj.type]
                    });

                    // Process Units for Videos/PDFs (Duplicate for boards too)
                    if (subj.units) {
                        for (const unit of subj.units) {
                            if (unit.videos) {
                                for (const vid of unit.videos) {
                                    // General
                                    await createContent({
                                        title: vid.title,
                                        type: 'video',
                                        branch: branchName,
                                        subject: subj.code || subj.name,
                                        semester: semKey,
                                        category: 'School',
                                        url: vid.url,
                                        description: vid.description || unit.title,
                                        tags: ['10th', 'video', unit.title]
                                    });
                                    // NCERT
                                    await createContent({
                                        title: `${vid.title} (NCERT)`,
                                        type: 'video',
                                        branch: 'ncert',
                                        subject: subj.code || subj.name,
                                        semester: semKey,
                                        category: 'School',
                                        url: vid.url,
                                        description: vid.description || unit.title,
                                        tags: ['10th', 'BCERT', 'video', unit.title]
                                    });
                                }
                            }
                            if (unit.pdfs) {
                                for (const pdf of unit.pdfs) {
                                    // General
                                    await createContent({
                                        title: pdf.title,
                                        type: 'pdf',
                                        branch: branchName,
                                        subject: subj.code || subj.name,
                                        semester: semKey,
                                        category: 'School',
                                        url: pdf.url,
                                        description: pdf.description || unit.title,
                                        tags: ['10th', 'pdf', unit.title]
                                    });
                                    // NCERT
                                    await createContent({
                                        title: `${pdf.title} (NCERT)`,
                                        type: 'pdf',
                                        branch: 'ncert',
                                        subject: subj.code || subj.name,
                                        semester: semKey,
                                        category: 'School',
                                        url: pdf.url,
                                        description: pdf.description || unit.title,
                                        tags: ['10th', 'NCERT', 'pdf', unit.title]
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }

        // 2. Process UG Branches
        if (data.branches) {
            for (const [branchKey, branchData] of Object.entries(data.branches)) {
                console.log(`Processing UG Branch: ${branchData.name}...`);
                for (const [semKey, semData] of Object.entries(branchData.semesters || {})) {
                    for (const subj of semData.subjects || []) {
                        await createContent({
                            title: subj.name,
                            type: 'subject',
                            branch: branchKey, // e.g., 'computer-science--engineering'
                            subject: subj.code || '',
                            semester: semKey,
                            category: 'UG',
                            description: `Credits: ${subj.credits}. Difficulty: ${subj.difficulty}`,
                            tags: ['UG', branchKey, subj.type]
                        });

                        // Add units/videos/pdfs if available
                        if (subj.units) {
                            for (const unit of subj.units) {
                                // Add Videos
                                if (unit.videos) {
                                    for (const vid of unit.videos) {
                                        await createContent({
                                            title: vid.title,
                                            type: 'video',
                                            branch: branchKey,
                                            subject: subj.code,
                                            semester: semKey,
                                            category: 'UG',
                                            url: vid.url,
                                            description: vid.description || unit.title,
                                            tags: ['Video', unit.title]
                                        });
                                    }
                                }
                                // Add PDFs
                                if (unit.pdfs) {
                                    for (const pdf of unit.pdfs) {
                                        await createContent({
                                            title: pdf.title,
                                            type: 'pdf',
                                            branch: branchKey,
                                            subject: subj.code,
                                            semester: semKey,
                                            category: 'UG',
                                            url: pdf.url,
                                            description: pdf.description || unit.title,
                                            tags: ['PDF', unit.title]
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // 3. Process Intermediate
        if (data.intermediate) {
            // Intermediate structure might be streams -> semesters OR just semesters if nested under streams
            // Let's assume data.intermediate is an object with stream keys like "mpc", "bipc"
            for (const [streamKey, streamData] of Object.entries(data.intermediate)) {
                // Check if it has 'semesters' or if it IS a stream object
                if (streamData.semesters) {
                    console.log(`Processing Intermediate Stream: ${streamData.name || streamKey}...`);
                    for (const [semKey, semData] of Object.entries(streamData.semesters || {})) {
                        for (const subj of semData.subjects || []) {
                            await createContent({
                                title: subj.name,
                                type: 'subject',
                                branch: streamKey, // e.g., 'mpc'
                                subject: subj.code || '',
                                semester: semKey,
                                category: 'Intermediate',
                                description: `Difficulty: ${subj.difficulty}`,
                                tags: ['Intermediate', streamKey]
                            });
                        }
                    }
                }
            }
        }

        // 4. Process Postgraduate
        if (data.postgraduate) {
            // Similar structure to branches usually
            for (const [progKey, progData] of Object.entries(data.postgraduate)) {
                if (progData.semesters) {
                    console.log(`Processing PG Program: ${progData.name || progKey}...`);
                    for (const [semKey, semData] of Object.entries(progData.semesters || {})) {
                        for (const subj of semData.subjects || []) {
                            await createContent({
                                title: subj.name,
                                type: 'subject',
                                branch: progKey, // e.g., 'mba'
                                subject: subj.code || '',
                                semester: semKey,
                                category: 'PG',
                                description: `Credits: ${subj.credits}`,
                                tags: ['PG', progKey]
                            });

                            // Add Units/Media if available
                            if (subj.units) {
                                for (const unit of subj.units) {
                                    if (unit.videos) {
                                        for (const vid of unit.videos) {
                                            await createContent({
                                                title: vid.title,
                                                type: 'video',
                                                branch: progKey,
                                                subject: subj.code,
                                                semester: semKey,
                                                category: 'PG',
                                                url: vid.url,
                                                description: vid.description || unit.title,
                                                tags: ['PG', 'Video']
                                            });
                                        }
                                    }
                                    if (unit.pdfs) {
                                        for (const pdf of unit.pdfs) {
                                            await createContent({
                                                title: pdf.title,
                                                type: 'pdf',
                                                branch: progKey,
                                                subject: subj.code,
                                                semester: semKey,
                                                category: 'PG',
                                                url: pdf.url,
                                                description: pdf.description || unit.title,
                                                tags: ['PG', 'PDF']
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log(`\n✅ Successfully seeded/verified ${count} content items across all levels.`);

        // 5. SEED DETAILED CSE DATA
        try {
            const cseDataPath = path.join(__dirname, '../client/src/data/complete_cse_data.json');
            if (fs.existsSync(cseDataPath)) {
                console.log('\n🚀 Seeding *DETAILED CSE* data from complete_cse_data.json...\n');
                const rawCse = fs.readFileSync(cseDataPath, 'utf-8');
                const cseData = JSON.parse(rawCse);

                // Usually cseData is an object with semesters keys like "semester-1", etc.
                for (const [semKey, semContent] of Object.entries(cseData)) {
                    // Extract sem number from key "semester-1" -> "1"
                    const semNum = semKey.split('-')[1];

                    if (semContent.subjects) {
                        for (const subj of semContent.subjects) {
                            // Create Subject
                            await createContent({
                                title: subj.name,
                                type: 'subject',
                                branch: 'computer-science--engineering',
                                subject: subj.code || subj.name,
                                semester: semNum,
                                category: 'UG',
                                description: `Detailed CSE Subject. Credits: ${subj.credits}`,
                                tags: ['UG', 'CSE', 'Detailed', subj.type]
                            });

                            if (subj.units) {
                                for (const unit of subj.units) {
                                    // Videos
                                    if (unit.videos) {
                                        for (const vid of unit.videos) {
                                            await createContent({
                                                title: vid.title,
                                                type: 'video',
                                                branch: 'computer-science--engineering',
                                                subject: subj.code || subj.name,
                                                semester: semNum,
                                                category: 'UG',
                                                url: vid.url,
                                                description: vid.description || unit.title,
                                                tags: ['UG', 'CSE', 'Video', unit.title]
                                            });
                                        }
                                    }
                                    // PDFs
                                    if (unit.pdfs) { // Assuming structure matches or adapts
                                        for (const pdf of unit.pdfs) {
                                            await createContent({
                                                title: pdf.title,
                                                type: 'pdf',
                                                branch: 'computer-science--engineering',
                                                subject: subj.code || subj.name,
                                                semester: semNum,
                                                category: 'UG',
                                                url: pdf.url,
                                                description: pdf.description || unit.title,
                                                tags: ['UG', 'CSE', 'PDF', unit.title]
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Error reading extra CSE data:", e.message);
        }

        // 6. SEED COURSE MODULES (UG/PG/Medical)
        try {
            const courseModulesPath = path.join(__dirname, '../client/src/data/courseModulesData.json');
            if (fs.existsSync(courseModulesPath)) {
                console.log('\n🚀 Seeding *COURSE MODULES* from courseModulesData.json...\n');
                const rawModules = fs.readFileSync(courseModulesPath, 'utf-8');
                const modulesData = JSON.parse(rawModules);

                // Helper to process courses
                const processCourses = async (category, branchName, courses) => {
                    if (!courses) return;
                    for (const course of courses) {
                        // Seed Course as Subject
                        await createContent({
                            title: course.title,
                            type: 'subject',
                            branch: branchName,
                            subject: course.courseCode || course.title,
                            semester: '1', // Defaulting as semester isn't explicit in this file structure often
                            category: category,
                            description: course.description || `Course Code: ${course.courseCode}`,
                            tags: [category, branchName, 'Course']
                        });

                        if (course.modules) {
                            for (const mod of course.modules) {
                                // Videos
                                if (mod.videos) {
                                    for (const vid of mod.videos) {
                                        await createContent({
                                            title: vid.title,
                                            type: 'video',
                                            branch: branchName,
                                            subject: course.courseCode || course.title,
                                            semester: '1',
                                            category: category,
                                            url: vid.url,
                                            description: vid.description || mod.title,
                                            tags: [category, branchName, 'Video', mod.title]
                                        });
                                    }
                                }
                                // Resources (PDFs)
                                if (mod.resources) {
                                    for (const res of mod.resources) {
                                        await createContent({
                                            title: res.title,
                                            type: 'pdf',
                                            branch: branchName,
                                            subject: course.courseCode || course.title,
                                            semester: '1',
                                            category: category,
                                            url: res.url,
                                            description: res.description || mod.title,
                                            tags: [category, branchName, 'PDF', mod.title]
                                        });
                                    }
                                }
                            }
                        }
                    }
                };

                // Undergraduate
                if (modulesData.undergraduate) {
                    for (const [key, val] of Object.entries(modulesData.undergraduate)) {
                        await processCourses('UG', val.branch || key, val.courses);
                    }
                }
                // Postgraduate
                if (modulesData.postgraduate) {
                    for (const [key, val] of Object.entries(modulesData.postgraduate)) {
                        await processCourses('PG', val.branch || key, val.courses);
                    }
                }
                // Medical (from courseModulesData)
                if (modulesData.medical) {
                    for (const [key, val] of Object.entries(modulesData.medical)) {
                        await processCourses('Medical', val.branch || key, val.courses);
                    }
                }

            }
        } catch (e) {
            console.error("Error reading courseModulesData:", e.message);
        }

        // 7. SEED DETAILED MEDICAL DATA
        try {
            const medicalPath = path.join(__dirname, '../client/src/data/semesterDataMedical.json');
            if (fs.existsSync(medicalPath)) {
                console.log('\n🚀 Seeding *MEDICAL DATA* from semesterDataMedical.json...\n');
                const rawMed = fs.readFileSync(medicalPath, 'utf-8');
                const medData = JSON.parse(rawMed);

                if (medData.branches) {
                    for (const [branchKey, branchVal] of Object.entries(medData.branches)) {
                        const branchName = branchVal.name || branchKey;
                        if (branchVal.semesters) {
                            for (const [semKey, semVal] of Object.entries(branchVal.semesters)) {
                                // Handle nested structure if 'subjects' is inside 'semVal' directly or inside 'semVal' object
                                // Structure seems to be: semesters -> "1" -> { name:..., subjects: [] }
                                const subjects = semVal.subjects || [];

                                for (const subj of subjects) {
                                    // Subject
                                    await createContent({
                                        title: subj.name,
                                        type: 'subject',
                                        branch: branchName,
                                        subject: subj.code || subj.name,
                                        semester: semKey,
                                        category: 'Medical',
                                        description: `Credits: ${subj.credits}. Type: ${subj.type}`,
                                        tags: ['Medical', branchKey, 'Subject']
                                    });

                                    // Videos
                                    if (subj.videos) {
                                        for (const vid of subj.videos) {
                                            await createContent({
                                                title: vid.title,
                                                type: 'video',
                                                branch: branchName,
                                                subject: subj.code || subj.name,
                                                semester: semKey,
                                                category: 'Medical',
                                                url: vid.url,
                                                description: `Duration: ${vid.duration}`,
                                                tags: ['Medical', branchKey, 'Video']
                                            });
                                        }
                                    }
                                    // PDFs
                                    if (subj.pdfs) {
                                        for (const pdf of subj.pdfs) {
                                            await createContent({
                                                title: pdf.title,
                                                type: 'pdf',
                                                branch: branchName,
                                                subject: subj.code || subj.name,
                                                semester: semKey,
                                                category: 'Medical',
                                                url: pdf.url,
                                                description: `Pages: ${pdf.pages}`,
                                                tags: ['Medical', branchKey, 'PDF']
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Error reading semesterDataMedical:", e.message);
        }


        console.log(`\n✅ Validated all data sources. Total items: ${count}`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seedFullContent();
