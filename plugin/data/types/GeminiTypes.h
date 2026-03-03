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

#include "Types.h"

namespace magenta {

struct GeminiConfig {
  string endpoint;
  string audioModel;
  string apiKey;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(GeminiConfig, endpoint, audioModel, apiKey);

////////////////////////////////////////////////////////////
/// Gemini API Types
////////////////////////////////////////////////////////////

/**
 * @brief Scale of the generated music.
 * Originally: export enum Scale
 */
enum Scale {
  SCALE_UNSPECIFIED,
  C_MAJOR_A_MINOR,
  D_FLAT_MAJOR_B_FLAT_MINOR,
  D_MAJOR_B_MINOR,
  E_FLAT_MAJOR_C_MINOR,
  E_MAJOR_D_FLAT_MINOR,
  F_MAJOR_D_MINOR,
  G_FLAT_MAJOR_E_FLAT_MINOR,
  G_MAJOR_E_MINOR,
  A_FLAT_MAJOR_F_MINOR,
  A_MAJOR_G_FLAT_MINOR,
  B_FLAT_MAJOR_G_MINOR,
  B_MAJOR_A_FLAT_MINOR,
};
NLOHMANN_JSON_SERIALIZE_ENUM(
    Scale, {
               {SCALE_UNSPECIFIED, "SCALE_UNSPECIFIED"},
               {C_MAJOR_A_MINOR, "C_MAJOR_A_MINOR"},
               {D_FLAT_MAJOR_B_FLAT_MINOR, "D_FLAT_MAJOR_B_FLAT_MINOR"},
               {D_MAJOR_B_MINOR, "D_MAJOR_B_MINOR"},
               {E_FLAT_MAJOR_C_MINOR, "E_FLAT_MAJOR_C_MINOR"},
               {E_MAJOR_D_FLAT_MINOR, "E_MAJOR_D_FLAT_MINOR"},
               {F_MAJOR_D_MINOR, "F_MAJOR_D_MINOR"},
               {G_FLAT_MAJOR_E_FLAT_MINOR, "G_FLAT_MAJOR_E_FLAT_MINOR"},
               {G_MAJOR_E_MINOR, "G_MAJOR_E_MINOR"},
               {A_FLAT_MAJOR_F_MINOR, "A_FLAT_MAJOR_F_MINOR"},
               {A_MAJOR_G_FLAT_MINOR, "A_MAJOR_G_FLAT_MINOR"},
               {B_FLAT_MAJOR_G_MINOR, "B_FLAT_MAJOR_G_MINOR"},
               {B_MAJOR_A_FLAT_MINOR, "B_MAJOR_A_FLAT_MINOR"},
           });

/**
 * @brief The mode of music generation.
 * Originally: export enum MusicGenerationMode
 */
enum MusicGenerationMode {
  QUALITY,
  DIVERSITY,
  VOCALIZATION,
};
NLOHMANN_JSON_SERIALIZE_ENUM(MusicGenerationMode,
                             {
                                 {QUALITY, "QUALITY"},
                                 {DIVERSITY, "DIVERSITY"},
                                 {VOCALIZATION, "VOCALIZATION"},
                             });

/**
 * @brief The playback control signal to apply to the music generation.
 * Originally: export enum LiveMusicPlaybackControl
 */
enum LiveMusicPlaybackControl {
  PLAYBACK_CONTROL_UNSPECIFIED,
  PLAY,
  PAUSE,
  STOP,
  RESET_CONTEXT,
};
NLOHMANN_JSON_SERIALIZE_ENUM(LiveMusicPlaybackControl,
                             {
                                 {PLAYBACK_CONTROL_UNSPECIFIED,
                                  "PLAYBACK_CONTROL_UNSPECIFIED"},
                                 {PLAY, "PLAY"},
                                 {PAUSE, "PAUSE"},
                                 {STOP, "STOP"},
                                 {RESET_CONTEXT, "RESET_CONTEXT"},
                             });

/**
 * @brief Message to be sent by the system when connecting to the API.
 * Originally: export declare interface LiveMusicClientSetup
 */
struct LiveMusicClientSetup {
  // The model's resource name. Format: `models/{model}`.
  optional<string> model;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(LiveMusicClientSetup, model);

/**
 * @brief Maps a prompt to a relative weight to steer music generation.
 * Originally: export declare interface WeightedPrompt
 */
struct WeightedPrompt {
  // Text prompt.
  optional<string> text;
  // Weight of the prompt. The weight is used to control the relative
  // importance of the prompt. Higher weights are more important than lower
  // weights. Weight must not be 0. Weights of all weighted_prompts in this
  // LiveMusicClientContent message will be normalized.
  optional<float> weight; // Assuming 'number' maps to float for weight
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(WeightedPrompt, text, weight);

/**
 * @brief User input to start or steer the music.
 * Originally: export declare interface LiveMusicClientContent
 */
struct LiveMusicClientContent {
  // Weighted prompts as the model input.
  optional<vector<WeightedPrompt>> weightedPrompts;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(LiveMusicClientContent, weightedPrompts);

/**
 * @brief Configuration for music generation.
 * Originally: export declare interface LiveMusicGenerationConfig
 */
struct LiveMusicGenerationConfig {
  // Controls the variance in audio generation. Higher values produce
  // higher variance. Range is [0.0, 3.0].
  optional<float> temperature;
  // Controls how the model selects tokens for output. Samples the topK
  // tokens with the highest probabilities. Range is [1, 1000].
  optional<int> topK;
  // Seeds audio generation. If not set, the request uses a randomly
  // generated seed.
  optional<int> seed;
  // Controls how closely the model follows prompts.
  // Higher guidance follows more closely, but will make transitions more
  // abrupt. Range is [0.0, 6.0].
  optional<float> guidance;
  // Beats per minute. Range is [60, 200].
  optional<int> bpm;
  // Density of sounds. Range is [0.0, 1.0].
  optional<float> density;
  // Brightness of the music. Range is [0.0, 1.0].
  optional<float> brightness;
  // Scale of the generated music.
  optional<Scale> scale;
  // Whether the audio output should contain bass.
  optional<bool> muteBass;
  // Whether the audio output should contain drums.
  optional<bool> muteDrums;
  // Whether the audio output should contain only bass and drums.
  optional<bool> onlyBassAndDrums;
  // The mode of music generation. Default mode is QUALITY.
  optional<MusicGenerationMode> musicGenerationMode;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(LiveMusicGenerationConfig, temperature, topK,
                              seed, guidance, bpm, density, brightness, scale,
                              muteBass, muteDrums, onlyBassAndDrums,
                              musicGenerationMode);

/**
 * @brief Messages sent by the client in the LiveMusicClientMessage call.
 * Originally: export declare interface LiveMusicClientMessage
 */
struct LiveMusicClientMessage {
  // Message to be sent in the first (and only in the first)
  // `LiveMusicClientMessage`. Clients should wait for a
  // `LiveMusicSetupComplete` message before sending any additional messages.
  optional<LiveMusicClientSetup> setup;
  // User input to influence music generation.
  optional<LiveMusicClientContent> clientContent;
  // Configuration for music generation.
  optional<LiveMusicGenerationConfig> musicGenerationConfig;
  // Playback control signal for the music generation.
  optional<LiveMusicPlaybackControl> playbackControl;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(LiveMusicClientMessage, setup, clientContent,
                              musicGenerationConfig, playbackControl);

/**
 * @brief Sent in response to a `LiveMusicClientSetup` message from the client.
 * Originally: export declare interface LiveMusicServerSetupComplete
 */
struct LiveMusicServerSetupComplete {
  // This struct should be empty, but jsonify doesn't like empty structs.
  optional<string> success;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(LiveMusicServerSetupComplete, success);

/**
 * @brief Prompts and config used for generating this audio chunk.
 * Originally: export declare interface LiveMusicSourceMetadata
 */
struct LiveMusicSourceMetadata {
  // Weighted prompts for generating this audio chunk.
  optional<LiveMusicClientContent> clientContent;
  // Music generation config for generating this audio chunk.
  optional<LiveMusicGenerationConfig> musicGenerationConfig;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(LiveMusicSourceMetadata, clientContent,
                              musicGenerationConfig);

/**
 * @brief Representation of an audio chunk.
 * Originally: export declare interface AudioChunk
 */
struct AudioChunk {
  // Raw bytes of audio data.
  optional<string> data;
  // MIME type of the audio chunk.
  optional<string> mimeType;
  // Prompts and config used for generating this audio chunk.
  optional<LiveMusicSourceMetadata> sourceMetadata;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(AudioChunk, data, mimeType, sourceMetadata);

/**
 * @brief Server update generated by the model in response to client messages.
 * Originally: export declare interface LiveMusicServerContent
 */
struct LiveMusicServerContent {
  // The audio chunks that the model has generated.
  optional<vector<AudioChunk>> audioChunks;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(LiveMusicServerContent, audioChunks);

/**
 * @brief A prompt that was filtered with the reason.
 * Originally: export declare interface LiveMusicFilteredPrompt
 */
struct LiveMusicFilteredPrompt {
  // The text prompt that was filtered.
  optional<string> text;
  // The reason the prompt was filtered.
  optional<string> filteredReason;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(LiveMusicFilteredPrompt, text, filteredReason);

/**
 * @brief Response message for the LiveMusicClientMessage call.
 * Originally: export class LiveMusicServerMessage
 */
struct LiveMusicServerMessage {
  // Message sent in response to a `LiveMusicClientSetup` message from the
  // client. Clients should wait for this message before sending any additional
  // messages.
  optional<LiveMusicServerSetupComplete> setupComplete;
  // Content generated by the model in response to client messages.
  optional<LiveMusicServerContent> serverContent;
  // A prompt that was filtered with the reason.
  optional<LiveMusicFilteredPrompt> filteredPrompt;

  /**
   * @brief Returns the first audio chunk from the server content, if present.
   *
   * @remarks
   * If there are no audio chunks in the response, nullopt will be returned.
   * @return optional<AudioChunk> The first audio chunk or nullopt.
   */
  // optional<AudioChunk> getAudioChunk() const {
  //   if (serverContent && serverContent->audioChunks &&
  //       !serverContent->audioChunks->empty()) {
  //     return serverContent->audioChunks->front();
  //   }
  //   return nullopt;
  // }
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(LiveMusicServerMessage, setupComplete,
                              serverContent, filteredPrompt);

/**
 * @brief Parameters for setting config for the live music API.
 * Originally: export declare interface LiveMusicSetConfigParameters
 */
struct LiveMusicSetConfigParameters {
  // Configuration for music generation. (Non-optional in TypeScript)
  LiveMusicGenerationConfig musicGenerationConfig;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(LiveMusicSetConfigParameters,
                              musicGenerationConfig);

/**
 * @brief Parameters for setting weighted prompts for the live music API.
 * Originally: export declare interface LiveMusicSetWeightedPromptsParameters
 */
struct LiveMusicSetWeightedPromptsParameters {
  // A map of text prompts to weights to use for the generation request.
  // (Non-optional in TypeScript)
  vector<WeightedPrompt> weightedPrompts;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(LiveMusicSetWeightedPromptsParameters,
                              weightedPrompts);

////////////////////////////////////////////////////////////
/// Gemini Request Types
////////////////////////////////////////////////////////////

struct GeminiClientContent {
  vector<WeightedPrompt> weighted_prompts;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(GeminiClientContent, weighted_prompts);

struct GeminiSetupParams {
  LiveMusicClientSetup setup;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(GeminiSetupParams, setup);

struct GeminiPromptParams {
  GeminiClientContent client_content;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(GeminiPromptParams, client_content);

struct GeminiPlaybackParams {
  LiveMusicPlaybackControl playback_control;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(GeminiPlaybackParams, playback_control);

struct GeminiConfigParams {
  LiveMusicGenerationConfig music_generation_config;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(GeminiConfigParams, music_generation_config);

////////////////////////////////////////////////////////////
/// Gemini Response Types
////////////////////////////////////////////////////////////

struct GeminiSetupResponse {
  LiveMusicClientSetup setup;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(GeminiSetupResponse, setup);

struct GeminiConfigResponse {
  LiveMusicGenerationConfig musicGenerationConfig;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(GeminiConfigResponse, musicGenerationConfig);

struct GeminiPromptResponse {
  LiveMusicClientContent clientContent;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(GeminiPromptResponse, clientContent);

struct GeminiPlaybackResponse {
  LiveMusicPlaybackControl playbackControl;
};
NLOHMANN_DEFINE_TYPE_OPTIONAL(GeminiPlaybackResponse, playbackControl);

} // namespace magenta
