import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, Minimize2, Sparkles, Brain,
  Zap, Trash2, Cpu, ChevronRight, Globe, ShieldCheck,
  Layout, BookOpen, Briefcase, User as UserIcon
} from "lucide-react";
import { aiAPI, supportAPI } from "../services/api";
import toast from "react-hot-toast";

const QUICK_ACTIONS = [
  { label: "Find Courses", query: "Show me available courses", icon: <BookOpen className="w-3 h-3" /> },
  { label: "Job Postings", query: "Where are the jobs?", icon: <Briefcase className="w-3 h-3" /> },
  { label: "Contact Support", type: "support", icon: <Globe className="w-3 h-3" /> },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I am your E-Shikshan AI Consultant. I'm connected to the platform's core to provide you with real-time navigation support, career guidance, and technical insights. How may I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAiOnline, setIsAiOnline] = useState(true);
  const [isSupportMode, setIsSupportMode] = useState(false);
  const [supportData, setSupportData] = useState({ name: "", email: "", message: "" });
  const [isSendingSupport, setIsSendingSupport] = useState(false);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Handle outside clicks and keyboard
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // Optional: setOpen(false) or just ignore to keep persistent
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  const getOfflineResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes("where") || lowerQuery.includes("how to") || lowerQuery.includes("page")) {
      return "I'm currently in high-performance local mode. \n\n📍 Destinations:\n- /courses: Browse all learning material\n- /jobs: Explore career opportunities\n- /content: Academic resources\n- /profile: Manage your growth";
    }
    return "The Generative AI model is currently recalibrating. I am available with my core knowledge base. Please try after a quick page refresh!";
  };

  const handleSendMessage = async (queryOverride) => {
    const userQuery = queryOverride || inputMessage.trim();
    if (!userQuery) return;

    const userMessage = {
      id: Date.now(),
      text: userQuery,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await aiAPI.chat({
        message: userQuery,
        history: messages.slice(-6)
      });

      setIsAiOnline(!response.data.isOffline);

      const botResponse = {
        id: Date.now() + 1,
        text: response.data.response || getOfflineResponse(userQuery),
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setIsAiOnline(false);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        text: "My neural link is currently resetting. I am switching to auxiliary knowledge systems. Navigation: Try /courses, /jobs, or /roadmap!",
        sender: "bot",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!supportData.name || !supportData.email || !supportData.message) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setIsSendingSupport(true);
      await supportAPI.contact(supportData);
      toast.success("Support request dispatched!", {
        style: { background: '#10b981', color: '#fff' }
      });
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `Support request received, ${supportData.name}. Our engineering team has been notified. We will reach out to ${supportData.email} shortly.`,
        sender: 'bot',
        timestamp: new Date()
      }]);
      setIsSupportMode(false);
      setSupportData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error("Support node communication failure");
    } finally {
      setIsSendingSupport(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        text: "Knowledge buffers cleared. I am ready for a fresh session. What's on your mind?",
        sender: "bot",
        timestamp: new Date(),
      }
    ]);
    toast.success("Consultation history reset", {
      style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
    });
  };

  return (
    <>
      {/* Floating Trigger */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 45, opacity: 0 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 border border-indigo-500/30 text-white pl-4 pr-5 py-3 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all group"
          >
            <div className="relative">
              <Sparkles className="w-6 h-6 text-indigo-400 group-hover:animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
            </div>
            <span className="font-bold text-sm tracking-wide uppercase">AI Assistant</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            ref={containerRef}
            className="fixed z-[60] bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[420px] h-[100dvh] sm:h-[520px] bg-slate-950/95 backdrop-blur-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800 flex flex-col overflow-hidden ring-1 ring-white/5"
          >
            {/* Professional Header - Compacted */}
            <div className="relative py-3 px-5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent group-hover:scale-150 transition-transform duration-500" />
                  <Cpu className="w-5 h-5 text-indigo-400 relative z-10" />
                  <div className={`absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${isAiOnline ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-tight flex items-center gap-2">
                    E-Shikshan Intel
                    <span className="text-[8px] bg-white/10 text-indigo-300 px-1.5 py-0.5 rounded-full border border-white/5 font-bold">PRO</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-slate-400 text-[9px] uppercase font-black tracking-widest flex items-center gap-1">
                      <span className={`w-1 h-1 rounded-full ${isAiOnline ? 'bg-green-500' : 'bg-amber-500'}`} />
                      {isAiOnline ? 'Synced' : 'Local'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-500">
                <button onClick={clearChat} title="Purge Context" className="p-1.5 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} title="Minimize" className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-all text-slate-500">
                  <Minimize2 className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-800 mx-0.5" />
                <button onClick={() => setIsOpen(false)} title="Close" className="p-1.5 hover:text-white hover:bg-red-500/20 rounded-lg transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* AI Status Banner - Compacted */}
            <div className="bg-indigo-600/5 px-5 py-1.5 border-b border-slate-800 flex items-center justify-between overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-3 text-[9px] text-indigo-400/80 font-bold uppercase tracking-tighter whitespace-nowrap">
                <span className="flex items-center gap-1"><ShieldCheck className="w-2.5 h-2.5" /> Secure</span>
                <span className="flex items-center gap-1"><Globe className="w-2.5 h-2.5" /> Global</span>
              </div>
              <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest whitespace-nowrap">Gemini Pro Enterprise</p>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(30,41,59,0.3),transparent)]">
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: message.sender === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", damping: 25 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex flex-col ${message.sender === "user" ? "items-end" : "items-start"} max-w-[85%]`}>
                    <div
                      className={`relative p-4 rounded-2xl shadow-xl ${message.sender === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-slate-900/80 text-slate-100 rounded-bl-none border border-slate-800/50"
                        }`}
                    >
                      <p className="text-sm leading-relaxed font-medium whitespace-pre-line">{message.text}</p>

                      {/* Decorative elements for bot */}
                      {message.sender === "bot" && (
                        <div className="absolute top-0 right-0 p-1 opacity-10">
                          <Sparkles className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 font-black uppercase mt-2 tracking-widest px-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-900/80 px-4 py-3 rounded-2xl rounded-bl-none border border-slate-800/50">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_0ms]" />
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_200ms]" />
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_400ms]" />
                      <span className="text-[10px] text-indigo-400 font-black uppercase ml-2 tracking-widest">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Support Mode Overlay */}
            <AnimatePresence>
              {isSupportMode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 z-50 bg-slate-950 p-6 flex flex-col justify-center"
                >
                  <button
                    onClick={() => setIsSupportMode(false)}
                    className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">Support Terminal</h2>
                  <p className="text-slate-500 text-xs mb-8 uppercase font-black tracking-widest">Public Inquiry Protocol</p>

                  <form onSubmit={handleSupportSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="IDENTIFIER (NAME)..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500"
                      value={supportData.name}
                      onChange={(e) => setSupportData({ ...supportData, name: e.target.value })}
                    />
                    <input
                      type="email"
                      placeholder="CONTACT EMAIL..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500"
                      value={supportData.email}
                      onChange={(e) => setSupportData({ ...supportData, email: e.target.value })}
                    />
                    <textarea
                      placeholder="INQUIRY MESSAGE..."
                      rows={4}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 resize-none"
                      value={supportData.message}
                      onChange={(e) => setSupportData({ ...supportData, message: e.target.value })}
                    />
                    <button
                      type="submit"
                      disabled={isSendingSupport}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                    >
                      {isSendingSupport ? "TRANSMITTING..." : "DISPATCH MESSAGE"}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer / Interaction Area */}
            <div className="p-5 bg-slate-900/80 border-t border-slate-800">
              {/* Quick Suggestions */}
              <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => {
                      if (action.type === 'support') setIsSupportMode(true);
                      else handleSendMessage(action.query);
                    }}
                    className="flex items-center gap-2 whitespace-nowrap bg-slate-800 hover:bg-indigo-600/20 hover:text-indigo-400 border border-slate-700 hover:border-indigo-500/50 text-slate-300 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>

              <div className="relative group">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask a question or enter command..."
                  className="w-full bg-slate-950/50 text-white placeholder-slate-600 pl-4 pr-14 py-4 rounded-2xl border border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-medium"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-0 disabled:scale-90"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-center text-[9px] text-slate-600 mt-3 font-bold uppercase tracking-widest">
                System: E-Shikshan Platform Intelligence Terminal
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default Chatbot;

