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
#include <juce_dsp/juce_dsp.h>
#include <juce_gui_basics/juce_gui_basics.h>
#include <juce_gui_extra/juce_gui_extra.h>
#include <juce_audio_plugin_client/juce_audio_plugin_client.h>

#include "audio/AudioEngine.h"
#include "audio/CircularBuffer.h"
#include "audio/Transport.h"
#include "data/State.h"
#include "networking/Gemini.h"
#include "networking/WebBridge.h"
#include "data/types/Types.h"

namespace magenta {
class Processor : public AudioProcessor {
 public:
  Processor();
  ~Processor() override;
    
  void updateState();

  void prepareToPlay(double sampleRate, int samplesPerBlock) override;
  void releaseResources() override;

  bool isBusesLayoutSupported(const BusesLayout &layouts) const override;

  void processBlock(AudioBuffer<float> &, MidiBuffer &) override;
  using AudioProcessor::processBlock;

  AudioProcessorEditor *createEditor() override;
  bool hasEditor() const override;

  const String getName() const override;

  bool acceptsMidi() const override;
  bool producesMidi() const override;
  bool isMidiEffect() const override;
  double getTailLengthSeconds() const override;

  int getNumPrograms() override;
  int getCurrentProgram() override;
  void setCurrentProgram(int index) override;
  const String getProgramName(int index) override;
  void changeProgramName(int index, const String &newName) override;

  Gemini gemini;
    
  WebBridge webBridge;
    
  State state;
  APVTS valueTreeState;
  Transport transport;

#if JUCE_WINDOWS
  unique_ptr<WebBrowserComponent> webViewPtr;
#else
  WebBrowserComponent webView;
#endif

  WebBrowserComponent::Options createWebViewOptions();
  void loadUrl();
  void emitEventToWebView(string type, string data);

  void getStateInformation(MemoryBlock &destData) override;
  void setStateInformation(const void *data, int sizeInBytes) override;
  
  int pluginWidth{DEFAULT_WIDTH};
  int pluginHeight{DEFAULT_HEIGHT};

 private:
  using Resource = WebBrowserComponent::Resource;
  optional<Resource> getResource(const String &url) const;

  void updateBPM(AudioPlayHead& playhead);
        
  AudioEngine audioEngine;

  JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(Processor)
};
}  // namespace magenta
