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

import {StateCreator} from 'zustand';
import {Prompt} from '@/data/types';
import {getRandomPromptText, textPrompt} from '@/lib/utils';
import {PROMPT_PREFIX, PROMPT_SUFFIX} from '@/lib/utils/const';
import {PromptValue} from '@/data/types/';
import {NUM_DAW_PROMPTS} from '@/data/params/prompt';

export interface PromptState {
  initialized: boolean;
  initialize: () => void;

  p0: number;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  p5: number;
  p6: number;
  p7: number;
  p8: number;
  p9: number;

  prefix: string;
  suffix: string;
  normalize: boolean;
  prompts: Prompt[];
  getPromptWithID: (id: string) => Prompt | undefined;
  setPrompts: (prompts: Prompt[]) => void;
  addPrompts: (prompts: Prompt[]) => void;
  addTextPrompt: (prompt: string) => void;
  initRandomPrompts: () => void;
  removePromptWithID: (id: string) => void;
  removePromptWithText: (text: string) => void;
  removeAllPrompts: () => void;
  updatePromptWithID: (id: string, prompt: Prompt) => void;

  // Keep prompt array weights in sync with DAW params
  syncPromptWeights: () => void;
  syncDawParamValues: () => void;

  updatePrefix: (prefix: string) => void;
  updateSuffix: (suffix: string) => void;
  toggleNormalize: () => void;
}

export const usePromptState: StateCreator<PromptState> = (set, get) => ({
  initialized: false,
  initialize: () => set({initialized: true}),

  p0: 0,
  p1: 0,
  p2: 0,
  p3: 0,
  p4: 0,
  p5: 0,
  p6: 0,
  p7: 0,
  p8: 0,
  p9: 0,
  p10: 0,
  p11: 0,
  p12: 0,

  prefix: PROMPT_PREFIX,
  suffix: PROMPT_SUFFIX,
  normalize: false,

  prompts: [],
  getPromptWithID: (id: string) => get().prompts.find(p => p.id === id),
  setPrompts: (prompts: Prompt[]) => {
    set({prompts});
    get().syncDawParamValues();
  },
  addPrompts: (prompts: Prompt[]) => {
    set(state => ({
      prompts: [...state.prompts, ...prompts],
    }));
    get().syncDawParamValues();
  },
  addTextPrompt: (prompt: string) => {
    set(state => ({
      prompts: [...state.prompts, textPrompt(prompt)],
    }));
    get().syncDawParamValues();
  },
  removePromptWithID: (id: string) => {
    set(state => ({
      prompts: state.prompts.filter(p => p.id !== id),
    }));
    get().syncDawParamValues();
  },
  removePromptWithText: (text: string) => {
    set(state => ({
      prompts: state.prompts.filter(p => p.text !== text),
    }));
    get().syncDawParamValues();
  },
  removeAllPrompts: () => {
    set({prompts: []});
    get().syncDawParamValues();
  },
  updatePromptWithID: (id: string, prompt: Prompt) => {
    set(state => ({
      prompts: state.prompts.map(p => (p.id === id ? prompt : p)),
    }));
    get().syncDawParamValues();
  },

  initRandomPrompts: () => {
    set({
      prompts: [
        textPrompt(getRandomPromptText()),
        textPrompt(getRandomPromptText()),
      ],
    });
    get().syncDawParamValues();
  },

  syncPromptWeights: () => {
    set(state => {
      const updatedPrompts = [...state.prompts];
      for (let i = 0; i < NUM_DAW_PROMPTS; i++) {
        const weight = get()[`p${i + 1}` as keyof PromptState] as number;
        if (i < updatedPrompts.length) {
          updatedPrompts[i] = {...updatedPrompts[i], weight};
        }
      }
      return {prompts: updatedPrompts};
    });
  },
  syncDawParamValues: () => {
    set(state => {
      const newValues: Partial<PromptValue> = {};
      for (let i = 0; i < NUM_DAW_PROMPTS; i++) {
        const key = `p${i + 1}` as keyof PromptValue;
        if (state.prompts[i] && !state.prompts[i].muted) {
          newValues[key] = state.prompts[i].weight;
        } else {
          newValues[key] = 0;
        }
      }
      return newValues;
    });
  },
  updatePrefix: (prefix: string) => {
    set({prefix});
  },
  updateSuffix: (suffix: string) => {
    set({suffix});
  },
  toggleNormalize: () => {
    set(state => ({normalize: !state.normalize}));
  },
});
