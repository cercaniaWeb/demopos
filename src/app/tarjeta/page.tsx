'use client';

import DigitalBusinessCard from '@/components/templates/DigitalBusinessCard';

export default function TarjetaPage() {
    return (
        <main className="min-h-screen bg-[#0b0c15]">
            {/* 
         Esta página está diseñada para ser mostrada en dispositivos móviles 
         como una tarjeta de presentación digital.
      */}
            <DigitalBusinessCard />

            {/* Botón flotante rápido para compartir o guardar */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-3">
                <button
                    onClick={() => window.print()}
                    className="bg-primary/20 hover:bg-primary/40 text-primary p-3 rounded-full backdrop-blur-md border border-primary/30 transition-all shadow-lg shadow-primary/20"
                    title="Imprimir Tarjeta"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 9V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5" /><rect x="6" y="14" width="12" height="8" rx="2" /></svg>
                </button>
            </div>
        </main>
    );
}
