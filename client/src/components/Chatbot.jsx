import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Minimize2, Sparkles } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! 👋 I'm your E-Shikshan assistant. Ask me anything about our platform!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close on outside click or Esc and make mobile-friendly
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  // Comprehensive Knowledge base about E-Shikshan project
  const getResponse = (query) => {
    const lowerQuery = query.toLowerCase();

    // ========== NAVIGATION & PAGES ==========
    if (lowerQuery.includes("home") || (lowerQuery.includes("main") && lowerQuery.includes("page"))) {
      return "🏠 The Home page is at '/' - It's your starting point with hero section, features overview, and quick links to all major sections. Click the E-Shikshan logo to return home anytime!";
    }

    if (lowerQuery.includes("where") && (lowerQuery.includes("course") || lowerQuery.includes("class"))) {
      return "📚 Courses are at '/courses'. Click 'Courses' in the navbar, or visit directly. You'll see all available courses with filters for branch, level, and type. Each course card shows price, duration, and enrollment info!";
    }

    if (lowerQuery.includes("where") && lowerQuery.includes("job")) {
      return "💼 Jobs are at '/jobs'. Navigate via the navbar or go directly to see career opportunities from top companies. You can filter by category, type, location, and sort by salary, date, or alphabetically!";
    }

    if (lowerQuery.includes("where") && lowerQuery.includes("hackathon")) {
      return "🏆 Hackathons are at '/hackathons'. Click 'Hackathons' in the menu to browse live, upcoming, and past events. Filter by payment type, event type, and category. Each hackathon shows prizes, timeline, and registration details!";
    }

    if (lowerQuery.includes("where") && lowerQuery.includes("roadmap")) {
      return "🗺️ Roadmaps are at '/roadmap'. Find structured learning paths for different skills. Each roadmap guides you step-by-step through technologies and milestones!";
    }

    if (lowerQuery.includes("where") && (lowerQuery.includes("resume") || lowerQuery.includes("cv"))) {
      return "📄 Resume Builder is at '/resume-builder' (or '/resume' for quick access). Access via navbar to create professional resumes with templates and guidance!";
    }

    if (lowerQuery.includes("where") && (lowerQuery.includes("content") || lowerQuery.includes("study material"))) {
      return "📖 Study Content is at '/content'. You'll find materials organized by education level: 10th Grade, Intermediate (11th-12th), Undergraduate branches (CSE, ECE, etc.), and Postgraduate programs!";
    }

    if (lowerQuery.includes("where") && (lowerQuery.includes("login") || lowerQuery.includes("signin") || lowerQuery.includes("sign in"))) {
      return "🔐 Login is at '/login' and Signup at '/signup'. Click the user icon in the navbar or access directly to authenticate and access personalized features!";
    }

    if (lowerQuery.includes("where") && lowerQuery.includes("profile")) {
      return "👤 Your Profile is at '/profile' (requires login). View enrolled courses, achievements, certificates, and personal info. Update settings from there!";
    }

    // ========== DETAILED FEATURES ==========
    if (lowerQuery.includes("what") && (lowerQuery.includes("e-shikshan") || lowerQuery.includes("platform") || lowerQuery.includes("website"))) {
      return "E-Shikshan is a comprehensive educational platform offering:\n📚 Courses (free & paid)\n💼 Job Opportunities & Career Paths\n🏆 Hackathons & Competitions\n🗺️ Learning Roadmaps\n📄 Resume Builder\n📖 Study Materials (10th, 12th, UG, PG)\n✅ Certificates & Achievements\nAll organized to help students and professionals upskill and succeed! 🎓";
    }

    if ((lowerQuery.includes("what") || lowerQuery.includes("list") || lowerQuery.includes("all")) && lowerQuery.includes("page")) {
      return "📁 All Pages in E-Shikshan:\n\n🏠 Home: /\n📚 Courses: /courses\n💼 Jobs: /jobs\n🏆 Hackathons: /hackathons\n🗺️ Roadmaps: /roadmap\n📄 Resume: /resume-builder\n📖 Content: /content\n🔐 Login: /login\n✍️ Signup: /signup\n👤 Profile: /profile\n\n📂 Content sub-sections:\n- 10th Grade: /content/10th\n- Intermediate: /content/intermediate\n- Postgraduate: /content/postgraduate\n- Branch-specific: /content/{branch}\n\n📋 Admin Panel: /admin (restricted access)";
    }

    if ((lowerQuery.includes("what") || lowerQuery.includes("all")) && (lowerQuery.includes("component") || lowerQuery.includes("feature"))) {
      return "🧩 Main Components:\n\n📌 Navigation: Navbar, Footer\n🎴 Cards: Course Cards, Job Cards, Roadmap Cards\n🔍 SearchBar with filters\n📊 Features showcase\n📁 Folder & Content viewers\n🎯 Stepper for Resume Building\n🔒 Protected Routes (login-required)\n✨ Hackathon Details viewer\n⏳ Loader animations\n\nEach component is designed for smooth UX and easy navigation!";
    }

    // ========== CONTENT & ACADEMIC STRUCTURE ==========
    if (lowerQuery.includes("10th") || lowerQuery.includes("tenth")) {
      return "📚 10th Grade Content:\n- Access at '/content/10th'\n- Organized by Terms (semesters)\n- Subjects for each term\n- Study materials and resources\n- Perfect for school students preparing for board exams!";
    }

    if (lowerQuery.includes("intermediate") || lowerQuery.includes("11th") || lowerQuery.includes("12th") || lowerQuery.includes("plus two")) {
      return "📖 Intermediate (11th-12th):\n- Access at '/content/intermediate'\n- Multiple streams: MPC, BiPC, CEC, MEC, etc.\n- Select your stream → semester → subjects\n- Route: /intermediate/{stream}/{semester}\n- Comprehensive study materials for junior college!";
    }

    if (lowerQuery.includes("postgraduate") || lowerQuery.includes("pg") || lowerQuery.includes("masters") || lowerQuery.includes("mba") || lowerQuery.includes("mca")) {
      return "🎓 Postgraduate Programs:\n- Access at '/content/postgraduate'\n- Programs: MBA, MCA, M.Tech, M.Sc, etc.\n- Some have specializations (MBA-Finance, M.Tech-CSE)\n- Route: /postgraduate/{program}/{specialization}/{semester}\n- Advanced study materials for master's students!";
    }

    if (lowerQuery.includes("branch") || lowerQuery.includes("cse") || lowerQuery.includes("ece") || lowerQuery.includes("mechanical") || lowerQuery.includes("civil")) {
      return "🏗️ Undergraduate Branches:\n- CSE (Computer Science)\n- ECE (Electronics)\n- Mechanical Engineering\n- Civil Engineering\n- EEE (Electrical)\n- And more!\n\nAccess via '/content' → select branch → semester → subjects\nRoute: /content/{branch}, /subjects/{branch}, /subjects/{branch}/{semester}/{subjectCode}";
    }

    if ((lowerQuery.includes("how") || lowerQuery.includes("access")) && (lowerQuery.includes("subject") || lowerQuery.includes("material") || lowerQuery.includes("pdf"))) {
      return "📂 Access Study Materials:\n1. Go to '/content'\n2. Select education level (10th/Intermediate/Branch/PG)\n3. Choose semester/term\n4. Pick your subject\n5. View units and download PDFs\n\nPath structure:\n- Branches: /content/{branch} → /subjects/{branch}\n- Detailed: /subjects/{branch}/{semester}/{subjectCode}\n- Files: Organized in folders by units!";
    }

    // ========== COURSES ==========
    if (lowerQuery.includes("course") && (lowerQuery.includes("how") || lowerQuery.includes("enroll") || lowerQuery.includes("join"))) {
      return "✅ How to Enroll in Courses:\n1. Visit '/courses'\n2. Browse or search courses\n3. Click on a course card\n4. View details at '/courses/{id}'\n5. Click 'Enroll Now'\n6. Free courses: instant access\n7. Paid courses: complete payment first\n8. Access from your profile after enrollment!\n\nRequires login. Create account at '/signup' if needed.";
    }

    if (lowerQuery.includes("course") && (lowerQuery.includes("type") || lowerQuery.includes("kind") || lowerQuery.includes("category"))) {
      return "📚 Course Types:\n- Free courses (instant access)\n- Paid courses (with certification)\n- Branch-specific (CSE, ECE, etc.)\n- Skill-based (Web Dev, AI/ML, etc.)\n- Different levels (Beginner to Advanced)\n- Filter by: branch, price, level, status\n\nEach course shows: duration, instructor, syllabus, price, and student count!";
    }

    if (lowerQuery.includes("course") && lowerQuery.includes("detail")) {
      return "📋 Course Details Page (/courses/{id}):\n- Full course description\n- Instructor info\n- Syllabus & curriculum\n- Duration & time commitment\n- Price (free/paid)\n- Enrollment count\n- Prerequisites\n- What you'll learn\n- Certificate info\n- Enroll button\n\nClick any course card to see full details!";
    }

    // ========== JOBS ==========
    if (lowerQuery.includes("job") && (lowerQuery.includes("how") || lowerQuery.includes("apply") || lowerQuery.includes("find"))) {
      return "💼 How to Find & Apply for Jobs:\n1. Visit '/jobs'\n2. Browse job listings (Google, TCS, Amazon, etc.)\n3. Filter by: category, type, location\n4. Sort by: newest, salary, A-Z, remote-first\n5. Click a job card\n6. View full details at '/jobs/{id}'\n7. See: description, responsibilities, curriculum, skills, salary, benefits\n8. Click 'Apply Now' → redirects to company portal\n\nTip: Each job includes a learning pathway to prepare!";
    }

    if (lowerQuery.includes("job") && (lowerQuery.includes("type") || lowerQuery.includes("kind") || lowerQuery.includes("category"))) {
      return "💼 Job Types Available:\n- Full-time positions\n- Internships\n- Contract roles\n- Part-time work\n- Remote opportunities\n\nCategories:\n- Full-stack, Frontend, Backend\n- Data Science, AI/ML\n- DevOps, Cloud\n- UI/UX Design\n- Marketing, Business\n\nFrom top companies: Google, Amazon, TCS, Infosys, Zoho, Meta, Netflix, Adobe, and more!";
    }

    if (lowerQuery.includes("job") && lowerQuery.includes("detail")) {
      return "📋 Job Details Page (/jobs/{id}):\n- Job title & company\n- Location & mode (remote/hybrid/office)\n- Salary range\n- Experience level\n- Full description\n- Key responsibilities\n- Required skills\n- Learning curriculum (how to prepare)\n- Benefits & perks\n- Application URL\n- How to get this job (step-by-step)\n- Similar roles\n\nClick any job card for complete info!";
    }

    // ========== HACKATHONS ==========
    if (lowerQuery.includes("hackathon") && (lowerQuery.includes("how") || lowerQuery.includes("join") || lowerQuery.includes("participate") || lowerQuery.includes("register"))) {
      return "🏆 How to Join Hackathons:\n1. Visit '/hackathons'\n2. Browse events (live/upcoming/past)\n3. Filter by: payment, event type, category, user\n4. Sort by: newest, ending soon, prize, live, free\n5. Click a hackathon card to select\n6. View details in right panel\n7. See: overview, timeline, prizes, team size, rules\n8. Click 'View Full Details & Register'\n9. Goes to '/hackathon/{id}' with complete info\n10. Click registration link to sign up!\n\nTip: Check 'Live' status for ongoing events!";
    }

    if (lowerQuery.includes("hackathon") && (lowerQuery.includes("type") || lowerQuery.includes("kind") || lowerQuery.includes("category"))) {
      return "🏆 Hackathon Types:\n- Online/Offline events\n- Solo/Team competitions\n- Free/Paid entry\n- Categories: Tech, Design, Business, Social Impact\n- Status: Live, Upcoming, Past\n- Different organizers and sponsors\n\nFeatures:\n- Prize pools\n- Timeline (registration, submission, results)\n- Team size requirements\n- Eligibility criteria\n\nFilter and sort to find your perfect competition!";
    }

    if (lowerQuery.includes("hackathon") && lowerQuery.includes("prize")) {
      return "💰 Hackathon Prizes:\nEach hackathon displays:\n- Total prize pool\n- Winner rewards\n- Runner-up prizes\n- Special category awards\n- Certificates for participants\n\nSort hackathons by 'prize' to see highest rewards first! Many offer cash, gadgets, internships, and recognition!";
    }

    // ========== ROADMAPS ==========
    if (lowerQuery.includes("roadmap") && (lowerQuery.includes("how") || lowerQuery.includes("use") || lowerQuery.includes("follow"))) {
      return "🗺️ How to Use Roadmaps:\n1. Visit '/roadmaps'\n2. Browse learning paths\n3. Choose a skill/technology\n4. Click roadmap card\n5. View details at '/roadmaps/{id}'\n6. See: milestones, steps, resources, timeline\n7. Follow the structured path\n8. Track your progress\n9. Complete each milestone\n\nRoadmaps guide you from beginner to expert in your chosen field!";
    }

    if (lowerQuery.includes("roadmap") && (lowerQuery.includes("available") || lowerQuery.includes("topic") || lowerQuery.includes("skill"))) {
      return "🗺️ Available Roadmaps:\n- Web Development (Frontend/Backend/Full-stack)\n- Data Science & ML\n- DevOps & Cloud\n- Mobile Development\n- Cybersecurity\n- UI/UX Design\n- Programming Languages\n- System Design\n- And more!\n\nEach roadmap includes:\n- Learning sequence\n- Resources\n- Practice projects\n- Estimated timeline\n- Skill checkpoints";
    }

    // ========== RESUME BUILDER ==========
    if (lowerQuery.includes("resume") && (lowerQuery.includes("how") || lowerQuery.includes("build") || lowerQuery.includes("create"))) {
      return "📄 How to Build Resume:\n1. Visit '/resume' or '/resumestepper'\n2. Choose a template\n3. Step-by-step form:\n   - Personal info\n   - Education\n   - Experience\n   - Skills\n   - Projects\n   - Achievements\n4. Preview as you type\n5. Download as PDF\n6. Edit anytime from your profile\n\nTip: '/resumestepper' offers guided step-by-step process!";
    }

    // ========== ADMIN PANEL ==========
    if (lowerQuery.includes("admin") && (lowerQuery.includes("what") || lowerQuery.includes("feature") || lowerQuery.includes("can"))) {
      return "🔐 Admin Panel Features (/admin):\n\n📊 Dashboard:\n- Analytics & statistics\n- User metrics\n- Course enrollment data\n- Platform overview\n\n👥 User Management (/admin/users):\n- View all users\n- Edit user details\n- Manage roles\n- Delete users\n\n📚 Course Management (/admin/courses):\n- Add/edit/delete courses\n- View both admin & public courses\n- Manage enrollment\n- Track student progress\n\n💼 Jobs Management (/admin/jobs):\n- Create job listings\n- Edit/delete jobs\n- View admin & public jobs (read-only for public)\n- Track applicants\n\n🏆 Hackathons (/admin/hackathons):\n- Create events\n- Edit details\n- Manage registrations\n\n🗺️ Roadmaps (/admin/roadmaps):\n- Create learning paths\n- Update content\n\n📖 Content Management (/admin/content):\n- Manage study materials\n\n📄 Resumes (/admin/resumes):\n- View templates\n\n👨‍🎓 Students (/admin/students):\n- Student database\n\n⚙️ Settings (/admin/settings):\n- Platform configuration\n\nLogin at '/admin' with admin credentials!";
    }

    if (lowerQuery.includes("admin") && (lowerQuery.includes("login") || lowerQuery.includes("access") || lowerQuery.includes("how"))) {
      return "🔐 Admin Access:\n1. Go to '/admin'\n2. Enter admin credentials\n3. Login with email & password\n4. Role-based access:\n   - Super Admin: Full access\n   - Course Manager: Courses & Settings only\n5. Dashboard appears after login\n6. Navigate via admin sidebar\n7. Manage all platform content\n\nNote: Requires admin-level authorization. Contact platform owner for credentials!";
    }

    // ========== AUTHENTICATION ==========
    if (lowerQuery.includes("how") && (lowerQuery.includes("login") || lowerQuery.includes("signin") || lowerQuery.includes("sign in"))) {
      return "🔐 How to Login:\n1. Click user icon in navbar OR go to '/login'\n2. Enter email & password\n3. Click 'Login'\n4. Access profile, enrolled courses, achievements\n5. Required for:\n   - Course enrollment\n   - Job application tracking\n   - Resume building\n   - Profile management\n\nNo account? Sign up at '/signup' first!";
    }

    if (lowerQuery.includes("how") && (lowerQuery.includes("signup") || lowerQuery.includes("register") || lowerQuery.includes("create account"))) {
      return "✍️ How to Sign Up:\n1. Go to '/signup'\n2. Fill in:\n   - Full name\n   - Email\n   - Password\n   - Confirm password\n3. Agree to terms\n4. Click 'Create Account'\n5. Verify email (if required)\n6. Auto-login\n7. Start learning!\n\nBenefits:\n- Enroll in courses\n- Track progress\n- Earn certificates\n- Build resume\n- Save favorites";
    }

    // ========== PROFILE & SETTINGS ==========
    if (lowerQuery.includes("profile") && (lowerQuery.includes("what") || lowerQuery.includes("feature") || lowerQuery.includes("see"))) {
      return "👤 Profile Page (/profile):\n- Personal information\n- Enrolled courses\n- Course progress\n- Certificates earned\n- Achievement badges\n- Learning statistics\n- Edit profile button\n- Settings access\n- Resume downloads\n- Activity history\n\nRequires login. Update anytime!";
    }

    if (lowerQuery.includes("setting") || (lowerQuery.includes("how") && lowerQuery.includes("update"))) {
      return "⚙️ Settings (/settings):\n- Update profile info\n- Change password\n- Email preferences\n- Notification settings\n- Privacy controls\n- Account management\n- Linked accounts\n- Language preferences\n\nAccess from profile or navbar menu!";
    }

    // ========== CERTIFICATES & ACHIEVEMENTS ==========
    if (lowerQuery.includes("certificate") || lowerQuery.includes("achievement") || lowerQuery.includes("badge")) {
      return "🏅 Certificates & Achievements:\n- Earn certificates by completing courses\n- Badge system for milestones\n- View all in your profile\n- Download certificates as PDF\n- Share on social media\n- Types:\n  - Course completion\n  - Skill mastery\n  - Hackathon participation\n  - Special achievements\n\nTrack progress in profile dashboard!";
    }

    // ========== PAYMENT & ENROLLMENT ==========
    if (lowerQuery.includes("payment") || lowerQuery.includes("pay") || lowerQuery.includes("price")) {
      return "💳 Payment & Pricing:\n- Free courses: Instant access\n- Paid courses: Secure payment gateway\n- Payment required BEFORE access\n- No hidden charges\n- Enrollment status:\n  - Pending: Payment incomplete\n  - Active: Paid & enrolled\n  - Cancelled: Back button before payment\n\nPayment flow:\n1. Click 'Enroll'\n2. If paid → Payment page\n3. Complete transaction\n4. Auto-enrolled\n5. Access course content\n\nSupports multiple payment methods!";
    }

    if (lowerQuery.includes("enroll") && lowerQuery.includes("status")) {
      return "📊 Enrollment Status:\n- Free courses: Active immediately\n- Paid courses:\n  - 'Pending': Awaiting payment\n  - 'Active': Paid & enrolled\n  - Incomplete if payment cancelled\n- View status in profile\n- Course appears in 'My Courses' when active\n- Access locked until payment complete\n- Cancel pending enrollment anytime\n\nCheck '/profile' for all enrollments!";
    }

    // ========== SEARCH & FILTERS ==========
    if (lowerQuery.includes("search") || lowerQuery.includes("filter") || lowerQuery.includes("find")) {
      return "🔍 Search & Filters:\n\n📚 Courses:\n- Search by title\n- Filter: branch, level, price, status\n- Sort: newest, popular, price\n\n💼 Jobs:\n- Search by title/company\n- Filter: category, type, location\n- Sort: newest, salary, A-Z, remote\n\n🏆 Hackathons:\n- Search by title/tagline\n- Filter: status, payment, event type, category\n- Sort: newest, ending soon, prize, live, free\n\n🗺️ Roadmaps:\n- Search by skill/topic\n- Browse by category\n\nAll pages have dedicated search bars and filter panels!";
    }

    // ========== COMPONENTS ==========
    if (lowerQuery.includes("component") && lowerQuery.includes("what")) {
      return "🧩 Available Components:\n\n📌 Layout:\n- Navbar (top navigation)\n- Footer (bottom info)\n- Sidebar (admin)\n\n🎴 Display:\n- Card (course/job/roadmap cards)\n- JobCard\n- RoadmapCard\n- Contentcard\n- Folder (file display)\n\n🔧 Functional:\n- SearchBar\n- Loader (loading animation)\n- Stepper (multi-step forms)\n- ResumeStepper\n- ProtectedRoute (auth guard)\n\n🎨 UI:\n- HeroSection\n- Features\n- FeatureSection\n- TextType (animated text)\n- HackathonDetails\n\nAll designed for smooth UX!";
    }

    // ========== NAVIGATION STRUCTURE ==========
    if (lowerQuery.includes("navbar") || lowerQuery.includes("menu") || lowerQuery.includes("navigation")) {
      return "🧭 Navbar Links:\n- Home (logo)\n- Content (study materials)\n- Courses\n- Hackathons\n- Roadmaps\n- Resume Builder\n- Jobs\n- Profile (when logged in)\n- Login/Signup\n\nResponsive design:\n- Desktop: Full menu\n- Mobile: Hamburger menu\n- Always accessible\n- Highlights current page\n\nClick any link for instant navigation!";
    }

    // ========== FOOTER ==========
    if (lowerQuery.includes("footer")) {
      return "📍 Footer Contains:\n- Quick links\n- Contact information\n- Social media links\n- About E-Shikshan\n- Terms & Privacy\n- Copyright info\n- Newsletter signup\n- Support links\n\nVisible on all public pages at the bottom!";
    }

    // ========== EXISTENCE CHECKS ==========
    if ((lowerQuery.includes("is there") || lowerQuery.includes("do you have") || lowerQuery.includes("available")) && lowerQuery.includes("course")) {
      return "✅ YES! Courses are available at '/courses'. We have:\n- Free & paid courses\n- Multiple branches (CSE, ECE, etc.)\n- Various skill levels\n- Live courses with enrollment\n- Detailed course pages\n- Certificate programs\n\nBrowse the full catalog now!";
    }

    if ((lowerQuery.includes("is there") || lowerQuery.includes("do you have") || lowerQuery.includes("available")) && lowerQuery.includes("job")) {
      return "✅ YES! Jobs are available at '/jobs'. Features:\n- Career opportunities from top companies\n- Full-time, internships, contracts\n- Detailed job descriptions\n- Salary information\n- Application links\n- Learning pathways\n\nExplore job listings now!";
    }

    if ((lowerQuery.includes("is there") || lowerQuery.includes("do you have") || lowerQuery.includes("available")) && lowerQuery.includes("hackathon")) {
      return "✅ YES! Hackathons are at '/hackathons'. We list:\n- Live competitions\n- Upcoming events\n- Past hackathons\n- Various categories\n- Prize information\n- Registration links\n\nJoin a hackathon today!";
    }

    if ((lowerQuery.includes("is there") || lowerQuery.includes("do you have")) && lowerQuery.includes("mobile app")) {
      return "📱 Currently, E-Shikshan is a web platform accessible on:\n- Desktop browsers\n- Mobile browsers (responsive design)\n- Tablets\n\nWorks on any device with internet access. Fully responsive for mobile viewing! Native app may come in the future. 🚀";
    }

    // ========== GENERAL QUESTIONS ==========
    if (lowerQuery.includes("how many") && (lowerQuery.includes("page") || lowerQuery.includes("section"))) {
      return "📊 E-Shikshan has 30+ pages including:\n\n🎓 Main sections: 8\n📖 Content pages: 10+\n👤 User pages: 4\n🔐 Admin pages: 10+\n📋 Detail pages: Dynamic\n\nPlus dynamic routes for specific courses, jobs, hackathons, subjects, and more!";
    }

    if (lowerQuery.includes("what can i") || lowerQuery.includes("what should i")) {
      return "🎯 What You Can Do:\n\n📚 Learn:\n- Enroll in courses\n- Access study materials\n- Follow roadmaps\n\n💼 Career:\n- Find jobs\n- Build resume\n- Apply to companies\n\n🏆 Compete:\n- Join hackathons\n- Win prizes\n- Showcase skills\n\n📈 Track:\n- Course progress\n- Certificates\n- Achievements\n\n🔧 Manage (Admin):\n- Content\n- Users\n- Platform data\n\nStart by creating an account!";
    }

    if (lowerQuery.includes("who made") || lowerQuery.includes("developer") || lowerQuery.includes("creator")) {
      return "👨‍💻 E-Shikshan was developed as a comprehensive educational platform. For more information about the team and vision, check the About section in the footer or contact us through the platform!";
    }

    // ========== RESPONSIVE & MOBILE ==========
    if (lowerQuery.includes("mobile") || lowerQuery.includes("responsive") || lowerQuery.includes("phone")) {
      return "📱 Mobile Support:\n✅ Fully responsive design\n✅ Works on all screen sizes\n✅ Touch-friendly interface\n✅ Optimized for mobile browsers\n✅ Hamburger menu on small screens\n✅ Swipe gestures\n✅ Fast loading\n\nAccess from any device - phone, tablet, or desktop!";
    }

    // ========== TECHNICAL ==========
    if (lowerQuery.includes("technology") || lowerQuery.includes("tech stack") || lowerQuery.includes("built with")) {
      return "⚙️ Technology Stack:\n\n🎨 Frontend:\n- React.js\n- Tailwind CSS\n- Framer Motion (animations)\n- React Router (navigation)\n- Lucide Icons\n\n🔧 Backend:\n- Node.js\n- Express.js\n- MongoDB\n- JWT Authentication\n\n🚀 Features:\n- Responsive design\n- Real-time updates\n- Secure authentication\n- RESTful APIs\n- Modern UI/UX\n\nBuilt with latest web technologies!";
    }

    // ========== GREETINGS & CASUAL CONVERSATIONS ==========
    if (lowerQuery.includes("hello") || lowerQuery.includes("hi ") || lowerQuery === "hi" || lowerQuery.includes("hey")) {
      return "Hello! 👋 I'm your E-Shikshan guide! I know everything about this platform - all pages, features, courses, jobs, and how to navigate!\n\nAsk me:\n- Where to find something\n- How to use features\n- What pages exist\n- Navigation help\n- Anything about E-Shikshan!\n\nWhat would you like to know? 🚀";
    }

    if (lowerQuery.includes("good morning")) {
      return "Good morning! ☀️ Hope you have a productive day of learning! How can I assist you with E-Shikshan today?";
    }

    if (lowerQuery.includes("good afternoon")) {
      return "Good afternoon! 🌤️ Ready to explore some courses or features? What can I help you find?";
    }

    if (lowerQuery.includes("good evening")) {
      return "Good evening! 🌆 Perfect time to learn something new! What would you like to know about E-Shikshan?";
    }

    if (lowerQuery.includes("good night")) {
      return "Good night! 🌙 Sweet dreams! Come back tomorrow to continue your learning journey. Sleep well! 😴";
    }

    // ========== APPRECIATION & PRAISE ==========
    if (lowerQuery.includes("good job") || lowerQuery.includes("great job") || lowerQuery.includes("well done") || lowerQuery.includes("awesome") || lowerQuery.includes("amazing")) {
      return "Thank you so much! 🎉 I'm here to make your E-Shikshan experience amazing! Is there anything else I can help you explore? 😊";
    }

    if (lowerQuery.includes("nice") || lowerQuery.includes("cool") || lowerQuery.includes("excellent") || lowerQuery.includes("perfect") || lowerQuery.includes("wonderful")) {
      return "I appreciate that! 😊 Glad I could help! Feel free to ask me anything else about E-Shikshan - courses, jobs, features, you name it! 🚀";
    }

    if (lowerQuery.includes("love it") || lowerQuery.includes("love this") || lowerQuery.includes("fantastic")) {
      return "So happy to hear that! ❤️ That's what I'm here for! What else would you like to discover on E-Shikshan? 🌟";
    }

    // ========== GRATITUDE ==========
    if (lowerQuery.includes("thank") || lowerQuery.includes("thanks") || lowerQuery.includes("thx")) {
      return "You're very welcome! 😊 Happy to help you navigate E-Shikshan. Ask me anything else about courses, jobs, features, or how to find what you need! 🎓";
    }

    if (lowerQuery.includes("appreciate")) {
      return "I appreciate you too! 💙 Always here to help. Don't hesitate to ask if you need anything else about E-Shikshan! 🙌";
    }

    // ========== POLITE RESPONSES ==========
    if (lowerQuery.includes("sorry")) {
      return "No worries at all! 😊 No need to apologize. I'm here to help! What can I assist you with on E-Shikshan?";
    }

    if (lowerQuery.includes("excuse me")) {
      return "Yes, of course! I'm all ears! � How can I help you with E-Shikshan today?";
    }

    if (lowerQuery.includes("please")) {
      return "Of course! I'd be happy to help! 😊 What would you like to know about E-Shikshan?";
    }

    // ========== OFFERS TO HELP ==========
    if ((lowerQuery.includes("how can i help") || lowerQuery.includes("can i help") || lowerQuery.includes("need help")) && !lowerQuery.includes("me")) {
      return "That's so kind of you, but I'm here to help YOU! 😄 I'm your E-Shikshan assistant. Tell me what you'd like to learn or find - courses, jobs, hackathons, study materials, or anything else! 🎓";
    }

    if (lowerQuery.includes("anything i can do")) {
      return "You're too sweet! 💕 But I'm your assistant here! Just tell me what you need help with on E-Shikshan and I'll guide you! 🗺️";
    }

    // ========== GENERAL QUESTIONS ==========
    if (lowerQuery.includes("how are you") || lowerQuery.includes("how r u") || lowerQuery.includes("how do you do")) {
      return "I'm doing great, thanks for asking! 😊 I'm always excited to help people explore E-Shikshan. How about you? What brings you here today?";
    }

    if (lowerQuery.includes("what's up") || lowerQuery.includes("whats up") || lowerQuery.includes("wassup")) {
      return "Not much, just here ready to help you with E-Shikshan! 🚀 What can I show you today - courses, jobs, hackathons, or something else?";
    }

    if (lowerQuery.includes("who are you") || (lowerQuery.includes("what are you") && !lowerQuery.includes("what are you looking"))) {
      return "I'm your E-Shikshan AI assistant! 🤖 I know everything about this platform - every page, feature, course, job listing, and how to navigate them all. Think of me as your personal guide! What would you like to explore? 🎓";
    }

    if (lowerQuery.includes("your name")) {
      return "I'm the E-Shikshan Chatbot Assistant! 🤖✨ You can just call me your learning buddy. I'm here to help you find anything on the platform! What do you need?";
    }

    // ========== FAREWELLS ==========
    if (lowerQuery.includes("bye") || lowerQuery.includes("goodbye") || lowerQuery.includes("see you") || lowerQuery.includes("gotta go") || lowerQuery.includes("got to go")) {
      return "Goodbye! 👋 Happy learning on E-Shikshan! Feel free to come back anytime you need help. Take care! 😊🎓";
    }

    if (lowerQuery.includes("talk later") || lowerQuery.includes("catch you later")) {
      return "Sure thing! Catch you later! 👋 I'll be here whenever you need help with E-Shikshan. Happy learning! 🚀";
    }

    // ========== HELP REQUESTS ==========
    if (lowerQuery.includes("help") && !lowerQuery.includes("how")) {
      return "🆘 I can help you with:\n\n📍 Navigation: Where to find pages\n🔍 Features: What's available\n📚 Courses: How to enroll\n💼 Jobs: How to apply\n🏆 Hackathons: How to join\n🗺️ Roadmaps: How to follow\n📄 Resume: How to build\n🔐 Account: Login/signup\n👤 Profile: Managing info\n⚙️ Admin: Panel features\n\n💡 Tip: Type 'clear chat' to start fresh!\n\nJust ask 'where is [thing]' or 'how to [action]'!";
    }

    // ========== CONFUSION ==========
    if (lowerQuery.includes("confused") || lowerQuery.includes("don't understand") || lowerQuery.includes("dont understand")) {
      return "No problem! 😊 Let me help clear things up. What specific part of E-Shikshan are you confused about? I can explain:\n- How to navigate\n- Where to find courses/jobs/hackathons\n- How to use features\n- What's available\n\nJust ask! 🤝";
    }

    // ========== AGREEMENT ==========
    if (lowerQuery === "ok" || lowerQuery === "okay" || lowerQuery === "okk" || lowerQuery === "okkk" || lowerQuery === "sure" || lowerQuery === "alright" || lowerQuery === "got it") {
      return "Thank you! 😊 How can I help you? Ask me about courses, jobs, hackathons, study materials, navigation, or any feature on E-Shikshan! 🎓";
    }

    if (lowerQuery === "yes" || lowerQuery === "yeah" || lowerQuery === "yep" || lowerQuery === "yup") {
      return "Awesome! 🎉 What would you like to know? Ask me about any page, feature, or how to find something on E-Shikshan!";
    }

    if (lowerQuery === "no" || lowerQuery === "nope" || lowerQuery === "nah") {
      return "No problem! 😊 I'm here if you need anything. Just let me know when you want to explore E-Shikshan! 🎓";
    }

    // ========== CHAT COMMANDS ==========
    if (lowerQuery.includes("clear") || lowerQuery.includes("reset") || lowerQuery.includes("command")) {
      return "🧹 Chat Commands:\n\n✨ Type 'clear chat' or 'clear' or 'reset' to clear all messages and start fresh!\n\nThis will remove all conversation history and give you a clean slate. Try it anytime! 🔄";
    }

    // ========== DEFAULT INTELLIGENT RESPONSE ==========
    return "🤔 I can help you with that! Try asking:\n\n📍 'Where can I find courses/jobs/hackathons?'\n🔍 'What pages are available?'\n📚 'How to enroll in a course?'\n💼 'How to apply for jobs?'\n🏆 'How to join hackathons?'\n📖 'Where are study materials?'\n👤 'What's in my profile?'\n🔐 'How to access admin panel?'\n🧩 'What components does the site have?'\n\nI know every page, feature, and route in E-Shikshan! Ask me anything specific! 🎓✨";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const trimmedInput = inputMessage.trim().toLowerCase();

    // Check for clear chat command
    if (trimmedInput === "clear chat" || trimmedInput === "clear" || trimmedInput === "reset chat" || trimmedInput === "reset") {
      setMessages([
        {
          id: 1,
          text: "Chat cleared! 🧹 Hi! 👋 I'm your E-Shikshan assistant. Ask me anything about our platform!",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setInputMessage("");
      return;
    }

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getResponse(inputMessage),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            ref={containerRef}
            className="fixed z-[60] bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 w-auto sm:w-96 h-[70vh] sm:h-[600px] bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/30 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Sparkles className="w-6 h-6 text-white" />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-purple-600" />
                </div>
                <div>
                  <h3 className="text-white font-bold">E-Shikshan Assistant</h3>
                  <p className="text-purple-100 text-xs">Online • Here to help</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none"
                        : "bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-800 text-gray-100 p-3 rounded-2xl rounded-bl-none border border-gray-700">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-800/50 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about E-Shikshan..."
                  className="flex-1 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!inputMessage.trim()}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #9333ea, #ec4899);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #a855f7, #f472b6);
        }
      `}</style>
    </>
  );
};

export default Chatbot;
