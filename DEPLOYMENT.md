# DigitalOcean Deployment Setup

## Prerequisites

1. **DigitalOcean Account**: Create a new droplet (Ubuntu 22.04 recommended)
2. **GitHub Secrets**: Configure in your repo settings
3. **MongoDB Atlas**: Create a cluster and get your connection string

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

## Step 2: Set Up Your DigitalOcean Droplet

SSH into your droplet:
```bash
ssh root@YOUR_DROPLET_IP
```

Run the setup commands:
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install Git
apt install -y git

# Install PM2 (process manager)
npm install -g pm2
pm2 startup
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
apt install -y nginx

# Create config
cat > /etc/nginx/sites-available/md-blog << 'EOF'
upstream md_blog {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name intentionalowl.io www.intentionalowl.io;

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

# Enable the site
ln -s /etc/nginx/sites-available/md-blog /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Start Nginx
systemctl start nginx
systemctl enable nginx
```

## Step 6: Set Up SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d intentionalowl.io -d www.intentionalowl.io

# Auto-renewal is configured automatically
certbot renew --dry-run
```

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
systemctl restart nginx
```

**Check app is running**:
```bash
pm2 status
```
