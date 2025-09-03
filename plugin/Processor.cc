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

#include "Processor.h"

#include <cmath>
#include <functional>

#include "JucePluginDefines.h"
#include "ui/Container.h"
#include "utils/Aliases.h"
#include "utils/Functions.h"

namespace magenta {

Processor::Processor()
    : AudioProcessor(
          BusesProperties()
              .withOutput("Output", AudioChannelSet::stereo(), true)
              .withInput("Sidechain", AudioChannelSet::stereo(), true)),
      gemini{},
      webBridge{*this},
      state{webBridge, gemini},
      valueTreeState{*this, nullptr, "PARAMETERS", state.getParameterLayout()},
      transport{state.transportState},
#if JUCE_WINDOWS
      webViewPtr{make_unique<WebBrowserComponent>(createWebViewOptions())},
#else
      webView{createWebViewOptions()},
#endif
      audioEngine{transport, state.fxState} {
  state.setValueTreeListener(valueTreeState);
  state.updateTransport = [this]() { transport.transportUpdatedFromUI(); };

  transport.updateTransportOnUI = [this]() {
    DBG("Transport updating on UI");
    state.updateStateOnUI(TRANSPORT_STATE);
  };

  gemini.onAudioChunks = [this](vector<AudioChunk> chunks) {
    audioEngine.processAudioChunks(chunks);
  };
  gemini.onFilteredPrompt = [this](json filteredPrompt) {
    webBridge.passMessageToUI("filteredPrompt", filteredPrompt);
  };
  gemini.onServerConnected = [this](json response) {
    webBridge.passMessageToUI("serverConnected", response);
  };
  gemini.onServerClose = [this](json response) {
    webBridge.passMessageToUI("serverResponse", response);
  };
  gemini.onContextClear = [this]() { audioEngine.clearBuffer(); };

  audioEngine.onSampleRateChange = [this](double sampleRate) {
    json message;
    message["sampleRate"] = sampleRate;
    webBridge.passMessageToUI("sampleRateChange", message);
  };
  audioEngine.onHeadIndexChange = [this](size_t headIndex) {
      json message;
      message["headIndex"] = headIndex;
      webBridge.passMessageToUI("headIndexChange", message);
  };
          
  MessageManager::callAsync([this]() {
    loadUrl();
  });
  
}

void Processor::loadUrl() {
#if JUCE_WINDOWS
  String url = DEV ? LOCAL_DEV_SERVER_ADDRESS : webViewPtr->getResourceProviderRoot();
  webViewPtr->setVisible(true);
  webViewPtr->goToURL(url);
#else
  String url = DEV ? LOCAL_DEV_SERVER_ADDRESS : webView.getResourceProviderRoot();
  webView.setVisible(true);
  webView.goToURL(url);
#endif
}

void Processor::emitEventToWebView(string type, string data) {
#if JUCE_WINDOWS
    webViewPtr->emitEventIfBrowserIsVisible(Identifier(type),
                                            Var(data));
#else
    webView.emitEventIfBrowserIsVisible(Identifier(type),
                                        Var(data));
#endif
}

#define BIND_WEBBRIDGE_FUNCTION(name) \
  .withNativeFunction(Identifier{#name}, \
    [this](const Array<Var> &args, NativeFunctionCompletion c) { \
      webBridge.name(args, std::move(c)); \
    })

WebBrowserComponent::Options Processor::createWebViewOptions() {
  return WebBrowserComponent::Options{}
      .withKeepPageLoadedWhenBrowserIsHidden()
      .withBackend(WebBrowserComponent::Options::Backend::webview2)
      .withWinWebView2Options(
          WebBrowserComponent::Options::WinWebView2{}
              .withBackgroundColour(WhiteColor)
              .withUserDataFolder(File::getSpecialLocation(
                  File::SpecialLocationType::tempDirectory)))
      .withNativeIntegrationEnabled()
      .withResourceProvider(
          [this](const auto &url) { return getResource(url); },
          JURL{LOCAL_DEV_SERVER_ADDRESS}.getOrigin())
      BIND_WEBBRIDGE_FUNCTION(loadStateFromProcessor)
      BIND_WEBBRIDGE_FUNCTION(updateStateOnProcessor)
      BIND_WEBBRIDGE_FUNCTION(resetStateOnProcessor)
      BIND_WEBBRIDGE_FUNCTION(resetGeminiFromProcessor)
      BIND_WEBBRIDGE_FUNCTION(reconnectGeminiFromProcessor)
      BIND_WEBBRIDGE_FUNCTION(launchAIStudioFromProcessor)
      BIND_WEBBRIDGE_FUNCTION(launchUpdateURLFromProcessor)
      BIND_WEBBRIDGE_FUNCTION(launchAboutPageFromProcessor)
      BIND_WEBBRIDGE_FUNCTION(launchFeedbackPageFromProcessor);
}

Processor::~Processor() {}

const String Processor::getName() const { return JucePlugin_Name; }

bool Processor::acceptsMidi() const {
#if JucePlugin_WantsMidiInput
  return true;
#else
  return false;
#endif
}

bool Processor::producesMidi() const {
#if JucePlugin_ProducesMidiOutput
  return true;
#else
  return false;
#endif
}

bool Processor::isMidiEffect() const {
#if JucePlugin_IsMidiEffect
  return true;
#else
  return false;
#endif
}

double Processor::getTailLengthSeconds() const { return 0.0; }

int Processor::getNumPrograms() {
  return 1;  // NB: some hosts don't cope very well if you tell them there are 0
             // programs, so this should be at least 1, even if you're not
             // really implementing programs.
}

int Processor::getCurrentProgram() { return 0; }

void Processor::setCurrentProgram(int index) { ignoreUnused(index); }

const String Processor::getProgramName(int index) {
  ignoreUnused(index);
  return {};
}

void Processor::changeProgramName(int index, const String &newName) {
  ignoreUnused(index, newName);
}

void Processor::prepareToPlay(double sampleRate, int samplesPerBlock) {
  ChannelCount numChannels = {.inputs = getTotalNumInputChannels(),
                              .outputs = getTotalNumOutputChannels()};

  audioEngine.prepare(sampleRate, samplesPerBlock, numChannels);
}

void Processor::releaseResources() {
  // When playback stops, you can use this as an opportunity to free up any
  // spare memory, etc.
}

bool Processor::isBusesLayoutSupported(const BusesLayout &layouts) const {
#if JucePlugin_IsMidiEffect
  ignoreUnused(layouts);
  return true;
#else
  // This is the place where you check if the layout is supported.
  // In this template code we only support mono or stereo.
  // Some plugin hosts, such as certain GarageBand versions, will only
  // load plugins that support stereo bus layouts.
  if (layouts.getMainOutputChannelSet() != AudioChannelSet::stereo())
    return false;

  // This checks if the input layout matches the output layout
#if !JucePlugin_IsSynth
  if (layouts.getMainOutputChannelSet() != layouts.getMainInputChannelSet())
    return false;
#endif

  return true;
#endif
}

void Processor::processBlock(AudioBuffer<float> &buffer,
                             MidiBuffer &midiMessages) {
  ignoreUnused(midiMessages);
  ScopedNoDenormals noDenormals;

  updateBPM(*getPlayHead());
  audioEngine.process(buffer, midiMessages);
}

void Processor::updateBPM(AudioPlayHead &playhead) {
  if (state.lyriaState.bpmMode == "daw") {
    double bpm = 0.0;
    auto bpmValue = playhead.getPosition()->getBpm();
    if (bpmValue.hasValue()) {
      bpm = *bpmValue;
      if (state.lyriaState.bpm != bpm) {
        state.lyriaState.bpm = bpm;
        state.updateStateOnUI(LYRIA_STATE);
      }
    }
  }
}

bool Processor::hasEditor() const {
  return true;  // (change this to false if you choose to not supply an editor)
}

AudioProcessorEditor *Processor::createEditor() { return new Container(*this); }

// Method to save state to memory block
void Processor::getStateInformation(MemoryBlock &destData) {
  state.saveToMemoryBlock(destData);
}

// Method to restore state from memory block
void Processor::setStateInformation(const void *data, int sizeInBytes) {
  state.loadFromMemoryBlock(data, sizeInBytes);
}

auto Processor::getResource(const String &url) const -> optional<Resource> {

#if JUCE_WINDOWS
  static const auto resourceFilesRoot =
      File::getSpecialLocation(
          File::SpecialLocationType::currentApplicationFile)
          .getParentDirectory()
          .getParentDirectory()
          .getChildFile("Resources/");
#else
  static const auto resourceFilesRoot =
      File::getSpecialLocation(
          File::SpecialLocationType::currentApplicationFile)
          .getChildFile("Contents/Resources/");
#endif

  [[maybe_unused]] static auto printRootOnce = [] {
     DBG("Resource files root is " << resourceFilesRoot.getFullPathName());
     return true;
  }();

  const auto resourceToRetrieve =
      url == "/" ? "index.html" : url.fromFirstOccurrenceOf("/", false, false);

  const auto resource =
      resourceFilesRoot.getChildFile(resourceToRetrieve).createInputStream();
  if (resource) {
    const auto extension =
        resourceToRetrieve.fromLastOccurrenceOf(".", false, false);
    return Resource{streamToVector(*resource), getMimeForExtension(extension)};
  }

  return nullopt;
}

}  // namespace magenta

// This creates new instances of the plugin.
// This function definition must be in the global namespace.
juce::AudioProcessor *JUCE_CALLTYPE createPluginFilter() {
  return new magenta::Processor();
}
