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

import {StateStorage} from 'zustand/middleware';
import {nativeFunction, addJuceListener} from '@/lib/utils';

const RESET_STATE = false;
const CPP_STORAGE = false;

const loadState = nativeFunction('loadStateFromProcessor');
const updateState = nativeFunction('updateStateOnProcessor');
const resetState = nativeFunction('resetStateOnProcessor');

export const resetGemini = nativeFunction('resetGeminiFromProcessor');
export const reconnectGemini = nativeFunction('reconnectGeminiFromProcessor');
export const launchAIStudio = nativeFunction('launchAIStudioFromProcessor');
export const launchUpdateURL = nativeFunction('launchUpdateURLFromProcessor');
export const launchAboutPage = nativeFunction('launchAboutPageFromProcessor');
export const launchFeedbackPage = nativeFunction(
  'launchFeedbackPageFromProcessor',
);

if (RESET_STATE) localStorage.clear();

export const juceBridge: StateStorage = CPP_STORAGE
  ? localStorage
  : {
      setItem: (name, value) => {
        updateState(name, value);
        return true;
      },
      getItem: async name => {
        const value = await loadState(name);
        if (value == '{"state":null}') {
          return JSON.stringify({state: {initialized: false}});
        }
        return value;
      },
      removeItem: name => {
        resetState(name);
        return true;
      },
    };

export function addStateListener(event: string, callback: (data: any) => void) {
  const jsonCallback = (data: string) => callback(JSON.parse(data));
  return addJuceListener(event, jsonCallback);
}
