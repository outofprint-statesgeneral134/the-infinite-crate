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

#include "../utils/Aliases.h"
#include "../utils/Constants.h"

namespace magenta {

class CircularBuffer {
 public:
  enum class Format { Mono = 1, Stereo = 2 };

  CircularBuffer(size_t numFrames = DEFAULT_FRAME_CAPACITY,
                 Format format = Format::Stereo);

  // JUCE-native stereo operations
  bool writeStereo(const Array<Var> *left, const Array<Var> *right);
  bool writeStereo(const AudioBuffer<float> &inBuffer, float sampleRate = 48000);
  bool writeStereoSample(float left, float right);
  int readStereo(AudioBuffer<float> &outBuffer, int numFrames, float sampleRate = 48000);
  int readResampled(AudioBuffer<float> &outBuffer, int numFrames, float sampleRate);

  void clear();

  bool isStereo() const { return numChannels == 2; }
  size_t getNumFramesAvailable() const;

 private:
  AudioBuffer<float> buffer;
  const size_t frameCapacity;
  const size_t numChannels;
  size_t head;
  size_t tail;
  size_t count;
  mutable mutex mtx;
};

}  // namespace magenta
