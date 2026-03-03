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

#ifndef JSON_OPTIONAL_H_
#define JSON_OPTIONAL_H_

#include <optional>
#include <nlohmann/json.hpp>

namespace nlohmann {

template <typename>
constexpr bool is_opt = false;
template <typename T>
constexpr bool is_opt<std::optional<T>> = true;

template <typename T>
void opt_to_json(const char *key, json &j, const T &value) {
  if constexpr (is_opt<T>) {
    if (value) j[key] = *value;
  } else {
    j[key] = value;
  }
}
template <typename T>
void opt_from_json(const char *key, const json &j, T &value) {
  if constexpr (is_opt<T>) {
    if (j.contains(key))
      value = j[key].get<typename T::value_type>();
    else
      value = std::nullopt;
  } else {
    j.at(key).get_to(value);
  }
}

}  // namespace nlohmann

#define OPT_TO_JSON(v1) \
  opt_to_json(#v1, j, t.v1);
#define OPT_FROM_JSON(v1) \
  opt_from_json(#v1, j, t.v1);

#define NLOHMANN_DEFINE_TYPE_OPTIONAL(Type, ...)                             \
  inline void to_json(json &j, const Type &t) {                              \
    NLOHMANN_JSON_EXPAND(NLOHMANN_JSON_PASTE(OPT_TO_JSON, __VA_ARGS__))      \
  }                                                                          \
  inline void from_json(const json &j, Type &t) {                            \
    NLOHMANN_JSON_EXPAND(NLOHMANN_JSON_PASTE(OPT_FROM_JSON, __VA_ARGS__))    \
  }

#endif  // JSON_OPTIONAL_H_
