'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react'; // I'll check if this is available or use another way
import { Sparkles, Globe, Monitor, Mail, Phone, ExternalLink } from 'lucide-react';

const BusinessCard = () => {
    return (
        <div className="min-h-screen bg-[#0b0c15] flex flex-col items-center justify-center p-8 text-white font-sans">
            {/* Container for the physical card mockups */}
            <div className="flex flex-col lg:flex-row gap-8 perspective-1000">

                {/* Front Side */}
                <div className="relative w-[400px] h-[225px] rounded-xl overflow-hidden shadow-2xl transition-transform hover:rotate-y-12 duration-500 group border border-white/10 glass">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#c084fc]/20 via-transparent to-[#38bdf8]/20 opacity-50" />
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />

                    <div className="relative h-full p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
                                    Ing. Luis Angel Romero Ramirez
                                </h1>
                                <p className="text-sm text-primary font-medium tracking-widest uppercase opacity-80">
                                    Desarrollador de Software
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="text-primary w-6 h-6 animate-pulse" />
                                <span className="font-bold text-xl tracking-tighter">AURA</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <Mail size={14} className="text-primary" />
                                <span>cercaniaweb@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <Globe size={14} className="text-primary" />
                                <span>aura-pos-official.vercel.app</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-green-400/80">
                                <Phone size={14} className="text-green-500" />
                                <span className="font-medium tracking-wide">WhatsApp: +52 56 6095 1415</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Side */}
                <div className="relative w-[400px] h-[225px] rounded-xl overflow-hidden shadow-2xl transition-transform hover:rotate-y-12 duration-500 group border border-white/10 glass bg-slate-900/40">
                    <div className="absolute inset-0 bg-gradient-to-tl from-[#6366f1]/10 to-transparent opacity-30" />

                    <div className="relative h-full flex p-6 gap-6 items-center">
                        {/* QR 1: Demo */}
                        <div className="flex-1 flex flex-col items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-lg">
                                {/* Simplified QR Placeholder for code logic */}
                                <div className="w-24 h-24 bg-slate-900 flex items-center justify-center overflow-hidden">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://aura-pos-fawn.vercel.app/login`} alt="QR Demo" />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-primary">Acceso Demo</p>
                                <div className="flex items-center justify-center gap-1 mt-1">
                                    <Monitor size={10} className="text-slate-500" />
                                    <span className="text-[9px] text-slate-400">fawn.vercel.app</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-px h-2/3 bg-white/10 self-center" />

                        {/* QR 2: Web Official */}
                        <div className="flex-1 flex flex-col items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-lg">
                                <div className="w-24 h-24 bg-slate-900 flex items-center justify-center overflow-hidden">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://aura-pos-official.vercel.app/`} alt="QR Official" />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-[#c084fc]">Sitio Oficial</p>
                                <div className="flex items-center justify-center gap-1 mt-1">
                                    <Globe size={10} className="text-slate-500" />
                                    <span className="text-[9px] text-slate-400">official.vercel.app</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center max-w-lg">
                <p className="text-slate-500 text-sm">
                    Tarjeta de presentación digital diseñada para <span className="text-white font-medium">Ing. Luis Angel Romero Ramirez</span>.
                    Estilos basados en el ecosistema <strong>AURA POS</strong>.
                </p>
            </div>

            <style jsx>{`
        .glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-y-12:hover {
          transform: rotateY(12deg) rotateX(2deg);
        }
      `}</style>
        </div>
    );
};

export default BusinessCard;
