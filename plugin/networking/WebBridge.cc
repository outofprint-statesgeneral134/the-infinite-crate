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

// WebBridge.cpp
#include "WebBridge.h"

#include <iostream>

#include "../Processor.h"

namespace magenta {

WebBridge::WebBridge(Processor& p) : processor(p) {
}

void WebBridge::loadStateFromProcessor(const Array<Var>& args,
                                       NativeFunctionCompletion completion) {
  string key = args[0].toString().toStdString();

  json j;
  if (key == APP_STATE) {
    processor.state.loadAppProps();
    j[STATE_KEY] = processor.state.appJson;
  } else if (key == LYRIA_STATE) {
    j[STATE_KEY] = processor.state.lyriaJson;
  } else if (key == FX_STATE) {
    j[STATE_KEY] = processor.state.fxJson;
  } else if (key == PROMPT_STATE) {
    j[STATE_KEY] = processor.state.promptJson;
  } else if (key == CHAT_STATE) {
    j[STATE_KEY] = processor.state.chatJson;
  } else if (key == TRANSPORT_STATE) {
    j[STATE_KEY] = processor.state.transportJson;
  }

  string jsonString = j.dump();
  completion(Var(jsonString));
}

void WebBridge::updateStateOnProcessor(const Array<Var>& args,
                                       NativeFunctionCompletion completion) {
  string key =
      args[0].toString().toStdString();  // state-lyria, state-fx, state-user
  string jsonString = args[1].toString().toStdString();

  json j = json::parse(jsonString);
  json state = j[STATE_KEY];
  json version = j[VERSION_KEY];

  processor.state.updateState(key, state);

  completion("updateStateOnProcessor callback: All OK!");
}

void WebBridge::resetStateOnProcessor(const Array<Var>& args,
                                      NativeFunctionCompletion completion) {
  completion("resetStateOnProcessor callback: All OK!");
}

void WebBridge::launchAIStudioFromProcessor(
    const Array<Var>& args, NativeFunctionCompletion completion) {
  JURL url(AI_STUDIO_URL);
  url.launchInDefaultBrowser();
  completion("launchAIStudioFromProcessor callback: All OK!");
}

void WebBridge::launchUpdateURLFromProcessor(
    const Array<Var>& args, NativeFunctionCompletion completion) {
  JURL url(processor.state.appState.updateURL);
  DBG(processor.state.appState.updateURL);
  url.launchInDefaultBrowser();
  completion("launchUpdateURLFromProcessor callback: All OK!");
}

void WebBridge::launchAboutPageFromProcessor(
    const Array<Var>& args, NativeFunctionCompletion completion) {
  JURL url(ABOUT_URL);
  url.launchInDefaultBrowser();
  completion("launchAboutPageFromProcessor callback: All OK!");
}

void WebBridge::launchFeedbackPageFromProcessor(
    const Array<Var>& args, NativeFunctionCompletion completion) {
  JURL url(FEEDBACK_URL);
  url.launchInDefaultBrowser();
  completion("launchAboutPageFromProcessor callback: All OK!");
}

void WebBridge::passStateToUI(string stateID, json state) {
  // Ensure this block runs on the main thread
  auto lambda = [this, stateID, state]() {
    string stateString;
    if (stateID == APP_STATE) {
      stateString = processor.state.appJson.dump();
    } else if (stateID == FX_STATE) {
      stateString = processor.state.fxJson.dump();
    } else if (stateID == LYRIA_STATE) {
      stateString = processor.state.lyriaJson.dump();
    } else if (stateID == PROMPT_STATE) {
      stateString = processor.state.promptJson.dump();
    } else if (stateID == CHAT_STATE) {
      stateString = processor.state.chatJson.dump();
    } else if (stateID == TRANSPORT_STATE) {
      stateString = processor.state.transportJson.dump();
    }
    processor.emitEventToWebView(stateID, stateString);
  };
  MessageManager::callAsync(lambda);
}

void WebBridge::resetGeminiFromProcessor(const Array<Var>& args,
                                         NativeFunctionCompletion completion) {
  DBG("resetGeminiFromProcessor");
  processor.gemini.resetContext();
  processor.transport.updateTransportOnUI();
  completion("resetGeminiFromProcessor callback: All OK!");
}

void WebBridge::reconnectGeminiFromProcessor(
    const Array<Var>& args, NativeFunctionCompletion completion) {
  DBG("reconnectGeminiFromProcessor");
  processor.gemini.reconnect();
  completion("reconnectGeminiFromProcessor callback: All OK!");
}

void WebBridge::passMessageToUI(string type, json data) {
  MessageManager::callAsync([this, type, data]() {
      processor.emitEventToWebView(type, data.dump());
  });
}

void WebBridge::passVarToUI(string varID, json value) {
  size_t pos = varID.find(':');
  string stateKey = varID.substr(0, pos);
  string varKey = varID.substr(pos + 1);
  string val = getNestedJsonString(varKey, value);

  // Ensure this block runs on the main thread
  MessageManager::callAsync([this, stateKey, val]() {
    processor.emitEventToWebView(stateKey, val);
  });
}

string WebBridge::getNestedJsonString(string varID, json value) {
  std::vector<string> keys;
  size_t start = 0;
  size_t end = varID.find('.');
  while (end != std::string::npos) {
    keys.push_back(varID.substr(start, end - start));
    start = end + 1;
    end = varID.find('.', start);
  }
  keys.push_back(varID.substr(start));

  // Construct the nested JSON
  json nestedJson;
  json* current = &nestedJson;
  for (size_t i = 0; i < keys.size(); ++i) {
    if (i == keys.size() - 1) {
      (*current)[keys[i]] = value;  // Assign the value at the deepest level
    } else {
      (*current)[keys[i]] = json::object();  // Create a new nested object
      current = &(*current)[keys[i]];  // Move deeper into the JSON structure
    }
  }

  return nestedJson.dump();
}

WebBridge::~WebBridge() {}

}  // namespace magenta
