import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    data?: any[];
    sql?: string;
    timestamp: Date;
}

export function useChatbot() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendQuery = async (query: string) => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);

        // Add user message
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: query,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);

        try {
            const { isDemo } = useAuthStore.getState();

            let result: any;

            if (isDemo) {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Return mock response based on query
                const lowerQuery = query.toLowerCase();
                if (lowerQuery.includes('vendi') || lowerQuery.includes('venta')) {
                    result = {
                        text: "Aquí tienes un resumen de tus ventas recientes. Se observa un crecimiento del 15% esta semana.",
                        data: [
                            { producto: "Coca Cola 600ml", ventas: 145, total: "$2,175.00" },
                            { producto: "Sabritas Naturales", ventas: 89, total: "$1,335.00" },
                            { producto: "Gansito", ventas: 67, total: "$1,005.00" }
                        ],
                        sql: "SELECT name, SUM(quantity), SUM(total) FROM sales JOIN products... (SIMULATED)"
                    };
                } else if (lowerQuery.includes('stock') || lowerQuery.includes('inventario')) {
                    result = {
                        text: "He analizado tu inventario. Tienes 5 productos con stock crítico que requieren atención inmediata.",
                        data: [
                            { producto: "Leche Entera 1L", stock_actual: 3, stock_minimo: 10 },
                            { producto: "Huevo 12 pz", stock_actual: 2, stock_minimo: 15 },
                            { producto: "Aceite Vegetal 1L", stock_actual: 4, stock_minimo: 12 }
                        ],
                        sql: "SELECT name, current_stock, min_stock FROM inventory... (SIMULATED)"
                    };
                } else {
                    result = {
                        text: "¡Hola! Soy tu asistente de demo. Puedo ayudarte a analizar tus ventas, inventario y más. Como ésta es una versión de prueba, mis respuestas son simuladas para que veas cómo funciona el sistema sin gastar tokens reales.",
                        data: [],
                        sql: ""
                    };
                }
            } else {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    throw new Error('No authenticated session');
                }

                const { data: invokeResult, error: funcError } = await supabase.functions.invoke('sales-reporter', {
                    body: { query }
                });

                if (funcError) {
                    throw new Error(funcError.message || 'Failed to process query');
                }
                result = invokeResult;
            }

            // Add assistant message
            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: result.text || 'No se pudo generar una respuesta.',
                data: result.data,
                sql: result.sql,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err: any) {
            console.error('Chatbot error:', err);
            setError(err.message);

            // Add error message
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Error: ${err.message}`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = () => {
        setMessages([]);
        setError(null);
    };

    return {
        messages,
        loading,
        error,
        sendQuery,
        clearHistory
    };
}
