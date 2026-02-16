import React from 'react';
import { Sparkles } from 'lucide-react';

interface AuraIconProps {
    className?: string;
    size?: number;
    showParticles?: boolean;
    pulsing?: boolean;
}

const AuraIcon: React.FC<AuraIconProps> = ({
    className = '',
    size = 24,
    showParticles = true,
    pulsing = true
}) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            {/* The Glow Effect */}
            {pulsing && (
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse" />
            )}

            {/* The Styled "A" */}
            <span
                className="font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-600 select-none leading-none"
                style={{ fontSize: `${size}px` }}
            >
                A
            </span>

            {/* Particles around the A */}
            {showParticles && (
                <>
                    <Sparkles
                        className="absolute -top-1 -right-1 text-primary opacity-60 animate-pulse"
                        size={size * 0.5}
                    />
                    <Sparkles
                        className="absolute -bottom-0.5 -left-1 text-purple-400 opacity-40"
                        size={size * 0.35}
                    />
                </>
            )}

            {/* Pulse Indicator */}
            {pulsing && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
            )}
        </div>
    );
};

export default AuraIcon;
