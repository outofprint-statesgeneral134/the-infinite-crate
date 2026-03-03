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

import * as React from 'react';
import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {PromptMode} from '@/data/types';
import {
  MAJOR_NOTE_NAMES,
  MINOR_NOTE_NAMES,
  MODE_NAMES,
  MOBILE_BREAKPOINT,
  CATEGORY_PROMPT_MAP,
  isPlugin,
} from './const';
import {Juce} from '@/lib';

export const isWindows = () => navigator.userAgent.includes('Windows');

export const isUpdateAvailable = (current: string, latest: string): boolean => {
  const currentParts = current.split('.').map(Number);
  const latestParts = latest.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (currentParts[i] < latestParts[i]) return true;
    if (currentParts[i] > latestParts[i]) return false;
  }
  return false;
};

////////////////////////
// Juce
////////////////////////

export function nativeFunction(name: string) {
  return isPlugin ? Juce.getNativeFunction(name) : () => Promise.resolve(null);
}

export function addJuceListener(event: string, callback: (data: any) => void) {
  if (!isPlugin) return () => {};
  window.__JUCE__.backend.addEventListener(event, callback);
  return () => window.__JUCE__.backend.removeEventListener(event, callback);
}

////////////////////////
// Note
////////////////////////

export function getNoteName(rootNote: number, majorScale: boolean) {
  if (majorScale) {
    return MAJOR_NOTE_NAMES[rootNote];
  } else {
    return MINOR_NOTE_NAMES[rootNote];
  }
}

export function getNoteNumber(noteName: string) {
  const majorIndex = MAJOR_NOTE_NAMES.indexOf(noteName);
  if (majorIndex !== -1) {
    return majorIndex;
  }
  const minorIndex = MINOR_NOTE_NAMES.indexOf(noteName);
  if (minorIndex !== -1) {
    return minorIndex;
  }
  return 0;
}

export function getModeName(majorScale: boolean) {
  return majorScale ? MODE_NAMES[0] : MODE_NAMES[1];
}

export function getModeBool(modeName: string) {
  return modeName === MODE_NAMES[0];
}

export function getScaleName(rootNote: number, majorScale: boolean) {
  const noteName = getNoteName(rootNote, majorScale);
  return noteName + ' ' + getModeName(majorScale);
}

////////////////////////
// Shadcn
////////////////////////

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}

////////////////////////
// Prompts
////////////////////////

export const textPrompt = (text: string) => {
  const id = crypto.randomUUID();
  return {
    id: id,
    weight: 0.5,
    muted: false,
    soloed: false,
    mode: 'text' as PromptMode,
    text: text,
  };
};

const getRandomCategoryPrompts = () => {
  // There are four categories of prompts: Genres, Instruments, Moods, and Creative
  // We want to select prompts from one based on its weight.
  let total = Array.from(CATEGORY_PROMPT_MAP.values()).reduce(
    (partialSum, a) => partialSum + a,
    0,
  );
  const rnd = Math.random() * total;
  for (const [prompts, weight] of CATEGORY_PROMPT_MAP) {
    total -= weight;
    if (total <= rnd) {
      return prompts;
    }
  }
};

export const getRandomPromptText = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know this will be defined
  const categoryPrompts = getRandomCategoryPrompts()!;

  const prompt =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know this will be defined
    categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)]!;
  return prompt;
};

export const getRandomPromptTexts = (numPrompts: number) => {
  const prompts = [];
  // get 3x numPrompts in case of duplicates
  for (let i = 0; i < numPrompts * 3; i++) {
    prompts.push(getRandomPromptText());
  }
  return Array.from(new Set(prompts)).slice(0, numPrompts);
};
