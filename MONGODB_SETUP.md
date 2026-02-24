# MongoDB Atlas Setup Guide

## Getting Started with MongoDB Atlas

### 1. Create MongoDB Atlas Account
- Go to https://cloud.mongodb.com
- Sign up and create an account
- Create a new project (e.g., "MD Blog")

### 2. Create a Cluster
- Click "Build a Database"
- Choose shared cluster (free tier)
- Select your region (same as your DigitalOcean droplet region if possible)
- Click "Create"

### 3. Create Database User (for Connection)
1. Go to **Database Access** in the left menu
2. Click **"+ Add New Database User"**
3. Choose **"Password"** for authentication method
4. Set a username (e.g., `blog_user`)
5. Set a strong password (save this!)
6. Click **"Add User"**

### 4. Get Connection String
1. Go to **Databases** and find your cluster
2. Click **"Connect"**
3. Choose **"Drivers"** (NOT X.509 certificates)
4. Select **"Node.js"** from the dropdown
5. Copy the connection string that looks like:
```
mongodb+srv://blog_user:PASSWORD@cluster0.xxxxx.mongodb.net/blog?retryWrites=true&w=majority
```

### 5. Update Your Connection String
Replace the placeholders:
- `blog_user` → Your username from step 3
- `PASSWORD` → Your password from step 3
- `blog` → Database name (you can change this)

Your final string should look like:
```
mongodb+srv://blog_user:mySecurePassword123@cluster0.abc123.mongodb.net/blog?retryWrites=true&w=majority
```

### 6. Add to `.env` File
On your DigitalOcean server:
```bash
nano /var/www/md-blog/.env
```

Add:
```
MONGODB_URI=mongodb+srv://blog_user:mySecurePassword123@cluster0.abc123.mongodb.net/blog?retryWrites=true&w=majority
```

### 7. Allow Your App to Connect
1. In MongoDB Atlas, go to **Network Access**
2. Click **"+ Add IP Address"**
3. Click **"Allow Access from Anywhere"** OR add your server's IP
   - If server IP: Add `YOUR_DROPLET_IP/32`
4. Click **"Confirm"**

### 8. Test Connection
SSH into your droplet:
```bash
cd /var/www/md-blog
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ MongoDB connected!')).catch(err => console.error('❌ Error:', err.message));"
```

## Troubleshooting MongoDB Connection

**Error: "IP is not whitelisted"**
- Solution: Add your server's IP in MongoDB Atlas Network Access

**Error: "authentication failed"**
- Check your username/password in the connection string
- Verify database user exists in Database Access

**Error: "SyntaxError" or connection string issues**
- Verify your connection string is properly formatted
- Re-copy from MongoDB Atlas to avoid typos
- Check that password special characters are URL-encoded (@ → %40, # → %23, etc.)

## X.509 vs Username/Password

You received an X.509 connection string. Here's the difference:

| Feature | Username/Password | X.509 Certificates |
|---------|-------------------|-------------------|
| Setup difficulty | Simple | Complex (requires certificate files) |
| Security | Good (encrypted in transit) | Excellent (mutual TLS) |
| Good for | Development, first deployment | High-security production |
| Team use | Easy (share credentials) | Difficult (individual certificates) |
| Ideal for | This blog | Enterprise systems |

**Recommendation**: Use username/password for initial setup. You can upgrade to X.509 later if needed.

## Connection String Formats

**Username/Password (Recommended)**:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**X.509 Certificate** (advanced):
```
mongodb+srv://cluster.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&tlsCertificateKeyFile=/path/to/cert.pem
```

## Important Notes

- ⚠️ Never commit `.env` file to GitHub (already in .gitignore)
- 🔒 Use strong passwords (20+ characters, mix of types)
- 🌍 Keep "Allow Access from Anywhere" for now; restrict to server IP once deployed
- 💾 Always keep database backups enabled in MongoDB Atlas
