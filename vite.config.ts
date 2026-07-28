import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icons/favicon-16.png', 'icons/favicon-32.png', 'icons/apple-touch-icon.png'],
        manifest: {
          name: 'Reveal Clinic — Aesthetic & Dermatology',
          short_name: 'Reveal Clinic',
          description: 'Book appointments, manage treatments, digital check-in, medical reports, loyalty rewards, and chat with the Reveal Clinic AI assistant.',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          categories: ['health', 'medical', 'lifestyle'],
          icons: [
            {src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any'},
            {src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any'},
            {src: 'icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable'},
            {src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'},
          ],
        },
        workbox: {
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//],
          globPatterns: ['**/*.{js,css,html,png,svg,webmanifest}'],
          runtimeCaching: [
            {
              urlPattern: ({url}) => url.pathname === '/api/health',
              handler: 'NetworkFirst',
              options: {cacheName: 'api-health', networkTimeoutSeconds: 3},
            },
            {
              urlPattern: ({url}) => url.hostname === 'images.unsplash.com',
              handler: 'CacheFirst',
              options: {
                cacheName: 'unsplash-images',
                expiration: {maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 30},
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
