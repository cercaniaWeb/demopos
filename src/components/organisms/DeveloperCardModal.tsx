import React from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import Text from '@/components/atoms/Text';

interface DeveloperCardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DeveloperCardModal: React.FC<DeveloperCardModalProps> = ({ isOpen, onClose }) => {
    const [copied, setCopied] = React.useState(false);
    const cardUrl = typeof window !== 'undefined' ? `${window.location.origin}/tarjeta` : '';

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(cardUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-8 flex flex-col items-center text-center space-y-6">

                    {/* Header */}
                    <div>
                        <div className="inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 mb-4 shadow-lg shadow-cyan-500/10">
                            <span className="text-2xl">👨‍💻</span>
                        </div>
                        <Text variant="h3" className="font-bold text-white mb-1">
                            Contacto de Desarrollo
                        </Text>
                        <Text variant="body" className="text-slate-400">
                            Escanea para guardar mi tarjeta digital
                        </Text>
                    </div>

                    {/* QR Code */}
                    <div className="bg-white p-3 rounded-xl shadow-inner relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10 rounded-xl"></div>
                        {cardUrl && (
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(cardUrl)}`}
                                alt="QR Tarjeta Digital"
                                className="w-48 h-48 object-contain mix-blend-multiply"
                            />
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex w-full gap-3">
                        <button
                            onClick={handleCopy}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 hover:border-slate-600"
                        >
                            {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                            <span className="text-sm font-medium">{copied ? 'Copiado' : 'Copiar Link'}</span>
                        </button>

                        <a
                            href={cardUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all shadow-lg shadow-cyan-500/20"
                        >
                            <ExternalLink size={18} />
                            <span className="text-sm font-medium">Abrir</span>
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DeveloperCardModal;
