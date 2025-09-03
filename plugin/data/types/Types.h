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
#include <JuceHeader.h>

#include <string>

#include "../../utils/Aliases.h"
#include "../../utils/Constants.h"
#include "../../utils/Optionals.h"

namespace magenta {

////////////////////////////////////////////////////////////
/// Data Structure Types
////////////////////////////////////////////////////////////

using IntPairs = vector<pair<int, int>>;

template <typename T>
using Dict = map<string, unique_ptr<T>>;

struct ChannelCount {
  int inputs;
  int outputs;
};

/** Represents mono or stereo audio samples. */
using MonoSamples = vector<float>;
using StereoSamples = array<MonoSamples, 2>;
using Samples = StereoSamples;

enum class PromptType { TEXT, AUDIO };

struct Prompt {
  string id;
  PromptType type = PromptType::TEXT;
  string text = "";
  MonoSamples audio = {};
  float weight = 0.5;
  bool muted = false;
  bool soloed = false;
};
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE_WITH_DEFAULT(Prompt, id, type, text, audio,
                                                weight, muted, soloed);

struct Balance {
  float drums;
  float bass;
  float other;
};
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE_WITH_DEFAULT(Balance, drums, bass, other)

struct Credentials {
  string refresh_token;
  string access_token;
  string api_key;
};
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE_WITH_DEFAULT(Credentials, refresh_token,
                                                access_token, api_key);

}  // namespace magenta
