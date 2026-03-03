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

#include "../Processor.h"
#include "../utils/Aliases.h"

namespace magenta {

class Container : public AudioProcessorEditor, private Timer {
 public:
  explicit Container(Processor &);
  ~Container() override;

  double getDPIScale();
  void resized() override;
  void paint(Graphics &g) override;

  void timerCallback() override;

  bool keyPressed(const KeyPress &k) override;

 private:
  Processor &processor;
  WebBrowserComponent &webView;
  ComponentBoundsConstrainer constrainer;

  JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(Container)
};

}  // namespace magenta
