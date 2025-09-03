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

# Notes: 
# - Need to turn on hardening in Projucer
# - Need to create and sign a fat binary for OpenSSL

#!/bin/bash

# https://melatonin.dev/blog/how-to-code-sign-and-notarize-macos-audio-plugins-in-ci/

# 1. Generate developer certificate via Xcode 
# Settings -> Accounts -> Manage Certificates -> + -> Developer ID Application
DEVELOPER_ID="Developer ID Application: NAME (TEAMID)"

# 2. Create app specific password for notarytool
# https://support.apple.com/en-us/102654
# 3. Save the credentials in keychain
# xcrun notarytool store-credentials "notarytool-creds" --apple-id "<AppleID>" --team-id <DeveloperTeamID> --password <secret_2FA_password>
CREDS="notarytool-creds"

# This notarizes and staples the plugin and app
cd ../dist

zip -r "The Infinite Crate.vst3.zip" "The Infinite Crate.vst3"
xcrun notarytool submit "The Infinite Crate.vst3.zip" --keychain-profile "$CREDS" --wait
xcrun stapler staple "The Infinite Crate.vst3"
xcrun stapler validate "The Infinite Crate.vst3"

zip -r "The Infinite Crate.component.zip" "The Infinite Crate.component"
xcrun notarytool submit "The Infinite Crate.component.zip" --keychain-profile "$CREDS" --wait
xcrun stapler staple "The Infinite Crate.component"
xcrun stapler validate "The Infinite Crate.component"

# Entitlements is not needed if you archive in Xcode
codesign --force -s "$DEVELOPER_ID" -v "The Infinite Crate.app" --deep --strict --options=runtime --timestamp --entitlements="../Builds/MacOSX/Standalone_Plugin.entitlements"
codesign -dv --verbose=4 "The Infinite Crate.app"
codesign -d --entitlements :- "The Infinite Crate.app"
zip -r "The Infinite Crate.app.zip" "The Infinite Crate.app"
xcrun notarytool submit "The Infinite Crate.app.zip" --keychain-profile "$CREDS" --wait
xcrun stapler staple "The Infinite Crate.app"
xcrun stapler validate "The Infinite Crate.app"

rm "The Infinite Crate.vst3.zip"
rm "The Infinite Crate.component.zip"
rm "The Infinite Crate.app.zip"
rm juce_vst3_helper
rm "libThe Infinite Crate.a"

cd ..
cp -r dist/ "The Infinite Crate"
zip -r "The Infinite Crate.zip" "The Infinite Crate"
mv "The Infinite Crate.zip" "Builds/signed/The-Infinite-Crate-$(date +'%-m.%-d.%y').zip"
rm -rf "The Infinite Crate"

##############################################
