'use client';

import React, { useState } from 'react';
import { Sparkles, Globe, Monitor, Mail, Phone, Share2, Download, Copy, Check, MessageCircle } from 'lucide-react';
import AuraIcon from '../atoms/AuraIcon';

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
                        Ing. Luis Angel Romero
                    </h1>
                    <p className="text-cyan-400 font-mono text-xs sm:text-sm tracking-[0.2em] uppercase font-bold">CEO & Software Architect</p>
                </div>

                {/* Main Content Area: Resilient 3D Card */}
                <div className="relative w-full">
                    {/* Responsive 3D Card - Now visible on all screens with adjusted scaling */}
                    <div
                        className="relative group perspective-2000 w-full aspect-[1.7/1] sm:aspect-[1.7/1] cursor-pointer"
                        onClick={handleFlip}
                    >
                        <div className={`relative w-full h-full transition-all duration-1000 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                            {/* Front Side */}
                            <div className="absolute inset-0 w-full h-full backface-hidden rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900/40 backdrop-blur-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                <div className="relative h-full p-5 sm:p-10 flex flex-col justify-between z-10">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-slate-950/80 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-white/5 shadow-2xl group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                                            {/* Aura Logo with subtle bounce animation */}
                                            <div className="block sm:hidden">
                                                <AuraIcon size={24} className="animate-float" showParticles={true} pulsing={true} />
                                            </div>
                                            <div className="hidden sm:block">
                                                <AuraIcon size={40} className="animate-float" showParticles={true} pulsing={true} />
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <h3 className="text-lg sm:text-3xl font-black text-white tracking-tighter">CercaniaWeb</h3>
                                            <p className="text-[8px] sm:text-[10px] text-cyan-400/60 font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold">Digital Excellence</p>
                                        </div>
                                    </div>
                                    <div className="group-hover:translate-x-2 transition-transform duration-500">
                                        <h2 className="text-lg sm:text-2xl font-bold text-white mb-1">Ing. Luis Angel Romero</h2>
                                        <div className="h-0.5 sm:h-1 w-12 sm:w-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-2 sm:mb-3 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                                        <p className="text-[10px] sm:text-sm text-slate-400 font-mono tracking-wider">Software Architect & Innovator</p>
                                    </div>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-32 sm:w-40 h-32 sm:h-40 bg-cyan-500/20 blur-[60px] rounded-full" />
                                <div className="absolute -top-10 -left-10 w-32 sm:w-40 h-32 sm:h-40 bg-purple-500/20 blur-[60px] rounded-full" />
                            </div>

                            {/* Back Side */}
                            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900/90 backdrop-blur-2xl p-4 sm:p-10 flex items-center justify-around gap-2 sm:gap-4">
                                <div className="text-center group/qr flex-1">
                                    <div className="bg-white p-2 sm:p-3 rounded-xl sm:rounded-2xl mb-2 sm:mb-4 shadow-2xl transform transition-all duration-500 group-hover/qr:scale-110 group-hover/qr:rotate-3 flex items-center justify-center mx-auto w-fit">
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://aura-pos-fawn.vercel.app/login`} alt="Demo QR" className="w-16 h-16 sm:w-28 sm:h-28 mix-blend-multiply" />
                                    </div>
                                    <p className="text-[8px] sm:text-xs font-black text-white mb-0.5 sm:mb-1 tracking-widest uppercase">AURA | DEMO</p>
                                    <span className="text-[7px] sm:text-[10px] text-cyan-400 font-mono font-bold uppercase">Experience it now</span>
                                </div>
                                <div className="h-16 sm:h-2/3 w-px bg-white/10"></div>
                                <div className="text-center group/qr flex-1">
                                    <div className="bg-white p-2 sm:p-3 rounded-xl sm:rounded-2xl mb-2 sm:mb-4 shadow-2xl transform transition-all duration-500 group-hover/qr:scale-110 group-hover/qr:-rotate-3 flex items-center justify-center mx-auto w-fit">
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://aura-pos-official.vercel.app/`} alt="Official QR" className="w-16 h-16 sm:w-28 sm:h-28 mix-blend-multiply" />
                                    </div>
                                    <p className="text-[8px] sm:text-xs font-black text-white mb-0.5 sm:mb-1 tracking-widest uppercase">WEBSITE</p>
                                    <span className="text-[7px] sm:text-[10px] text-purple-400 font-mono font-bold uppercase">Our official site</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info / Skills Section */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 animate-fade-in-up delay-300">
                    <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/5 text-center transition-all hover:bg-white/5">
                        <Monitor className="text-cyan-400 mx-auto mb-1 sm:mb-2 opacity-60 w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-[8px] sm:text-xs font-bold text-slate-400 tracking-wider">FULL STACK</p>
                    </div>
                    <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/5 text-center transition-all hover:bg-white/5">
                        <Share2 className="text-purple-400 mx-auto mb-1 sm:mb-2 opacity-60 w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-[8px] sm:text-xs font-bold text-slate-400 tracking-wider">STRATEGY</p>
                    </div>
                    <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/5 text-center transition-all hover:bg-white/5">
                        <Monitor className="text-blue-400 mx-auto mb-1 sm:mb-2 opacity-60 w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-[8px] sm:text-xs font-bold text-slate-400 tracking-wider">UX DESIGN</p>
                    </div>
                </div>

                {/* Main Action Bar (Fixed Dock Optimized) */}
                <div className="fixed bottom-6 left-0 right-0 mx-auto w-fit max-w-[96%] flex items-center justify-center gap-1 sm:gap-3 p-1.5 sm:p-2 bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 animate-fade-in-up transition-all">
                    <button
                        onClick={handleSaveContact}
                        className="flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full text-[10px] sm:text-sm font-black uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap shadow-lg shadow-cyan-500/20 shrink-0"
                    >
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce" />
                        <span>Guardar</span>
                    </button>

                    <div className="w-px h-5 bg-white/10 mx-0.5 sm:mx-1 shrink-0"></div>

                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                        <a href="https://wa.me/525660951415" target="_blank" rel="noopener noreferrer" className="p-2 sm:p-3 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-full transition-all active:scale-95 flex items-center justify-center" title="WhatsApp">
                            <MessageCircle className="w-5 h-5 sm:w-5 sm:h-5" strokeWidth={2} />
                        </a>

                        <a href="mailto:cercaniaweb@gmail.com" className="p-2 sm:p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95 flex items-center justify-center" title="Email">
                            <Mail className="w-5 h-5 sm:w-5 sm:h-5" strokeWidth={2} />
                        </a>

                        <button onClick={handleCopyLink} className="p-2 sm:p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95 flex items-center justify-center" title="Copiar Enlace">
                            {copied ? <Check className="w-5 h-5 sm:w-5 sm:h-5 text-green-400" /> : <Copy className="w-5 h-5 sm:w-5 sm:h-5" strokeWidth={2} />}
                        </button>

                        <button onClick={handleShare} className="p-2 sm:p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95 flex items-center justify-center" title="Compartir">
                            <Share2 className="w-5 h-5 sm:w-5 sm:h-5" strokeWidth={2} />
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
