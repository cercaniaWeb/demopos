import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Admin client with Service Role Key
const getAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        },
        global: {
            fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
        }
    });
};

export async function GET() {
    try {
        const supabase = getAdminClient();

        // 1. Fetch all users
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (usersError) {
            console.error('Error fetching users:', usersError);
            return NextResponse.json({ error: usersError.message }, { status: 500 });
        }

        // 2. Fetch user_stores with store details
        // Note: separate query because public.users might not have explicit FK to user_stores
        const { data: userStores, error: storesError } = await supabase
            .from('user_stores')
            .select(`
                user_id,
                store_id,
                stores (
                    id,
                    name
                )
            `);

        if (storesError) {
            console.warn('Error fetching user stores (non-critical):', storesError);
            // Continue without stores if this fails
        }

        // 3. Map stores to users
        const userStoreMap = new Map();
        if (userStores) {
            userStores.forEach((us: any) => {
                if (us.user_id && us.stores) {
                    userStoreMap.set(us.user_id, us.stores);
                }
            });
        }

        // 4. Transform to response format
        const mappedUsers = (users || []).map((user: any) => {
            const store = userStoreMap.get(user.id);
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                status: user.status,
                created_at: user.created_at,
                updated_at: user.updated_at,
                store_id: store?.id || null,
                store_name: store?.name || null
            };
        });

        return NextResponse.json(mappedUsers);
    } catch (error: any) {
        console.error('Unexpected error listing users:', error);
        return NextResponse.json(
            { error: error.message || 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
