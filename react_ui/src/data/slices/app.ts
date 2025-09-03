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
import {AuthTokens} from '@/data/types';
import {UPDATE_URL} from '@/lib/utils';

export interface AppState {
  credentials: AuthTokens;
  updateURL: string;
  setCredentials: (credentials: Partial<AuthTokens>) => void;
  setUpdateURL: (updateURL: string) => void;
}

export const useAppState: StateCreator<AppState> = set => ({
  credentials: {refresh_token: '', access_token: '', api_key: ''},
  updateURL: UPDATE_URL,
  setCredentials: (credentials: Partial<AuthTokens>) =>
    set(state => ({
      credentials: {
        ...state.credentials,
        ...credentials,
      },
    })),
  setUpdateURL: (updateURL: string) =>
    set({
      updateURL: updateURL,
    }),
});
