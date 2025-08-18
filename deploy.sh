#!/bin/bash

# Trust Fundraising Website Deployment Script
# Use this script to update the website after making changes

echo "🚀 Deploying Trust Fundraising website updates..."

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run this script with sudo"
    exit 1
fi

# Backup current version
echo "💾 Creating backup..."
BACKUP_DIR="/var/www/backups/trust-fundraising-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r /var/www/trust-fundraising/* "$BACKUP_DIR/"

# Copy new files
echo "📋 Copying new files..."
cp -r . /var/www/trust-fundraising/

# Set proper permissions
echo "🔐 Setting permissions..."
chown -R www-data:www-data /var/www/trust-fundraising
chmod -R 755 /var/www/trust-fundraising

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuration is valid"
    
    # Reload nginx
    echo "🔄 Reloading nginx..."
    systemctl reload nginx
    
    echo "✅ Deployment complete!"
    echo "🌐 Website updated at: http://$(hostname -I | awk '{print $1}')"
else
    echo "❌ Configuration has errors. Rolling back..."
    cp -r "$BACKUP_DIR"/* /var/www/trust-fundraising/
    chown -R www-data:www-data /var/www/trust-fundraising
    systemctl reload nginx
    echo "✅ Rollback complete"
    exit 1
fi
