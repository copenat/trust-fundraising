# Raspberry Pi Deployment Guide

This guide will help you deploy the Trust Fundraising website on your Raspberry Pi with UFW firewall protection.

## 🍓 Prerequisites

- Raspberry Pi (3 or 4 recommended)
- Raspberry Pi OS (Bullseye or newer)
- Internet connection
- SSH access to your Pi

## 🚀 Quick Setup

### 1. Transfer Files to Raspberry Pi

First, copy your website files to your Raspberry Pi:

```bash
# From your local machine, copy files to Pi
scp -r . pi@your-pi-ip:/home/pi/trust-fundraising
```

### 2. Run the Setup Script

SSH into your Raspberry Pi and run the setup script:

```bash
# SSH into your Pi
ssh pi@your-pi-ip

# Navigate to the website directory
cd trust-fundraising

# Make the setup script executable
chmod +x setup_raspberry_pi.sh

# Run the setup script
sudo ./setup_raspberry_pi.sh
```

## 🔧 Manual Setup (Alternative)

If you prefer to set up manually or the script doesn't work:

### 1. Install nginx

```bash
sudo apt update
sudo apt install nginx -y
```

### 2. Configure UFW Firewall for nginx

```bash
# Allow HTTP and HTTPS for nginx
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable UFW if not already enabled
sudo ufw --force enable

# Check status
sudo ufw status verbose
```

### 3. Deploy Website Files

```bash
# Create web directory
sudo mkdir -p /var/www/trust-fundraising

# Copy files
sudo cp -r . /var/www/trust-fundraising/

# Set permissions
sudo chown -R www-data:www-data /var/www/trust-fundraising
sudo chmod -R 755 /var/www/trust-fundraising
```

### 4. Configure nginx

Create the nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/trust-fundraising
```

Add this configuration:

```nginx
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
        try_files $uri $uri/ =404;
    }
    
    # Security: Hide nginx version
    server_tokens off;
}
```

Enable the site:

```bash
sudo ln -sf /etc/nginx/sites-available/trust-fundraising /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## 🌐 Accessing Your Website

Your website will be accessible at:

- **Local network**: `http://your-pi-ip-address`
- **Hostname**: `http://raspberrypi.local` (if mDNS is enabled)

To find your Pi's IP address:

```bash
hostname -I
```

## 🔒 Security Features

The setup includes several security measures:

### UFW Firewall Rules
- **Preserves existing UFW configuration**: Only adds necessary rules for nginx
- **HTTP/HTTPS allowed**: Allows web traffic (ports 80/443)
- **Maintains existing SSH access**: Keeps your current SSH configuration

### nginx Security Headers
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Enables XSS protection
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **Content-Security-Policy**: Restricts resource loading
- **Server tokens off**: Hides nginx version

## 📝 Updating Your Website

### Using the Deployment Script

```bash
# Make the script executable
chmod +x deploy.sh

# Deploy updates
sudo ./deploy.sh
```

### Manual Update

```bash
# Copy new files
sudo cp -r . /var/www/trust-fundraising/

# Set permissions
sudo chown -R www-data:www-data /var/www/trust-fundraising

# Reload nginx
sudo systemctl reload nginx
```

## 🔐 SSL Certificate (Optional but Recommended)

If you have a domain name, you can add SSL:

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is set up automatically
```

## 🛠️ Troubleshooting

### Check nginx Status
```bash
sudo systemctl status nginx
```

### Check UFW Status
```bash
sudo ufw status verbose
```

### View nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Test nginx Configuration
```bash
sudo nginx -t
```

### Common Issues

1. **Website not accessible**: Check if nginx is running and UFW allows port 80
2. **Permission denied**: Ensure files are owned by www-data
3. **404 errors**: Check if files are in the correct directory

## 📊 Monitoring

### Check Website Status
```bash
curl -I http://localhost
```

### Monitor Resource Usage
```bash
# CPU and memory usage
htop

# Disk usage
df -h

# nginx processes
ps aux | grep nginx
```

## 🔄 Maintenance

### Regular Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Restart nginx after updates
sudo systemctl restart nginx
```

### Backup Website
```bash
# Create backup
sudo cp -r /var/www/trust-fundraising /home/pi/backup-$(date +%Y%m%d)
```

## 📞 Support

If you encounter issues:

1. Check the logs: `sudo journalctl -u nginx`
2. Verify UFW rules: `sudo ufw status`
3. Test nginx config: `sudo nginx -t`
4. Check file permissions: `ls -la /var/www/trust-fundraising`

---

**Note**: This setup provides a secure, production-ready web server on your Raspberry Pi. The UFW firewall ensures only necessary ports are open, and nginx provides excellent performance and security for serving static websites.
