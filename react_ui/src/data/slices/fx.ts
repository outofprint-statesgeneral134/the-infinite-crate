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

export interface FXState {
  initialized: boolean;
  initialize: () => void;
  inputGain: number;
  inputMute: boolean;
  outputGain: number;
  outputMute: boolean;
  hold: boolean;
  bypass: boolean;
  distortionType: string;
  leftBuffer: number[];
  rightBuffer: number[];
  length: number;

  updateInputGain: (inputGain: number) => void;
  updateInputMute: (inputMute: boolean) => void;
  updateOutputGain: (outputGain: number) => void;
  updateOutputMute: (outputMute: boolean) => void;
  updateBypass: (bypass: boolean) => void;
  updateDistortionType: (distortionType: string) => void;
}

export const useFXState: StateCreator<FXState> = set => ({
  initialized: false,
  initialize: () => set({initialized: true}),
  inputGain: 1.0,
  outputGain: 1.0,
  inputMute: false,
  outputMute: false,
  hold: false,
  bypass: false,
  distortionType: 'none',
  leftBuffer: [],
  rightBuffer: [],
  length: 0,
  updateInputGain: (inputGain: number) => set({inputGain}),
  updateInputMute: (inputMute: boolean) => set({inputMute}),
  updateOutputGain: (outputGain: number) => set({outputGain}),
  updateOutputMute: (outputMute: boolean) => set({outputMute}),
  updateDistortionType: (distortionType: string) => set({distortionType}),
  updateBypass: (bypass: boolean) => set({bypass}),
});
