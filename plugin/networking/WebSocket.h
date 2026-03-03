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
#include "../data/types/Types.h" 
#include <thread>
#include <memory>
#include <atomic>
#include <functional> 


namespace magenta {

class WebSocket {
 public:
  explicit WebSocket();
  ~WebSocket();

  function<void()> onOpen;
  function<void(json)> onMessage;
  function<void(json)> onClose;

  void start(string uri);
  void send(json payload);
  void stop();

  atomic<bool> connected{false};

 private:
  void on_socket_init(ws_handler);
  ws_context on_tls_init(ws_handler);
  void on_open(ws_handler);
  void on_message(ws_handler, ws_message);
  void on_close(ws_handler);
  void on_fail(ws_handler);

  ws_client client;
  ws_handler hdl; 
  string uri; 
  unique_ptr<thread> m_io_thread;
  atomic<bool> m_is_starting{false};
  atomic<bool> m_is_stopping{false};

  // Timing members
  ws_time m_start;
  ws_time m_socket_init;
  ws_time m_tls_init;
  ws_time m_open;
  ws_time m_message;
  ws_time m_close;
};

}  // namespace magenta
