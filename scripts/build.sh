#!/bin/bash

# Build script for Trust Fundraising website
echo "🔨 Building Trust Fundraising website..."

# Get current Git commit hash (short version)
GIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "dev")

# Get current date
BUILD_DATE=$(date +"%d/%m/%Y")

# Check if this is being run from a Git hook
if [ "$GIT_HOOK" = "1" ]; then
    echo "📋 Running from Git hook - using current commit hash"
else
    echo "📋 Running standalone - using current commit hash"
fi

echo "📅 Build Date: $BUILD_DATE"
echo "🔗 Git Hash: $GIT_HASH"

# Update the build info in index.html
if [ -f "index.html" ]; then
    # Create a temporary file with the updated build hash and date
    cp index.html index_temp.html
    
    # Update build hash (handle both empty and existing content)
    sed -i '' "s|id=\"build-hash\">[^<]*<|id=\"build-hash\">$GIT_HASH<|g" index_temp.html
    
    # Update build date (handle both empty and existing content)
    sed -i '' "s|id=\"build-date\">[^<]*<|id=\"build-date\">Built: $BUILD_DATE<|g" index_temp.html
    
    # Replace the original file
    mv index_temp.html index.html
    
    echo "✅ Build info updated in index.html"
else
    echo "❌ index.html not found"
    exit 1
fi

echo "🎉 Build complete!"
echo "📊 Build Details:"
echo "   Date: $BUILD_DATE"
echo "   Hash: $GIT_HASH"
