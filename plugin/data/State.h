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
#include <JuceHeader.h>

#include "types/StateTypes.h"
#include "types/Types.h"

namespace magenta {

class WebBridge;
class Gemini;
class Transport;

class State : public APVTS::Listener {
 public:
  explicit State(WebBridge& w, Gemini& g);  // Constructor
  ~State();                      // Destructor

  json lyriaJson;
  json fxJson;
  json transportJson;
  json appJson;
  json promptJson;
  json chatJson;

  // States that are sync'd with Zustand
  LyriaStruct lyriaState;
  FXStruct fxState;
  TransportStruct transportState;
  AppStruct appState;
  PromptStruct promptState;

  bool initialized = false;

  Dict<Parameter> dawParameters;
  Dict<Parameter> getDawParameters();

  unique_ptr<Parameter> parseParameter(string id, json param);

  ParameterLayout getParameterLayout();

  void updateState(string key, json state);
  void updateValueTree(string prefix, json state);

  void setValueTreeListener(APVTS& v);
  void parameterChanged(const String& parameterID, float newValue) override;
  json getJsonValueForParameterID(string varID);
    
  void updateStateOnUI(string key);

  void saveToMemoryBlock(MemoryBlock& destData);
  void loadFromMemoryBlock(const void* data, int sizeInBytes);

  void initAppProps();
  void loadAppProps();
  void saveAppProps();

  function<void()> updateTransport;

 private:
  WebBridge& webBridge;
  Gemini& gemini;
  APVTS* valueTreeState;
  AppProps appProps;
};

}  // namespace magenta
