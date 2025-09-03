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
import * as p from '@/data/params/lyria';
import * as lyria from '@/data/types/lyria';

export interface LyriaState extends lyria.AudioGenerationSettings {
  initialized: boolean;

  // Helpers for optional parameters
  bpmMode: (typeof p.bpmMode.choices)[number];
  scaleMode: (typeof p.scaleMode.choices)[number];
  useDensity: boolean;
  useBrightness: boolean;

  initialize: () => void;
  updateParam: (newSettings: Partial<LyriaState>) => void;
}

export const useLyriaState: StateCreator<LyriaState> = (set) => ({
  seed: p.seed.default,
  temperature: p.temperature.default,
  guidance: p.guidance.default,
  numChannels: p.numChannels.default,
  sampleRate: p.sampleRate.default,
  topk: p.topk.default,
  bpm: p.bpm.default,
  bpmMode: p.bpmMode.default,
  density: p.density.default,
  useDensity: p.useDensity.default,
  brightness: p.brightness.default,
  useBrightness: p.useBrightness.default,
  rootNote: p.rootNote.default,
  scaleMode: p.scaleMode.default,
  majorScale: p.majorScale.default,
  muteBass: p.muteBass.default,
  muteDrums: p.muteDrums.default,
  muteOther: p.muteOther.default,
  generationQuality: p.generationQuality.default,

  initialized: false,
  initialize: () => set({initialized: true}),

  updateParam: (newSettings: Partial<LyriaState>) => set(newSettings),

});
