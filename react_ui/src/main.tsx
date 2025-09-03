/**
 * Copyright 2025 Google LLC
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

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.tsx';

function toggleDarkMode() {
  const prefersDarkScheme = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;
  document.body.classList.toggle('dark', prefersDarkScheme);
}
toggleDarkMode();
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', toggleDarkMode);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
