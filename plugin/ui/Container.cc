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

#include "Container.h"

#include <optional>
#include <ranges>

#include "../utils/Constants.h"

#if JUCE_WINDOWS
namespace {
const bool dpiAwareSet = []() {
  SetProcessDpiAwarenessContext(DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2);
  DBG("Setting DPI awareness...");
  return true;
}();
}  // namespace
#endif

namespace magenta {

static WebBrowserComponent &getOrCreateWebView(Processor &p) {
#if JUCE_WINDOWS
  if (!p.webViewPtr || !p.webViewPtr->isVisible()) {
    p.webViewPtr = make_unique<WebBrowserComponent>(p.createWebViewOptions());
    p.loadUrl();
  }
  return *p.webViewPtr;
#else
  return p.webView;
#endif
}

Container::Container(Processor &p)
    : AudioProcessorEditor(&p), processor(p), webView(getOrCreateWebView(p)) {
  setWantsKeyboardFocus(true);

  double dpiScale = getDPIScale();
        
  // Set initial size (e.g., a reasonable default or a proportion of screen size)
  auto* primaryDisplay = juce::Desktop::getInstance().getDisplays().getPrimaryDisplay();
  if (primaryDisplay != nullptr)
  {
    int screenWidth = primaryDisplay->userArea.getWidth() / dpiScale;
    int width = min(processor.pluginWidth, int(screenWidth/1.2));
    int height = processor.pluginHeight * width / processor.pluginWidth;
    setSize(width, height);
  } else {
    setSize(processor.pluginWidth, processor.pluginHeight);
  }

  // Add webview to JUCE UI
  addChildComponent(webView);
  if (!juce::JUCEApplicationBase::isStandaloneApp())
  {
    setResizable(true, true);
  } else {
    setResizable(true, false);
  }
  constrainer.setFixedAspectRatio(static_cast<double>(processor.pluginWidth) /
                                   processor.pluginHeight);
  setConstrainer(&constrainer);
}

void Container::paint(Graphics &g) {}

Container::~Container() {
#if JUCE_WINDOWS
  processor.webViewPtr->setVisible(false);
#endif
}

double Container::getDPIScale() {
#if JUCE_WINDOWS
  // Get the display scale factor for DPI scaling on Windows
  auto *primaryDisplay =
      juce::Desktop::getInstance().getDisplays().getPrimaryDisplay();
  double dpiScale = primaryDisplay->dpi / 96.0f;
  return dpiScale;
#else
  return 1.0;
#endif
}

void Container::resized() {
  auto bounds = getBounds();
  webView.setBounds(bounds);

  double scale = static_cast<double>(bounds.getWidth()) / DEFAULT_WIDTH;
  webView.emitEventIfBrowserIsVisible("resizeEvent", scale);
}

bool Container::keyPressed(const KeyPress &k) {
  if (k.getModifiers().isCommandDown() &&
      (k.getKeyCode() == 'Z' || k.getKeyCode() == 'z')) {
    DBG("Command + Z pressed");
    return true;
  }
  return false;
}

void Container::timerCallback() {}

}  // namespace magenta
