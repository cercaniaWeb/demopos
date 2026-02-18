import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { PROTECTED_ROUTES, canAccessRoute, UserRole } from './src/types/roles';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // --- Lógica de Rastreo de Visitantes para Estudio de Mercado ---
    // Capturar datos geográficos de los headers de Vercel
    const city = request.headers.get('x-vercel-ip-city') || 'Unknown';
    const country = request.headers.get('x-vercel-ip-country') || 'Unknown';
    const region = request.headers.get('x-vercel-ip-country-region') || 'Unknown';
    const timezone = request.headers.get('x-vercel-ip-timezone') || 'Unknown';
    const ip = request.headers.get('x-real-ip') || 'Unknown';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Rutas públicas que no requieren autenticación 
    const publicRoutes = ['/login', '/register', '/forgot-password', '/', '/tarjeta'];

    try {
        // Actualizar sesión y obtener cliente supabase
        const { supabase, response, user } = await updateSession(request);

        // Registrar visita de forma asíncrona (no bloquea la respuesta)
        supabase.from('visitor_tracking').insert([{
            city,
            region,
            country,
            timezone,
            ip,
            path: pathname,
            user_agent: userAgent
        }]).then(({ error }) => {
            if (error) console.error('Error tracking visitor:', error);
        });

        if (publicRoutes.includes(pathname)) {
            return response || NextResponse.next();
        }

        if (!user) {
            // No hay sesión, redirigir a login 
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            url.searchParams.set('redirectTo', pathname);
            return NextResponse.redirect(url);
        }

        // Obtener rol del usuario desde metadata o DB 
        let userRole: UserRole = 'cajero'; // Default 
        if (user.user_metadata?.role) {
            userRole = user.user_metadata.role as UserRole;
        } else {
            const { data: userData } = await supabase
                .from('users')
                .select('role')
                .eq('id', user.id)
                .single();
            if (userData?.role) {
                userRole = userData.role as UserRole;
            }
        }

        // Verificar si el usuario puede acceder a esta ruta 
        const hasAccess = canAccessRoute(userRole, pathname);
        if (!hasAccess) {
            const url = request.nextUrl.clone();
            if (userRole === 'cajero') {
                url.pathname = '/pos';
            } else if (userRole === 'grte') {
                url.pathname = '/reports';
            } else {
                url.pathname = '/';
            }
            return NextResponse.redirect(url);
        }

        return response;
    } catch (error) {
        console.error('Middleware error:', error);
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }
}

// Configurar qué rutas pasan por el middleware 
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|login|register|forgot-password|tarjeta).*)',
    ],
};

