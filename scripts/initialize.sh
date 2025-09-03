#!/bin/bash
# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


# Initialize Submodules
git submodule update --init --recursive

# Copy third party ts/js files
cp ../third_party/juce/juce.js ../react_ui/src/lib/juce/juce.js
cp ../third_party/juce/check_native_interop.js ../react_ui/src/lib/juce/check_native_interop.js

# Copy third party shadcn files
mkdir -p ../react_ui/src/components/ui/shadcn
for file in ../third_party/shadcn/*.tsx; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    # Remove @ts-nocheck comments while copying
    sed '/^\/\/ @ts-nocheck$/d' "$file" > "../react_ui/src/components/ui/shadcn/$filename"
  fi
done

# Install dependencies
npm install

# Compile dom files
npm run compile
