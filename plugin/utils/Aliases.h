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

#include <string>

#define ASIO_STANDALONE
#define _WEBSOCKETPP_CPP11_STRICT_
#include <websocketpp/client.hpp>
#include <websocketpp/config/asio_client.hpp>

#include <nlohmann/json.hpp>

namespace magenta {

using json = nlohmann::json;

using std::any;
using std::array;
using std::async;
using std::atomic;
using std::byte;
using std::exception;
using std::exp;
using std::function;
using std::future;
using std::invalid_argument;
using std::lock_guard;
using std::make_shared;
using std::make_unique;
using std::map;
using std::max;
using std::micro;
using std::min;
using std::move;
using std::mutex;
using std::nullopt;
using std::optional;
using std::pair;
using std::shared_ptr;
using std::stoi;
using std::string;
using std::tanh;
using std::thread;
using std::to_string;
using std::unique_ptr;
using std::unordered_map;
using std::variant;
using std::vector;

using juce::Array;
using juce::AudioBuffer;
using juce::AudioChannelSet;
using juce::AudioFormatManager;
using juce::AudioFormatReader;
using juce::AudioFormatWriter;
using juce::AudioPlayHead;
using juce::AudioProcessor;
using juce::AudioProcessorEditor;
using juce::Base64;
using juce::BlowFish;
using juce::ComponentBoundsConstrainer;
using juce::Decibels;
using juce::File;
using juce::Graphics;
using juce::Identifier;
using juce::ignoreUnused;
using juce::InputStream;
using juce::KeyPress;
using juce::MessageManager;
using juce::MemoryBlock;
using juce::MemoryInputStream;
using juce::MemoryOutputStream;
using juce::MidiBuffer;
using juce::ParameterID;
using juce::PropertiesFile;
using juce::ScopedNoDenormals;
using juce::String;
using juce::StringRef;
using juce::Timer;
using juce::uint32;
using juce::WavAudioFormat;
using juce::WebBrowserComponent;
using juce::dsp::AudioBlock;
using juce::dsp::BallisticsFilter;
using juce::dsp::ProcessContextNonReplacing;
using juce::dsp::ProcessSpec;
using NativeFunctionCompletion =
    juce::WebBrowserComponent::NativeFunctionCompletion;
using JURL = juce::URL;

using APVTS = juce::AudioProcessorValueTreeState;
using AppProps = juce::ApplicationProperties;
using ParameterLayout = juce::AudioProcessorValueTreeState::ParameterLayout;
using Var = juce::var;

using Bool = juce::AudioParameterBool;
using Choice = juce::AudioParameterChoice;
using Float = juce::AudioProcessorValueTreeState::Parameter;
using Int = juce::AudioParameterInt;
using Parameter = juce::RangedAudioParameter;

using websocketpp::lib::bind;
using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using ws_dur = std::chrono::duration<int, micro>;
using ws_time = std::chrono::high_resolution_clock::time_point;
using ws_client = websocketpp::client<
    websocketpp::config::asio_tls_client>;  // Define a client type for
                                            // convenience using the TLS config
using ws_handler = websocketpp::connection_hdl;  // Define a connection handle
using ws_connection = ws_client::connection_ptr;
using ws_message = ws_client::message_ptr;
using ws_context =
    websocketpp::lib::shared_ptr<asio::ssl::context>;  // Pull out the
                                                       // Asio TLS
                                                       // context

constexpr auto launch_async = std::launch::async;
const auto WhiteColor = juce::Colours::white;
const auto BlackColor = juce::Colours::black;

}  // namespace magenta
