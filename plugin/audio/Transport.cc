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

#include "Transport.h"

namespace magenta {

Transport::Transport(TransportStruct &transportState)
    : transportState{transportState} {}

void Transport::play() {
  transportState.playing = true;
  updateTransportOnUI();
  DBG("Transport is playing");
}

void Transport::stop() {
  transportState.playing = false;
  updateTransportOnUI();
  DBG("Transport is stopped");
}

void Transport::buffering(bool buffering) {
  transportState.buffering = buffering;
  updateTransportOnUI();
  DBG("Transport is buffering: " + std::to_string(buffering));
}

void Transport::transportUpdatedFromUI() {
  DBG("Transport updated from UI");
}

}  // namespace magenta
