import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Award, Shield, Sparkles, Printer, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

const CertificatePreviewModal = ({ isOpen, onClose, certificate, userData }) => {
    const certificateRef = useRef(null);

    const handleDownload = async () => {
        if (!certificateRef.current) return;
        
        const toastId = toast.loading('Exporting high-resolution certificate...');
        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 3, // High quality
                useCORS: true,
                backgroundColor: '#0f111a',
                logging: false,
            });
            
            const link = document.createElement('a');
            link.download = `E-Shikshan_Certificate_${certificate.title.replace(/\s+/g, '_')}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
            toast.success('Certificate downloaded successfully!', { id: toastId });
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to export certificate', { id: toastId });
        }
    };

    if (!certificate) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-5xl bg-[#1a1c2e] rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col md:flex-row max-h-[90vh]"
                    >
                        {/* Control Panel */}
                        <div className="w-full md:w-64 bg-[#111322] p-8 flex flex-col border-b md:border-b-0 md:border-r border-white/5 space-y-8">
                            <div className="flex justify-between items-center md:block">
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Merit Terminal</h2>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Verified Credential</p>
                                </div>
                                <button onClick={onClose} className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 flex-1">
                                <button
                                    onClick={handleDownload}
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                                    Export PNG
                                </button>
                                
                                <button
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-300 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/5 transition-all flex items-center justify-center gap-2"
                                >
                                    <Printer size={16} />
                                    Print Paper
                                </button>

                                <button
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-300 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/5 transition-all flex items-center justify-center gap-2"
                                >
                                    <Share2 size={16} />
                                    Secure Link
                                </button>
                            </div>

                            <div className="hidden md:block">
                                <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] leading-relaxed">
                                    This credential is cryptographically signed and stored on the E-Shikshan secure cloud infrastructure.
                                </p>
                            </div>

                            <button onClick={onClose} className="hidden md:flex w-full py-4 bg-gray-900 hover:bg-gray-800 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/5 transition-all items-center justify-center gap-2">
                                <X size={16} />
                                Dismiss
                            </button>
                        </div>

                        {/* Certificate Canvas Container */}
                        <div className="flex-1 p-4 sm:p-8 md:p-12 overflow-y-auto custom-scrollbar flex items-center justify-center bg-[#0f111a]">
                            <div 
                                ref={certificateRef}
                                className="relative w-full aspect-[1.414/1] bg-[#0f111a] rounded-xl overflow-hidden shadow-2xl p-[2px] min-w-[320px]"
                            >
                                {/* Galactic Background */}
                                <div className="absolute inset-0 overflow-hidden rounded-xl">
                                    <div className="absolute inset-0 bg-[#0f111a]" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-[#0f111a] to-purple-900/40" />
                                    
                                    {/* Stars (Mimicking the galactic look) */}
                                    {[...Array(40)].map((_, i) => (
                                        <div 
                                            key={i}
                                            className="absolute bg-white rounded-full opacity-20"
                                            style={{
                                                width: Math.random() * 2 + 'px',
                                                height: Math.random() * 2 + 'px',
                                                top: Math.random() * 100 + '%',
                                                left: Math.random() * 100 + '%',
                                                filter: 'blur(0.5px)',
                                                animation: `pulse ${Math.random() * 3 + 2}s infinite ${Math.random() * 5}s`
                                            }}
                                        />
                                    ))}
                                    
                                    {/* Nebulas */}
                                    <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[100px] rounded-full" />
                                    <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-600/10 blur-[100px] rounded-full" />
                                </div>

                                {/* Main Card (Glassmorphism) */}
                                <div className="relative h-full w-full border border-white/10 rounded-xl flex flex-col p-12 backdrop-blur-sm bg-white/5 overflow-hidden">
                                     {/* Inner Decorative Border */}
                                    <div className="absolute inset-4 border border-white/5 rounded-lg pointer-events-none" />
                                    
                                    {/* Top Content */}
                                    <div className="flex flex-col items-center text-center space-y-2 mt-4">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/20" />
                                            <span className="text-xs font-black uppercase tracking-[0.4em] text-white/60">Certificate of Completion</span>
                                            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/20" />
                                        </div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Awarded On to {new Date(certificate.issuedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    </div>

                                    {/* Middle Content */}
                                    <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-6">
                                        <div className="relative mb-4">
                                            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full" />
                                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl border border-white/10 flex items-center justify-center p-6 shadow-2xl">
                                                <div className="relative">
                                                     <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-400" />
                                                     <Award className="absolute -top-4 -right-4 w-8 h-8 sm:w-10 sm:h-10 text-white fill-white" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tighter">{userData?.name || 'Academic Scholar'}</h3>
                                            <div className="h-[1px] w-24 bg-indigo-500/30 mx-auto" />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-indigo-500/10 px-6 py-2 rounded-full border border-indigo-500/20 inline-block">
                                                <p className="text-xs sm:text-sm font-black text-indigo-400 uppercase tracking-widest">{certificate.title}</p>
                                            </div>
                                            <p className="text-[10px] sm:text-xs text-gray-400 font-medium max-w-lg mx-auto leading-relaxed">
                                                By successfully completing this curriculum, the student has demonstrated specialized technical proficiency and academic excellence in the field of {certificate.title}.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bottom Content */}
                                    <div className="mt-auto flex justify-between items-end">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                                    <span className="text-white font-black text-[10px]">ES</span>
                                                </div>
                                                <span className="text-sm font-black text-white uppercase tracking-tighter">E-Shikshan</span>
                                            </div>
                                            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest pl-2 border-l border-white/10">
                                                Ref ID: {certificate.credentialId || (certificate._id?.substring(0, 8).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase())}
                                            </div>
                                        </div>

                                        <div className="text-right space-y-2">
                                            <div className="mb-4">
                                                 <p className="text-[14px] font-black italic text-gray-400 font-serif tracking-tight">Swarna Rajasekhar</p>
                                                 <div className="h-[1px] w-32 bg-gray-500/30 ml-auto mt-1" />
                                                 <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest mt-1">Academic Director</p>
                                            </div>
                                            <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em]">Verified Secure Credential</p>
                                        </div>
                                    </div>

                                    {/* Corner Details */}
                                    <div className="absolute top-0 right-0 p-8">
                                        <Sparkles className="w-4 h-4 text-white/10" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 p-8">
                                        <div className="w-1.5 h-1.5 bg-indigo-500/40 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.5; scale: 1.2; }
                }
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
            `}</style>
        </AnimatePresence>
    );
};

export default CertificatePreviewModal;
