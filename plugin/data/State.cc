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

#include "State.h"

#include <fstream>
#include <thread>

#include "../audio/Transport.h"
#include "../networking/Gemini.h"
#include "../networking/WebBridge.h"

namespace magenta {

State::State(WebBridge& w, Gemini& g)
    : dawParameters(getDawParameters()),
      webBridge(w),
      gemini(g) {
  initAppProps();
}

unique_ptr<Parameter> State::parseParameter(string id, json param) {
  using namespace juce;

  unique_ptr<Parameter> parameter;

  int version = param["version"];
  string name = param["name"];
  string type = param["type"];

  if (type == "float") {
    float min = param["range"][0];
    float max = param["range"][1];
    float step = param["step"];
    float defaultValue = param["default"];

    if (id.compare(0, 12, "prompt-state") == 0) {
      parameter = make_unique<Float>(
          ParameterID(id, version), name, "",
          NormalisableRange<float>{min, max, step}, defaultValue,
          [this, id](float value) -> String {
            // value to text function
            int index = stoi(id.substr(14)) - 1;
            if (index < this->promptJson["prompts"].size()) {
              string promptID = "p" + to_string(index + 1);
              json prompt = this->promptJson["prompts"][index];
              string promptName = prompt["text"];
              float promptValue = this->promptJson[promptID];
              return String(promptValue, 1) + " | " + String(promptName);
            }
            return "";
          },
          [](const String& text) -> float {
            // text to value function
            return 0.0f;
          });
    } else {
      parameter = make_unique<Float>(ParameterID(id, version), name,
                                     NormalisableRange<float>{min, max, step},
                                     defaultValue);
    }
  } else if (type == "bool") {
    bool defaultValue = param["default"];
    string label = param["label"];

    parameter =
        make_unique<Bool>(ParameterID(id, version), name, defaultValue,
                          AudioParameterBoolAttributes{}.withLabel(label));
  } else if (type == "int") {
    int min = param["range"][0];
    int max = param["range"][1];
    int defaultValue = param["default"];

    parameter = make_unique<Int>(ParameterID(id, version), name, min, max,
                                 defaultValue);
  } else if (type == "choice") {
    StringArray choices;
    for (const json& choice : param["choices"]) {
      choices.add(choice.get<string>());
    }
    int defaultValue = choices.indexOf(param["default"].get<string>());
    parameter = make_unique<Choice>(ParameterID(id, version), name, choices,
                                    defaultValue);
  }

  return parameter;
}

Dict<Parameter> State::getDawParameters() {
  Dict<Parameter> parameters;

  auto jsonData =
      String::fromUTF8(BinaryData::schema_json, BinaryData::schema_jsonSize);
  json j = json::parse(jsonData.toStdString());

  for (const auto& [key, params] : j.items()) {
    if (key == LYRIA_STATE || key == FX_STATE || key == TRANSPORT_STATE ||
        key == PROMPT_STATE) {
      for (const json& param : params) {
        if (param["daw"]) {  // Add parameters that are exposed to the DAW
          string id = key + ":" + param["id"].get<string>();
          parameters[id] = parseParameter(id, param);
        }
      }
    }
  }
  return parameters;
}

ParameterLayout State::getParameterLayout() {
  ParameterLayout layout;
  for (auto& [id, parameter] : dawParameters) {
    layout.add(std::move(parameter));
  }
  return layout;
}

void State::setValueTreeListener(APVTS& v) {
  valueTreeState = &v;
  for (auto& [id, parameter] : dawParameters) {
    valueTreeState->addParameterListener(id, this);
  }
}

void State::updateState(string key, json state) {
  // Allows partial updates (keep an eye on performance)
  if (key == APP_STATE) {
    appJson.merge_patch(state);
    appState = appJson;
    saveAppProps();
  } else if (key == LYRIA_STATE) {
    lyriaJson.merge_patch(state);
    lyriaState = lyriaJson;
    DBG("Lyria state updated");
    gemini.sendConfig(lyriaState);
    updateValueTree(key + ':', state);
  } else if (key == FX_STATE) {
    fxJson.merge_patch(state);
    fxState = fxJson;
    updateValueTree(key + ':', state);
  } else if (key == TRANSPORT_STATE) {
    transportJson.merge_patch(state);
    transportState = transportJson;
    updateTransport();
    DBG("Transport state updated");
    gemini.sendTransport(transportState);
  } else if (key == PROMPT_STATE) {
    promptJson.merge_patch(state);
    promptState = promptJson;
    updateValueTree(key + ':', state);
    DBG("Prompt state updated");
    gemini.sendPrompts(promptState.prompts);
  } else if (key == CHAT_STATE) {
    chatJson.merge_patch(state);
  }
}

void State::updateStateOnUI(string key) {
  if (key == LYRIA_STATE) {
      lyriaJson = lyriaState;
      webBridge.passStateToUI(key, lyriaJson);
  } else if (key == TRANSPORT_STATE) {
      transportJson = transportState;
      webBridge.passStateToUI(key, transportJson);
  }
}

void State::updateValueTree(string prefix, json state) {
  for (const auto& [key, param] : state.items()) {
    if (param.is_object()) {
      updateValueTree(prefix + key + '.', param);
    } else {
      string id = prefix + key;
      Parameter* p = valueTreeState->getParameter(id);
      if (p) {
        Choice* c = dynamic_cast<Choice*>(p);
        float v;
        if (c) {
          v = p->convertTo0to1(c->choices.indexOf(param.get<string>()));
        } else {
          v = p->convertTo0to1(param);
        }
        if (p->getValue() != v) {
          p->setValueNotifyingHost(v);
        }
      }
    }
  }
}

json State::getJsonValueForParameterID(string varID) {
  size_t pos = varID.find(':');
  string stateKey = varID.substr(0, pos);
  string varKey = varID.substr(pos + 1);
  json* state = nullptr;
  if (stateKey == LYRIA_STATE) {
    state = &lyriaJson;
  } else if (stateKey == FX_STATE) {
    state = &fxJson;
  } else if (stateKey == TRANSPORT_STATE) {
    state = &transportJson;
  } else if (stateKey == APP_STATE) {
    state = &appJson;
  } else if (stateKey == PROMPT_STATE) {
    state = &promptJson;
  }
  if (state) {
    std::istringstream keyStream(varKey);
    string segment;
    json* current = state;
    while (std::getline(keyStream, segment, '.')) {
      if (current->contains(segment)) {
        current = &(*current)[segment];
      } else {
        return 0;
      }
    }
    return *current;
  }
  return 0;
}

void State::parameterChanged(const String& parameterID, float newValue) {
  Parameter* p = valueTreeState->getParameter(parameterID);
  json value;
  Choice* c = dynamic_cast<Choice*>(p);
  Bool* b = dynamic_cast<Bool*>(p);
  if (c) {
    value = c->choices[newValue].toStdString();
  } else if (b) {
      value = b->get();
  } else {
      value = newValue;
  }
  json old = getJsonValueForParameterID(parameterID.toStdString());
  if (value.is_number_float() &&
      std::abs(value.get<float>() - old.get<float>()) <= 0.002) {
    return;  // avoid sending too many updates due to float precision
  }
  if (value != getJsonValueForParameterID(parameterID.toStdString())) {
    webBridge.passVarToUI(parameterID.toStdString(), value);
  }
}

/////// Methods to save/load plugin state (project specific data)

void State::saveToMemoryBlock(MemoryBlock& destData) {
    DBG("saving to memory block");
  json state;
  state[LYRIA_STATE] = lyriaJson;
  state[FX_STATE] = fxJson;
  state[PROMPT_STATE] = promptJson;
  state[CHAT_STATE] = chatJson;
  state[TRANSPORT_STATE] = transportJson;

  string jsonString = state.dump();
  destData.append(jsonString.c_str(), jsonString.size());
}

void State::loadFromMemoryBlock(const void* data, int sizeInBytes) {
    DBG("loading from memory block");
  try {
    string jsonString(static_cast<const char*>(data), sizeInBytes);
    json state = json::parse(jsonString);
    updateState(LYRIA_STATE, state[LYRIA_STATE]);
    updateState(FX_STATE, state[FX_STATE]);
    updateState(PROMPT_STATE, state[PROMPT_STATE]);
    updateState(CHAT_STATE, state[CHAT_STATE]);
    updateState(TRANSPORT_STATE, state[TRANSPORT_STATE]);
    DBG("State restored");
  } catch (const exception& e) {
    DBG("No data to load or error parsing JSON data" << e.what());
  }
}

/////// Methods to save/load plugin properties

void State::initAppProps() {
    DBG("initAppProps");
  using namespace juce;
  PropertiesFile::Options options;
  options.applicationName = ProjectInfo::projectName;
  options.filenameSuffix = ".settings";
  options.osxLibrarySubFolder = "Application Support";
  options.folderName = String(ProjectInfo::companyName) +
                       File::getSeparatorString() +
                       String(ProjectInfo::projectName);
  options.storageFormat = PropertiesFile::storeAsXML;

  appProps.setStorageParameters(options);
}

void State::loadAppProps() {
    DBG("load app props");
  String s = appProps.getUserSettings()->getValue(APP_STATE, String());
  if (s.isNotEmpty()) {
    appJson = json::parse(s.toStdString());
  }
}

void State::saveAppProps() {
    DBG("save app props");
  appProps.getUserSettings()->setValue(APP_STATE, String(appJson.dump()));
  // Set the access token for the networking class
  Credentials credentials = appState.credentials;

  DBG("Testing Gemini Initialize");
  gemini.initialize(credentials.api_key);
}

State::~State() {}

}  // namespace magenta
