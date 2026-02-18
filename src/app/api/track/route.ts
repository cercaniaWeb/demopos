import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { path } = await request.json();
        const headersList = request.headers;

        // Capturar datos geográficos de Vercel
        const city = headersList.get('x-vercel-ip-city') || 'Unknown';
        const country = headersList.get('x-vercel-ip-country') || 'Unknown';
        const region = headersList.get('x-vercel-ip-country-region') || 'Unknown';
        const timezone = headersList.get('x-vercel-ip-timezone') || 'Unknown';
        const ip = headersList.get('x-real-ip') || headersList.get('x-forwarded-for')?.split(',')[0] || 'Unknown';
        const userAgent = headersList.get('user-agent') || 'Unknown';

        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                },
            }
        );

        const { error } = await supabase.from('visitor_tracking').insert([{
            city,
            region,
            country,
            timezone,
            ip,
            path,
            user_agent: userAgent
        }]);

        if (error) {
            console.error('Supabase Tracking Error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('API Track Error:', err);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
