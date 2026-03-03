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

#include "../data/types/GeminiTypes.h"
#include "../data/types/StateTypes.h"
#include "WebSocket.h"

namespace magenta {

class Gemini {
 public:
  explicit Gemini();  // Constructor
  ~Gemini();          // Destructor

  void initialize(string apiKey);
  string websocketUrl();
  void connectWebSocket();

  void sendMessage(json payload);
  void sendSetup();
  void initializeGemini();
  void resetContext();
  void reconnect();

  void sendTransport(TransportStruct& transportState);  // PLAY, PAUSE, STOP
  void sendConfig(LyriaStruct& lyriaState);      // music generation config
  void sendPrompts(vector<Prompt> prompts);  // client content

  void parseMessage(json payload);

  function<void(vector<AudioChunk>)> onAudioChunks;
  function<void(json filteredPrompt)> onFilteredPrompt;
  function<void()> onContextClear;
  function<void(json response)> onServerConnected;
  function<void(json response)> onServerClose;

  GeminiPromptParams convertPrompts(vector<Prompt> newPrompts);
  GeminiConfigParams convertConfig(LyriaStruct& lyriaState);
  GeminiPlaybackParams convertTransport(TransportStruct& transportState);

 private:
  GeminiConfig config;
  shared_ptr<WebSocket> ws;
  atomic<bool> geminiActive;

  // Save the most recent values so we can resend on reconnection
  json transport;
  json lyriaConfig;
  json prompts;

  mutex url_mutex;
};

}  // namespace magenta
