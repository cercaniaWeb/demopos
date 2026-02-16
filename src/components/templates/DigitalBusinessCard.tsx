'use client';

import React, { useState } from 'react';
import { Sparkles, Globe, Monitor, Mail, Phone, Share2, Download, Copy, Check, MessageCircle } from 'lucide-react';

const DigitalBusinessCard = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Ing. Luis Angel Romero Ramirez - Tarjeta Digital',
                    text: 'Contacta a un experto en desarrollo de software.',
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error compartiendo', error);
            }
        } else {
            handleCopyLink();
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSaveContact = () => {
        const vCardData = `BEGIN:VCARD
VERSION:3.0
N:Romero Ramirez;Luis Angel;;Ing.;
FN:Ing. Luis Angel Romero Ramirez
ORG:CercaniaWeb
TITLE:CEO & Software Architect
TEL;TYPE=CELL:+525660951415
EMAIL:cercaniaweb@gmail.com
URL:https://aura-pos-official.vercel.app
END:VCARD`;
        const blob = new Blob([vCardData], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Luis_Angel_Romero.vcf';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="relative min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-start sm:justify-center p-4 sm:p-8 overflow-x-hidden antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Background Effects - Optimized for performance */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="z-10 w-full max-w-lg flex flex-col gap-6 sm:gap-10 pb-24 sm:pb-0">
                {/* Status Badge & Header */}
                <div className="text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] sm:text-xs font-mono text-slate-300 uppercase tracking-widest font-semibold">Ready for new projects</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tighter leading-none mb-2">
                        Luis Angel Romero
                    </h1>
                    <p className="text-cyan-400 font-mono text-xs sm:text-sm tracking-[0.2em] uppercase font-bold">CEO & Software Architect</p>
                </div>

                {/* Main Content Area: Resilient 3D Card */}
                <div className="relative w-full">
                    {/* Desktop/Tablet 3D Card (Hidden on very small screens or switched to 2D) */}
                    <div
                        className="relative group perspective-2000 w-full aspect-[1.7/1] cursor-pointer hidden sm:block"
                        onClick={handleFlip}
                    >
                        <div className={`relative w-full h-full transition-all duration-1000 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                            {/* Front Side */}
                            <div className="absolute inset-0 w-full h-full backface-hidden rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900/40 backdrop-blur-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                <div className="relative h-full p-6 sm:p-10 flex flex-col justify-between z-10">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                            <Sparkles className="text-cyan-400 w-8 h-8 sm:w-10 sm:h-10 animate-float" />
                                        </div>
                                        <div className="text-right">
                                            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tighter">CercaniaWeb</h3>
                                            <p className="text-[10px] text-cyan-400/60 font-mono uppercase tracking-[0.3em] font-bold">Digital Excellence</p>
                                        </div>
                                    </div>
                                    <div className="group-hover:translate-x-2 transition-transform duration-500">
                                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Ing. Luis Angel Romero</h2>
                                        <div className="h-1 w-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-3 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                                        <p className="text-xs sm:text-sm text-slate-400 font-mono tracking-wider">Software Architect & Innovator</p>
                                    </div>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/20 blur-[60px] rounded-full" />
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 blur-[60px] rounded-full" />
                            </div>

                            {/* Back Side */}
                            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-around gap-6 sm:gap-4">
                                <div className="text-center group/qr w-full sm:w-auto">
                                    <div className="bg-white p-3 rounded-2xl mb-4 shadow-2xl transform transition-all duration-500 group-hover/qr:scale-110 group-hover/qr:rotate-3 flex items-center justify-center mx-auto w-fit">
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://aura-pos-fawn.vercel.app/login`} alt="Demo QR" className="w-24 h-24 sm:w-28 sm:h-28 mix-blend-multiply" />
                                    </div>
                                    <p className="text-xs font-black text-white mb-1 tracking-widest uppercase">AURA | DEMO</p>
                                    <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase">Experience it now</span>
                                </div>
                                <div className="hidden sm:block h-2/3 w-px bg-white/10"></div>
                                <div className="text-center group/qr w-full sm:w-auto">
                                    <div className="bg-white p-3 rounded-2xl mb-4 shadow-2xl transform transition-all duration-500 group-hover/qr:scale-110 group-hover/qr:-rotate-3 flex items-center justify-center mx-auto w-fit">
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://aura-pos-official.vercel.app/`} alt="Official QR" className="w-24 h-24 sm:w-28 sm:h-28 mix-blend-multiply" />
                                    </div>
                                    <p className="text-xs font-black text-white mb-1 tracking-widest uppercase">WEBSITE</p>
                                    <span className="text-[10px] text-purple-400 font-mono font-bold uppercase">Our official site</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Card Layout (Stack) - Visible only on mobile */}
                    <div className="sm:hidden space-y-4">
                        <div className="glass rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden active:scale-[0.98] transition-all">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/15 blur-[40px] rounded-full -mr-16 -mt-16"></div>
                            <div className="flex items-center gap-5 mb-8">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-white/10 flex items-center justify-center shadow-2xl rotate-3">
                                    <Sparkles size={32} className="text-cyan-400 animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white leading-tight">Luis Angel Romero</h3>
                                    <p className="text-cyan-400 text-[10px] font-mono font-black uppercase tracking-widest">Software Architect</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <a href="mailto:cercaniaweb@gmail.com" className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                                        <Mail size={18} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-200 truncate">cercaniaweb@gmail.com</span>
                                </a>
                                <a href="https://aura-pos-official.vercel.app" target="_blank" className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                        <Globe size={18} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-200 truncate">aura-pos-official.vercel.app</span>
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <a href="https://aura-pos-fawn.vercel.app/login" target="_blank" className="glass rounded-3xl p-5 border border-white/10 flex flex-col items-center gap-4 active:scale-95 transition-all">
                                <div className="bg-white p-2 rounded-xl shadow-xl">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://aura-pos-fawn.vercel.app/login`} alt="QR" className="w-16 h-16 mix-blend-multiply" />
                                </div>
                                <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Demo App</span>
                            </a>
                            <a href="https://aura-pos-official.vercel.app/" target="_blank" className="glass rounded-3xl p-5 border border-white/10 flex flex-col items-center gap-4 active:scale-95 transition-all">
                                <div className="bg-white p-2 rounded-xl shadow-xl">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://aura-pos-official.vercel.app/`} alt="QR" className="w-16 h-16 mix-blend-multiply" />
                                </div>
                                <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Web Oficial</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Additional Info / Skills Section (Works as responsive grid) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in-up delay-300">
                    <div className="glass rounded-2xl p-4 border border-white/5 text-center transition-all hover:bg-white/5">
                        <Monitor className="text-cyan-400 mx-auto mb-2 opacity-60" size={20} />
                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider">FULL STACK</p>
                    </div>
                    <div className="glass rounded-2xl p-4 border border-white/5 text-center transition-all hover:bg-white/5">
                        <Share2 className="text-purple-400 mx-auto mb-2 opacity-60" size={20} />
                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider">STRATEGY</p>
                    </div>
                    <div className="glass rounded-2xl p-4 border border-white/5 text-center transition-all hover:bg-white/5 hidden sm:block">
                        <Monitor className="text-blue-400 mx-auto mb-2 opacity-60" size={20} />
                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider">UX DESIGN</p>
                    </div>
                </div>

                {/* Main Action Bar (Optimized Floating Dock) */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-3 p-2 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 animate-fade-in-up transition-all w-[90%] sm:w-auto overflow-x-auto sm:overflow-visible no-scrollbar">
                    <button
                        onClick={handleSaveContact}
                        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full text-xs sm:text-sm font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(6,182,212,0.3)] transition-all active:scale-95 hover:scale-105"
                    >
                        <Download size={16} className="animate-bounce" />
                        <span>Guardar</span>
                    </button>

                    <div className="w-px h-6 bg-white/20 mx-1"></div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <a href="https://wa.me/525660951415" target="_blank" rel="noopener noreferrer" className="p-3 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-full transition-all hover:scale-110 active:scale-90" title="WhatsApp">
                            <MessageCircle size={20} strokeWidth={2.5} />
                        </a>

                        <a href="mailto:cercaniaweb@gmail.com" className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all hover:scale-110 active:scale-90" title="Email">
                            <Mail size={20} strokeWidth={2.5} />
                        </a>

                        <button onClick={handleCopyLink} className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all hover:scale-110 active:scale-90" title="Copiar Enlace">
                            {copied ? <Check size={20} className="text-green-400 animate-scale-in" /> : <Copy size={20} strokeWidth={2.5} />}
                        </button>

                        <button onClick={handleShare} className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all hover:scale-110 active:scale-90" title="Compartir">
                            <Share2 size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s infinite ease-in-out;
                }
                .perspective-2000 {
                    perspective: 2000px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                @keyframes scale-in {
                    0% { transform: scale(0); }
                    100% { transform: scale(1); }
                }
                .animate-scale-in {
                    animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .delay-300 { animation-delay: 0.3s; }
                .glass {
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }
            `}</style>
        </div>
    );
};

export default DigitalBusinessCard;
