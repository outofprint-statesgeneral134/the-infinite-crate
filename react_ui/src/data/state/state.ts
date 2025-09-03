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

import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {juceBridge, addStateListener} from './bridge';
import {
  LyriaState,
  useLyriaState,
  FXState,
  useFXState,
  AppState,
  useAppState,
  PromptState,
  usePromptState,
  TransportState,
  useTransportState,
  ChatState,
  useChatState,
  DawState,
  useDawState,
} from '@/data/slices';
import {
  AppStateID,
  LyriaStateID,
  FXStateID,
  PromptStateID,
  TransportStateID,
  DawStateID,
  ChatStateID,
} from '@/data/types';
import {toast, isWindows, SERVER_ERROR} from '@/lib/utils';

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...useAppState(...a),
    }),
    {
      name: AppStateID,
      storage: createJSONStorage(() => juceBridge),
      version: 1,
    },
  ),
);

export const useLyriaStore = create<LyriaState>()(
  persist(
    (...a) => ({
      ...useLyriaState(...a),
    }),
    {
      name: LyriaStateID,
      storage: createJSONStorage(() => juceBridge),
      version: 1,
    },
  ),
);

export const useFXStore = create<FXState>()(
  persist(
    (...a) => ({
      ...useFXState(...a),
    }),
    {
      name: FXStateID,
      storage: createJSONStorage(() => juceBridge),
      version: 1,
    },
  ),
);

export const usePromptStore = create<PromptState>()(
  persist(
    (...a) => ({
      ...usePromptState(...a),
    }),
    {
      name: PromptStateID,
      storage: createJSONStorage(() => juceBridge),
      version: 1,
    },
  ),
);

export const useTransportStore = create<TransportState>()(
  persist(
    (...a) => ({
      ...useTransportState(...a),
    }),
    {
      name: TransportStateID,
      storage: createJSONStorage(() => juceBridge),
      version: 1,
    },
  ),
);

export const useDawStore = create<DawState>()(
  persist(
    (...a) => ({
      ...useDawState(...a),
    }),
    {
      name: DawStateID,
      storage: createJSONStorage(() => juceBridge),
      version: 1,
    },
  ),
);

export const useChatStore = create<ChatState>()(
  persist(
    (...a) => ({
      ...useChatState(...a),
    }),
    {
      name: ChatStateID,
      storage: createJSONStorage(() => juceBridge),
      version: 1,
    },
  ),
);

// Allows full or partial updates
// Allows full or partial updates
// Currently this retriggers a push down to the C++ side
// Which in some ways is nice because all state is managed here
addStateListener(AppStateID, (partialState: Partial<AppState>) => {
  useAppStore.setState(prevState => ({
    ...prevState,
    ...partialState,
  }));
});

addStateListener(FXStateID, (partialState: Partial<FXState>) => {
  useFXStore.setState(prevState => ({
    ...prevState,
    ...partialState,
  }));
});

addStateListener(LyriaStateID, (partialState: Partial<LyriaState>) => {
  useLyriaStore.setState(prevState => ({
    ...prevState,
    ...partialState,
  }));
});

addStateListener(TransportStateID, (partialState: Partial<TransportState>) => {
  useTransportStore.setState(prevState => ({
    ...prevState,
    ...partialState,
  }));
});

addStateListener(PromptStateID, (partialState: Partial<PromptState>) => {
  usePromptStore.setState(prevState => ({
    ...prevState,
    ...partialState,
  }));
  usePromptStore.getState().syncPromptWeights();
});

addStateListener('filteredPrompt', (data: any) => {
  console.log('filteredPrompt', data);
  usePromptStore.getState().removePromptWithText(data.text);

  toast({
    description: `${data.text} can't be used as a prompt. More info: https://ai.google.dev/gemini-api/docs/music-generation`,
    variant: 'destructive',
  });
});

addStateListener('serverConnected', () => {
  if (!useTransportStore.getState().connected) {
    useTransportStore.getState().setConnected(true);
  }
});

addStateListener('serverResponse', (data: any) => {
  useTransportStore.getState().setConnected(false);
  useTransportStore.getState().stop();

  const errorMessage = SERVER_ERROR + (typeof data.reason === 'string' && data.reason.length > 0 ? ` Error: "${data.reason}"` : '');
  
  toast({
    description: errorMessage,
    variant: 'destructive',
    duration: 500000000,
  });
});

addStateListener('sampleRateChange', (data: any) => {
  useDawStore.getState().setSampleRate(data.sampleRate);
});

addStateListener('headIndexChange', (data: any) => {
  useDawStore.getState().incrementPlayhead(data.headIndex);
});

// This forces sync with C++ on startup
function initializeState() {
  useFXStore.getState().initialize();
  useLyriaStore.getState().initialize();
  usePromptStore.getState().initialize();
  useTransportStore.getState().initialize();
}

// Is this the right home for this?
function initPrompts() {
  console.log('initializing prompts');
  const prompts = usePromptStore.getState().prompts;
  console.log('prompts', prompts);
  if (!prompts || prompts.length === 0) {
    usePromptStore.getState().initRandomPrompts();
  }
}

console.log('initializing state');
setTimeout(initializeState, isWindows() ? 50 : 0);
setTimeout(initPrompts, isWindows() ? 70 : 50);
