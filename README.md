# Trust Fundraising Website

A modern, responsive website for Trust Fundraising services, built with HTML, CSS, and JavaScript.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trust-fundraising
   ```

2. **Start the local server**
   ```bash
   python3 -m http.server 8000
   ```

3. **View the website**
   Open your browser and navigate to `http://localhost:8000`

## 📁 Project Structure

```
trust-fundraising/
├── index.html              # Main HTML file
├── styles.css              # All CSS styles
├── script.js               # JavaScript functionality
├── about.md                # About section content
├── services.md             # Services section content
├── pricing.md              # Pricing section content
├── clients.md              # Clients section content
├── testimonials.md         # Testimonials section content
├── get_in_touch.md         # Contact section content
├── blog_posts.json         # Blog posts data
├── cropped-Beach-huts-Littlehampton.jpg
├── cropped-trust-fundraising-logo.jpg
├── scripts/                # Deployment and setup scripts
│   ├── setup_raspberry_pi.sh
│   ├── deploy.sh
│   ├── fix_port_conflict.sh
│   └── trust-fundraising.service
└── backup/                 # Original WordPress export
    └── trust-fundraisingcouk.wordpress.2020-03-11.xml
```

## 🎨 Content Management

The website uses a modular content system where each section loads content from separate files:

- **About Section**: Content from `about.md`
- **Services**: Content from `services.md`
- **Pricing**: Content from `pricing.md`
- **Clients**: Content from `clients.md`
- **Testimonials**: Content from `testimonials.md`
- **Contact**: Content from `get_in_touch.md`
- **Blog**: Content from `blog_posts.json`

### Making Content Updates

1. **Edit the appropriate content file** (e.g., `about.md` for About section)
2. **Commit and push to GitHub**
   ```bash
   git add .
   git commit -m "Update [section name] content"
   git push
   ```
3. **Refresh the browser** to see changes

### Content File Formats

- **`.md` files**: HTML content (not Markdown)
- **`.json` files**: Structured data for dynamic content

## 🛠️ Features

- ✅ **Responsive Design** - Works on all devices
- ✅ **Modular Content** - Easy to edit via GitHub
- ✅ **Modern UI** - Clean, professional design
- ✅ **Fast Loading** - Optimized for performance
- ✅ **SEO Friendly** - Proper HTML structure
- ✅ **Accessible** - Follows web accessibility guidelines

## 🎯 Sections

1. **Hero Section** - Welcome message and call-to-action
2. **About** - Information about Sue Crow and services
3. **Services** - Fundraising services offered
4. **Pricing** - Transparent pricing information
5. **Clients** - Client showcase
6. **Testimonials** - Client feedback
7. **Blog** - Latest news and insights
8. **Contact** - Email and phone contact information

## 🚀 Deployment

### Raspberry Pi Deployment

The website includes scripts for easy deployment to a Raspberry Pi:

1. **Initial Setup** (run on Raspberry Pi):
   ```bash
   sudo bash scripts/setup_raspberry_pi.sh
   ```

2. **Update Deployment** (run on Raspberry Pi):
   ```bash
   sudo bash scripts/deploy.sh
   ```

3. **Troubleshooting** (if needed):
   ```bash
   sudo bash scripts/fix_port_conflict.sh
   ```

### Build Process

#### Automatic Build Information (Recommended)
The build information is automatically updated when you make commits:

```bash
# Just commit normally - build info updates automatically
git add .
git commit -m "Your commit message"
git push
```

**Git Hooks**: Pre-commit and post-commit hooks automatically:
- Update build date to current date
- Update build hash to the new commit hash
- Stage the updated `index.html` file

#### Manual Build Information
To manually update the build information:

```bash
# Run the build script to update build date and Git hash
./scripts/build.sh
```

This will:
- Update the build date to the current date
- Update the build hash to the current Git commit hash
- Display build information in the footer

### Deployment

#### For Development (Nginx):
```bash
# Run build script to update build info
./scripts/build.sh

# Deploy to Raspberry Pi
sudo bash scripts/deploy.sh
```

#### For Production (Cloudflare):
```bash
# Prepare files for Cloudflare deployment
./scripts/deploy-cloudflare.sh
```

This will:
- Run the build script to update build info
- Create a deployment manifest
- Prepare files for upload to Cloudflare Pages

**Note**: The build information (date and Git hash) will be embedded in the HTML files during the build process, so it will display correctly on Cloudflare even though it's a static site.

### Local Development

For local development and testing:

```bash
python3 -m http.server 8000
```

## 🔧 Technical Details

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **Vanilla JavaScript** - No frameworks required
- **FontAwesome Icons** - Professional iconography
- **Google Fonts** - Typography

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Make changes to content files
2. Test locally with `python3 -m http.server 8000`
3. Commit and push to GitHub
4. Changes will be live immediately

## 📞 Contact

For website updates or questions:
- **Email**: contact@trust-fundraising.co.uk

---

*Built with ❤️ for Trust Fundraising*
