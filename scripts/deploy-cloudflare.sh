#!/bin/bash

# Cloudflare deployment script for Trust Fundraising website
echo "☁️  Preparing Trust Fundraising website for Cloudflare deployment..."

# Run the build script first to update build info
echo "🔨 Running build process..."
./scripts/build.sh

# Get current Git commit hash for deployment tracking
GIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "dev")
DEPLOY_DATE=$(date +"%d/%m/%Y %H:%M")

echo "📦 Preparing deployment package..."
echo "📅 Deploy Date: $DEPLOY_DATE"
echo "🔗 Git Hash: $GIT_HASH"

# Create a deployment manifest file
cat > deployment-info.txt << EOF
Trust Fundraising Website Deployment
==================================
Deploy Date: $DEPLOY_DATE
Git Hash: $GIT_HASH
Environment: Cloudflare Production

Files to upload:
- index.html
- styles.css
- script.js
- *.md files
- *.jpg files
- *.json files
- scripts/ directory (optional, for reference)

Deployment Steps:
1. Upload all files to Cloudflare Pages
2. Verify build info appears in footer
3. Test all functionality
4. Update DNS if needed
EOF

echo "✅ Deployment package prepared!"
echo "📋 Deployment info saved to: deployment-info.txt"
echo ""
echo "🚀 Next steps:"
echo "   1. Upload files to Cloudflare Pages"
echo "   2. Check that build info appears in footer"
echo "   3. Test website functionality"
echo ""
echo "📊 Build Details:"
echo "   Date: $DEPLOY_DATE"
echo "   Hash: $GIT_HASH"
