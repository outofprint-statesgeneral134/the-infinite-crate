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

import {StateCreator} from 'zustand';
import {GEMINI_SAMPLE_RATE} from '@/lib/utils';

export interface DawState {
  initialized: boolean;
  initialize: () => void;

  sampleRate: number;
  playhead: number;

  setSampleRate: (sampleRate: number) => void;
  setPlayhead: (playhead: number) => void;
  incrementPlayhead: (playhead: number) => void;
}

export const useDawState: StateCreator<DawState> = set => ({
  initialized: false,
  initialize: () => set({initialized: true}),

  sampleRate: GEMINI_SAMPLE_RATE,
  playhead: 0,

  setSampleRate: (sampleRate: number) => set({sampleRate}),
  setPlayhead: (playhead: number) => set({playhead}),
  incrementPlayhead: (playhead: number) => set(state => ({playhead: state.playhead + playhead})),
});
