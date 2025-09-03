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

#include "WebSocket.h"

#include <iostream>
#include <string>

namespace magenta {

WebSocket::WebSocket() {
  client.set_access_channels(websocketpp::log::alevel::none);
  client.set_error_channels(websocketpp::log::elevel::all);

  // Initialize ASIO
  client.init_asio();

  // Register our handlers
  client.set_socket_init_handler(bind(&WebSocket::on_socket_init, this, _1));
  client.set_tls_init_handler(bind(&WebSocket::on_tls_init, this, _1));
  client.set_message_handler(bind(&WebSocket::on_message, this, _1, _2));
  client.set_open_handler(bind(&WebSocket::on_open, this, _1));
  client.set_close_handler(bind(&WebSocket::on_close, this, _1));
  client.set_fail_handler(bind(&WebSocket::on_fail, this, _1));

  // connected{false} and m_is_stopping{false} are initialized in WebSocket.h
}

WebSocket::~WebSocket() {
  client.get_alog().write(websocketpp::log::alevel::app,
                          "WebSocket Destructor: Calling stop().");
  stop();
  client.get_alog().write(websocketpp::log::alevel::app,
                          "WebSocket Destructor: stop() finished.");
}

void WebSocket::start(string uri) {
  // this->stop();
  if (m_is_starting.load() || connected.load()) {
    client.get_alog().write(
        websocketpp::log::alevel::app,
        "WebSocket::start called while starting or connected.");
    return;
  }

  if (m_is_stopping.load() || (m_io_thread && m_io_thread->joinable())) {
    this->stop();
    client.get_alog().write(
        websocketpp::log::alevel::app,
        "WebSocket::start called while stopping or already started.");
    return;
  }

  this->uri = uri;
  m_is_starting.store(true);
  m_is_stopping.store(false);

  websocketpp::lib::error_code ec;
  ws_connection con = client.get_connection(this->uri, ec);

  if (ec) {
    client.get_alog().write(websocketpp::log::alevel::app,
                            "Get connection error: " + ec.message());
    return;
  }

  client.connect(con);

  m_start = std::chrono::high_resolution_clock::now();
  m_io_thread = std::make_unique<std::thread>([this]() {
    try {
      client.get_alog().write(websocketpp::log::alevel::app,
                              "Starting client.run()");
      client.run();
      client.get_alog().write(websocketpp::log::alevel::app,
                              "client.run() finished.");
    } catch (const std::exception& e) {
      client.get_alog().write(
          websocketpp::log::alevel::app,
          "Exception in client.run() thread: " + std::string(e.what()));
    } catch (...) {
      client.get_alog().write(websocketpp::log::alevel::app,
                              "Unknown exception in client.run() thread.");
    }
  });
}

void WebSocket::on_socket_init(ws_handler) {
  m_socket_init = std::chrono::high_resolution_clock::now();
}

ws_context WebSocket::on_tls_init(ws_handler) {
  m_tls_init = std::chrono::high_resolution_clock::now();
  ws_context ctx = websocketpp::lib::make_shared<asio::ssl::context>(
      asio::ssl::context::tlsv12);

  try {
    ctx->set_options(
        asio::ssl::context::default_workarounds | asio::ssl::context::no_sslv2 |
        asio::ssl::context::no_sslv3 | asio::ssl::context::single_dh_use);
  } catch (std::exception& e) {
    // Original code used std::cout here
    std::cout << "Exception in on_tls_init: " << e.what() << std::endl;
  }
  return ctx;
}

void WebSocket::on_open(ws_handler hdl_param) {
  m_open = std::chrono::high_resolution_clock::now();
  this->hdl = hdl_param;
  DBG("Socket opened!");
  connected.store(true);
  m_is_starting.store(false);
  if (onOpen) {
    onOpen();
  }
}

void WebSocket::send(json payload) {
  DBG("Sending payload");
  DBG(payload.dump());
  DBG("=========");
  if (connected.load()) {
    client.send(hdl, payload.dump(), websocketpp::frame::opcode::text);
  }
}

void WebSocket::on_message(ws_handler, ws_message m) {
  m_message = std::chrono::high_resolution_clock::now();
  if (onMessage) {
    onMessage(json::parse(m->get_payload()));
  }
}

void WebSocket::on_close(ws_handler hdl_param) {
  connected.store(false);

  ws_connection con = client.get_con_from_hdl(hdl_param);
  if (!con) {
    return;
  }

  try {
    json payload;
    payload["code"] = con->get_remote_close_code();
    payload["reason"] = con->get_remote_close_reason();
    if (onClose) {
      onClose(payload);
    }
  } catch (const std::exception& e) {
    DBG("unexpected socket error");
  }

  if (con) {
    DBG("Closed Socket");
    DBG(con->get_local_close_code());
    DBG(con->get_local_close_reason());
    DBG(con->get_remote_close_code());
    DBG(con->get_remote_close_reason());
    DBG("=========");
  }

  m_close = std::chrono::high_resolution_clock::now();

  DBG("Socket Init: "
      << std::chrono::duration_cast<ws_dur>(m_socket_init - m_start).count());
  DBG("TLS Init: "
      << std::chrono::duration_cast<ws_dur>(m_tls_init - m_start).count());
  DBG("Open: " << std::chrono::duration_cast<ws_dur>(m_open - m_start).count());
  DBG("Message: "
      << std::chrono::duration_cast<ws_dur>(m_message - m_start).count());
  DBG("Close: "
      << std::chrono::duration_cast<ws_dur>(m_close - m_start).count());
}

void WebSocket::on_fail(ws_handler hdl_param) {
  m_is_starting.store(false);
  connected.store(false);

  ws_connection con = client.get_con_from_hdl(hdl_param);
  if (!con) {
    // Connection is no longer valid, return early.
    return;
  }

  try {
    json payload;
    payload["code"] = con->get_remote_close_code();
    payload["reason"] = con->get_remote_close_reason();
    if (onClose) {
      onClose(payload);
    }
  } catch (const std::exception& e) {
    DBG("unexpected socket error");
  }

  DBG("Fail handler");
  if (con) {  // Check if con is valid
    DBG(con->get_state());
    DBG(con->get_local_close_code());
    DBG(con->get_local_close_reason());
    DBG(con->get_remote_close_code());
    DBG(con->get_remote_close_reason());
    DBG("WebSocket failure: " << con->get_ec().value() << " - "
                              << con->get_ec().message());
  } else {
    DBG("WebSocket failure: could not get connection from handle.");
  }
}

void WebSocket::stop() {
  if (m_is_stopping.load()) {
    if (m_io_thread && m_io_thread->joinable()) {
      client.get_alog().write(
          websocketpp::log::alevel::app,
          "Stop: Thread was joinable (already stopping), joining.");
      m_io_thread->join();
    }
    client.get_alog().write(websocketpp::log::alevel::app,
                            "Stop: Already stopping or stopped.");
    return;
  }

  client.get_alog().write(websocketpp::log::alevel::app,
                          "Stop: Initiating shutdown.");

  if (connected.load()) {
    websocketpp::lib::error_code ec_close;
    client.get_alog().write(websocketpp::log::alevel::app,
                            "Stop: Closing connection.");
    if (hdl.lock()) {
      client.close(hdl, websocketpp::close::status::going_away,
                   "Shutting down by client", ec_close);
      if (ec_close) {
        client.get_alog().write(
            websocketpp::log::alevel::app,
            "Error closing connection: " + ec_close.message());
      }
    } else {
      client.get_alog().write(
          websocketpp::log::alevel::app,
          "Stop: Connection handle (hdl) is invalid, cannot send close frame.");
    }
  }

  if (!client.stopped()) {
    client.get_alog().write(websocketpp::log::alevel::app,
                            "Stop: Stopping client's io_service.");
    client.stop();
  }

  if (m_io_thread && m_io_thread->joinable()) {
    client.get_alog().write(websocketpp::log::alevel::app,
                            "Stop: Joining I/O thread.");
    m_io_thread->join();
    client.get_alog().write(websocketpp::log::alevel::app,
                            "Stop: I/O thread joined.");
  }
  m_io_thread.reset();
  connected.store(false);
  m_is_stopping.store(false);
  m_is_starting.store(false);
  client.get_alog().write(websocketpp::log::alevel::app,
                          "Stop: Shutdown complete.");
}

}  // namespace magenta
