#!/bin/bash
set -e

echo "🚀 Preparing AIGo for TestFlight Archive & Export..."

# 1. Clean previous build directory
rm -rf ./build
mkdir -p ./build

# 2. Build Release Archive (.xcarchive)
echo "📦 Building Release Archive..."
xcodebuild -project AIGo.xcodeproj \
           -scheme AIGo \
           -destination "generic/platform=iOS" \
           -archivePath ./build/AIGo.xcarchive \
           archive

# 3. Export IPA Payload
echo "📱 Exporting IPA Payload..."
xcodebuild -exportArchive \
           -archivePath ./build/AIGo.xcarchive \
           -exportPath ./build/export \
           -exportOptionsPlist ExportOptions.plist

echo "✅ SUCCESS! TestFlight payload ready at ios/build/export/AIGo.ipa"
echo "💡 To upload to App Store Connect / TestFlight:"
echo "   xcrun altool --upload-app -f ./build/export/AIGo.ipa -t ios -u YOUR_APPLE_ID -p YOUR_APP_SPECIFIC_PASSWORD"
