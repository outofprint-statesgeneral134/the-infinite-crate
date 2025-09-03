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

#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_audio_basics/juce_audio_basics.h>
#include <juce_dsp/juce_dsp.h>

#include "../audio/CircularBuffer.h"
#include "../data/State.h"
#include "../data/types/Types.h"

namespace magenta {

struct AudioChunk;
class Transport;

class AudioEngine {
 public:
  explicit AudioEngine(Transport& transport, FXStruct& fxState);
  ~AudioEngine() = default;

  void prepare(double sampleRate, int blockSize, ChannelCount numChannels);
  void process(AudioBuffer<float>& buffer, MidiBuffer& midiMessages);
  void writeStreamToBuffer(const Array<Var>& leftChannel,
                           const Array<Var>& rightChannel);
  void processAudioChunks(vector<AudioChunk> chunks);
    
  void clearBuffer();

  function<void(double)> onSampleRateChange;
  function<void(size_t)> onHeadIndexChange;

 private:
  void setupProcessing(AudioBuffer<float>& buffer);
  void writeSidechainToBuffer(const AudioBuffer<float>& buffer);
  void applyFX(AudioBuffer<float>& buffer);
  void applyOutputGainAndMute(AudioBuffer<float>& buffer);
  void processEnvelopeFollower(AudioBuffer<float>& buffer);
  void writeToLooper(AudioBuffer<float>& buffer);

  // Buffers (move from PluginProcessor)
  unique_ptr<CircularBuffer> audioBuffer;
  unique_ptr<CircularBuffer> sidechainBuffer;
  unique_ptr<CircularBuffer> looperBuffer;

  AudioBuffer<float> streamBuffer;
  AudioBuffer<float> playbackBuffer;

  // Envelope follower (move from PluginProcessor)
  BallisticsFilter<float> envelopeFollower;
  AudioBuffer<float> envelopeFollowerOutputBuffer;
  atomic<float> outputLevelLeft;

  Transport& transport;
  FXStruct& fxState;

  // Audio Engine Properties
  ChannelCount numChannels;
  double currentSampleRate;
  int currentBlockSize;
    
  bool sampleRateInitialized = false;

  double fadeVolume;
};

}  // namespace magenta
