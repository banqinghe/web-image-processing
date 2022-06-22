import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import analyze from 'rollup-plugin-analyzer';
import WindiCSS from 'vite-plugin-windicss';
import { resolve } from 'path';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const basePlugins = [react(), monacoEditorPlugin(), WindiCSS()];

  if (process.env.VITE_IS_ANALYZE) {
    basePlugins.push(analyze());
  }

  return defineConfig({
    plugins: basePlugins,
    build: {
      chunkSizeWarningLimit: 5120,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  });
};
