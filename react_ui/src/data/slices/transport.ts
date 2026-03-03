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
// import {GEMINI_SAMPLE_RATE} from '@/lib/utils';

export interface TransportState {
  initialized: boolean;
  initialize: () => void;

  connected: boolean;
  playing: boolean;
  paused: boolean;
  buffering: boolean;
  loop: boolean;
  hold: boolean;
  // sampleRate: number;
  // playhead: number;

  setConnected: (connected: boolean) => void;
  play: () => void;
  stop: () => void;
  togglePlaying: () => void;
  togglePaused: () => void;
  toggleLoop: () => void;
  toggleHold: () => void;
  // setSampleRate: (sampleRate: number) => void;
  // setPlayhead: (playhead: number) => void;
  // incrementPlayhead: (playhead: number) => void;
}

export const useTransportState: StateCreator<TransportState> = set => ({
  initialized: false,
  initialize: () => set({initialized: true}),

  connected: true,
  playing: false,
  paused: false,
  buffering: false,
  loop: false,
  hold: false,
  // sampleRate: GEMINI_SAMPLE_RATE,
  // playhead: 0,

  setConnected: (connected: boolean) => set({connected}),
  play: () => set({playing: true, buffering: true}),
  stop: () => set({playing: false, buffering: false}),
  togglePlaying: () => set(state => ({playing: !state.playing})),
  togglePaused: () => set(state => ({paused: !state.paused})),
  toggleLoop: () => set(state => ({loop: !state.loop})),
  toggleHold: () => set(state => ({hold: !state.hold})),
  // setSampleRate: (sampleRate: number) => set({sampleRate}),
  // setPlayhead: (playhead: number) => set({playhead}),
  // incrementPlayhead: (playhead: number) => set(state => ({playhead: state.playhead + playhead})),
});
