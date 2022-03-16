import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    monacoEditorPlugin(),
    VitePWA({
      srcDir: 'src',
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png',
      ],
      manifest: {
        name: 'Canvas Image',
        short_name: 'Canvas Image',
        description: 'Simple tool to process images',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      strategies: 'injectManifest',
      registerType: 'autoUpdate',
      // workbox: {
      //   maximumFileSizeToCacheInBytes: 52428800,
      // },
      injectManifest: {
        maximumFileSizeToCacheInBytes: 52428800,
        globPatterns: ['**/*.{js,css,html,png,svg,jpg,jpeg}'],
      },
    }),
  ],
});
