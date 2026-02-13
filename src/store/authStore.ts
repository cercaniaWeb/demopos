import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { User } from '@/lib/supabase/types';

interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
  isDemo: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  initialize: () => Promise<void>;
  setError: (error: string | null) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  isDemo: false,
  error: null,

  setError: (error) => set({ error }),

  setUser: (user) => set({ user }),

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const isDemo = authUser.email === 'demo@cercania.com';
          set({
            session,
            isDemo,
            user: {
              id: authUser.id,
              email: authUser.email || '',
              name: authUser.user_metadata?.name || authUser.email || 'Usuario',
              imageUrl: authUser.user_metadata?.avatar_url,
              role: authUser.user_metadata?.role || 'admin',
              status: authUser.user_metadata?.status || 'active',
              created_at: authUser.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            loading: false
          });
          return;
        }
      }
    } catch (e) {
      console.warn('Supabase initialization failed, checking local session...');
    }
    set({ session: null, user: null, isDemo: false, loading: false });
  },

  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ loading: false, error: error.message });
        throw error;
      }

      const { data: { session } } = await supabase.auth.getSession();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser && session) {
        const isDemo = authUser.email === 'demo@cercania.com';
        set({
          session,
          isDemo,
          user: {
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.name || authUser.email || 'Usuario',
            imageUrl: authUser.user_metadata?.avatar_url,
            role: authUser.user_metadata?.role || 'admin',
            status: authUser.user_metadata?.status || 'active',
            created_at: authUser.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          loading: false
        });
      }
    } catch (err: any) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  logout: async () => {
    const { isDemo, user } = get();
    set({ loading: true });

    // If demo user, cleanup data before signing out
    if (isDemo && user) {
      try {
        // Call a cleanup routine - in this case we'll try to delete sales and movements for this demo user
        // Note: This requires appropriate RLS policies or a specific edge function
        await supabase.rpc('cleanup_demo_data', { user_id_param: user.id });
      } catch (e) {
        console.error('Error cleaning up demo data:', e);
      }
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      set({ loading: false, error: error.message });
    } else {
      set({ session: null, user: null, isDemo: false, loading: false });
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    });

    if (error) {
      set({ loading: false, error: error.message });
      throw error;
    }

    set({ loading: false });
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });

    if (error) {
      set({ loading: false, error: error.message });
      throw error;
    }

    set({ loading: false });
  },
}));