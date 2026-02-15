// Enrich subject-level videos and pdfs by aggregating from units across data files
// Usage: node scripts/enrichSubjectMedia.cjs

const fs = require('fs');
const path = require('path');

const FILES = [
  path.join(__dirname, '..', 'src', 'data', 'semesterData.json'),
  path.join(__dirname, '..', 'src', 'data', 'semesterDataMedical.json'),
];

function ensureArray(x) {
  return Array.isArray(x) ? x : [];
}

function aggregateFromUnits(subject) {
  const units = ensureArray(subject.units);
  const unitVideos = units.flatMap(u => ensureArray(u.videos));
  const unitPdfs = units.flatMap(u => ensureArray(u.pdfs));
  return { unitVideos, unitPdfs };
}

function enrichSubject(subject) {
  const { unitVideos, unitPdfs } = aggregateFromUnits(subject);

  if (!Array.isArray(subject.videos) || subject.videos.length === 0) {
    if (unitVideos.length > 0) {
      subject.videos = unitVideos;
    } else if (!Array.isArray(subject.videos)) {
      subject.videos = [];
    }
  }

  if (!Array.isArray(subject.pdfs) || subject.pdfs.length === 0) {
    if (unitPdfs.length > 0) {
      subject.pdfs = unitPdfs;
    } else if (!Array.isArray(subject.pdfs)) {
      subject.pdfs = [];
    }
  }
}

function traverseBranch(branch) {
  if (!branch || !branch.semesters) return 0;
  let updated = 0;
  for (const semKey of Object.keys(branch.semesters)) {
    const sem = branch.semesters[semKey];
    const subjects = ensureArray(sem.subjects);
    subjects.forEach((subject) => {
      const beforeV = ensureArray(subject.videos).length;
      const beforeP = ensureArray(subject.pdfs).length;
      enrichSubject(subject);
      const afterV = ensureArray(subject.videos).length;
      const afterP = ensureArray(subject.pdfs).length;
      if (afterV !== beforeV || afterP !== beforeP) updated += 1;
    });
    sem.subjects = subjects;
  }
  return updated;
}

function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[skip] Not found: ${filePath}`);
    return;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(raw);

  let totalUpdated = 0;

  // Case 1: branches object present
  if (json.branches && typeof json.branches === 'object') {
    for (const key of Object.keys(json.branches)) {
      totalUpdated += traverseBranch(json.branches[key]);
    }
  }

  // Case 2: other top-level entries with semesters (e.g., 10th-grade)
  for (const key of Object.keys(json)) {
    if (key === 'branches') continue;
    const val = json[key];
    if (val && typeof val === 'object' && val.semesters) {
      totalUpdated += traverseBranch(val);
    }
  }

  if (totalUpdated > 0) {
    const backupPath = filePath + `.backup.${Date.now()}`;
    fs.writeFileSync(backupPath, raw, 'utf-8');
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
    console.log(`[updated] ${filePath} • subjects changed: ${totalUpdated} (backup: ${path.basename(backupPath)})`);
  } else {
    console.log(`[no-change] ${filePath} • nothing to update`);
  }
}

(function main() {
  console.log('Enriching subject media (videos/pdfs) from units...');
  FILES.forEach(processFile);
  console.log('Done.');
})();
