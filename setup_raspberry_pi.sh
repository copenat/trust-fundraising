#!/bin/bash

# Trust Fundraising Website Setup for Raspberry Pi
# This script sets up the website with proper UFW firewall configuration

echo "🚀 Setting up Trust Fundraising website on Raspberry Pi..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install nginx web server
echo "🌐 Installing nginx web server..."
sudo apt install nginx -y

# Install certbot for SSL certificates (optional but recommended)
echo "🔒 Installing certbot for SSL certificates..."
sudo apt install certbot python3-certbot-nginx -y

# Create web directory
echo "📁 Creating web directory..."
sudo mkdir -p /var/www/trust-fundraising
sudo chown -R $USER:$USER /var/www/trust-fundraising

# Copy website files to nginx directory
echo "📋 Copying website files..."
cp -r . /var/www/trust-fundraising/

# Set proper permissions
echo "🔐 Setting proper permissions..."
sudo chown -R www-data:www-data /var/www/trust-fundraising
sudo chmod -R 755 /var/www/trust-fundraising

# Create nginx configuration
echo "⚙️ Creating nginx configuration..."
sudo tee /etc/nginx/sites-available/trust-fundraising << EOF
server {
    listen 80;
    server_name _;  # Replace with your domain if you have one
    
    root /var/www/trust-fundraising;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
    
    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Handle all other requests
    location / {
        try_files \$uri \$uri/ =404;
    }
    
    # Security: Hide nginx version
    server_tokens off;
}
EOF

# Enable the site
echo "🔗 Enabling nginx site..."
sudo ln -sf /etc/nginx/sites-available/trust-fundraising /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors. Please check the configuration."
    exit 1
fi

# Configure UFW firewall
echo "🔥 Configuring UFW firewall..."

# Reset UFW to default
sudo ufw --force reset

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (important to keep this!)
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable UFW
sudo ufw --force enable

# Start and enable nginx
echo "🚀 Starting nginx service..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Show status
echo "📊 Current status:"
echo "UFW Status:"
sudo ufw status verbose

echo ""
echo "Nginx Status:"
sudo systemctl status nginx --no-pager -l

echo ""
echo "🌐 Website should now be accessible at:"
echo "   http://$(hostname -I | awk '{print $1}')"
echo "   or"
echo "   http://$(hostname).local"
echo ""
echo "📝 Next steps:"
echo "1. If you have a domain name, update the nginx configuration with your domain"
echo "2. Consider setting up SSL with: sudo certbot --nginx"
echo "3. Test the website in your browser"
echo ""
echo "✅ Setup complete!"
