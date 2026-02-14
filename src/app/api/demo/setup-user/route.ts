import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const getAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }

        const supabase = getAdminClient();

        // 1. Get user from Auth to get the ID
        const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();

        if (authError) {
            return NextResponse.json({ error: 'Auth list error: ' + authError.message }, { status: 500 });
        }

        const authUser = users.find(u => u.email === email);

        if (!authUser) {
            return NextResponse.json({ error: 'User not found in Auth' }, { status: 404 });
        }

        // 2. Upsert into public.users
        const { error: insertError } = await supabase
            .from('users')
            .upsert({
                id: authUser.id,
                email: authUser.email,
                name: authUser.user_metadata?.name || 'Usuario Demo',
                role: authUser.user_metadata?.role || 'admin',
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (insertError) {
            console.error('Insert error:', insertError);
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Setup demo user error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
