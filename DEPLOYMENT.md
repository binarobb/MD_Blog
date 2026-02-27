# DigitalOcean Deployment Setup - Rocky Linux 9

This guide covers deploying the MD Blog to a DigitalOcean droplet running Rocky Linux 9.

## Architecture Overview

The blog uses this architecture:
- **Node.js App**: Runs on port 5000 (internal only, not publicly accessible)
- **Nginx**: Listens on ports 80/443 (public-facing)
- **SSL/TLS**: Handled by Nginx with Let's Encrypt
- **Users**: Access via `https://intentionalowl.io` (standard web ports)

Nginx acts as a reverse proxy, forwarding all web traffic to the Node app running on port 5000. This is the standard, secure way to run Node.js applications.

## Why This Architecture?

**Security & Best Practices:**
- Node.js app runs as non-root user (cannot bind to ports < 1024)
- Nginx runs as root, can bind to ports 80/443
- Nginx handles SSL/TLS certificates
- If Node crashes, Nginx still serves error pages
- Easy to scale (add multiple Node instances behind Nginx)

**Port Explanation:**
- **Port 5000** (internal): Where your Node.js app actually runs
- **Port 80** (public): HTTP traffic (redirects to HTTPS)
- **Port 443** (public): HTTPS traffic (secure, standard web port)
- Users never interact with port 5000 directly

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
MONGODB_URI=mongodb+srv://owleyes:owleyes@cluster.mongodb.net/blog?retryWrites=true&w=majority
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-secret-key-here-change-this
```

### Get Your MongoDB Atlas Connection String

**Option A: Username/Password (Recommended for simplicity)**
1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Click "Connect" on your cluster
3. Choose "Drivers" (not Applications/X.509)
4. Select "Node.js" and copy the connection string
5. Replace `<username>` and `<password>` with your credentials
6. Replace `<password>` with your database password

**Option B: X.509 Certificates (More Secure)**
If you have an X.509 connection string like:
```
mongodb+srv://parliment.myhux.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&appName=parliment
```

This requires:
1. Downloading X.509 certificate from MongoDB Atlas
2. Adding certificate path environment variables
3. More complex server setup

**For easier first deployment, use Option A (username/password)**

### MongoDB Database Setup
1. In MongoDB Atlas, create a database user:
   - Go to Database Access
   - Click "+ Add New Database User"
   - Choose "Password" authentication
   - Set username and password
   - Add to cluster
2. Create a database (e.g., "blog")
3. Use these credentials in your connection string

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

## Step 6a: Verify Port Configuration

To verify that your setup is correctly routing traffic:

```bash
# Check that Node.js app is running on port 5000 (internal)
netstat -tuln | grep 5000
# Output should show: LISTEN on 127.0.0.1:5000 (only localhost)

# Check that Nginx is listening on ports 80 and 443 (public)
netstat -tuln | grep :80
netstat -tuln | grep :443
# Output should show: LISTEN on 0.0.0.0 (all interfaces)

# Test that Nginx is routing correctly to Node.js
curl http://localhost/  # Should work through Nginx → Node.js
curl http://127.0.0.1:5000/  # Should work directly to Node.js
```

The security model:
- Node app on port 5000: **Not exposed to internet** (only localhost)
- Nginx on ports 80/443: **Public facing**
- Users access the public ports, Nginx forwards to the internal port

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

## Port Configuration Summary

**Your Site Access Pattern:**
```
User Browser
    ↓ https://intentionalowl.io (port 443)
Nginx (reverse proxy)
    ↓ http://127.0.0.1:5000
Node.js App
    ↓ Serves content
```

**Port Breakdown:**
| Port | Service | Access | Purpose |
|------|---------|--------|---------|
| 80 | Nginx | Public (everyone) | HTTP → redirects to HTTPS |
| 443 | Nginx | Public (everyone) | HTTPS (secure, default web) |
| 5000 | Node.js | Internal only (localhost) | Actual app logic |

Users never see or interact with port 5000. All traffic goes through Nginx on the standard web ports (80/443).

## Troubleshooting

**Node.js module not found**:
```bash
dnf module list nodejs
dnf module enable nodejs:18
```

**Firewall blocking connections**:
```bash
# Check firewall rules (should only expose 80 and 443)
firewall-cmd --list-all

# If HTTP/HTTPS aren't listed:
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# Verify ports are open
firewall-cmd --query-service=http  # Should output 'yes'
firewall-cmd --query-service=https  # Should output 'yes'

# Check if port 5000 is accessible from localhost (internal only)
curl http://localhost:5000

# IMPORTANT: Port 5000 should NOT be open to the firewall - it's internal only!
# If you see it exposed, something isn't right
firewall-cmd --query-port=5000/tcp  # Should output 'no'
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

Rocky Linux 9 has SELinux enabled by default. If you get "Permission denied" errors connecting to port 5000:

```bash
# Check SELinux status
getenforce
# Output: Enforcing (if it's blocking things)

# QUICK FIX: Allow Nginx to connect to port 5000
setsebool -P httpd_can_network_connect 1

# Then restart
systemctl restart nginx
pm2 restart md-blog

# Test the connection
curl http://127.0.0.1:5000
```

**Alternative (more restrictive):**
If you only want to allow port 5000, not all network connections:
```bash
# Add port to http_port_t
semanage port -a -t http_port_t -p tcp 5000

# Apply contexts
semanage fcontext -a -t http_exec_t "/var/www/md-blog(/.*)?"
restorecon -R /var/www/md-blog

# Restart
systemctl restart nginx
```

**Nuclear option (not recommended for production):**
```bash
# Disable SELinux entirely (temporary)
setenforce 0

# Make it permanent (edit file and reboot)
nano /etc/selinux/config
# Change: SELINUX=enforcing → SELINUX=permissive
# Then reboot
```

**Pro tip:** The `setsebool -P httpd_can_network_connect 1` command is the easiest and safest option for development/small deployments.

**Certbot renewal issues**:
```bash
# Check systemd timer
systemctl list-timers certbot*

# Manual renewal
certbot renew

# View Certbot logs
journalctl -u certbot.timer -f
```

## Verifying Your Complete Setup

Run these checks to ensure everything is configured correctly:

```bash
# 1. Check Node.js is running on port 5000 (internal)
pm2 status
netstat -tuln | grep 5000
# Expected: LISTEN on 127.0.0.1:5000

# 2. Check Nginx is listening on ports 80/443 (public)
ssl -t
systemctl status nginx
netstat -tuln | grep :80
netstat -tuln | grep :443
# Expected: LISTEN on 0.0.0.0 for both

# 3. Check firewall only exposes 80/443, NOT 5000
firewall-cmd --list-all | grep 80
firewall-cmd --list-all | grep 443
firewall-cmd --query-port=5000/tcp  # Should output: no

# 4. Test routing from Nginx to Node.js
curl -I http://localhost  # Via Nginx
curl -I http://127.0.0.1:5000  # Direct to Node.js
# Both should respond with HTTP 200 or redirect

# 5. Check SSL certificate is working
curl -I https://intentionalowl.io  # Should work (after DNS is updated)
certbot certificates  # View all certificates
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
