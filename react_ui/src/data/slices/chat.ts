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
import {Chat} from '@/data/types';
import {userChat, modelChat, assistantChat} from '@/data/types/factory';

export interface ChatState {
  initialized: boolean;
  initialize: () => void;

  chats: Chat[];
  addChat: (chat: Chat) => void;
  addUserChat: (parts: string) => void;
  addModelChat: (parts: string) => void;
  addAssistantChat: (parts: string) => void;
  clearChats: () => void;
}

export const useChatState: StateCreator<ChatState> = set => ({
  initialized: false,
  initialize: () => set({initialized: true}),

  chats: [],
  addChat: (chat: Chat) => set(state => ({chats: [...state.chats, chat]})),
  addUserChat: (parts: string) =>
    set(state => ({chats: [...state.chats, userChat(parts)]})),
  addModelChat: (parts: string) =>
    set(state => ({chats: [...state.chats, modelChat(parts)]})),
  addAssistantChat: (parts: string) =>
    set(state => ({chats: [...state.chats, assistantChat(parts)]})),
  clearChats: () => set({chats: []}),
});
