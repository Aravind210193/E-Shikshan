const fs = require('fs');

const roadmaps = [
  {
    "id": "frontend-developer",
    "title": "Frontend Developer",
    "category": "Web Development",
    "tagline": "Build beautiful and interactive user interfaces for the web.",
    "image": "/indiegame.png",
    "duration": "12-16 weeks",
    "difficulty": "Beginner-Friendly",
    "popularity": "Very Popular",
    "description": "Frontend developers create the user-facing side of websites and applications that users interact with directly. This roadmap will guide you through the essential technologies and concepts required to become a modern frontend developer.",
    "path": [
      {
        "title": "HTML & CSS Foundations",
        "description": "Learn the fundamental building blocks of all websites, focusing on structure and style.",
        "topics": ["Semantic HTML5", "CSS Box Model", "Flexbox", "Grid", "Responsive Design", "Accessibility Basics", "CSS Variables", "Media Queries"],
        "resources": [
          "MDN Web Docs: HTML Basics",
          "CSS-Tricks: Complete Guide to Flexbox",
          "web.dev: Learn Responsive Design",
          "Frontend Masters: HTML & CSS Basics"
        ],
        "project": "Build a personal portfolio website from scratch with responsive design."
      }
    ]
  }
];

// Write the JSON file
fs.writeFileSync('src/Roadmap/skills.json', JSON.stringify(roadmaps, null, 2));
console.log('JSON file written successfully!');