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

// WebBridge.hpp
#pragma once
#include "../data/types/Types.h"

namespace magenta {

class Processor;

class WebBridge {
 public:
  explicit WebBridge(Processor& processor);  // Constructor
  ~WebBridge();                              // Destructor

  void loadStateFromProcessor(const Array<Var>& args,
                              NativeFunctionCompletion completion);
  void updateStateOnProcessor(const Array<Var>& args,
                              NativeFunctionCompletion completion);
  void resetStateOnProcessor(const Array<Var>& args,
                             NativeFunctionCompletion completion);

  void resetGeminiFromProcessor(const Array<Var>& args,
                                NativeFunctionCompletion completion);
    
  void reconnectGeminiFromProcessor(const Array<Var>& args,
                                    NativeFunctionCompletion completion);

  void launchAIStudioFromProcessor(const Array<Var>& args,
                                   NativeFunctionCompletion completion);
  void launchUpdateURLFromProcessor(const Array<Var>& args,
                                    NativeFunctionCompletion completion);
  void launchAboutPageFromProcessor(const Array<Var>& args,
                                    NativeFunctionCompletion completion);
  void launchFeedbackPageFromProcessor(const Array<Var>& args,
                                       NativeFunctionCompletion completion);
    
  void passMessageToUI(string type, json data);
  
  void passStateToUI(string stateID, json state);
  void passVarToUI(string varID, json value);
  string getNestedJsonString(string varID, json value);

 private:
  Processor& processor;
};

}  // namespace magenta
