'use client';

import React, { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { useAuthStore } from '@/store/authStore';

const DemoTour: React.FC = () => {
    const { isDemo } = useAuthStore();
    const [run, setRun] = useState(false);

    useEffect(() => {
        if (isDemo) {
            const hasSeenTour = localStorage.getItem('has_seen_demo_tour');
            if (!hasSeenTour) {
                setRun(true);
            }
        }
    }, [isDemo]);

    const steps: Step[] = [
        {
            target: 'body',
            placement: 'center',
            content: (
                <div className="text-left">
                    <h3 className="text-xl font-bold mb-2 text-blue-600">¡Bienvenido a la Demo!</h3>
                    <p className="text-gray-600">
                        Esta es una versión independiente y segura para que explores todas las funcionalidades de
                        <strong> Recoom POS</strong> sin afectar los datos reales de producción.
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-gray-500">
                        <li>• Las respuestas de la IA son simuladas (sin costo de tokens).</li>
                        <li>• Puedes generar ventas y movimientos libremente.</li>
                        <li>• Al cerrar la sesión, todos tus movimientos de prueba serán eliminados.</li>
                    </ul>
                </div>
            ),
            disableBeacon: true,
        },
        {
            target: '[id^="pos"]',
            content: 'Aquí puedes procesar ventas rápidas, escanear productos y gestionar cobros.',
            title: 'Punto de Venta',
        },
        {
            target: '[id^="inventory"]',
            content: 'Gestiona tu stock, realiza transferencias entre sucursales y controla entradas/salidas.',
            title: 'Control de Inventario',
        },
        {
            target: '[id^="voice-inventory"]',
            content: 'Utiliza comandos de voz para realizar inventarios de forma ágil y manos libres.',
            title: 'Asistente de Voz',
        },
        {
            target: 'button:has(svg.lucide-sparkles), .lucide-sparkles',
            content: 'Nuestro asistente inteligente te dará recomendaciones de reabastecimiento y análisis de tus ventas.',
            title: 'Inteligencia Artificial',
        },
        {
            target: '[id^="reports"]',
            content: 'Visualiza el rendimiento de tu negocio con gráficas detalladas y reportes descargables.',
            title: 'Analítica Avanzada',
        },
    ];

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem('has_seen_demo_tour', 'true');
        }
    };

    if (!isDemo) return null;

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            hideBackButton
            run={run}
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={steps}
            styles={{
                options: {
                    primaryColor: '#3b82f6',
                    zIndex: 1000,
                },
                tooltipContainer: {
                    textAlign: 'left',
                },
                buttonNext: {
                    borderRadius: '8px',
                    padding: '10px 20px',
                },
                buttonSkip: {
                    color: '#94a3b8',
                }
            }}
            locale={{
                back: 'Atrás',
                close: 'Cerrar',
                last: 'Finalizar',
                next: 'Siguiente',
                skip: 'Omitir tour',
            }}
        />
    );
};

export default DemoTour;
