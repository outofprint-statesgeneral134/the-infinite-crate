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
  FloatParameter,
  BoolParameter,
  ChoiceParameter,
  IntParameter,
  Chat,
  ChatRole,
} from './types';

////////////////////////////////////////////////////////////
// Parameter factory functions
////////////////////////////////////////////////////////////

export function boolParam(
  params: Partial<BoolParameter> & Pick<BoolParameter, 'id' | 'name'>,
): BoolParameter {
  return {
    version: 1,
    type: 'bool',
    daw: false,
    default: false,
    label: '',
    ...params,
  };
}

export function choiceParam(
  params: Partial<ChoiceParameter> &
    Pick<ChoiceParameter, 'id' | 'name' | 'choices'>,
): ChoiceParameter {
  return {
    type: 'choice',
    version: 1,
    daw: false,
    default: 'none',
    label: '',
    ...params,
  };
}

export function floatParam(
  params: Partial<FloatParameter> & Pick<FloatParameter, 'id' | 'name'>,
): FloatParameter {
  return {
    type: 'float',
    version: 1,
    daw: false,
    range: [0.0, 1.0],
    step: 0.01,
    default: 1.0,
    label: '',
    ...params,
  };
}

export function intParam(
  params: Partial<IntParameter> & Pick<IntParameter, 'id' | 'name'>,
): IntParameter {
  return {
    type: 'int',
    version: 1,
    daw: false,
    range: [0, 256],
    step: 1,
    default: 0,
    label: '',
    ...params,
  };
}

export function promptParam(
  params: Partial<FloatParameter> & Pick<FloatParameter, 'id' | 'name'>,
): FloatParameter {
  return {
    version: 1,
    type: 'float',
    daw: true,
    range: [0, 2],
    step: 0.1,
    default: 0,
    label: '',
    ...params,
  };
}

////////////////////////////////////////////////////////////
// Chat factory functions
////////////////////////////////////////////////////////////

export function newChat(role: ChatRole, parts: string): Chat {
  return {
    role: role,
    parts: parts,
    timestamp: Date.now(),
  };
}

export function userChat(parts: string): Chat {
  return newChat('user', parts);
}

export function modelChat(parts: string): Chat {
  return newChat('model', parts);
}

export function assistantChat(parts: string): Chat {
  return newChat('assistant', parts);
}
