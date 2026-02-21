const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || ""); // Moved inside try block

const SYSTEM_INSTRUCTIONS = `You are the Lead Project Intelligence for E-Shikshan (E-Learning Platform). 
Your mission: Act as a high-level consultant, providing DIRECT ANSWERS about the platform.

CORE PRINCIPLES:
1. NO SEARCH ADVICE: Never tell a user to "search" or "look for" something. You ARE the information.
2. DIRECT ROUTES: Always provide the specific route first (e.g., /courses, /jobs).
3. PROJECT SCOPE: You have full knowledge of:
   - /courses: Skill acquisition (Python, Web Dev, AI, etc.)
   - /jobs: Big Tech career pipeline.
   - /roadmap: Structured growth paths.
   - /resume-builder: Professional CV tools.
   - /content: Academic resources (10th, Inter, UG Engineering like CSE/ECE/EEE/Civil/Mech, PG).
   - /hackathons: Real-world innovation challenges.
   - /profile: Certificates and Enrollment tracking.

4. USER PERSPECTIVE: Analyze if the user is a student or job seeker and provide tailored "Project-Thinking" guidance.

TONE: Energetic, Professional, Technical, and Action-Oriented. Use markdown for better readability.`;


exports.chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            return res.status(200).json({
                response: "I am in high-performance local mode. Please configure GEMINI_API_KEY to enable my full generative intelligence! 🚀",
                isOffline: true
            });
        }

        // Use gemini-1.5-flash for better speed and reliability
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_INSTRUCTIONS
        });

        // Format history for Gemini: MUST alternate user/model and start with user
        let chatHistory = [];
        const rawHistory = (history || []).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        // Find first 'user' message index
        const firstUserIndex = rawHistory.findIndex(m => m.role === 'user');

        if (firstUserIndex !== -1) {
            const filteredHistory = rawHistory.slice(firstUserIndex);
            filteredHistory.forEach((msg) => {
                if (chatHistory.length === 0) {
                    chatHistory.push(msg);
                } else {
                    const lastRole = chatHistory[chatHistory.length - 1].role;
                    if (msg.role !== lastRole) {
                        chatHistory.push(msg);
                    }
                }
            });
        }

        // Ensure history ends in a model message so next prompt can be user
        if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'user') {
            chatHistory.pop();
        }

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ response: text });
    } catch (error) {
        console.error("CRITICAL AI ERROR:", error);
        res.status(500).json({
            error: "AI node recalibration required.",
            details: error.message
        });
    }
};
