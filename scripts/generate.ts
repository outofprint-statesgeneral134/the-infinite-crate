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

import {
  ParameterInfo,
  StateInfo,
  Comments,
  AppStateID,
  LyriaStateID,
  FXStateID,
  PromptStateID,
  TransportStateID,
  FloatParameter,
} from '@/data/types';
import {fx, lyria, prompt} from '@/data/params';
import {
  useAppStore,
  useLyriaStore,
  useFXStore,
  usePromptStore,
  useTransportStore,
} from '@/data';
import * as fs from 'fs';

////////////////////////////////////////////////////////////
// Parameter Schema Types
////////////////////////////////////////////////////////////

const parameters: ParameterInfo = {
  [Comments]:
    'Parameters with [daw: true] are exposed to the DAW. Nested parameters have dot syntax (reverb.bypass). Must match zustand state.',
  [LyriaStateID]: [...Object.values(lyria)],
  [FXStateID]: [...Object.values(fx)],
  [PromptStateID]: [
    ...Object.values(prompt).filter(
      (parameter): parameter is FloatParameter => typeof parameter === 'object',
    ),
  ],
};

fs.writeFileSync(
  '../resources/json/schema.json',
  JSON.stringify(parameters, null, 4),
);
console.log('Parameters generated');

////////////////////////////////////////////////////////////
// State Types
////////////////////////////////////////////////////////////

////
// 1. Create a "states" object that reduces state down to variables
////

// Helper function to eliminate functions from state
function extractVars<T>(state: T): any {
  return Object.fromEntries(
    Object.entries(state as any).filter(
      ([_, value]) => typeof value !== 'function',
    ),
  );
}
const states: Partial<StateInfo> = {
  [AppStateID]: extractVars(useAppStore.getState()),
  [LyriaStateID]: extractVars(useLyriaStore.getState()),
  [FXStateID]: extractVars(useFXStore.getState()),
  [PromptStateID]: extractVars(usePromptStore.getState()),
  [TransportStateID]: extractVars(useTransportStore.getState()),
};

////
// 2. Recursively convert types to C++ types
////

// Helper function to differentiate between int and double based on schema
function schemaType(schema: any) {
  console.log(schema);
  if (schema.type === 'choice') {
    return 'string';
  }
  return schema.type;
}

// Helper function to override types for certain keys that don't work well
function overrides(key: string) {
  if (key == 'prompts') {
    return 'vector<Prompt>';
  } else if (key == 'leftBuffer') {
    return 'MonoSamples';
  } else if (key == 'rightBuffer') {
    return 'MonoSamples';
  }
  return undefined;
}

// Helper function to check special types above
function checkSpecialType(key: string) {
  let type = undefined;
  if (key in fx) {
    const schema = fx[key as keyof typeof fx];
    type = schemaType(schema);
  } else if (key in lyria) {
    const schema = lyria[key as keyof typeof lyria];
    type = schemaType(schema);
  } else {
    type = overrides(key);
  }
  return type;
}

// Helper function to convert JavaScript types to C++ types
function cppType(tsType: string): string {
  switch (tsType) {
    case 'number':
      return 'float';
    case 'boolean':
      return 'bool';
    default:
      return tsType;
  }
}

// Core recursive function to map object to C++ types
function mapObjectToType(obj: any) {
  const result: any = {};
  for (const key in obj) {
    const specialType = checkSpecialType(key);
    if (specialType) {
      result[key] = specialType;
      continue;
    }
    const value = obj[key];
    const type = typeof value;
    if (type === 'object') {
      if (Array.isArray(value)) {
        // For arrays, check the first element to determine array type
        result[key] =
          value.length > 0
            ? `vector<${mapObjectToType(value[0])}>`
            : 'vector<any>';
      } else if (value !== null) {
        // Recursively process nested objects
        result[key] = mapObjectToType(value);
      } else {
        result[key] = 'null';
      }
    } else {
      result[key] = cppType(type);
    }
  }
  return result;
}

const stateTypes = mapObjectToType(states);

fs.writeFileSync(
  '../resources/json/states.json',
  JSON.stringify(stateTypes, null, 4),
);
console.log('States generated');
