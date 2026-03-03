/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import {fileURLToPath} from 'url';
import svgr from 'vite-plugin-svgr';

// Get the directory of the current file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const abs = (relativePath: string) =>
  path.resolve(__dirname, '..', relativePath);

// https://vite.dev/config/
export default defineConfig(({command}) => ({
  server: {
    port: 62418,
    fs: {
      allow: ['..'],
    },
  },
  logLevel: 'info', // Use 'info' to show requests or 'debug' for more details
  plugins: [react(), svgr({svgrOptions: {jsxRuntime: 'automatic'}})],
  resolve: {
    alias: {
      'juce/juce': abs('src/lib/juce/juce.js'),
      '@': abs('src'),
      '%': abs('../resources/img'),
      ...(command !== 'build' && { 'fonts': abs('../resources/fonts/') }),
    },
  },
  css: {
    postcss: abs('config'), // Tell Vite where to find postcss.config.js
  },
  publicDir: abs('public'),
  build: {
    outDir: abs('../resources/dom'),
    rollupOptions: {
      external: [],
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
}));
