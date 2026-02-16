import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { Customer } from '@/lib/supabase/types';

interface CustomerState {
    customers: Customer[];
    loading: boolean;
    error: string | null;
    fetchCustomers: () => Promise<void>;
    addCustomer: (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
    deleteCustomer: (id: string) => Promise<void>;
    setError: (error: string | null) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
    customers: [],
    loading: false,
    error: null,

    setError: (error) => set({ error }),

    fetchCustomers: async () => {
        set({ loading: true, error: null });

        try {
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;

            set({ customers: data as Customer[], loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    addCustomer: async (customerData) => {
        set({ loading: true, error: null });

        try {
            const { data, error } = await supabase
                .from('customers')
                .insert([{
                    ...customerData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }])
                .select()
                .single();

            if (error) throw error;

            set((state) => ({
                customers: [...state.customers, data as Customer],
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    updateCustomer: async (id, updates) => {
        set({ loading: true, error: null });

        try {
            const { data, error } = await supabase
                .from('customers')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            set((state) => ({
                customers: state.customers.map((customer) =>
                    customer.id === id ? (data as Customer) : customer
                ),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    deleteCustomer: async (id) => {
        set({ loading: true, error: null });

        try {
            const { error } = await supabase
                .from('customers')
                .delete()
                .eq('id', id);

            if (error) throw error;

            set((state) => ({
                customers: state.customers.filter((customer) => customer.id !== id),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));
