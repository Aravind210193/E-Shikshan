import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Clock, Users, Star, Award, BookOpen, ChevronDown, X, TrendingUp, Zap, Heart, PlayCircle, CheckCircle, FileText, Video, Download, Calendar, Globe, Lock, Play, ExternalLink } from 'lucide-react';

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeCommentBox, setActiveCommentBox] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [activeProjectCommentBox, setActiveProjectCommentBox] = useState(null);
  const [projectCommentText, setProjectCommentText] = useState({});

  // Mock course data (edX-style)
  const courses = [
    {
      id: 1,
      title: "Introduction to Computer Science",
      provider: "MIT",
      category: "Computer Science",
      level: "Beginner",
      duration: "12 weeks",
      rating: 4.8,
      students: 125000,
      price: "Free",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop",
      description: "Learn the basics of computer science and programming",
      skills: ["Python", "Algorithms", "Problem Solving"],
      instructor: "Dr. John Smith",
      instructorBio: "Professor of Computer Science at MIT with 20+ years of experience",
      syllabus: [
        { week: 1, title: "Introduction to Programming", topics: ["Variables", "Data Types", "Control Flow"] },
        { week: 2, title: "Functions and Modules", topics: ["Function Basics", "Parameters", "Return Values"] },
        { week: 3, title: "Data Structures", topics: ["Lists", "Dictionaries", "Sets"] },
        { week: 4, title: "Object-Oriented Programming", topics: ["Classes", "Objects", "Inheritance"] }
      ],
      prerequisites: ["Basic computer skills", "No prior programming experience required"],
      whatYoullLearn: [
        "Core programming concepts and problem-solving techniques",
        "Python programming language fundamentals",
        "Algorithm design and analysis",
        "Software development best practices"
      ],
      certificate: true,
      language: "English",
      subtitles: ["English", "Spanish", "French"],
      totalVideos: 48,
      totalQuizzes: 12,
      projects: 4,
      videoLectures: [
        { id: 1, title: "Course Introduction", duration: "10:30", free: true },
        { id: 2, title: "Setting Up Your Environment", duration: "15:20", free: true },
        { id: 3, title: "Variables and Data Types", duration: "22:45", free: true },
        { id: 4, title: "Control Flow Statements", duration: "18:30", free: false },
        { id: 5, title: "Functions Deep Dive", duration: "25:10", free: false },
        { id: 6, title: "Working with Lists", duration: "20:15", free: false }
      ],
      assignments: [
        { id: 1, title: "Hello World Program", difficulty: "Easy", points: 10 },
        { id: 2, title: "Calculator Application", difficulty: "Medium", points: 20 },
        { id: 3, title: "Data Analysis Project", difficulty: "Hard", points: 30 }
      ],
      projectsDetails: [
        { 
          id: 1, 
          title: "Build a To-Do List App", 
          description: "Create a functional to-do list application with full CRUD operations", 
          duration: "2 weeks",
          instructions: "Build a complete to-do list application. Requirements: 1) Create a responsive user interface, 2) Implement add, edit, delete, and mark as complete functionality, 3) Add local storage to persist tasks, 4) Include filter options (all, active, completed), 5) Add due date functionality, 6) Implement task categories or tags. Focus on clean code and user experience.",
          deadline: "2 weeks"
        },
        { 
          id: 2, 
          title: "Web Scraper", 
          description: "Build a web scraper using Python and BeautifulSoup", 
          duration: "1 week",
          instructions: "Create a web scraping application. Your task: 1) Choose a target website (e.g., news site, e-commerce), 2) Use BeautifulSoup to parse HTML content, 3) Extract specific data (headlines, prices, etc.), 4) Store data in CSV or JSON format, 5) Handle errors and edge cases, 6) Add rate limiting to be respectful. Document your code and explain your approach.",
          deadline: "1 week"
        },
        { 
          id: 3, 
          title: "Data Visualization Dashboard", 
          description: "Create interactive data visualizations using modern libraries", 
          duration: "2 weeks",
          instructions: "Build an interactive dashboard for data analysis. Steps: 1) Choose a dataset (COVID-19, weather, stocks, etc.), 2) Use libraries like Chart.js or D3.js for visualizations, 3) Create at least 5 different chart types (line, bar, pie, scatter, etc.), 4) Add interactive filters and controls, 5) Make it responsive for all devices, 6) Include data export functionality. Present insights from your analysis.",
          deadline: "2 weeks"
        },
        { 
          id: 4, 
          title: "Final Capstone Project", 
          description: "Comprehensive project combining all course concepts", 
          duration: "3 weeks",
          instructions: "Create a full-stack application of your choice. Requirements: 1) Plan your project with wireframes and database schema, 2) Implement frontend using modern framework (React, Vue, etc.), 3) Build backend API with proper authentication, 4) Use a database (MongoDB, PostgreSQL, etc.), 5) Deploy your application to cloud platform, 6) Write comprehensive documentation including setup instructions, API docs, and user guide. Present your project with a demo video.",
          deadline: "3 weeks"
        }
      ]
    },
    {
      id: 2,
      title: "Machine Learning Fundamentals",
      provider: "Stanford",
      category: "Data Science",
      level: "Intermediate",
      duration: "8 weeks",
      rating: 4.9,
      students: 98000,
      price: "₹3,999",
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
      description: "Master the fundamentals of machine learning and AI",
      skills: ["Machine Learning", "Python", "TensorFlow"],
      instructor: "Prof. Andrew Ng",
      instructorBio: "Co-founder of Coursera, former head of Google Brain and Baidu AI",
      syllabus: [
        { week: 1, title: "Introduction to ML", topics: ["Supervised Learning", "Unsupervised Learning"] },
        { week: 2, title: "Linear Regression", topics: ["Cost Function", "Gradient Descent"] },
        { week: 3, title: "Neural Networks", topics: ["Deep Learning Basics", "Backpropagation"] },
        { week: 4, title: "Model Evaluation", topics: ["Accuracy Metrics", "Cross-Validation"] }
      ],
      prerequisites: ["Basic Python", "Linear Algebra", "Statistics"],
      whatYoullLearn: [
        "Machine learning algorithms and techniques",
        "Neural networks and deep learning",
        "Model training and evaluation",
        "Real-world ML applications"
      ],
      certificate: true,
      language: "English",
      subtitles: ["English", "Chinese", "Spanish"],
      totalVideos: 56,
      totalQuizzes: 15,
      projects: 5,
      videoLectures: [
        { id: 1, title: "Introduction to Machine Learning", duration: "12:00", free: false, url: "https://www.youtube.com/watch?v=aircAruvnKk" },
        { id: 2, title: "Understanding Supervised Learning", duration: "18:45", free: false, url: "https://www.youtube.com/watch?v=CqOfi41LfDw" },
        { id: 3, title: "Linear Regression Theory", duration: "25:30", free: false, url: "https://www.youtube.com/watch?v=nk2CQITm_eo" },
        { id: 4, title: "Gradient Descent Algorithm", duration: "20:15", free: false, url: "https://www.youtube.com/watch?v=IHZwWFHWa-w" },
        { id: 5, title: "Neural Networks Basics", duration: "28:20", free: false, url: "https://www.youtube.com/watch?v=ZzWaow1Rvho" },
        { id: 6, title: "Model Evaluation Techniques", duration: "22:10", free: false, url: "https://www.youtube.com/watch?v=85dtiMz9tSo" }
      ],
      assignments: [
        { 
          id: 1, 
          title: "Linear Regression Implementation", 
          difficulty: "Medium", 
          points: 25,
          instructions: "Implement a linear regression model from scratch using Python and NumPy. Your task: 1) Load the provided dataset, 2) Implement cost function, 3) Implement gradient descent, 4) Train the model and visualize results, 5) Calculate R² score and MSE. Submit your Python notebook with all code, visualizations, and a brief analysis of your results.",
          deadline: "1 week"
        },
        { 
          id: 2, 
          title: "Neural Network from Scratch", 
          difficulty: "Hard", 
          points: 40,
          instructions: "Build a neural network without using high-level frameworks. Requirements: 1) Implement forward propagation, 2) Implement backpropagation algorithm, 3) Create activation functions (sigmoid, ReLU), 4) Train on MNIST dataset, 5) Achieve at least 85% accuracy. Include detailed comments explaining each step and submit a report documenting your approach and results.",
          deadline: "2 weeks"
        },
        { 
          id: 3, 
          title: "Model Optimization Challenge", 
          difficulty: "Hard", 
          points: 35,
          instructions: "Optimize a pre-trained model for better performance. Tasks: 1) Analyze the baseline model performance, 2) Experiment with different optimizers (SGD, Adam, RMSprop), 3) Implement learning rate scheduling, 4) Apply regularization techniques (L1, L2, Dropout), 5) Compare results and document improvements. Submit optimization report with graphs showing performance metrics.",
          deadline: "10 days"
        }
      ],
      projectsDetails: [
        { 
          id: 1, 
          title: "House Price Prediction", 
          description: "Build a regression model for price prediction using real estate data", 
          duration: "2 weeks",
          instructions: "Create a machine learning model to predict house prices. Steps: 1) Load and explore the housing dataset, 2) Perform data preprocessing (handle missing values, encode categorical variables), 3) Feature engineering (create new features from existing ones), 4) Train multiple regression models (Linear, Ridge, Lasso, Random Forest), 5) Compare model performance using metrics (RMSE, R², MAE), 6) Create visualizations showing predictions vs actual prices. Submit your notebook with detailed analysis and model comparison.",
          deadline: "2 weeks"
        },
        { 
          id: 2, 
          title: "Image Classification", 
          description: "Create a CNN for classifying images into multiple categories", 
          duration: "3 weeks",
          instructions: "Build a Convolutional Neural Network for image classification. Requirements: 1) Use a dataset like CIFAR-10 or Fashion-MNIST, 2) Design CNN architecture with multiple conv layers, 3) Implement data augmentation techniques, 4) Use transfer learning with pre-trained models (VGG, ResNet), 5) Train and validate your model, 6) Achieve at least 80% accuracy on test set. Include confusion matrix and classification report in your submission.",
          deadline: "3 weeks"
        },
        { 
          id: 3, 
          title: "NLP Sentiment Analysis", 
          description: "Analyze sentiment in text data using natural language processing", 
          duration: "2 weeks",
          instructions: "Create a sentiment analysis system for text classification. Tasks: 1) Choose a dataset (movie reviews, tweets, product reviews), 2) Perform text preprocessing (tokenization, stopword removal, stemming), 3) Implement TF-IDF or word embeddings, 4) Train classifiers (Naive Bayes, LSTM, BERT), 5) Evaluate model performance, 6) Build a simple web interface for real-time sentiment prediction. Document your findings and model selection rationale.",
          deadline: "2 weeks"
        },
        { 
          id: 4, 
          title: "Recommender System", 
          description: "Build a movie recommendation engine using collaborative filtering", 
          duration: "2 weeks",
          instructions: "Develop a recommendation system for movies or products. Requirements: 1) Use MovieLens or similar dataset, 2) Implement collaborative filtering (user-based and item-based), 3) Try matrix factorization techniques (SVD, ALS), 4) Build content-based filtering as alternative, 5) Create hybrid recommendation system, 6) Evaluate using metrics (RMSE, precision@k, recall@k). Create a demo showing personalized recommendations for different users.",
          deadline: "2 weeks"
        },
        { 
          id: 5, 
          title: "ML Research Project", 
          description: "Complete research project with comprehensive paper and implementation", 
          duration: "4 weeks",
          instructions: "Conduct an original machine learning research project. Process: 1) Identify a research problem or improvement to existing methods, 2) Review related literature and existing approaches, 3) Design your methodology and experiments, 4) Implement your solution with proper evaluation, 5) Write a research paper (abstract, introduction, methodology, results, conclusion), 6) Create presentation slides. Your submission should include code, paper (5-8 pages), and presentation demonstrating your contribution to the field.",
          deadline: "4 weeks"
        }
      ]
    },
    {
      id: 3,
      title: "Web Development Bootcamp",
      provider: "Harvard",
      category: "Web Development",
      level: "Beginner",
      duration: "16 weeks",
      rating: 4.7,
      students: 156000,
      price: "Free",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
      description: "Complete guide to modern web development",
      skills: ["HTML", "CSS", "JavaScript", "React"],
      instructor: "Sarah Johnson",
      certificate: true,
      language: "English",
      subtitles: ["English", "Spanish", "French"],
      totalVideos: 85,
      totalQuizzes: 20,
      projects: 6,
      whatYoullLearn: [
        "Build responsive websites with HTML5 and CSS3",
        "Master JavaScript fundamentals and ES6+ features",
        "Create dynamic UIs with React and Redux",
        "Work with APIs and asynchronous JavaScript",
        "Deploy applications to production",
        "Best practices for modern web development"
      ],
      syllabus: [
        { week: 1, title: "HTML & CSS Basics", topics: ["HTML structure", "CSS styling", "Flexbox", "Grid"] },
        { week: 2, title: "JavaScript Fundamentals", topics: ["Variables", "Functions", "Arrays", "Objects"] },
        { week: 3, title: "DOM Manipulation", topics: ["DOM API", "Events", "Forms"] },
        { week: 4, title: "React Introduction", topics: ["Components", "Props", "State", "Hooks"] }
      ],
      prerequisites: [
        "Basic computer skills",
        "No prior programming experience required",
        "Willingness to learn"
      ],
      instructorBio: "Sarah Johnson is a senior full-stack developer with 12 years of experience building web applications for Fortune 500 companies.",
      videoLectures: [
        { id: 1, title: "Introduction to HTML", duration: "15:30", free: true, url: "https://www.youtube.com/watch?v=pQN-pnXPaVg" },
        { id: 2, title: "CSS Basics & Styling", duration: "22:45", free: true, url: "https://www.youtube.com/watch?v=1Rs2ND1ryYc" },
        { id: 3, title: "Flexbox Layout System", duration: "18:20", free: true, url: "https://www.youtube.com/watch?v=JJSoEo8JSnc" },
        { id: 4, title: "CSS Grid Advanced", duration: "25:10", free: true, url: "https://www.youtube.com/watch?v=EFafSYg-PkI" },
        { id: 5, title: "JavaScript Variables & Data Types", duration: "20:00", free: true, url: "https://www.youtube.com/watch?v=hdI2bqOjy3c" },
        { id: 6, title: "Functions and Scope", duration: "23:45", free: true, url: "https://www.youtube.com/watch?v=N8ap4k_1QEQ" },
        { id: 7, title: "Arrays and Objects", duration: "28:30", free: true, url: "https://www.youtube.com/watch?v=OrNQZUZKjwc" },
        { id: 8, title: "DOM Manipulation Techniques", duration: "26:15", free: true, url: "https://www.youtube.com/watch?v=5fb2aPlgoys" }
      ],
      assignments: [
        { 
          id: 1, 
          title: "Build a Landing Page", 
          difficulty: "Easy", 
          points: 20,
          instructions: "Create a responsive landing page for a product/service of your choice. Requirements: 1) Use semantic HTML5 elements, 2) Implement a navigation bar, hero section, features section, and footer, 3) Style with CSS (Flexbox/Grid), 4) Make it mobile-responsive (use media queries), 5) Add hover effects and smooth scrolling. The page should look professional and be fully responsive on all devices.",
          deadline: "5 days"
        },
        { 
          id: 2, 
          title: "JavaScript Calculator", 
          difficulty: "Medium", 
          points: 30,
          instructions: "Build a functional calculator using HTML, CSS, and vanilla JavaScript. Features needed: 1) Basic operations (+, -, *, /), 2) Clear and delete buttons, 3) Decimal point support, 4) Keyboard input support, 5) Display previous operation, 6) Handle edge cases (division by zero, etc.). Focus on clean code structure and proper event handling.",
          deadline: "1 week"
        },
        { 
          id: 3, 
          title: "Interactive Todo App", 
          difficulty: "Medium", 
          points: 35,
          instructions: "Create a full-featured todo application. Requirements: 1) Add, edit, and delete tasks, 2) Mark tasks as complete/incomplete, 3) Filter tasks (All, Active, Completed), 4) Use localStorage for data persistence, 5) Add due dates and priority levels, 6) Implement search functionality. Include CSS animations for smooth transitions.",
          deadline: "10 days"
        },
        { 
          id: 4, 
          title: "React Shopping Cart", 
          difficulty: "Hard", 
          points: 50,
          instructions: "Build a shopping cart application using React. Features: 1) Display product list with images and prices, 2) Add/remove items from cart, 3) Update item quantities, 4) Calculate total price with tax, 5) Use React hooks (useState, useEffect, useContext), 6) Implement proper component structure, 7) Add local storage integration, 8) Create responsive design. Submit with component documentation.",
          deadline: "2 weeks"
        }
      ],
      projectsDetails: [
        { id: 1, title: "Personal Portfolio Website", description: "Create a responsive portfolio using HTML & CSS", duration: "1 week", repoUrl: "https://github.com/web-bootcamp/portfolio-project", starterCode: "https://github.com/web-bootcamp/portfolio-starter" },
        { id: 2, title: "Weather App", description: "Build a weather application using API integration", duration: "2 weeks", repoUrl: "https://github.com/web-bootcamp/weather-app", starterCode: "https://github.com/web-bootcamp/weather-starter" },
        { id: 3, title: "Blog Platform", description: "Full-stack blog with authentication", duration: "3 weeks", repoUrl: "https://github.com/web-bootcamp/blog-platform", starterCode: "https://github.com/web-bootcamp/blog-starter" },
        { id: 4, title: "E-commerce Store", description: "Complete shopping platform with React", duration: "4 weeks", repoUrl: "https://github.com/web-bootcamp/ecommerce", starterCode: "https://github.com/web-bootcamp/ecommerce-starter" },
        { id: 5, title: "Social Media Dashboard", description: "Analytics dashboard with real-time data", duration: "3 weeks", repoUrl: "https://github.com/web-bootcamp/dashboard", starterCode: "https://github.com/web-bootcamp/dashboard-starter" },
        { id: 6, title: "Final Capstone Project", description: "Build your own web application idea", duration: "4 weeks", repoUrl: "https://github.com/web-bootcamp/capstone", starterCode: "https://github.com/web-bootcamp/capstone-template" }
      ]
    },
    {
      id: 4,
      title: "Data Structures and Algorithms",
      provider: "UC Berkeley",
      category: "Computer Science",
      level: "Intermediate",
      duration: "10 weeks",
      rating: 4.6,
      students: 87000,
      price: "₹2,999",
      thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop",
      description: "Master essential data structures and algorithms",
      skills: ["Algorithms", "Data Structures", "Java"],
      instructor: "Dr. Emily Chen",
      certificate: true,
      language: "English",
      subtitles: ["English", "Mandarin"],
      totalVideos: 48,
      totalQuizzes: 18,
      projects: 4,
      whatYoullLearn: [
        "Implement fundamental data structures",
        "Analyze algorithm complexity and performance",
        "Solve complex coding problems efficiently",
        "Master sorting and searching algorithms",
        "Understand graph and tree algorithms",
        "Prepare for technical interviews"
      ],
      syllabus: [
        { week: 1, title: "Arrays and Linked Lists", topics: ["Array operations", "Linked list types", "Memory management"] },
        { week: 2, title: "Stacks and Queues", topics: ["Stack ADT", "Queue implementations", "Applications"] },
        { week: 3, title: "Trees and Graphs", topics: ["Binary trees", "Graph representations", "Tree traversals"] },
        { week: 4, title: "Sorting Algorithms", topics: ["QuickSort", "MergeSort", "HeapSort", "Time complexity"] }
      ],
      prerequisites: [
        "Basic programming knowledge (Java or Python)",
        "Understanding of basic math concepts",
        "Familiarity with object-oriented programming"
      ],
      instructorBio: "Dr. Emily Chen is a professor of Computer Science at UC Berkeley with 15 years of teaching experience and published research in algorithm optimization.",
      videoLectures: [
        { id: 1, title: "Introduction to Data Structures", duration: "16:45", free: false },
        { id: 2, title: "Arrays and Dynamic Arrays", duration: "24:30", free: false },
        { id: 3, title: "Linked Lists Implementation", duration: "28:15", free: false },
        { id: 4, title: "Stack Data Structure", duration: "22:20", free: false },
        { id: 5, title: "Queue and Priority Queue", duration: "26:40", free: false },
        { id: 6, title: "Binary Search Trees", duration: "32:15", free: false }
      ],
      assignments: [
        { id: 1, title: "Implement Dynamic Array", difficulty: "Medium", points: 25 },
        { id: 2, title: "LinkedList Operations", difficulty: "Medium", points: 30 },
        { id: 3, title: "Binary Tree Traversals", difficulty: "Hard", points: 40 }
      ],
      projectsDetails: [
        { id: 1, title: "Custom HashMap", description: "Build your own hash table implementation", duration: "2 weeks" },
        { id: 2, title: "Graph Algorithms Library", description: "Implement BFS, DFS, and shortest path algorithms", duration: "3 weeks" },
        { id: 3, title: "Sorting Visualizer", description: "Create visual tool for sorting algorithms", duration: "2 weeks" },
        { id: 4, title: "Algorithm Competition", description: "Solve advanced competitive programming problems", duration: "2 weeks" }
      ]
    },
    {
      id: 5,
      title: "Cloud Computing with AWS",
      provider: "Amazon",
      category: "Cloud Computing",
      level: "Advanced",
      duration: "6 weeks",
      rating: 4.8,
      students: 72000,
      price: "₹7,999",
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
      description: "Learn AWS cloud services and architecture",
      skills: ["AWS", "Cloud Architecture", "DevOps"],
      instructor: "Michael Brown",
      certificate: true,
      language: "English",
      subtitles: ["English", "Japanese", "German"],
      totalVideos: 38,
      totalQuizzes: 14,
      projects: 5,
      whatYoullLearn: [
        "Design scalable cloud architectures",
        "Master AWS core services (EC2, S3, RDS, Lambda)",
        "Implement security best practices",
        "Automate deployments with CloudFormation",
        "Monitor and optimize cloud costs",
        "Prepare for AWS Solutions Architect certification"
      ],
      syllabus: [
        { week: 1, title: "AWS Fundamentals", topics: ["IAM", "VPC", "EC2 basics", "S3 storage"] },
        { week: 2, title: "Compute Services", topics: ["EC2 advanced", "Lambda", "ECS", "Auto Scaling"] },
        { week: 3, title: "Database Services", topics: ["RDS", "DynamoDB", "ElastiCache"] },
        { week: 4, title: "DevOps & Deployment", topics: ["CloudFormation", "CodePipeline", "Monitoring"] }
      ],
      prerequisites: [
        "Understanding of networking basics",
        "Experience with Linux command line",
        "Basic knowledge of web servers and databases"
      ],
      instructorBio: "Michael Brown is an AWS certified Solutions Architect with 8 years at Amazon, designing cloud infrastructure for enterprise clients.",
      videoLectures: [
        { id: 1, title: "AWS Cloud Overview", duration: "18:30", free: false },
        { id: 2, title: "IAM and Security Fundamentals", duration: "25:45", free: false },
        { id: 3, title: "EC2 Instance Management", duration: "30:20", free: false },
        { id: 4, title: "S3 Storage Solutions", duration: "22:15", free: false },
        { id: 5, title: "Lambda Serverless Functions", duration: "28:40", free: false },
        { id: 6, title: "VPC and Networking", duration: "26:50", free: false }
      ],
      assignments: [
        { id: 1, title: "Deploy Web App on EC2", difficulty: "Medium", points: 30 },
        { id: 2, title: "S3 Static Website Hosting", difficulty: "Easy", points: 20 },
        { id: 3, title: "Serverless API with Lambda", difficulty: "Hard", points: 45 }
      ],
      projectsDetails: [
        { id: 1, title: "Multi-Tier Web Application", description: "Deploy a full-stack app with load balancing", duration: "2 weeks" },
        { id: 2, title: "Serverless Architecture", description: "Build event-driven serverless application", duration: "2 weeks" },
        { id: 3, title: "Data Pipeline with AWS", description: "Create ETL pipeline using AWS services", duration: "3 weeks" },
        { id: 4, title: "Microservices on ECS", description: "Deploy containerized microservices", duration: "3 weeks" },
        { id: 5, title: "Cloud Migration Project", description: "Migrate legacy app to AWS cloud", duration: "4 weeks" }
      ]
    },
    {
      id: 6,
      title: "Digital Marketing Masterclass",
      provider: "Google",
      category: "Business",
      level: "Beginner",
      duration: "8 weeks",
      rating: 4.5,
      students: 110000,
      price: "Free",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      description: "Complete digital marketing strategy course",
      skills: ["SEO", "Social Media", "Analytics"],
      instructor: "Lisa Anderson",
      certificate: true,
      language: "English",
      subtitles: ["English", "Spanish"],
      totalVideos: 42,
      totalQuizzes: 12,
      projects: 4,
      whatYoullLearn: [
        "Create effective digital marketing strategies",
        "Master SEO and content marketing",
        "Run successful social media campaigns",
        "Analyze marketing data and metrics",
        "Email marketing best practices",
        "Paid advertising on Google and Facebook"
      ],
      syllabus: [
        { week: 1, title: "Digital Marketing Fundamentals", topics: ["Marketing basics", "Customer journey", "Digital channels"] },
        { week: 2, title: "SEO & Content Marketing", topics: ["Keyword research", "On-page SEO", "Link building"] },
        { week: 3, title: "Social Media Marketing", topics: ["Platform strategies", "Content creation", "Engagement"] },
        { week: 4, title: "Analytics & Optimization", topics: ["Google Analytics", "A/B testing", "ROI measurement"] }
      ],
      prerequisites: [
        "Basic internet and social media knowledge",
        "No marketing experience required"
      ],
      instructorBio: "Lisa Anderson is a Google-certified digital marketing expert with 10 years of experience helping brands grow online.",
      videoLectures: [
        { id: 1, title: "Introduction to Digital Marketing", duration: "14:20", free: true },
        { id: 2, title: "Understanding Your Target Audience", duration: "18:30", free: true },
        { id: 3, title: "SEO Fundamentals", duration: "22:15", free: true },
        { id: 4, title: "Keyword Research Strategies", duration: "20:45", free: true },
        { id: 5, title: "Social Media Platform Overview", duration: "16:30", free: true },
        { id: 6, title: "Content Creation Tips", duration: "19:20", free: true }
      ],
      assignments: [
        { id: 1, title: "Create Marketing Strategy", difficulty: "Easy", points: 15 },
        { id: 2, title: "SEO Audit Report", difficulty: "Medium", points: 25 },
        { id: 3, title: "Social Media Campaign Plan", difficulty: "Medium", points: 30 }
      ],
      projectsDetails: [
        { id: 1, title: "Brand Analysis Project", description: "Analyze a brand's digital presence", duration: "1 week" },
        { id: 2, title: "SEO Content Strategy", description: "Create a comprehensive SEO content plan", duration: "2 weeks" },
        { id: 3, title: "Social Media Campaign", description: "Plan and execute a full social campaign", duration: "2 weeks" },
        { id: 4, title: "Marketing Analytics Report", description: "Analyze campaign data and present insights", duration: "2 weeks" }
      ]
    },
    {
      id: 7,
      title: "Blockchain and Cryptocurrency",
      provider: "MIT",
      category: "Blockchain",
      level: "Intermediate",
      duration: "12 weeks",
      rating: 4.7,
      students: 65000,
      price: "₹6,499",
      thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop",
      description: "Understanding blockchain technology and crypto",
      skills: ["Blockchain", "Solidity", "Smart Contracts"],
      instructor: "Prof. David Lee",
      certificate: true,
      language: "English",
      subtitles: ["English", "Korean", "Portuguese"],
      totalVideos: 52,
      totalQuizzes: 16,
      projects: 5,
      whatYoullLearn: [
        "Understand blockchain fundamentals and consensus mechanisms",
        "Develop smart contracts with Solidity",
        "Build decentralized applications (DApps)",
        "Analyze cryptocurrency markets and trading",
        "Implement blockchain security best practices",
        "Explore NFTs and DeFi protocols"
      ],
      syllabus: [
        { week: 1, title: "Blockchain Basics", topics: ["Distributed ledgers", "Consensus algorithms", "Cryptography"] },
        { week: 2, title: "Cryptocurrency Fundamentals", topics: ["Bitcoin", "Ethereum", "Altcoins", "Wallets"] },
        { week: 3, title: "Smart Contracts", topics: ["Solidity basics", "Contract deployment", "Testing"] },
        { week: 4, title: "DeFi and NFTs", topics: ["DeFi protocols", "NFT standards", "Web3 integration"] }
      ],
      prerequisites: [
        "Basic programming experience",
        "Understanding of basic cryptography",
        "Familiarity with JavaScript recommended"
      ],
      instructorBio: "Prof. David Lee is a blockchain researcher at MIT with extensive experience in cryptocurrency development and blockchain protocol design.",
      videoLectures: [
        { id: 1, title: "Introduction to Blockchain", duration: "20:15", free: false },
        { id: 2, title: "Bitcoin Architecture Deep Dive", duration: "28:45", free: false },
        { id: 3, title: "Ethereum and Smart Contracts", duration: "32:20", free: false },
        { id: 4, title: "Solidity Programming Basics", duration: "35:30", free: false },
        { id: 5, title: "Building Your First DApp", duration: "40:15", free: false },
        { id: 6, title: "DeFi Protocols Overview", duration: "25:40", free: false }
      ],
      assignments: [
        { id: 1, title: "Build Simple Blockchain", difficulty: "Medium", points: 30 },
        { id: 2, title: "Create ERC-20 Token", difficulty: "Hard", points: 40 },
        { id: 3, title: "Smart Contract Security Audit", difficulty: "Hard", points: 45 }
      ],
      projectsDetails: [
        { id: 1, title: "Cryptocurrency Wallet", description: "Build a secure crypto wallet application", duration: "2 weeks" },
        { id: 2, title: "Token ICO Platform", description: "Create a token sale smart contract", duration: "3 weeks" },
        { id: 3, title: "NFT Marketplace", description: "Build a marketplace for trading NFTs", duration: "4 weeks" },
        { id: 4, title: "DeFi Lending Protocol", description: "Implement a decentralized lending platform", duration: "4 weeks" },
        { id: 5, title: "DAO Governance System", description: "Create a decentralized autonomous organization", duration: "3 weeks" }
      ]
    },
    {
      id: 8,
      title: "UX/UI Design Principles",
      provider: "Stanford",
      category: "Design",
      level: "Beginner",
      duration: "6 weeks",
      rating: 4.9,
      students: 95000,
      price: "₹3,999",
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
      description: "Create beautiful and intuitive user experiences",
      skills: ["Figma", "UI Design", "User Research"],
      instructor: "Jessica White",
      certificate: true,
      language: "English",
      subtitles: ["English", "French", "Italian"],
      totalVideos: 36,
      totalQuizzes: 10,
      projects: 4,
      whatYoullLearn: [
        "Master UI design principles and best practices",
        "Conduct effective user research and testing",
        "Create wireframes and prototypes in Figma",
        "Design responsive and accessible interfaces",
        "Build design systems and style guides",
        "Understand user psychology and behavior"
      ],
      syllabus: [
        { week: 1, title: "Design Fundamentals", topics: ["Color theory", "Typography", "Layout principles"] },
        { week: 2, title: "User Research", topics: ["User interviews", "Personas", "Journey mapping"] },
        { week: 3, title: "Wireframing & Prototyping", topics: ["Figma basics", "Low-fi wireframes", "Interactive prototypes"] },
        { week: 4, title: "Visual Design", topics: ["UI patterns", "Design systems", "Accessibility"] }
      ],
      prerequisites: [
        "Basic understanding of design concepts",
        "No prior design software experience required",
        "Creative mindset and attention to detail"
      ],
      instructorBio: "Jessica White is a lead UX designer at a Fortune 500 company with 9 years of experience creating award-winning digital experiences.",
      videoLectures: [
        { id: 1, title: "Introduction to UX/UI Design", duration: "16:30", free: false },
        { id: 2, title: "Design Thinking Process", duration: "22:15", free: false },
        { id: 3, title: "Color Theory for Designers", duration: "19:45", free: false },
        { id: 4, title: "Typography Best Practices", duration: "21:30", free: false },
        { id: 5, title: "User Research Methods", duration: "25:20", free: false },
        { id: 6, title: "Figma Interface Tour", duration: "18:40", free: false }
      ],
      assignments: [
        { id: 1, title: "Design System Creation", difficulty: "Medium", points: 30 },
        { id: 2, title: "User Research Report", difficulty: "Easy", points: 20 },
        { id: 3, title: "Mobile App Redesign", difficulty: "Hard", points: 40 }
      ],
      projectsDetails: [
        { id: 1, title: "Portfolio Website Design", description: "Design a personal portfolio with Figma", duration: "2 weeks" },
        { id: 2, title: "Mobile Banking App", description: "Create a complete mobile app design", duration: "3 weeks" },
        { id: 3, title: "E-commerce Redesign", description: "Redesign an existing e-commerce platform", duration: "3 weeks" },
        { id: 4, title: "Design System Project", description: "Build a comprehensive design system", duration: "2 weeks" }
      ]
    },
    {
      id: 9,
      title: "Cybersecurity Essentials",
      provider: "IBM",
      category: "Cybersecurity",
      level: "Intermediate",
      duration: "10 weeks",
      rating: 4.6,
      students: 58000,
      price: "₹7,299",
      thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
      description: "Protect systems and networks from threats",
      skills: ["Security", "Networking", "Ethical Hacking"],
      instructor: "Robert Martinez",
      certificate: true,
      language: "English",
      subtitles: ["English", "German", "Russian"],
      totalVideos: 45,
      totalQuizzes: 15,
      projects: 4,
      whatYoullLearn: [
        "Understand common cybersecurity threats and vulnerabilities",
        "Implement network security best practices",
        "Perform penetration testing and ethical hacking",
        "Secure web applications and databases",
        "Respond to security incidents effectively",
        "Prepare for CompTIA Security+ certification"
      ],
      syllabus: [
        { week: 1, title: "Security Fundamentals", topics: ["CIA triad", "Threat landscape", "Risk management"] },
        { week: 2, title: "Network Security", topics: ["Firewalls", "VPNs", "IDS/IPS", "Network monitoring"] },
        { week: 3, title: "Application Security", topics: ["OWASP Top 10", "SQL injection", "XSS attacks"] },
        { week: 4, title: "Ethical Hacking", topics: ["Penetration testing", "Vulnerability scanning", "Exploitation"] }
      ],
      prerequisites: [
        "Basic networking knowledge",
        "Understanding of operating systems (Linux/Windows)",
        "Familiarity with command line interfaces"
      ],
      instructorBio: "Robert Martinez is a senior cybersecurity consultant at IBM with 12 years of experience protecting enterprise systems and training security professionals.",
      videoLectures: [
        { id: 1, title: "Introduction to Cybersecurity", duration: "17:45", free: false },
        { id: 2, title: "Understanding Cyber Threats", duration: "23:30", free: false },
        { id: 3, title: "Network Security Basics", duration: "26:15", free: false },
        { id: 4, title: "Firewall Configuration", duration: "28:40", free: false },
        { id: 5, title: "Web Application Security", duration: "31:20", free: false },
        { id: 6, title: "Penetration Testing Tools", duration: "29:50", free: false }
      ],
      assignments: [
        { id: 1, title: "Network Vulnerability Assessment", difficulty: "Medium", points: 30 },
        { id: 2, title: "Web App Security Audit", difficulty: "Hard", points: 40 },
        { id: 3, title: "Incident Response Plan", difficulty: "Medium", points: 35 }
      ],
      projectsDetails: [
        { id: 1, title: "Network Security Design", description: "Design a secure corporate network", duration: "2 weeks" },
        { id: 2, title: "Penetration Testing Lab", description: "Perform ethical hacking on test environment", duration: "3 weeks" },
        { id: 3, title: "Security Monitoring System", description: "Implement SIEM and monitoring tools", duration: "3 weeks" },
        { id: 4, title: "Incident Response Simulation", description: "Handle a simulated security breach", duration: "2 weeks" }
      ]
    },
    {
      id: 10,
      title: "Full Stack JavaScript Development",
      provider: "Meta",
      category: "Web Development",
      level: "Intermediate",
      duration: "14 weeks",
      rating: 4.8,
      students: 142000,
      price: "₹2,999",
      thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400&h=250&fit=crop",
      description: "Master MERN stack and modern JavaScript",
      skills: ["MongoDB", "Express", "React", "Node.js"],
      instructor: "Alex Turner",
      certificate: true,
      language: "English",
      subtitles: ["English", "Hindi", "Spanish"],
      totalVideos: 72,
      totalQuizzes: 18,
      projects: 6,
      whatYoullLearn: [
        "Build full-stack applications with MERN stack",
        "Master modern JavaScript ES6+ features",
        "Create RESTful APIs with Express.js",
        "Handle authentication and authorization",
        "Deploy applications to cloud platforms",
        "Implement real-time features with Socket.io"
      ],
      syllabus: [
        { week: 1, title: "JavaScript Advanced Concepts", topics: ["Async/Await", "Promises", "Closures", "Prototypes"] },
        { week: 2, title: "Node.js & Express", topics: ["Server setup", "Routing", "Middleware", "REST APIs"] },
        { week: 3, title: "MongoDB & Mongoose", topics: ["Database design", "CRUD operations", "Relationships"] },
        { week: 4, title: "React & Redux", topics: ["State management", "Hooks", "Context API", "Redux toolkit"] }
      ],
      prerequisites: [
        "HTML, CSS, and JavaScript basics",
        "Understanding of web fundamentals",
        "Git and version control knowledge"
      ],
      instructorBio: "Alex Turner is a senior full-stack developer at Meta with 10 years of experience building scalable web applications.",
      videoLectures: [
        { id: 1, title: "JavaScript ES6+ Features", duration: "24:30", free: false },
        { id: 2, title: "Node.js Environment Setup", duration: "18:45", free: false },
        { id: 3, title: "Building REST APIs", duration: "32:20", free: false },
        { id: 4, title: "MongoDB Database Design", duration: "28:15", free: false },
        { id: 5, title: "React Components Deep Dive", duration: "35:40", free: false },
        { id: 6, title: "State Management with Redux", duration: "30:25", free: false }
      ],
      assignments: [
        { id: 1, title: "Build REST API", difficulty: "Medium", points: 30 },
        { id: 2, title: "User Authentication System", difficulty: "Hard", points: 40 },
        { id: 3, title: "Full Stack Blog App", difficulty: "Hard", points: 45 }
      ],
      projectsDetails: [
        { id: 1, title: "Task Management App", description: "Build a full-stack task manager with authentication", duration: "2 weeks" },
        { id: 2, title: "E-commerce Platform", description: "Create a complete shopping site with payment", duration: "4 weeks" },
        { id: 3, title: "Social Media App", description: "Build a social network with real-time features", duration: "4 weeks" },
        { id: 4, title: "Job Portal", description: "Create a job listing and application platform", duration: "3 weeks" },
        { id: 5, title: "Video Streaming Service", description: "Build a video platform with subscriptions", duration: "4 weeks" },
        { id: 6, title: "Real-time Chat Application", description: "Implement WebSocket-based chat with rooms", duration: "2 weeks" }
      ]
    },
    {
      id: 11,
      title: "Artificial Intelligence Fundamentals",
      provider: "DeepLearning.AI",
      category: "Data Science",
      level: "Advanced",
      duration: "10 weeks",
      rating: 4.9,
      students: 89000,
      price: "₹5,999",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
      description: "Deep dive into AI and neural networks",
      skills: ["Deep Learning", "Neural Networks", "TensorFlow", "PyTorch"],
      instructor: "Dr. Andrew Chen",
      certificate: true,
      language: "English",
      subtitles: ["English", "Hindi", "Mandarin"],
      totalVideos: 58,
      totalQuizzes: 20,
      projects: 5,
      whatYoullLearn: [
        "Understand neural network architectures",
        "Implement deep learning models",
        "Master TensorFlow and PyTorch",
        "Build computer vision applications",
        "Create natural language processing models",
        "Deploy AI models to production"
      ],
      syllabus: [
        { week: 1, title: "AI & ML Foundations", topics: ["AI history", "ML basics", "Neural networks intro"] },
        { week: 2, title: "Deep Learning", topics: ["CNNs", "RNNs", "LSTMs", "Transformers"] },
        { week: 3, title: "Computer Vision", topics: ["Image classification", "Object detection", "Segmentation"] },
        { week: 4, title: "NLP & Transformers", topics: ["BERT", "GPT", "Attention mechanism", "Transfer learning"] }
      ],
      prerequisites: [
        "Strong Python programming skills",
        "Linear algebra and calculus",
        "Machine learning basics",
        "Understanding of statistics"
      ],
      instructorBio: "Dr. Andrew Chen is an AI researcher with PhD from Stanford and has published 50+ papers in top ML conferences.",
      videoLectures: [
        { id: 1, title: "Introduction to AI", duration: "22:30", free: false },
        { id: 2, title: "Neural Networks Architecture", duration: "34:45", free: false },
        { id: 3, title: "Convolutional Neural Networks", duration: "38:20", free: false },
        { id: 4, title: "Natural Language Processing", duration: "42:15", free: false },
        { id: 5, title: "Transformer Models", duration: "36:40", free: false },
        { id: 6, title: "Model Deployment", duration: "28:25", free: false }
      ],
      assignments: [
        { id: 1, title: "Build CNN Classifier", difficulty: "Hard", points: 40 },
        { id: 2, title: "NLP Sentiment Analysis", difficulty: "Hard", points: 45 },
        { id: 3, title: "Transfer Learning Project", difficulty: "Hard", points: 50 }
      ],
      projectsDetails: [
        { id: 1, title: "Image Classification System", description: "Build CNN for image recognition", duration: "3 weeks" },
        { id: 2, title: "Chatbot with NLP", description: "Create conversational AI assistant", duration: "3 weeks" },
        { id: 3, title: "Object Detection App", description: "Implement YOLO for real-time detection", duration: "4 weeks" },
        { id: 4, title: "Text Generation Model", description: "Build GPT-style language model", duration: "4 weeks" },
        { id: 5, title: "AI Research Project", description: "Original research with paper publication", duration: "5 weeks" }
      ]
    },
    {
      id: 12,
      title: "Mobile App Development with Flutter",
      provider: "Google",
      category: "Mobile Development",
      level: "Beginner",
      duration: "8 weeks",
      rating: 4.7,
      students: 125000,
      price: "Free",
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
      description: "Build beautiful cross-platform mobile apps",
      skills: ["Flutter", "Dart", "Mobile UI", "Firebase"],
      instructor: "Sarah Kim",
      certificate: true,
      language: "English",
      subtitles: ["English", "Hindi", "Korean"],
      totalVideos: 55,
      totalQuizzes: 14,
      projects: 5,
      whatYoullLearn: [
        "Master Flutter framework and Dart language",
        "Create beautiful responsive mobile UIs",
        "Implement state management solutions",
        "Integrate Firebase backend services",
        "Build and deploy iOS and Android apps",
        "Handle platform-specific features"
      ],
      syllabus: [
        { week: 1, title: "Flutter Basics", topics: ["Dart language", "Widgets", "Layouts", "Navigation"] },
        { week: 2, title: "State Management", topics: ["Provider", "Riverpod", "Bloc pattern", "GetX"] },
        { week: 3, title: "Firebase Integration", topics: ["Authentication", "Firestore", "Storage", "Cloud functions"] },
        { week: 4, title: "Advanced Features", topics: ["Animations", "Platform channels", "Native code", "Publishing"] }
      ],
      prerequisites: [
        "Basic programming knowledge",
        "Understanding of mobile UI concepts",
        "No prior Flutter experience needed"
      ],
      instructorBio: "Sarah Kim is a Google Developer Expert for Flutter with 7 years of mobile development experience.",
      videoLectures: [
        { id: 1, title: "Introduction to Flutter", duration: "20:30", free: true },
        { id: 2, title: "Dart Programming Basics", duration: "25:45", free: true },
        { id: 3, title: "Flutter Widgets", duration: "28:20", free: true },
        { id: 4, title: "State Management", duration: "32:15", free: true },
        { id: 5, title: "Firebase Setup", duration: "24:40", free: true },
        { id: 6, title: "Building Layouts", duration: "30:25", free: true }
      ],
      assignments: [
        { id: 1, title: "Build Calculator App", difficulty: "Easy", points: 20 },
        { id: 2, title: "Todo App with Firebase", difficulty: "Medium", points: 30 },
        { id: 3, title: "Social Media Clone", difficulty: "Hard", points: 40 }
      ],
      projectsDetails: [
        { id: 1, title: "Weather App", description: "Create app with API integration", duration: "1 week" },
        { id: 2, title: "Recipe Finder", description: "Build food recipe browsing app", duration: "2 weeks" },
        { id: 3, title: "Fitness Tracker", description: "Health and workout tracking app", duration: "3 weeks" },
        { id: 4, title: "Chat Application", description: "Real-time messaging with Firebase", duration: "3 weeks" },
        { id: 5, title: "E-commerce Mobile App", description: "Complete shopping app with payments", duration: "4 weeks" }
      ]
    },
    {
      id: 13,
      title: "DevOps Engineering Bootcamp",
      provider: "Linux Foundation",
      category: "Cloud Computing",
      level: "Intermediate",
      duration: "12 weeks",
      rating: 4.8,
      students: 78000,
      price: "₹6,999",
      thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop",
      description: "Master CI/CD, Docker, Kubernetes, and cloud",
      skills: ["Docker", "Kubernetes", "Jenkins", "Terraform"],
      instructor: "John Smith",
      certificate: true,
      language: "English",
      subtitles: ["English", "Hindi", "German"],
      totalVideos: 65,
      totalQuizzes: 17,
      projects: 6,
      whatYoullLearn: [
        "Containerize applications with Docker",
        "Orchestrate containers with Kubernetes",
        "Build CI/CD pipelines",
        "Infrastructure as Code with Terraform",
        "Monitor and log applications",
        "Implement security best practices"
      ],
      syllabus: [
        { week: 1, title: "DevOps Fundamentals", topics: ["DevOps culture", "Linux basics", "Git workflows"] },
        { week: 2, title: "Containerization", topics: ["Docker", "Docker Compose", "Container registries"] },
        { week: 3, title: "Kubernetes", topics: ["Pods", "Services", "Deployments", "Helm"] },
        { week: 4, title: "CI/CD & IaC", topics: ["Jenkins", "GitLab CI", "Terraform", "Ansible"] }
      ],
      prerequisites: [
        "Basic Linux/Unix knowledge",
        "Understanding of networking",
        "Experience with cloud platforms",
        "Basic scripting skills"
      ],
      instructorBio: "John Smith is a DevOps architect with 12 years of experience and certified in AWS, Azure, and Kubernetes.",
      videoLectures: [
        { id: 1, title: "DevOps Introduction", duration: "18:30", free: false },
        { id: 2, title: "Docker Fundamentals", duration: "28:45", free: false },
        { id: 3, title: "Kubernetes Architecture", duration: "35:20", free: false },
        { id: 4, title: "CI/CD Pipeline Design", duration: "32:15", free: false },
        { id: 5, title: "Infrastructure as Code", duration: "38:40", free: false },
        { id: 6, title: "Monitoring & Logging", duration: "26:25", free: false }
      ],
      assignments: [
        { id: 1, title: "Dockerize Application", difficulty: "Medium", points: 30 },
        { id: 2, title: "Deploy to Kubernetes", difficulty: "Hard", points: 40 },
        { id: 3, title: "Build CI/CD Pipeline", difficulty: "Hard", points: 45 }
      ],
      projectsDetails: [
        { id: 1, title: "Containerized Microservices", description: "Dockerize multi-service application", duration: "2 weeks" },
        { id: 2, title: "Kubernetes Deployment", description: "Deploy app cluster with K8s", duration: "3 weeks" },
        { id: 3, title: "Automated CI/CD", description: "Build complete automation pipeline", duration: "3 weeks" },
        { id: 4, title: "Infrastructure Automation", description: "Terraform multi-cloud setup", duration: "3 weeks" },
        { id: 5, title: "Monitoring Solution", description: "Implement Prometheus & Grafana", duration: "2 weeks" },
        { id: 6, title: "Production Grade System", description: "Deploy enterprise-ready platform", duration: "4 weeks" }
      ]
    },
    {
      id: 14,
      title: "Python for Data Analytics",
      provider: "IBM",
      category: "Data Science",
      level: "Beginner",
      duration: "6 weeks",
      rating: 4.6,
      students: 156000,
      price: "Free",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      description: "Analyze data with Python, Pandas, and NumPy",
      skills: ["Python", "Pandas", "NumPy", "Matplotlib"],
      instructor: "Maria Rodriguez",
      certificate: true,
      language: "English",
      subtitles: ["English", "Hindi", "Spanish"],
      totalVideos: 42,
      totalQuizzes: 12,
      projects: 4,
      whatYoullLearn: [
        "Master Python programming fundamentals",
        "Data manipulation with Pandas",
        "Statistical analysis with NumPy",
        "Data visualization with Matplotlib",
        "Clean and prepare real-world datasets",
        "Build data-driven insights and reports"
      ],
      syllabus: [
        { week: 1, title: "Python Basics", topics: ["Syntax", "Data types", "Control flow", "Functions"] },
        { week: 2, title: "NumPy & Arrays", topics: ["Arrays", "Broadcasting", "Linear algebra", "Statistics"] },
        { week: 3, title: "Pandas DataFrames", topics: ["Series", "DataFrames", "Indexing", "Grouping"] },
        { week: 4, title: "Data Visualization", topics: ["Matplotlib", "Seaborn", "Plots", "Dashboards"] }
      ],
      prerequisites: [
        "Basic computer skills",
        "No programming experience required",
        "Interest in data analysis"
      ],
      instructorBio: "Maria Rodriguez is a data scientist at IBM with 8 years of experience in analytics and business intelligence.",
      videoLectures: [
        { id: 1, title: "Python Introduction", duration: "16:30", free: true },
        { id: 2, title: "Working with NumPy", duration: "22:45", free: true },
        { id: 3, title: "Pandas Basics", duration: "26:20", free: true },
        { id: 4, title: "Data Cleaning", duration: "24:15", free: true },
        { id: 5, title: "Visualization Techniques", duration: "28:40", free: true },
        { id: 6, title: "Exploratory Data Analysis", duration: "30:25", free: true }
      ],
      assignments: [
        { id: 1, title: "Data Cleaning Exercise", difficulty: "Easy", points: 20 },
        { id: 2, title: "Statistical Analysis", difficulty: "Medium", points: 25 },
        { id: 3, title: "Visualization Dashboard", difficulty: "Medium", points: 30 }
      ],
      projectsDetails: [
        { id: 1, title: "Sales Data Analysis", description: "Analyze retail sales patterns", duration: "2 weeks" },
        { id: 2, title: "Customer Segmentation", description: "Segment customers using clustering", duration: "2 weeks" },
        { id: 3, title: "Financial Report", description: "Create automated financial reports", duration: "2 weeks" },
        { id: 4, title: "Web Scraping Project", description: "Collect and analyze web data", duration: "2 weeks" }
      ]
    },
    {
      id: 15,
      title: "Game Development with Unity",
      provider: "Unity Technologies",
      category: "Game Development",
      level: "Intermediate",
      duration: "10 weeks",
      rating: 4.8,
      students: 94000,
      price: "₹4,999",
      thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=250&fit=crop",
      description: "Create 2D and 3D games with Unity engine",
      skills: ["Unity", "C#", "Game Design", "3D Modeling"],
      instructor: "Chris Johnson",
      certificate: true,
      language: "English",
      subtitles: ["English", "Hindi", "Japanese"],
      totalVideos: 68,
      totalQuizzes: 15,
      projects: 5,
      whatYoullLearn: [
        "Master Unity game engine",
        "Program gameplay with C#",
        "Create 2D and 3D games",
        "Implement physics and animations",
        "Design game mechanics and levels",
        "Publish games to multiple platforms"
      ],
      syllabus: [
        { week: 1, title: "Unity Basics", topics: ["Unity interface", "GameObjects", "Components", "Scenes"] },
        { week: 2, title: "C# Programming", topics: ["C# syntax", "Scripts", "Events", "Coroutines"] },
        { week: 3, title: "2D Game Development", topics: ["Sprites", "2D physics", "Animations", "Tilemaps"] },
        { week: 4, title: "3D Game Development", topics: ["3D models", "Materials", "Lighting", "Particle systems"] }
      ],
      prerequisites: [
        "Basic programming knowledge",
        "Understanding of game concepts",
        "C# or similar language experience helpful"
      ],
      instructorBio: "Chris Johnson is a Unity certified developer who has shipped 15+ games and worked on AAA titles.",
      videoLectures: [
        { id: 1, title: "Unity Introduction", duration: "20:30", free: false },
        { id: 2, title: "C# for Unity", duration: "28:45", free: false },
        { id: 3, title: "2D Game Mechanics", duration: "32:20", free: false },
        { id: 4, title: "3D Environments", duration: "36:15", free: false },
        { id: 5, title: "Physics & Collisions", duration: "26:40", free: false },
        { id: 6, title: "Game Optimization", duration: "24:25", free: false }
      ],
      assignments: [
        { id: 1, title: "Platformer Prototype", difficulty: "Medium", points: 30 },
        { id: 2, title: "3D Racing Game", difficulty: "Hard", points: 40 },
        { id: 3, title: "Multiplayer Game", difficulty: "Hard", points: 45 }
      ],
      projectsDetails: [
        { id: 1, title: "2D Platformer Game", description: "Build complete 2D platform game", duration: "3 weeks" },
        { id: 2, title: "3D FPS Game", description: "Create first-person shooter", duration: "4 weeks" },
        { id: 3, title: "Mobile Puzzle Game", description: "Design match-3 style puzzle game", duration: "2 weeks" },
        { id: 4, title: "VR Experience", description: "Build virtual reality demo", duration: "3 weeks" },
        { id: 5, title: "Complete Game Project", description: "Polish and publish original game", duration: "4 weeks" }
      ]
    }
  ];

  const categories = ['All', 'Computer Science', 'Data Science', 'Web Development', 'Business', 'Design', 'Cloud Computing', 'Blockchain', 'Cybersecurity', 'Mobile Development', 'Game Development'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const durations = ['All', '4-6 weeks', '7-10 weeks', '11+ weeks'];

  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.provider.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Level filter
    if (selectedLevel !== 'All') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    // Duration filter
    if (selectedDuration !== 'All') {
      const weeks = parseInt(course => course.duration);
      if (selectedDuration === '4-6 weeks') {
        filtered = filtered.filter(course => {
          const w = parseInt(course.duration);
          return w >= 4 && w <= 6;
        });
      } else if (selectedDuration === '7-10 weeks') {
        filtered = filtered.filter(course => {
          const w = parseInt(course.duration);
          return w >= 7 && w <= 10;
        });
      } else if (selectedDuration === '11+ weeks') {
        filtered = filtered.filter(course => {
          const w = parseInt(course.duration);
          return w >= 11;
        });
      }
    }

    // Sort
    if (sortBy === 'popular') {
      filtered = [...filtered].sort((a, b) => b.students - a.students);
    } else if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      filtered = [...filtered].sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedLevel, selectedDuration, sortBy]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <div className="relative h-80 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=400&fit=crop')" }}>
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[1px]"></div>
        <div className="relative max-w-7xl mx-auto h-full flex items-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center w-full"
          >
            <h1 className="text-5xl font-bold mb-4">Explore Top Courses</h1>
            <p className="text-xl text-white/90 mb-8">Learn from the world's best universities and companies</p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="What do you want to learn today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700"
                >
                  {showFilters ? <X size={20} /> : <Filter size={20} />}
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Category Filter */}
                <div className="bg-slate-800 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <BookOpen size={18} className="text-indigo-400" />
                    Category
                  </h3>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                          selectedCategory === cat
                            ? 'bg-indigo-600 text-white'
                            : 'hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div className="bg-slate-800 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp size={18} className="text-green-400" />
                    Level
                  </h3>
                  <div className="space-y-2">
                    {levels.map(level => (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(level)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                          selectedLevel === level
                            ? 'bg-green-600 text-white'
                            : 'hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration Filter */}
                <div className="bg-slate-800 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock size={18} className="text-yellow-400" />
                    Duration
                  </h3>
                  <div className="space-y-2">
                    {durations.map(duration => (
                      <button
                        key={duration}
                        onClick={() => setSelectedDuration(duration)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                          selectedDuration === duration
                            ? 'bg-yellow-600 text-white'
                            : 'hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Courses Grid */}
          <main className="lg:col-span-3">
            {/* Sort and Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-400">
                {filteredCourses.length} courses found
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 group"
                >
                  {/* Course Image */}
                  <div className="relative h-40 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${course.thumbnail})` }}>
                    <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/10 transition-all"></div>
                    <div className="absolute top-2 right-2">
                      <button className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors">
                        <Heart size={18} />
                      </button>
                    </div>
                    {course.price === 'Free' && (
                      <div className="absolute top-2 left-2 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                        FREE
                      </div>
                    )}
                  </div>

                  {/* Course Content */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-indigo-400 font-semibold">{course.provider}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Instructor */}
                    <p className="text-xs text-slate-500 mb-3">by {course.instructor}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {course.skills.slice(0, 3).map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-slate-700 text-xs rounded-full text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={16} fill="currentColor" />
                        <span className="font-semibold">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Users size={16} />
                        <span>{(course.students / 1000).toFixed(0)}k</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock size={16} />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    {/* Level Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        course.level === 'Beginner' ? 'bg-green-900/50 text-green-400' :
                        course.level === 'Intermediate' ? 'bg-yellow-900/50 text-yellow-400' :
                        'bg-red-900/50 text-red-400'
                      }`}>
                        {course.level}
                      </span>
                      <span className="font-bold text-indigo-400">{course.price}</span>
                    </div>

                    {/* Enroll Button */}
                    <button 
                      onClick={() => setSelectedCourse(course)}
                      className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
                    >
                      Enroll Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* No Results */}
            {filteredCourses.length === 0 && (
              <div className="text-center py-16">
                <BookOpen size={64} className="mx-auto text-slate-600 mb-4" />
                <h3 className="text-2xl font-bold mb-2">No courses found</h3>
                <p className="text-slate-400">Try adjusting your filters or search query</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Course Detail Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
            onClick={() => setSelectedCourse(null)}
          >
            <div className="min-h-screen px-4 py-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-5xl mx-auto bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url(${selectedCourse.thumbnail})` }}>
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-10"
                  >
                    <X size={24} />
                  </button>
                  
                  <div className="relative h-full flex items-center px-8">
                    <div className="flex-1">
                      <span className="text-sm text-white/80 font-semibold">{selectedCourse.provider}</span>
                      <h2 className="text-3xl font-bold mt-2 mb-3">{selectedCourse.title}</h2>
                      <p className="text-lg text-white/90 mb-4">{selectedCourse.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star size={16} fill="currentColor" className="text-yellow-400" />
                          <span className="font-bold">{selectedCourse.rating}</span>
                          <span className="text-white/70">({(selectedCourse.students / 1000).toFixed(0)}k students)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{selectedCourse.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Globe size={16} />
                          <span>{selectedCourse.language}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* What You'll Learn */}
                      <div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                          <CheckCircle className="text-green-400" size={24} />
                          What You'll Learn
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedCourse.whatYoullLearn?.map((item, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                              <span className="text-slate-300">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Syllabus */}
                      <div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                          <BookOpen className="text-indigo-400" size={24} />
                          Course Syllabus
                        </h3>
                        <div className="space-y-3">
                          {selectedCourse.syllabus?.map((item, index) => (
                            <div key={index} className="bg-slate-800 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">Week {item.week}: {item.title}</h4>
                                <span className="text-xs text-slate-400 px-2 py-1 bg-slate-700 rounded">
                                  Week {item.week}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {item.topics.map((topic, idx) => (
                                  <span key={idx} className="text-sm text-slate-400">
                                    • {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Prerequisites */}
                      <div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                          <Award className="text-yellow-400" size={24} />
                          Prerequisites
                        </h3>
                        <ul className="space-y-2">
                          {selectedCourse.prerequisites?.map((prereq, index) => (
                            <li key={index} className="flex items-center gap-2 text-slate-300">
                              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                              {prereq}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Instructor */}
                      <div>
                        <h3 className="text-2xl font-bold mb-4">Instructor</h3>
                        <div className="bg-slate-800 rounded-lg p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                              {selectedCourse.instructor.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h4 className="font-bold text-lg">{selectedCourse.instructor}</h4>
                              <p className="text-slate-400 mt-1">{selectedCourse.instructorBio}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Video Lectures */}
                      {selectedCourse.videoLectures && selectedCourse.videoLectures.length > 0 && (
                        <div>
                          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Video className="text-indigo-400" size={24} />
                            Video Lectures
                          </h3>
                          <div className="space-y-3">
                            {selectedCourse.videoLectures.map((video) => {
                              const isLocked = selectedCourse.price !== 'Free' && !video.free;
                              return (
                                <div 
                                  key={video.id} 
                                  className={`bg-slate-800 rounded-lg p-4 flex items-center justify-between ${
                                    isLocked ? 'opacity-70' : 'hover:bg-slate-700 cursor-pointer'
                                  } transition-colors`}
                                  onClick={() => !isLocked && video.url && window.open(video.url, '_blank')}
                                >
                                  <div className="flex items-center gap-3">
                                    {isLocked ? (
                                      <Lock size={20} className="text-slate-500" />
                                    ) : (
                                      <Play size={20} className="text-green-400" />
                                    )}
                                    <div>
                                      <h4 className={`font-semibold ${isLocked ? 'text-slate-400' : 'text-white'}`}>
                                        {video.title}
                                      </h4>
                                      <p className="text-xs text-slate-500">Duration: {video.duration}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {!isLocked && video.url && (
                                      <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs font-semibold transition-colors">
                                        Watch Now
                                      </button>
                                    )}
                                    {isLocked && (
                                      <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">
                                        Locked
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Assignments */}
                      {selectedCourse.assignments && selectedCourse.assignments.length > 0 && (
                        <div>
                          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <FileText className="text-green-400" size={24} />
                            Assignments
                          </h3>
                          <div className="space-y-4">
                            {selectedCourse.assignments.map((assignment) => {
                              const isLocked = selectedCourse.price !== 'Free';
                              const showCommentBox = activeCommentBox === assignment.id;
                              const comment = commentText[assignment.id] || '';
                              
                              return (
                                <div 
                                  key={assignment.id} 
                                  className={`bg-slate-800 rounded-lg p-4 ${
                                    isLocked ? 'opacity-70' : ''
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      {isLocked ? (
                                        <Lock size={18} className="text-slate-500" />
                                      ) : (
                                        <CheckCircle size={18} className="text-green-400" />
                                      )}
                                      <h4 className={`font-semibold ${isLocked ? 'text-slate-400' : 'text-white'}`}>
                                        {assignment.title}
                                      </h4>
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                      assignment.difficulty === 'Easy' ? 'bg-green-900/50 text-green-400' :
                                      assignment.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' :
                                      'bg-red-900/50 text-red-400'
                                    }`}>
                                      {assignment.difficulty}
                                    </span>
                                  </div>

                                  {/* Assignment Instructions */}
                                  {!isLocked && assignment.instructions && (
                                    <div className="mb-3 p-3 bg-slate-700/50 rounded-lg">
                                      <h5 className="text-sm font-semibold text-indigo-400 mb-2">Instructions:</h5>
                                      <p className="text-sm text-slate-300 leading-relaxed">
                                        {assignment.instructions}
                                      </p>
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                      <span>📊 {assignment.points} points</span>
                                      {assignment.deadline && <span>⏰ Deadline: {assignment.deadline}</span>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {!isLocked ? (
                                        <>
                                          <button 
                                            onClick={() => setActiveCommentBox(showCommentBox ? null : assignment.id)}
                                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs font-semibold transition-colors flex items-center gap-1"
                                          >
                                            <FileText size={14} />
                                            Ask Admin
                                          </button>
                                          <button 
                                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs font-semibold transition-colors"
                                          >
                                            Submit Work
                                          </button>
                                        </>
                                      ) : (
                                        <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">
                                          Locked
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Comment Box for Admin */}
                                  {!isLocked && showCommentBox && (
                                    <div className="mt-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                                        Ask a question to Admin:
                                      </label>
                                      <textarea
                                        value={comment}
                                        onChange={(e) => setCommentText({ ...commentText, [assignment.id]: e.target.value })}
                                        placeholder="Type your question or concern about this assignment..."
                                        className="w-full px-3 py-2 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                                        rows="3"
                                      />
                                      <div className="flex justify-end gap-2 mt-2">
                                        <button 
                                          onClick={() => setActiveCommentBox(null)}
                                          className="px-3 py-1 bg-slate-600 hover:bg-slate-700 rounded text-xs font-semibold transition-colors"
                                        >
                                          Cancel
                                        </button>
                                        <button 
                                          onClick={() => {
                                            alert('Your question has been sent to admin!');
                                            setCommentText({ ...commentText, [assignment.id]: '' });
                                            setActiveCommentBox(null);
                                          }}
                                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs font-semibold transition-colors"
                                        >
                                          Send Question
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Projects */}
                      {selectedCourse.projectsDetails && selectedCourse.projectsDetails.length > 0 && (
                        <div>
                          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Award className="text-purple-400" size={24} />
                            Projects
                          </h3>
                          <div className="space-y-3">
                            {selectedCourse.projectsDetails.map((project) => {
                              const isLocked = selectedCourse.price !== 'Free';
                              const isCommentOpen = activeProjectCommentBox === project.id;
                              const currentComment = projectCommentText[project.id] || '';
                              
                              return (
                                <div 
                                  key={project.id} 
                                  className={`bg-slate-800 rounded-lg p-4 ${
                                    isLocked ? 'opacity-70' : ''
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    {isLocked ? (
                                      <Lock size={20} className="text-slate-500 mt-1" />
                                    ) : (
                                      <Award size={20} className="text-purple-400 mt-1" />
                                    )}
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-2">
                                        <h4 className={`font-semibold ${isLocked ? 'text-slate-400' : 'text-white'}`}>
                                          {project.title}
                                        </h4>
                                        {isLocked && (
                                          <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">
                                            Locked
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-slate-400 mb-2">
                                        {project.description}
                                      </p>
                                      
                                      {!isLocked && project.instructions && (
                                        <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
                                          <h5 className="text-sm font-semibold text-purple-300 mb-2">Project Instructions:</h5>
                                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                            {project.instructions}
                                          </p>
                                        </div>
                                      )}
                                      
                                      <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                          <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            Duration: {project.duration}
                                          </span>
                                          {project.deadline && (
                                            <span className="flex items-center gap-1">
                                              <Clock size={14} />
                                              Deadline: {project.deadline}
                                            </span>
                                          )}
                                        </div>
                                        {!isLocked && (
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() => setActiveProjectCommentBox(isCommentOpen ? null : project.id)}
                                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-semibold transition-colors"
                                            >
                                              Ask Admin
                                            </button>
                                            <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs font-semibold transition-colors">
                                              Submit Project
                                            </button>
                                          </div>
                                        )}
                                      </div>

                                      {!isLocked && isCommentOpen && (
                                        <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
                                          <label className="block text-sm font-semibold text-slate-300 mb-2">
                                            Ask your question to the admin:
                                          </label>
                                          <textarea
                                            value={currentComment}
                                            onChange={(e) => setProjectCommentText({
                                              ...projectCommentText,
                                              [project.id]: e.target.value
                                            })}
                                            className="w-full bg-slate-800 text-slate-200 rounded p-2 text-sm border border-slate-600 focus:border-purple-500 focus:outline-none"
                                            rows="3"
                                            placeholder="Type your question about this project..."
                                          />
                                          <div className="flex justify-end gap-2 mt-2">
                                            <button 
                                              onClick={() => {
                                                setActiveProjectCommentBox(null);
                                                setProjectCommentText({
                                                  ...projectCommentText,
                                                  [project.id]: ''
                                                });
                                              }}
                                              className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-xs transition-colors"
                                            >
                                              Cancel
                                            </button>
                                            <button 
                                              onClick={() => {
                                                // Here you would typically send the question to admin
                                                alert('Question sent to admin!');
                                                setActiveProjectCommentBox(null);
                                                setProjectCommentText({
                                                  ...projectCommentText,
                                                  [project.id]: ''
                                                });
                                              }}
                                              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs transition-colors"
                                            >
                                              Send Question
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                      <div className="sticky top-8 space-y-6">
                        {/* Price Card */}
                        <div className="bg-slate-800 rounded-xl p-6 border-2 border-indigo-500/30">
                          <div className="text-center mb-6">
                            <div className="text-4xl font-bold text-indigo-400 mb-2">
                              {selectedCourse.price}
                            </div>
                            {selectedCourse.price !== 'Free' && (
                              <p className="text-sm text-slate-400">One-time payment</p>
                            )}
                          </div>

                          <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold text-lg transition-all transform hover:scale-105 mb-4">
                            Enroll Now
                          </button>

                          <button className="w-full py-2 border border-slate-600 hover:border-slate-500 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                            <Heart size={18} />
                            Add to Wishlist
                          </button>
                        </div>

                        {/* Course Includes */}
                        <div className="bg-slate-800 rounded-xl p-6">
                          <h4 className="font-bold mb-4">This course includes:</h4>
                          <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-slate-300">
                              <Video size={18} className="text-indigo-400" />
                              <span>{selectedCourse.totalVideos} video lectures</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                              <FileText size={18} className="text-green-400" />
                              <span>{selectedCourse.totalQuizzes} quizzes</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                              <Award size={18} className="text-yellow-400" />
                              <span>{selectedCourse.projects} hands-on projects</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                              <Download size={18} className="text-purple-400" />
                              <span>Downloadable resources</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                              <Clock size={18} className="text-blue-400" />
                              <span>Lifetime access</span>
                            </li>
                            {selectedCourse.certificate && (
                              <li className="flex items-center gap-3 text-slate-300">
                                <Award size={18} className="text-orange-400" />
                                <span>Certificate of completion</span>
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Skills */}
                        <div className="bg-slate-800 rounded-xl p-6">
                          <h4 className="font-bold mb-4">Skills you'll gain:</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedCourse.skills.map(skill => (
                              <span
                                key={skill}
                                className="px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Level */}
                        <div className="bg-slate-800 rounded-xl p-6">
                          <h4 className="font-bold mb-3">Course Level:</h4>
                          <span className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                            selectedCourse.level === 'Beginner' ? 'bg-green-900/50 text-green-400' :
                            selectedCourse.level === 'Intermediate' ? 'bg-yellow-900/50 text-yellow-400' :
                            'bg-red-900/50 text-red-400'
                          }`}>
                            {selectedCourse.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Courses;