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

import {
  AppState,
  LyriaState,
  FXState,
  PromptState,
  TransportState,
  DawState,
  ChatState,
} from '@/data/slices';

export const AppStateID = 'app-state';
export const LyriaStateID = 'lyria-state';
export const FXStateID = 'fx-state';
export const PromptStateID = 'prompt-state';
export const TransportStateID = 'transport-state';
export const DawStateID = 'daw-state';
export const ChatStateID = 'chat-state';
export const Comments = '_comments';

export type States =
  | typeof AppStateID
  | typeof LyriaStateID
  | typeof FXStateID
  | typeof PromptStateID
  | typeof TransportStateID
  | typeof DawStateID
  | typeof ChatStateID;

interface ValueTreeParameter {
  id: string; // unique identifier for the parameter
  version: number; // allows us to version parameters
  daw: boolean; // whether the parameter is exposed to the DAW
  name: string;
  type: string;
  label: string;
  tooltip?: string;
}

export interface BoolParameter extends ValueTreeParameter {
  type: 'bool';
  default: boolean;
}

export interface ChoiceParameter extends ValueTreeParameter {
  type: 'choice';
  choices: string[];
  default: string;
}

export interface IntParameter extends ValueTreeParameter {
  type: 'int';
  range: number[];
  step: 1;
  default: number;
}

export interface FloatParameter extends ValueTreeParameter {
  type: 'float';
  range: number[];
  step: number;
  default: number;
}

export type Parameter =
  | BoolParameter
  | ChoiceParameter
  | IntParameter
  | FloatParameter;

export interface ParameterInfo {
  [LyriaStateID]: Parameter[];
  [FXStateID]: Parameter[];
  [PromptStateID]: Parameter[];
  [Comments]?: string;
}

export type ExtractVars<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

export interface StateInfo {
  [AppStateID]: ExtractVars<AppState>;
  [LyriaStateID]: ExtractVars<LyriaState>;
  [FXStateID]: ExtractVars<FXState>;
  [PromptStateID]: ExtractVars<PromptState>;
  [TransportStateID]: ExtractVars<TransportState>;
  [DawStateID]: ExtractVars<DawState>;
  [ChatStateID]: ExtractVars<ChatState>;
}

////////////////////////////////////////////////////////////
// Prompt value types
////////////////////////////////////////////////////////////

export type PromptValue = {
  [key: `p${number}`]: number;
};

////////////////////////////////////////////////////////////
// Chat types
////////////////////////////////////////////////////////////

export type ChatRole = 'user' | 'model' | 'assistant';

export type Chat = {
  timestamp: number;
  role: ChatRole;
  parts: string;
};

////////////////////////////////////////////////////////////
// Component types
////////////////////////////////////////////////////////////

export interface ComponentProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface GeometryProps extends ComponentProps {
  children?: React.ReactNode;
}

////////////////////////////////////////////////////////////
// Auth types
////////////////////////////////////////////////////////////

export interface AuthTokens {
  refresh_token: string;
  access_token: string;
  api_key: string;
}
