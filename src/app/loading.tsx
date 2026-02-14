import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0b0c15] text-white gap-6">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                <img src="/iconoapp.png" alt="AURA Logo" className="h-24 w-24 relative z-10" />
            </div>
            <div className="flex flex-col items-center gap-2">
                <p className="text-xl font-bold text-gradient tracking-widest animate-pulse">AURA</p>
                <p className="text-xs text-slate-500 uppercase tracking-[0.2em]">Iniciando sistemas...</p>
            </div>
        </div>
    );
}
