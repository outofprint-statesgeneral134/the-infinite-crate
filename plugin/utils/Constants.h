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

#include "Aliases.h"

namespace magenta {

constexpr auto DEV = true;

constexpr auto LOCAL_DEV_SERVER_ADDRESS = "http://localhost:62418/";

constexpr auto AI_STUDIO_URL = "https://aistudio.google.com/apikey";
constexpr auto ABOUT_URL = "https://github.com/magenta/the-infinite-crate";
constexpr auto FEEDBACK_URL = "https://g.co/magenta/discord";

constexpr auto GEMINI_MODEL = "models/lyria-realtime-exp";
constexpr auto GEMINI_HOST = "generativelanguage.googleapis.com";
constexpr auto GEMINI_URI_PREFIX = "wss://";
constexpr auto GEMINI_URI =
    "/ws/"
    "google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateMusic";
constexpr auto GEMINI_URI_PARAMS = "?key=";

constexpr auto DEFAULT_HEIGHT = 800;
constexpr auto DEFAULT_WIDTH = 1600;

constexpr auto SOURCE_SAMPLE_RATE = 48000.0;
constexpr auto DEFAULT_FRAME_CAPACITY =
    static_cast<size_t>(SOURCE_SAMPLE_RATE * 60 * 2);

constexpr auto PLUGIN_VENDOR = "Magenta";
constexpr auto PLUGIN_NAME = "The Infinite Crate";
constexpr auto PLUGIN_VERSION = "0.1.0";

constexpr auto STATE_KEY = "state";
constexpr auto VERSION_KEY = "version";
constexpr auto LYRIA_STATE = "lyria-state";
constexpr auto FX_STATE = "fx-state";
constexpr auto TRANSPORT_STATE = "transport-state";
constexpr auto APP_STATE = "app-state";
constexpr auto PROMPT_STATE = "prompt-state";
constexpr auto CHAT_STATE = "chat-state";

}  // namespace magenta
