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

import {floatParam, boolParam, choiceParam} from '@/data/types';

export const inputGain = floatParam({
  id: 'inputGain',
  name: 'input gain',
  tooltip: 'Input gain controls how much audio is sent to the plugin',
  daw: false,
});

export const inputMute = boolParam({
  id: 'inputMute',
  name: 'input mute',
  daw: false,
});

export const inputRecord = boolParam({
  id: 'inputRecord',
  name: 'input record',
});

export const outputGain = floatParam({
  id: 'outputGain',
  name: 'output gain',
  tooltip: 'Output gain controls the output volume of the plugin',
  daw: false,
});

export const outputMute = boolParam({
  id: 'outputMute',
  name: 'output mute',
  daw: false,
});

export const bypass = boolParam({
  id: 'bypass',
  name: 'bypass',
});

export const distortionType = choiceParam({
  id: 'distortionType',
  name: 'distortion type',
  choices: ['none', 'tanh(kx)/tanh(k)', 'sigmoid'],
  default: 'none',
  daw: false,
});
