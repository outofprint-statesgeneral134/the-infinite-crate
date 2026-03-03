/*
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

#pragma once

#include <juce_audio_processors/juce_audio_processors.h>

#include "Aliases.h"

namespace magenta {

inline void forEachSampleIn(AudioBuffer<float> &buffer,
                            function<void(float &)> function) {
  for (auto channel = 0; channel < buffer.getNumChannels(); ++channel) {
    auto channelToWrite = buffer.getWritePointer(channel);
    for (auto sample = 0; sample < buffer.getNumSamples(); ++sample) {
      function(channelToWrite[sample]);
    }
  }
}

inline vector<byte> streamToVector(InputStream &stream) {
  // Workaround to make ssize_t work cross-platform.
  using namespace juce;
  const auto sizeInBytes = static_cast<size_t>(stream.getTotalLength());
  vector<byte> result(sizeInBytes);
  stream.setPosition(0);
  const auto bytesRead = stream.read(result.data(), result.size());
  jassert(bytesRead == static_cast<ssize_t>(sizeInBytes));
  return result;
}

inline const char *getMimeForExtension(const String &extension) {
  static const unordered_map<String, const char *> mimeMap = {
      {{"htm"}, "text/html"},
      {{"html"}, "text/html"},
      {{"txt"}, "text/plain"},
      {{"jpg"}, "image/jpeg"},
      {{"jpeg"}, "image/jpeg"},
      {{"svg"}, "image/svg+xml"},
      {{"ico"}, "image/vnd.microsoft.icon"},
      {{"json"}, "application/json"},
      {{"png"}, "image/png"},
      {{"css"}, "text/css"},
      {{"map"}, "application/json"},
      {{"js"}, "text/javascript"},
      {{"woff2"}, "font/woff2"}};

  if (const auto it = mimeMap.find(extension.toLowerCase());
      it != mimeMap.end())
    return it->second;

  return "";
}

}  // namespace magenta
