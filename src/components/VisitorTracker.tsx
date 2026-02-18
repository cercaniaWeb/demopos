'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Solo rastrear en producción para no ensuciar datos locales
        if (process.env.NODE_ENV === 'development') {
            console.log('VisitorTracker: Rastreo omitido en desarrollo para el path:', pathname);
            // return; // Descomenta esto si quieres omitir el rastreo local
        }

        const trackVisit = async () => {
            try {
                await fetch('/api/track', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ path: pathname }),
                });
            } catch (error) {
                console.error('Error enviando datos de rastreo:', error);
            }
        };

        trackVisit();
    }, [pathname]);

    return null;
}
