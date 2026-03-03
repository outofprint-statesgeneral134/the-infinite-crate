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

import {GENRES, INSTRUMENTS, MOODS, CREATIVE} from '@/lib/utils/prompts';

export const isPlugin = typeof window !== 'undefined';

export const DEFAULT_WIDTH = 1600;

export const VERSION = '0.1.0';

export const UPDATE_URL = 'https://g.co/magenta/infinite-crate-update';
export const CHECK_UPDATE_URL =
  'https://storage.googleapis.com/infinite-crate-version/latest.json';
export const GEMINI_API_URL = 'https://aistudio.google.com';


export const SERVER_ERROR = `The server is unavailable. Try the RESET button! 
  You may be offline or may have hit the 10 minute timeout for this alpha prototype. 
  We also have some throttles on the backend to prevent motherboard fires for experimental technologies. 
  If this keeps happening, please try again tomorrow :) `;

////////////////////////
// PromptDJ
////////////////////////

export const GEMINI_SAMPLE_RATE = 48000;
export const GEMINI_UPDATE_INTERVAL = 2000;

export const MODE_NAMES = ['major', 'minor'];
export const MAJOR_NOTE_NAMES = [
  'Unspecified',
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'F#',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
];
export const MINOR_NOTE_NAMES = [
  'Unspecified',
  'a',
  'bb',
  'b',
  'c',
  'c#',
  'd',
  'eb',
  'e',
  'f',
  'f#',
  'g',
  'g#',
];
export const MAJOR_FIFTHS = [
  'C',
  'G',
  'D',
  'A',
  'E',
  'B',
  'F#',
  'Db',
  'Ab',
  'Eb',
  'Bb',
  'F',
];
export const MINOR_FIFTHS = [
  'a',
  'e',
  'b',
  'f#',
  'c#',
  'g#',
  'eb',
  'bb',
  'f',
  'c',
  'g',
  'd',
];

////////////////////////
// Shadcn
////////////////////////

export const MOBILE_BREAKPOINT = 768;

////////////////////////
// Prompts
////////////////////////

export const PROMPT_PREFIX = 'High Quality Instrumental';
export const PROMPT_SUFFIX = '[Official Audio]';

export const SUGGESTED_PROMPTS = {
  genres: GENRES,
  instruments: INSTRUMENTS,
  moods: MOODS,
  creative: CREATIVE,
};

export const CATEGORY_PROMPT_MAP = new Map<string[], number>([
  [GENRES, 0.39],
  [INSTRUMENTS, 0.34],
  [MOODS, 0.15],
  [CREATIVE, 0.03],
]);
