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

import { floatParam, boolParam, choiceParam, intParam } from '@/data/types';

/////////////////////////////////////////
// AudioGenerationSettings
/////////////////////////////////////////

// Multiple fixed seeds could give users ability to return to deterministic "variations" of an idea
export const seed = floatParam({
  id: 'seed',
  name: 'seed',
  range: [0, 6.0],
  default: 0,
});

// Effectively "randomness", low temp is more deterministic
export const temperature = floatParam({
  id: 'temperature',
  name: 'temp',
  tooltip: `Influences the randomness of the model. Lower values make the 
model more deterministic.`,
  range: [0, 3],
  default: 1.1,
  daw: true,
});

//
export const guidance = floatParam({
  id: 'guidance',
  name: 'guidance',
  tooltip: `Influences how much the model will try to match the text prompts and parameters (prompts) vs 
the most recently generated audio (context).`,
  range: [0, 6],
  default: 4,
  daw: true,
});

export const numChannels = intParam({
  id: 'numChannels',
  name: 'numChannels',
  range: [1, 2],
  default: 2,
});

export const sampleRate = floatParam({
  id: 'sampleRate',
  name: 'sampleRate',
  range: [16000, 96000],
  default: 48000,
  step: 16000,
});

export const topk = intParam({
  id: 'topk',
  name: 'topk',
  tooltip: `Top-k sampling is a technique used to control the diversity 
of the generated audio. Lower values make the model more deterministic.`,
  range: [1, 1000],
  default: 40,
  daw: true,
});

export const balanceDrums = floatParam({
  id: 'balance.drums',
  name: 'balance.drums',
});

export const balanceBass = floatParam({
  id: 'balance.bass',
  name: 'balance.bass',
});

export const balanceOther = floatParam({
  id: 'balance.other',
  name: 'balance.other',
});

export const bpm = floatParam({
  id: 'bpm',
  name: 'bpm',
  range: [60, 200],
  default: 120,
});

export const bpmMode = choiceParam({
  id: 'bpmMode',
  name: 'bpmMode',
  tooltip: `Instructs the model to generate audio at the specified BPM. 
It's imprecise. Setting to DAW will use the BPM setting from the DAW. Might need to reset context.`,
  choices: ['off', 'controls', 'daw'],
  default: 'off',
});

export const density = floatParam({
  id: 'density',
  name: 'density',
  tooltip: `Controls the density of the audio. Higher values generate busier sounds. 
Turn this off to let the model decide.`,
  default: 0.25,
  daw: true,
});

export const useDensity = boolParam({
  id: 'useDensity',
  name: 'useDensity',
  default: false,
});

export const brightness = floatParam({
  id: 'brightness',
  name: 'bright',
  tooltip: `Controls the brightness of the audio. Higher values generate more high 
frequency content. Turn this off to let the model decide.`,
  default: 0.5,
  daw: true,
});

export const useBrightness = boolParam({
  id: 'useBrightness',
  name: 'useBrightness',
  default: false,
});

export const scaleMode = choiceParam({
  id: 'scaleMode',
  name: 'scale',
  tooltip: `Instructs the model to generate audio in the specified key. 
It's imprecise and does not differentiate between major and relative minor. Might need to reset context.`,
  choices: ['off', 'controls'], // TODO: add 'daw',
  default: 'off',
});

export const rootNote = intParam({
  id: 'rootNote',
  name: 'key (CM/Am=1)',
  range: [0, 12],
  default: 0,
  daw: true,
});

export const majorScale = boolParam({
  id: 'majorScale',
  name: 'majorScale',
  default: true,
});

export const muteBass = boolParam({
  id: 'muteBass',
  name: 'mute bass',
  tooltip: 'Attempts to mute bass sounds.',
  daw: true,
});

export const muteDrums = boolParam({
  id: 'muteDrums',
  name: 'mute drums',
  tooltip: 'Attempts to mute drums.',
  daw: true,
});

export const muteOther = boolParam({
  id: 'muteOther',
  name: 'mute other',
  tooltip: 'Attempts to mute melodic and textural sounds.',
  daw: true,
});

export const generationMode = choiceParam({
  id: 'generationMode',
  name: 'generationMode',
  tooltip: 'Indicates to the model to focus on quality or diversity of music. Set to vocalization to let the model generate vocalizations as another instrument (add them as new prompts)',
  label: 'Generation Mode',
  choices: ['quality', 'diversity', 'vocalization'],
  default: 'quality',
});
