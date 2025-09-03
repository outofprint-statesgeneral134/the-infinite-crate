// Copyright 2025 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#include "AudioEngine.h"

#include <juce_audio_processors/juce_audio_processors.h>

#include "../data/types/GeminiTypes.h"
#include "../utils/Functions.h"
#include "../audio/Transport.h"

namespace magenta {

AudioEngine::AudioEngine(Transport &transport, FXStruct &fxState)
    : audioBuffer{make_unique<CircularBuffer>()},
      sidechainBuffer{make_unique<CircularBuffer>()},
      looperBuffer{make_unique<CircularBuffer>()},
      transport{transport},
      fxState{fxState},
      fadeVolume{0} {}

void AudioEngine::writeStreamToBuffer(const Array<Var> &left,
                                      const Array<Var> &right) {
  if (!audioBuffer->writeStereo(&left, &right)) {
    DBG("Write error");
  }
}

//May want to batch load
void AudioEngine::processAudioChunks(vector<AudioChunk> chunks) {
  juce::String timestamp = juce::Time::getCurrentTime().toString(true, true, true, true);
  DBG(timestamp + " Chunks Received");

  const int numChannels = 2;
  const int bitDepth = 16;
  const float scaleFactor = 1.0f/32768.0f;
    
  for (const auto& chunk : chunks) {
    juce::MemoryOutputStream decodedStream;
    juce::Base64::convertFromBase64(decodedStream, chunk.data.value());
      
      const juce::MemoryBlock& decodedData = decodedStream.getMemoryBlock();
      const char* rawBytes = static_cast<const char*>(decodedData.getData());
      size_t numBytes = decodedData.getSize();

      const int bytesPerSample = bitDepth / 8; // 16 bits = 2 bytes
      const int bytesPerFrame = bytesPerSample * numChannels; // 2 bytes/sample * 2 channels = 4 bytes/frame
      int numSamples = (int)(numBytes / bytesPerFrame);
    
    DBG(numSamples);
      
      for (int sampleIndex = 0; sampleIndex < numSamples; ++sampleIndex)
      {
          int frameByteOffset = sampleIndex * bytesPerFrame;
          int16_t rawSample1 = juce::ByteOrder::littleEndianShort(
              reinterpret_cast<const int16_t*>(rawBytes + frameByteOffset)
          );
          int16_t rawSample2 = juce::ByteOrder::littleEndianShort(
              reinterpret_cast<const int16_t*>(rawBytes + frameByteOffset + bytesPerSample)
          );
          
           audioBuffer->writeStereoSample(
             static_cast<float>(rawSample1) * scaleFactor,
             static_cast<float>(rawSample2) * scaleFactor
           );
      }
  }
}

void AudioEngine::clearBuffer() {
    audioBuffer->clear();
}

void AudioEngine::prepare(double sampleRate, int blockSize,
                          ChannelCount numChannels) {
  this->currentSampleRate = sampleRate;
  this->currentBlockSize = blockSize;
  this->numChannels = numChannels;

  Timer::callAfterDelay(1000, [this, sampleRate]() {
      onSampleRateChange(sampleRate);
  });

  envelopeFollower.prepare(
      ProcessSpec{.sampleRate = sampleRate,
                  .maximumBlockSize = static_cast<uint32>(blockSize),
                  .numChannels = static_cast<uint32>(numChannels.outputs)});
  envelopeFollower.setAttackTime(200.f);
  envelopeFollower.setReleaseTime(200.f);
  envelopeFollower.setLevelCalculationType(
      BallisticsFilter<float>::LevelCalculationType::peak);

  envelopeFollowerOutputBuffer.setSize(numChannels.outputs, blockSize);
}

void AudioEngine::process(AudioBuffer<float> &buffer,
                          MidiBuffer &midiMessages) {
    
  int samplesToRead = buffer.getNumSamples();
  double dawSampleRate = this->currentSampleRate;
    
  setupProcessing(buffer);

  writeSidechainToBuffer(buffer);
    
    if (!transport.transportState.playing) {
        //Do this for stop
        //  audioBuffer->clear();
        //Do this for pause
        return;
    }

  // TODO: if looper is engaged, playback from looper buffer

  int framesRead = audioBuffer->readStereo(buffer, samplesToRead, dawSampleRate);
  if (framesRead == 0) {
    buffer.clear();
    if (transport.transportState.playing && !transport.transportState.buffering) {
      transport.buffering(true);
    }
    return;
  } else if (transport.transportState.buffering) {
    transport.buffering(false);
  }
  
  //Report sample rate up to server
  if (transport.transportState.initialized && !sampleRateInitialized) {
    onSampleRateChange(this->currentSampleRate);
    sampleRateInitialized = true;
  }
  //Report head index to server
  onHeadIndexChange(framesRead);
    
  applyFX(buffer);

  looperBuffer->writeStereo(buffer, this->currentSampleRate);

  applyOutputGainAndMute(buffer);

  processEnvelopeFollower(buffer);
}

void AudioEngine::setupProcessing(AudioBuffer<float> &buffer) {
  // Clear any output channels that didn't contain input data
  for (auto i = numChannels.inputs; i < numChannels.outputs; ++i)
    buffer.clear(i, 0, buffer.getNumSamples());
}

void AudioEngine::writeSidechainToBuffer(const AudioBuffer<float> &buffer) {
  auto numSamples = buffer.getNumSamples();
  if (numChannels.inputs >= 2) {  // stereo input
    AudioBuffer<float> leftChannel(1, numSamples);
    AudioBuffer<float> rightChannel(1, numSamples);
    leftChannel.copyFrom(0, 0, buffer, 0, 0, numSamples);
    rightChannel.copyFrom(0, 0, buffer, 1, 0, numSamples);

    Array<Var> leftArray;
    Array<Var> rightArray;
    for (int i = 0; i < leftChannel.getNumSamples(); ++i) {
      leftArray.add(leftChannel.getSample(0, i));
      rightArray.add(rightChannel.getSample(0, i));
    }

    sidechainBuffer->writeStereo(&leftArray, &rightArray);
  } else if (numChannels.inputs == 1) {  // mono input
    AudioBuffer<float> leftChannel(1, numSamples);
    leftChannel.copyFrom(0, 0, buffer, 0, 0, numSamples);

    Array<Var> leftArray;
    Array<Var> rightArray;
    for (int i = 0; i < leftChannel.getNumSamples(); ++i) {
      leftArray.add(leftChannel.getSample(0, i));
      rightArray.add(leftChannel.getSample(0, i));
    }
    sidechainBuffer->writeStereo(&leftArray, &rightArray);
  }
}

void AudioEngine::applyFX(AudioBuffer<float> &buffer) {
  if (fxState.distortionType == "tanh(kx)/tanh(k)") {
    forEachSampleIn(buffer, [](float &sample) {
      constexpr auto SATURATION = 5.f;
      static const auto normalizationFactor = tanh(SATURATION);
      sample = tanh(SATURATION * sample) / normalizationFactor;
    });
  } else if (fxState.distortionType == "sigmoid") {
    forEachSampleIn(buffer, [](float &sample) {
      constexpr auto SATURATION = 5.f;
      sample = 2.f / (1.f + exp(-SATURATION * sample)) - 1.f;
    });
  }
}

void AudioEngine::applyOutputGainAndMute(AudioBuffer<float> &buffer) {

  //TODO: fade volume!
  
  if (fxState.outputMute || fxState.bypass || !transport.transportState.playing) {
    buffer.applyGain(0);
  } else {
    buffer.applyGain(fxState.outputGain);
  }
}

void AudioEngine::processEnvelopeFollower(AudioBuffer<float> &buffer) {
  const auto inBlock = AudioBlock<float>{buffer}.getSubsetChannelBlock(
      0u, static_cast<size_t>(numChannels.outputs));
  auto outBlock = AudioBlock<float>{envelopeFollowerOutputBuffer}.getSubBlock(
      0u, static_cast<size_t>(buffer.getNumSamples()));
  envelopeFollower.process(
      ProcessContextNonReplacing<float>{inBlock, outBlock});
  outputLevelLeft = Decibels::gainToDecibels(
      outBlock.getSample(0, static_cast<int>(outBlock.getNumSamples()) - 1));
}

}  // namespace magenta
