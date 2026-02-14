'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useSettingsStore((state) => state.theme);

    useEffect(() => {
        const root = document.body; // or document.documentElement

        // Remove existing theme classes
        root.classList.remove('theme-emerald');
        root.classList.remove('theme-daylight');

        // Apply new theme class if it's not the default 'void'
        if (theme === 'emerald') {
            root.classList.add('theme-emerald');
        } else if (theme === 'daylight') {
            root.classList.add('theme-daylight');
        }

        // Optional: Save to local storage or handle system preferences here if not using zustand persist
    }, [theme]);

    // Prevent flash of wrong theme by waiting for hydration? 
    // With zustand persist, it might flash default state first. 
    // For now, simpler is better.

    return <>{children}</>;
}
