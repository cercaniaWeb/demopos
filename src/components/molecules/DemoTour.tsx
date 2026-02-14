'use client';

import React, { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS, EVENTS } from 'react-joyride';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';

const DemoTour: React.FC = () => {
    const { isDemo } = useAuthStore();
    const pathname = usePathname();
    const [run, setRun] = useState(false);
    const [steps, setSteps] = useState<Step[]>([]);

    useEffect(() => {
        if (!isDemo) return;

        // Reset run state when path changes to allow re-triggering if needed
        setRun(false);

        let newSteps: Step[] = [];

        // Define steps based on current path
        if (pathname === '/' || pathname === '/dashboard') {
            const hasSeenDashboard = localStorage.getItem('demo_tour_dashboard');
            if (!hasSeenDashboard) {
                newSteps = [
                    {
                        target: 'body',
                        placement: 'center',
                        content: (
                            <div className="text-left">
                                <h3 className="text-xl font-bold mb-2 text-primary">¡Bienvenido a AURA!</h3>
                                <p className="text-muted-foreground mb-2">
                                    Tu copiloto inteligente para el crecimiento de tu negocio.
                                </p>
                                <p className="text-sm text-gray-500">
                                    Esta demo te guiará para personalizar tu entorno y realizar tu primera venta.
                                </p>
                            </div>
                        ),
                        disableBeacon: true,
                    },
                    {
                        target: '#settings',
                        content: 'AURA es camaleónico. Puedes cambiar entre temas como "Daylight" (claro) y "Void" (oscuro) desde aquí para mejorar tu productividad según la hora del día.',
                        title: 'Apariencia Dinámica',
                    },
                    {
                        target: '#pos',
                        content: 'El Terminal de Ventas es donde ocurre la magia. Hemos optimizado cada clic para que atiendas más rápido.',
                        title: 'Punto de Venta',
                    },
                    {
                        target: '#inventory',
                        content: 'Control total de tu stock. AURA te avisa cuando tus productos estrella necesitan resurtido.',
                        title: 'Inventario Inteligente',
                    },
                    {
                        target: '#reports',
                        content: 'Toma decisiones con datos reales. Visualiza tus ganancias y tendencias al instante.',
                        title: 'Analítica Avanzada',
                    },
                    {
                        target: '#chatbot-trigger',
                        content: '¿Necesitas un reporte rápido? Aura IA puede analizar tus ventas y darte respuestas inmediatas por voz o texto.',
                        title: 'Inteligencia Aura',
                    }
                ];
            }
        } else if (pathname === '/pos') {
            const hasSeenPOS = localStorage.getItem('demo_tour_pos');
            if (!hasSeenPOS) {
                newSteps = [
                    {
                        target: 'body',
                        placement: 'center',
                        content: (
                            <div>
                                <h3 className="text-lg font-bold text-primary">Genera tu Primera Venta</h3>
                                <p>Sigue estos pasos para ver a AURA en acción.</p>
                            </div>
                        ),
                        disableBeacon: true,
                    },
                    {
                        target: '#pos-grid',
                        content: 'Haz clic en cualquier producto para añadirlo al carrito. Observa el badge de "Producto Estrella" en los más vendidos.',
                        title: 'Añadir Productos',
                    },
                    {
                        target: '#pos-cart',
                        content: 'Aquí verás el resumen de tu venta actual y los totales calculados en tiempo real.',
                        title: 'Tu Carrito',
                    },
                    {
                        target: '#pos-pay',
                        content: 'Haz clic en el botón principal de "Pagar" para abrir las opciones de cobro.',
                        title: 'Iniciar Pago',
                    },
                    {
                        target: '#pos-complete-payment',
                        content: 'Para terminar, selecciona el método de pago y haz clic aquí. ¡AURA generará el ticket automáticamente!',
                        title: 'Completar Venta',
                    }
                ];
            }
        } else if (pathname.startsWith('/inventory')) {
            const hasSeenInv = localStorage.getItem('demo_tour_inventory');
            if (!hasSeenInv) {
                newSteps = [
                    {
                        target: 'body',
                        placement: 'center',
                        content: (
                            <div>
                                <h3 className="text-lg font-bold text-blue-600">Gestión de Inventario</h3>
                                <p>Mantén tu stock sincronizado y organizado.</p>
                            </div>
                        ),
                        disableBeacon: true,
                    },
                    {
                        target: 'table',
                        content: 'Visualiza existencias en tiempo real. Los cambios aquí se reflejan al instante en todas las cajas.',
                    },
                    {
                        target: 'button:has(svg.lucide-plus)',
                        content: 'Agrega nuevos productos o realiza ajustes de stock manuales.',
                    }
                ];
            }
        } else if (pathname.startsWith('/products')) {
            const hasSeenProd = localStorage.getItem('demo_tour_products');
            if (!hasSeenProd) {
                newSteps = [
                    {
                        target: 'body',
                        placement: 'center',
                        content: (
                            <div>
                                <h3 className="text-lg font-bold text-blue-600">Catálogo de Productos</h3>
                                <p>Administra precios, costos y detalles de tus productos.</p>
                            </div>
                        ),
                        disableBeacon: true,
                    },
                    {
                        target: 'button:has(svg.lucide-plus)',
                        content: 'Crea productos manualmente o impórtalos masivamente.',
                    }
                ];
            }
        } else if (pathname.startsWith('/reports')) {
            const hasSeenReports = localStorage.getItem('demo_tour_reports');
            if (!hasSeenReports) {
                newSteps = [
                    {
                        target: 'body',
                        placement: 'center',
                        content: (
                            <div>
                                <h3 className="text-lg font-bold text-blue-600">Reportes y Analítica</h3>
                                <p>Entiende el comportamiento de tu negocio.</p>
                            </div>
                        ),
                        disableBeacon: true,
                    },
                    {
                        target: '.grid',
                        content: 'Tarjetas de resumen con ventas totales, ganancias y métricas clave.',
                    }
                ];
            }
        }

        if (newSteps.length > 0) {
            setSteps(newSteps);
            // Delay to ensure DOM requires are ready (especially for POS grid)
            setTimeout(() => setRun(true), 1500);
        }

    }, [pathname, isDemo]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, type } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            // Mark current section as seen
            if (pathname === '/' || pathname === '/dashboard') {
                localStorage.setItem('demo_tour_dashboard', 'true');
            } else if (pathname === '/pos') {
                localStorage.setItem('demo_tour_pos', 'true');
            } else if (pathname.startsWith('/inventory')) {
                localStorage.setItem('demo_tour_inventory', 'true');
            } else if (pathname.startsWith('/products')) {
                localStorage.setItem('demo_tour_products', 'true');
            } else if (pathname.startsWith('/reports')) {
                localStorage.setItem('demo_tour_reports', 'true');
            }
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
                    primaryColor: '#7c3aed',
                    zIndex: 9999, // High z-index to be on top of everything
                    backgroundColor: '#ffffff',
                    arrowColor: '#ffffff',
                    textColor: '#1f2937',
                },
                tooltipContainer: {
                    textAlign: 'left',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                },
                buttonNext: {
                    borderRadius: '0.375rem',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                },
                buttonSkip: {
                    color: '#6b7280',
                    fontSize: '0.875rem',
                }
            }}
            locale={{
                back: 'Atrás',
                close: 'Cerrar',
                last: 'Entendido',
                next: 'Siguiente',
                skip: 'Omitir',
            }}
        />
    );
};

export default DemoTour;
