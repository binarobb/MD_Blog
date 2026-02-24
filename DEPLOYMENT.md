# DigitalOcean Deployment Setup - Rocky Linux 9

This guide covers deploying the MD Blog to a DigitalOcean droplet running Rocky Linux 9.

## Prerequisites

1. **DigitalOcean Account**: Create a new droplet with Rocky Linux 9 image
2. **GitHub Secrets**: Configure in your repo settings
3. **MongoDB Atlas**: Create a cluster and get your connection string

## Rocky Linux 9 Specifics

- **Package Manager**: `dnf` (instead of `apt`)
- **Firewall**: `firewalld` (instead of `ufw`)
- **Init System**: `systemd`
- **Node.js**: Install via `dnf` module system
- **Certbot**: Auto-renewal uses `systemd` timers

## Step 1: Set Up GitHub Secrets

Go to your GitHub repo → Settings → Secrets and Variables → Actions → New repository secret

Add these secrets:

- `DO_HOST`: Your droplet's IP address (e.g., 123.456.789.012)
- `DO_USERNAME`: Username on your droplet (usually `root` or `ubuntu`)
- `DO_SSH_KEY`: Your private SSH key for the droplet

To generate SSH key (if needed):
```bash
ssh-keygen -t ed25519 -C "github-actions" -f deploy-key -N ""
cat deploy-key  # Copy this as DO_SSH_KEY
cat deploy-key.pub  # Add this to your droplet's ~/.ssh/authorized_keys
```

## Step 2: Set Up Your DigitalOcean Droplet (Rocky Linux 9)

SSH into your droplet:
```bash
ssh root@YOUR_DROPLET_IP
```

Run the setup commands:
```bash
# Update system
dnf update -y

# Install Node.js (18.x LTS)
dnf module enable nodejs:18 -y
dnf install -y nodejs

# Install Git
dnf install -y git

# Install PM2 (process manager)
npm install -g pm2
pm2 startup -u root
pm2 save

# Create app directory
mkdir -p /var/www/md-blog
cd /var/www/md-blog

# Clone your repo
git clone https://github.com/YOUR_USERNAME/MD_Blog.git .

# Install dependencies
npm install

# Create .env file (see below)
nano .env
```

## Step 3: Configure Environment Variables

Create `.env` file on your droplet:
```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/blog?retryWrites=true&w=majority
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-secret-key-here-change-this
```

Get your MongoDB Atlas connection string:
1. Go to MongoDB Atlas
2. Click "Connect" on your cluster
3. Choose "Applications"
4. Copy the connection string and replace USERNAME/PASSWORD

## Step 4: Install and Start the App

On your droplet:
```bash
cd /var/www/md-blog
npm install

# Start with PM2
pm2 start server.js --name "md-blog"
pm2 save

# Verify it's running
pm2 status
```

## Step 5: Set Up Nginx Reverse Proxy

```bash
# Install Nginx
dnf install -y nginx

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

# Create config
cat > /etc/nginx/conf.d/md-blog.conf << 'EOF'
upstream md_blog {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name intentionalowl.io www.intentionalowl.io;
    client_max_body_size 10M;

    location / {
        proxy_pass http://md_blog;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

## Step 5a: Configure Firewall (firewalld)

Rocky Linux 9 uses `firewalld` by default:

```bash
# Check firewall status
systemctl status firewalld

# Allow HTTP and HTTPS
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https

# Reload firewall
firewall-cmd --reload

# Verify rules
firewall-cmd --list-all
```

## Step 6: Set Up SSL Certificate (Let's Encrypt)

```bash
# Install Certbot and Nginx plugin
dnf install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d intentionalowl.io -d www.intentionalowl.io

# Auto-renewal is configured automatically via systemd timer
# Check the timer
systemctl list-timers certbot*

# Dry run renewal
certbot renew --dry-run
```

**Note**: On Rocky Linux 9, Let's Encrypt auto-renewal uses systemd timers instead of cron jobs. Certbot will automatically set up the timer.

## Step 7: Update Your Domain DNS

Point your domain to your DigitalOcean droplet IP in your DNS settings:

- Type: A Record
- Name: @ (root) and www
- Value: Your droplet's IP address

## Step 8: Push and Deploy

Everything is now ready! When you push to main:

```bash
git add .
git commit -m "Deploy blog"
git push origin main
```

GitHub Actions will automatically:
1. Pull latest code
2. Install dependencies
3. Restart the app with PM2
4. Keep the site live

## Monitoring and Logs

Monitor your app:
```bash
# SSH into droplet
ssh root@YOUR_DROPLET_IP

# View logs
pm2 logs md-blog

# Monitor
pm2 monit

# Restart if needed
pm2 restart md-blog
```

## Environment Variables on Droplet

Update `.env` with your MongoDB Atlas credentials:
```bash
nano /var/www/md-blog/.env
```

After saving, restart the app:
```bash
pm2 restart md-blog
```

## Troubleshooting

**Node.js module not found**:
```bash
dnf module list nodejs
dnf module enable nodejs:18
```

**Firewall blocking connections**:
```bash
# Check if port 5000 is accessible from localhost
curl http://localhost:5000

# Check firewall rules
firewall-cmd --list-all

# Temporarily disable firewall (for debugging only)
systemctl stop firewalld
```

**Port already in use**:
```bash
lsof -i :5000
kill -9 PID
```

**Permission denied for SSH**:
```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

**Nginx not routing correctly**:
```bash
nginx -t
systemctl reload nginx
curl http://localhost:5000  # Test Node app directly
curl http://localhost  # Test through Nginx
```

**Check app is running**:
```bash
pm2 status
pm2 logs md-blog  # View real-time logs
```

**SELinux issues (if enabled)**:

Rocky Linux 9 may have SELinux enabled by default. If you encounter permission issues:

```bash
# Check SELinux status
getenforce

# Set to permissive mode (not recommended for production)
setenforce 0

# Or add proper policies for Nginx
semanage port -a -t http_port_t -p tcp 5000
restorecon -R /var/www/md-blog
```

**Certbot renewal issues**:
```bash
# Check systemd timer
systemctl list-timers certbot*

# Manual renewal
certbot renew

# View Certbot logs
journalctl -u certbot.timer -f
```

## Rocky Linux 9 Quick Reference

| Task | Command |
|------|---------|
| Update system | `dnf update -y` |
| Install package | `dnf install -y <package>` |
| Search packages | `dnf search <keyword>` |
| Enable module | `dnf module enable <module>:<version>` |
| Check firewall | `firewall-cmd --list-all` |
| Allow service | `firewall-cmd --permanent --add-service=<service>` |
| View systemd logs | `journalctl -u <service> -f` |
| Check SELinux | `getenforce` |
| List systemd timers | `systemctl list-timers` |
| Check service status | `systemctl status <service>` |
