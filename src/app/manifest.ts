import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AURA - POS Inteligente',
    short_name: 'AURA',
    description: 'Sistema de Punto de Venta Inteligente',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1f2937',
    icons: [
      {
        src: '/iconoapp.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  };
}