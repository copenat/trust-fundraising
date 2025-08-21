#!/bin/bash

# Fix nginx port conflict script
echo "🔧 Fixing nginx port conflict..."

# Check what's using port 80
echo "📊 Checking what's using port 80..."
sudo netstat -tlnp | grep :80
sudo ss -tlnp | grep :80

# Stop Apache if it's running
echo "🛑 Stopping Apache if running..."
sudo systemctl stop apache2 2>/dev/null || echo "Apache2 not running"
sudo systemctl disable apache2 2>/dev/null || echo "Apache2 not enabled"

# Stop any existing nginx processes
echo "🛑 Stopping existing nginx processes..."
sudo systemctl stop nginx
sudo pkill nginx 2>/dev/null || echo "No nginx processes to kill"

# Wait a moment for ports to be released
sleep 2

# Start nginx
echo "🚀 Starting nginx..."
sudo systemctl start nginx

# Check nginx status
echo "📊 Checking nginx status..."
sudo systemctl status nginx --no-pager -l

# Test if port 80 is now available
echo "🧪 Testing port 80..."
curl -I http://localhost 2>/dev/null && echo "✅ Website is accessible!" || echo "❌ Website not accessible yet"

echo "✅ Port conflict fix complete!"

