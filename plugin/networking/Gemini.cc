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

#include "Gemini.h"

#include "../utils/Functions.h"

namespace magenta {

Gemini::Gemini() {
  config = {
      .endpoint = GEMINI_URI,
      .audioModel = GEMINI_MODEL,
      .apiKey = "",
  };
  transport = "";
  lyriaConfig = "";
  prompts = "";

  geminiActive = false;

  ws = make_shared<WebSocket>();
  ws->onOpen = [this]() {
    DBG("GEMINI ++++++ Socket opened!");
    onServerConnected(json{{"connected", true}});
    sendSetup();
  };
  ws->onMessage = [this](json payload) {
    geminiActive = true;
    onServerConnected(json{{"connected", true}});
    parseMessage(payload);
  };
  ws->onClose = [this](json payload) {
    DBG("GEMINI ++++++ Socket closed!");
    onServerClose(payload);
    //      reconnect();
  };
}

void Gemini::initialize(string apiKey) {
  config.apiKey = apiKey;
  DBG("Access token set to: " << config.apiKey);
  connectWebSocket();
}

string Gemini::websocketUrl() {
  return string(GEMINI_URI_PREFIX) + string(GEMINI_HOST) + string(GEMINI_URI) +
         string(GEMINI_URI_PARAMS) + config.apiKey;
}

void Gemini::reconnect() {
  DBG("Reconnecting");
  geminiActive = false;
  if (ws) {
    ws->stop();
  }

  ws = make_shared<WebSocket>();
  ws->onOpen = [this]() {
    DBG("GEMINI ++++++ Socket opened!");
    onServerConnected(json{{"connected", true}});
    sendSetup();
  };
  ws->onMessage = [this](json payload) {
    geminiActive = true;
    onServerConnected(json{{"connected", true}});
    parseMessage(payload);
  };
  ws->onClose = [this](json payload) {
    DBG("GEMINI ++++++ Socket closed!");
    onServerClose(payload);
  };

  connectWebSocket();
}

void Gemini::connectWebSocket() {
  if (config.apiKey == "") {
    DBG("No access token set");
    return;
  }
  try {
    thread([this]() {
      string uri = websocketUrl();
      ws->start(uri);
    }).detach();
  } catch (websocketpp::exception const& e) {
    DBG(e.what());
  } catch (std::exception const& e) {
    DBG(e.what());
  } catch (...) {
    DBG("other exception");
  }
}

void Gemini::sendMessage(json payload) {
  if (geminiActive) {
    thread([this, payload]() { ws->send(payload); }).detach();
  }
}

void Gemini::sendSetup() {
  GeminiSetupParams params;
  params.setup.model = config.audioModel;
  json payload = params;
  thread([this, payload]() { ws->send(payload); }).detach();
}

void Gemini::initializeGemini() {
  geminiActive = true;
  if (transport != "") {
    sendMessage(transport);
  }
  if (lyriaConfig != "") {
    sendMessage(lyriaConfig);
  }
  if (prompts != "") {
    sendMessage(prompts);
  }
}

void Gemini::resetContext() {
  if (!ws->connected) {
    reconnect();
    return;
  }
  DBG("Sending reset");
  GeminiPlaybackParams params;
  params.playback_control = LiveMusicPlaybackControl::RESET_CONTEXT;
  json reset = params;
  sendMessage(reset);
  onContextClear();
}

void Gemini::sendTransport(TransportStruct& transportState) {
  DBG("Sending transport");
  GeminiPlaybackParams params = convertTransport(transportState);
  transport = params;
    DBG(to_string(params.playback_control));
  sendMessage(transport);
}

void Gemini::sendConfig(LyriaStruct& lyriaParams) {
  DBG("Sending config");
  GeminiConfigParams params = convertConfig(lyriaParams);
  lyriaConfig = params;
  sendMessage(lyriaConfig);
}

void Gemini::sendPrompts(vector<Prompt> newPrompts) {
  DBG("Sending prompts");
  if (newPrompts.empty()) {
    return;
  }
  GeminiPromptParams params = convertPrompts(newPrompts);
  prompts = params;
  sendMessage(prompts);
}

void Gemini::parseMessage(json payload) {
  if (payload.contains("serverContent")) {
    vector<AudioChunk> audioChunks = payload["serverContent"]["audioChunks"];
    onAudioChunks(std::move(audioChunks));
  } else if (payload.contains("setupComplete")) {
    DBG("Setup Complete");
    initializeGemini();
  } else if (payload.contains("filteredPrompt")) {
    DBG("Filtered Prompt");
    DBG(payload.dump());
    json filteredPrompt = payload["filteredPrompt"];
    DBG(filteredPrompt.dump());
    DBG("=========");
    onFilteredPrompt(std::move(filteredPrompt));
  } else {
    DBG("Unknown message");
    DBG(payload.dump());
    DBG("=========");
  }
}

GeminiPromptParams Gemini::convertPrompts(vector<Prompt> prompts) {
  GeminiClientContent content;
  vector<WeightedPrompt> weightedPrompts;
  for (Prompt prompt : prompts) {
    if (prompt.weight > 0) {
      WeightedPrompt weightedPrompt;
      weightedPrompt.text = prompt.text;
      weightedPrompt.weight = prompt.weight;
      weightedPrompts.push_back(weightedPrompt);
    }
  }
  content.weighted_prompts = weightedPrompts;

  GeminiPromptParams params;
  params.client_content = content;
  return params;
}

GeminiConfigParams Gemini::convertConfig(LyriaStruct& lyriaParams) {
  LiveMusicGenerationConfig c;
  c.temperature = lyriaParams.temperature;
  c.topK = lyriaParams.topk;
  c.guidance = lyriaParams.guidance;
  if (lyriaParams.useDensity) {
    c.density = lyriaParams.density;
  }
  if (lyriaParams.useBrightness) {
    c.brightness = lyriaParams.brightness;
  }
  if (lyriaParams.bpmMode != "off") {
    c.bpm = lyriaParams.bpm;
  }
  if (lyriaParams.scaleMode != "off") {
    c.scale = static_cast<Scale>(lyriaParams.rootNote);
  }
  c.muteBass = lyriaParams.muteBass;
  c.muteDrums = lyriaParams.muteDrums;
  c.onlyBassAndDrums = lyriaParams.muteOther;

  if (lyriaParams.generationQuality == "quality") {
    c.musicGenerationMode = MusicGenerationMode::QUALITY;
  } else if (lyriaParams.generationQuality == "diversity") {
    c.musicGenerationMode = MusicGenerationMode::DIVERSITY;
  } else if (lyriaParams.generationQuality == "off") {
    c.musicGenerationMode =
        MusicGenerationMode::MUSIC_GENERATION_MODE_UNSPECIFIED;
  }

  GeminiConfigParams params;
  params.music_generation_config = c;
  return params;
}

GeminiPlaybackParams Gemini::convertTransport(TransportStruct& transportState) {
  LiveMusicPlaybackControl control;
  if (transportState.playing) {
    control = LiveMusicPlaybackControl::PLAY;
  } else {
    control = LiveMusicPlaybackControl::PAUSE;
  }
  GeminiPlaybackParams params;
  params.playback_control = control;
  return params;
}

Gemini::~Gemini() {}

}  // namespace magenta
