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

/** Lyria types taken from prompt-dj-library. */

/** Prompting mode. */
export type PromptMode = 'text' | 'audio';

/** Represents an audio generation prompt. */
export interface BasePrompt {
  // Unique identifier for the prompt.
  readonly id: string;
  // Prompting modality.
  readonly mode: PromptMode;
  // Content for `text` prompting mode; undefined otherwise.
  readonly text?: string;
  // Audio samples for `audio` prompting mode; undefined otherwise.
  readonly audio?: Float32Array;
}

/** Enables user control over a prompt */
export interface Prompt extends BasePrompt {
  // Relative prominence of the prompt.
  weight: number;
  // Indicates whether the prompt is included in audio generation.
  muted: boolean;
  // Indicates whether other prompts are included in audio generation.
  soloed: boolean;
}

/** Represents playback states. */
export type PlaybackState =
  // Playback initialization and post-reset state.
  | 'stopped'
  // Playback is playing.
  | 'playing'
  // Playback is paused.
  | 'paused'
  // Playback is buffering audio.
  | 'loading';

/** Represents mono or stereo audio samples. */
export type AudioSample = number[] | number[][];

/** Represents framed SoundStream audio tokens. */
export type Tokens = number[][];

export type AudioGenerationParams = {
  url: string;
  headers: {
    'Content-Type': string;
    Authorization: string;
  };
  body: string;
};

export interface AudioGenerationSettings {
  seed: number;
  temperature: number;
  guidance: number;
  numChannels: number;
  sampleRate: number;
  topk: number;
  bpm: number;
  density: number;
  brightness: number;
  rootNote: number;
  majorScale: boolean;
  muteBass: boolean;
  muteDrums: boolean;
  muteOther: boolean;
  generationMode: string;
}


