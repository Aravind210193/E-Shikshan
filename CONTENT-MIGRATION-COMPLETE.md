# Content Migration to Backend - Complete Guide

## 📋 Overview
All content JSON files have been migrated to the backend with full CRUD APIs and seed scripts.

## 🗂️ Models Created

### 1. Branch Model (`Branch.js`)
- **Fields**: title, link, description, isActive
- **Purpose**: Store branch information (CSE, ECE, CIVIL, MECH, etc.)

### 2. Education Level Model (`EducationLevel.js`)
- **Fields**: level, description, branches (array), isActive
- **Purpose**: Store education levels (10th, Intermediate, Undergraduate, Postgraduate)

### 3. Subject Model (`Subject.js`)
- **Fields**: branch, semester, subjects (array), isActive
- **Purpose**: Store subject lists for each branch and semester
- **Index**: Compound index on (branch, semester)

### 4. Semester Data Model (`SemesterData.js`)
- **Fields**: programKey, name, shortName, totalSemesters, color, description, semesters (Map), isActive
- **Purpose**: Store detailed semester-wise curriculum data
- **Contains**: Full syllabus with units, topics, hours per subject

### 5. Folder Model (`Folder.js`)
- **Fields**: branch, subject, units (array with title & link), isActive
- **Purpose**: Store PDF/study material links for each subject
- **Index**: Compound index on (branch, subject)

## 🚀 Seed Scripts

### Individual Seeders
```bash
npm run seed:branches           # Seed branches.json
npm run seed:education-levels   # Seed educationLevels.json
npm run seed:subjects           # Seed subjects.json
npm run seed:semester-data      # Seed semesterData.json
npm run seed:folders            # Seed folders.json
```

### Master Seeder (All Content at Once)
```bash
npm run seed:all-content        # Seeds all 5 content collections
```

### Complete Database Seed
```bash
npm run seed:all                # Seeds jobs, hackathons, content, roadmaps, resumes, AND all content
```

## 📡 API Endpoints

### Branches API (`/api/branches`)
```javascript
GET  /api/branches                  // Get all branches
GET  /api/branches/:id              // Get branch by ID
GET  /api/branches/title/:title     // Get branch by title (e.g., "CSE")
```

### Education Levels API (`/api/education-levels`)
```javascript
GET  /api/education-levels              // Get all education levels
GET  /api/education-levels/:id          // Get level by ID
GET  /api/education-levels/level/:level // Get level by name (e.g., "10th")
```

### Subjects API (`/api/subjects`)
```javascript
GET  /api/subjects                                  // Get all subjects (with optional query params)
GET  /api/subjects?branch=cs&semester=E1-S1        // Filter by branch and/or semester
GET  /api/subjects/branch/:branch                   // Get all subjects for a branch
GET  /api/subjects/branch/:branch/semester/:semester // Get subjects for specific branch & semester
```

### Programs API (`/api/programs`)
```javascript
GET  /api/programs                              // Get all programs
GET  /api/programs/:programKey                  // Get program by key (e.g., "10th-grade", "cse-btech")
GET  /api/programs/:programKey/semester/:number // Get specific semester data
```

### Folders API (`/api/folders`)
```javascript
GET  /api/folders                                  // Get all folders (with optional query params)
GET  /api/folders?branch=cs&subject=cla           // Filter by branch and/or subject
GET  /api/folders/branch/:branch                   // Get all folders for a branch
GET  /api/folders/branch/:branch/subject/:subject  // Get folder for specific branch & subject
```

## 💻 Frontend Integration

### Import in Components
```javascript
import { contentAPI } from '../services/api';
```

### Usage Examples

#### Get All Branches
```javascript
const { data } = await contentAPI.getAllBranches();
console.log(data.data); // Array of branches
```

#### Get Subjects for CSE Branch
```javascript
const { data } = await contentAPI.getSubjectsByBranch('cs');
console.log(data.data); // Array of semester-wise subjects
```

#### Get Specific Semester's Subjects
```javascript
const { data } = await contentAPI.getSubjectsByBranchAndSemester('cs', 'E1-S1');
console.log(data.data.subjects); // Array of subjects for CSE Semester 1
```

#### Get Program Details (e.g., 10th Grade)
```javascript
const { data } = await contentAPI.getProgramByKey('10th-grade');
console.log(data.data.semesters); // Map of semester data
```

#### Get Semester Curriculum
```javascript
const { data } = await contentAPI.getSemesterData('10th-grade', '1');
console.log(data.data.semesterData.subjects); // Detailed subject info with units
```

#### Get PDF Links for a Subject
```javascript
const { data } = await contentAPI.getFolderByBranchAndSubject('cs', 'cla');
console.log(data.data.units); // Array of unit PDFs
```

## 🔄 Migration Steps

### Backend Setup (Already Done ✅)
1. ✅ Created 5 models (Branch, EducationLevel, Subject, SemesterData, Folder)
2. ✅ Created 5 controllers with full CRUD operations
3. ✅ Created 5 route files with RESTful endpoints
4. ✅ Added routes to `app.js`
5. ✅ Created seed scripts (individual + master)
6. ✅ Copied JSON files to `server/client-data/`
7. ✅ Added seed commands to `package.json`

### Frontend Setup (Already Done ✅)
1. ✅ Added `contentAPI` to `src/services/api.js`
2. ✅ Exported all 5 resource APIs with full methods

## 🎯 Next Steps

### 1. Run the Seed Script
```bash
cd server
npm run seed:all-content
```

### 2. Update Frontend Pages
Replace local JSON imports with API calls in these pages:
- `Branches.jsx` - Use `contentAPI.getAllBranches()`
- `Content.jsx` - Use `contentAPI.getAllEducationLevels()`
- `Semesters.jsx` - Use `contentAPI.getSubjectsByBranch(branch)`
- `Subjects.jsx` - Use `contentAPI.getSubjectsByBranchAndSemester(branch, semester)`
- `SubjectUnits.jsx` - Use `contentAPI.getProgramByKey(programKey)`
- `Folders.jsx` - Use `contentAPI.getFolderByBranchAndSubject(branch, subject)`

### 3. Update Admin Panel
Add CRUD interfaces for:
- Branch Management
- Education Level Management  
- Subject Management
- Program/Curriculum Management
- Folder/PDF Management

## 📦 File Structure
```
server/
├── client-data/           # Copied JSON files
│   ├── branches.json
│   ├── educationLevels.json
│   ├── subjects.json
│   ├── semesterData.json
│   └── folders.json
├── src/
│   ├── models/
│   │   ├── Branch.js
│   │   ├── EducationLevel.js
│   │   ├── Subject.js
│   │   ├── SemesterData.js
│   │   └── Folder.js
│   ├── controllers/
│   │   ├── branchController.js
│   │   ├── educationLevelController.js
│   │   ├── subjectController.js
│   │   ├── semesterDataController.js
│   │   └── folderController.js
│   ├── routes/
│   │   ├── branchRoutes.js
│   │   ├── educationLevelRoutes.js
│   │   ├── subjectRoutes.js
│   │   ├── semesterDataRoutes.js
│   │   └── folderRoutes.js
│   └── seed/
│       ├── seedBranches.js
│       ├── seedEducationLevels.js
│       ├── seedSubjects.js
│       ├── seedSemesterData.js
│       ├── seedFolders.js
│       └── seedAllContent.js
└── app.js                 # Routes registered

client/
└── src/
    └── services/
        └── api.js         # contentAPI exported
```

## ✅ Testing APIs

### Using Browser/Postman
```
GET http://localhost:5000/api/branches
GET http://localhost:5000/api/education-levels
GET http://localhost:5000/api/subjects?branch=cs
GET http://localhost:5000/api/subjects/branch/cs/semester/E1-S1
GET http://localhost:5000/api/programs/10th-grade
GET http://localhost:5000/api/programs/10th-grade/semester/1
GET http://localhost:5000/api/folders/branch/cs/subject/cla
```

### Using Frontend
```javascript
// In any component
import { contentAPI } from '../services/api';

// Example: Fetch branches on mount
useEffect(() => {
  const fetchBranches = async () => {
    try {
      const response = await contentAPI.getAllBranches();
      setBranches(response.data.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };
  fetchBranches();
}, []);
```

## 🎉 Benefits
1. **Centralized Data**: All content in database instead of scattered JSON files
2. **Dynamic Updates**: Admin can update content without code deployment
3. **API-First**: Frontend fetches fresh data on every request
4. **Scalable**: Easy to add new fields, filters, sorting, pagination
5. **Consistent**: Same structure for all content types
6. **Searchable**: Can add full-text search across all content
7. **Versioning**: Track changes with timestamps
8. **Performance**: Database queries faster than file reads

## 🔐 Admin Features (Future)
- Add/Edit/Delete branches
- Manage education levels
- CRUD for subjects per semester
- Update curriculum (semester data)
- Manage PDF links and study materials
- Bulk upload/import
- Content versioning and approval workflow

---
**Status**: ✅ Backend complete | 🚀 Ready to seed | 🔧 Frontend integration pending
