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
        // Generar vCard simple
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
        <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="z-10 w-full max-w-md flex flex-col gap-6">

                {/* Header Mobile Title */}
                <div className="text-center md:hidden mb-2 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-mono text-slate-300">Open for work</span>
                    </div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
                        Luis Angel Romero
                    </h1>
                    <p className="text-cyan-400/90 font-mono text-sm mt-1">CEO & Software Architect</p>
                </div>

                {/* Card Container - Interactive 3D Flip on Desktop, Stacked on Mobile */}
                <div
                    className="relative group perspective-1000 w-full aspect-[1.7/1] cursor-pointer hidden md:block"
                    onClick={handleFlip}
                >
                    <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                        {/* Front Side (Desktop) */}
                        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/40 backdrop-blur-xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 pointer-events-none" />
                            <div className="relative h-full p-8 flex flex-col justify-between z-10">
                                <div className="flex justify-between items-start">
                                    <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5 shadow-inner">
                                        <Sparkles className="text-cyan-400 w-8 h-8" />
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-2xl font-bold text-white tracking-tight">CercaniaWeb</h3>
                                        <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Digital Solutions</p>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium text-white mb-1">Ing. Luis Angel Romero</h2>
                                    <div className="h-px w-12 bg-cyan-500/50 mb-2"></div>
                                    <p className="text-sm text-slate-400 font-mono">CEO & Software Architect</p>
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full" />
                            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full" />
                        </div>

                        {/* Back Side (Desktop) */}
                        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/80 backdrop-blur-xl p-8 flex items-center justify-around gap-4">
                            <div className="text-center group/qr">
                                <div className="bg-white p-2 rounded-xl mb-3 shadow-lg transform transition-transform group-hover/qr:scale-105">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://aura-pos-fawn.vercel.app/login`} alt="Demo QR" className="w-24 h-24" />
                                </div>
                                <p className="text-xs font-bold text-white mb-1">DEMO</p>
                                <span className="text-[10px] text-slate-400 font-mono">try aura pos</span>
                            </div>
                            <div className="h-2/3 w-px bg-white/10"></div>
                            <div className="text-center group/qr">
                                <div className="bg-white p-2 rounded-xl mb-3 shadow-lg transform transition-transform group-hover/qr:scale-105">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://aura-pos-official.vercel.app/`} alt="Official QR" className="w-24 h-24" />
                                </div>
                                <p className="text-xs font-bold text-white mb-1">WEBSITE</p>
                                <span className="text-[10px] text-slate-400 font-mono">visit official</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile View (Card Stack) */}
                <div className="md:hidden space-y-4 w-full">
                    {/* Main Info Card */}
                    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-[40px] rounded-full -mr-10 -mt-10"></div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center shadow-inner">
                                <span className="text-xl font-bold text-white">LA</span>
                            </div>
                            <div>
                                <h3 className="text-white font-medium">Ing. Luis Angel Romero</h3>
                                <p className="text-cyan-400 text-xs font-mono">@lrs_dev</p>
                            </div>
                            <div className="ml-auto">
                                <a
                                    href="https://wa.me/525660951415?text=Hola,%20vi%20tu%20tarjeta%20digital%20y%20me%20gustar%C3%ADa%20contactarte."
                                    target="_blank"
                                    className="h-10 w-10 flex items-center justify-center rounded-full bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600 hover:text-white transition-all shadow-lg shadow-green-900/20"
                                >
                                    <MessageCircle size={20} />
                                </a>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <a href="mailto:cercaniaweb@gmail.com" className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors group/link p-2 hover:bg-white/5 rounded-lg -mx-2">
                                <div className="bg-slate-800 p-2 rounded-md text-cyan-400 group-hover/link:text-cyan-300 transition-colors">
                                    <Mail size={16} />
                                </div>
                                <span className="truncate">cercaniaweb@gmail.com</span>
                            </a>
                            <a href="https://aura-pos-official.vercel.app" target="_blank" className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors group/link p-2 hover:bg-white/5 rounded-lg -mx-2">
                                <div className="bg-slate-800 p-2 rounded-md text-purple-400 group-hover/link:text-purple-300 transition-colors">
                                    <Globe size={16} />
                                </div>
                                <span className="truncate">aura-pos-official.vercel.app</span>
                            </a>
                            <div className="flex items-center gap-3 text-sm text-slate-300 p-2 rounded-lg -mx-2 hover:bg-white/5 group/link">
                                <div className="bg-slate-800 p-2 rounded-md text-green-400 group-hover/link:text-green-300 transition-colors">
                                    <Phone size={16} />
                                </div>
                                <span className="truncate">+52 56 6095 1415</span>
                            </div>
                        </div>
                    </div>

                    {/* QR Actions Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <a href="https://aura-pos-fawn.vercel.app/login" target="_blank" className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-cyan-500/30 transition-all active:scale-95 flex flex-col items-center justify-center gap-3 group">
                            <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://aura-pos-fawn.vercel.app/login`} alt="QR" className="w-16 h-16 mix-blend-multiply" />
                            </div>
                            <span className="text-xs font-bold text-slate-300 group-hover:text-white">Ver Demo</span>
                        </a>
                        <a href="https://aura-pos-official.vercel.app/" target="_blank" className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-purple-500/30 transition-all active:scale-95 flex flex-col items-center justify-center gap-3 group">
                            <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://aura-pos-official.vercel.app/`} alt="QR" className="w-16 h-16 mix-blend-multiply" />
                            </div>
                            <span className="text-xs font-bold text-slate-300 group-hover:text-white">Sitio Web</span>
                        </a>
                    </div>
                </div>

                {/* Shared Action Toolbar (Floating) */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl z-50 animate-fade-in-up">
                    <button
                        onClick={handleSaveContact}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full text-sm font-medium shadow-lg shadow-cyan-500/20 transition-all active:scale-95 whitespace-nowrap"
                    >
                        <Download size={16} />
                        <span>Guardar</span>
                    </button>

                    <div className="w-px h-6 bg-white/10 mx-1"></div>

                    <a
                        href="https://wa.me/525660951415?text=Hola,%20vi%20tu%20tarjeta%20digital%20y%20me%20gustar%C3%ADa%20contactarte."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-full transition-colors"
                        title="WhatsApp"
                    >
                        <MessageCircle size={18} />
                    </a>

                    <a
                        href="mailto:cercaniaweb@gmail.com"
                        className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        title="Enviar Correo"
                    >
                        <Mail size={18} />
                    </a>

                    <button
                        onClick={handleCopyLink}
                        className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors relative"
                        title="Copiar Enlace"
                    >
                        {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                    </button>

                    <button
                        onClick={handleShare}
                        className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        title="Compartir"
                    >
                        <Share2 size={18} />
                    </button>
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
                .perspective-1000 {
                    perspective: 1000px;
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
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default DigitalBusinessCard;
