/*
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

#pragma once

#include <string>
#include <vector>

#include "../../utils/Aliases.h"
#include "Types.h"

namespace magenta {

// App state structure
struct AppStruct {
  Credentials credentials;
  string updateURL;
};
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE_WITH_DEFAULT(AppStruct, credentials,
                                                updateURL)

// Lyria state structure
struct LyriaStruct {
  float seed;
  float temperature;
  float guidance;
  int numChannels;
  float sampleRate;
  int topk;
  string outputContainer;
  float bpm;
  string bpmMode;
  Balance balance;
  float density;
  bool useDensity;
  float brightness;
  bool useBrightness;
  int rootNote;
  string scaleMode;
  bool majorScale;
  bool muteBass;
  bool muteDrums;
  bool muteOther;
  string generationQuality;
  bool initialized;
};
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE_WITH_DEFAULT(
    LyriaStruct, seed, temperature, guidance, numChannels, sampleRate, topk,
    outputContainer, bpm, bpmMode, balance, density, useDensity, brightness,
    useBrightness, rootNote, scaleMode, majorScale, muteBass, muteDrums, muteOther,
    generationQuality, initialized)

// FX state structure
struct FXStruct {
  bool initialized;
  float inputGain;
  float outputGain;
  bool inputMute;
  bool outputMute;
  bool hold;
  bool bypass;
  string distortionType;
  vector<float> leftBuffer;
  vector<float> rightBuffer;
  float length;
};
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE_WITH_DEFAULT(FXStruct, initialized,
                                                inputGain, outputGain,
                                                inputMute, outputMute, hold,
                                                bypass, distortionType,
                                                leftBuffer, rightBuffer, length)

// Prompt state structure
struct PromptStruct {
  bool initialized;
  float p0;
  float p1;
  float p2;
  float p3;
  float p4;
  float p5;
  float p6;
  float p7;
  float p8;
  float p9;
  string prefix;
  string suffix;
  bool normalize;
  vector<Prompt> prompts;
};
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE_WITH_DEFAULT(PromptStruct, initialized, p0,
                                                p1, p2, p3, p4, p5, p6, p7, p8,
                                                p9, prefix, suffix, prompts)

// Transport state structure
struct TransportStruct {
  bool initialized;
  bool playing;
  bool paused;
  bool buffering;
  bool loop;
  bool hold;
  // int sampleRate;
  // size_t playhead;
};
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE_WITH_DEFAULT(TransportStruct, initialized,
                                                playing, paused, buffering,
                                                loop, hold)

}  // namespace magenta
