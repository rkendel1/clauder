# Production Deployment Checklist

This checklist helps you deploy Kuhmpel with Code Server and Aider in a production environment.

## 📋 Pre-Deployment

### Infrastructure Requirements

- [ ] Server with minimum 4GB RAM (8GB+ recommended)
- [ ] Docker 20.10+ installed
- [ ] Docker Compose 2.0+ installed
- [ ] Sufficient disk space (20GB+ recommended)
- [ ] Static IP or domain name configured

### Security Preparation

- [ ] Generate strong password for Code Server
- [ ] Obtain SSL/TLS certificates (Let's Encrypt recommended)
- [ ] Configure firewall rules
- [ ] Set up VPN or IP whitelist (if needed)
- [ ] Prepare API keys for AI providers

### Domain and SSL

- [ ] Domain name pointed to server IP
- [ ] SSL certificate obtained
- [ ] Reverse proxy configured (nginx/Caddy/Traefik)

## 🔐 Security Configuration

### 1. Change Default Passwords

```bash
# Edit .env file
CODE_SERVER_PASSWORD=YOUR_STRONG_PASSWORD_HERE

# Use a password manager to generate strong passwords
# Minimum 16 characters, mix of letters, numbers, symbols
```

### 2. Configure SSL/TLS

#### Option A: Using Caddy (Recommended - Auto SSL)

Create `Caddyfile`:
```caddy
code.yourdomain.com {
    reverse_proxy localhost:8443
}
```

#### Option B: Using nginx

Create `/etc/nginx/sites-available/kuhmpel`:
```nginx
server {
    listen 443 ssl http2;
    server_name code.yourdomain.com;
    
    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;
    
    location / {
        proxy_pass http://localhost:8443;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_set_header Accept-Encoding gzip;
    }
}
```

### 3. Firewall Configuration

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Block direct access to Code Server (accessed via reverse proxy)
sudo ufw deny 8443/tcp

# Block Aider port (only accessible from localhost)
sudo ufw deny 8080/tcp

# Enable firewall
sudo ufw enable
```

### 4. Docker Security

Edit `docker-compose.yml`:

```yaml
services:
  kuhmpel-codeserver:
    # ... existing config ...
    
    # Security enhancements
    security_opt:
      - no-new-privileges:true
    
    # Read-only root filesystem (if possible)
    read_only: true
    
    # Restrict capabilities
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETUID
      - SETGID
```

## ⚙️ Environment Configuration

### 1. API Keys

```bash
# .env file - NEVER commit this!
CODE_SERVER_PASSWORD=your-strong-password
AIDER_API_KEY=your-aider-api-key
AIDER_MODEL=gpt-4

# Provider API keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
DEEPSEEK_API_KEY=sk-...
```

### 2. Resource Limits

Edit `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '4'
      memory: 8G
    reservations:
      cpus: '2'
      memory: 4G
```

### 3. Logging Configuration

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## 🚀 Deployment Steps

### 1. Clone Repository

```bash
cd /opt
sudo git clone https://github.com/rkendel1/clauder.git kuhmpel
cd kuhmpel
sudo chown -R $USER:$USER .
```

### 2. Configure Environment

```bash
# Copy and edit environment file
cp .env.example .env
nano .env

# Set permissions
chmod 600 .env
```

### 3. Build and Start

```bash
# Build the container
./start.sh --build

# Verify it's running
docker ps
docker-compose logs -f
```

### 4. Set Up Reverse Proxy

```bash
# For Caddy
sudo caddy start

# For nginx
sudo ln -s /etc/nginx/sites-available/kuhmpel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Test Access

```bash
# Test HTTPS access
curl https://code.yourdomain.com/healthz

# Should return OK or similar health check response
```

## 📊 Monitoring and Maintenance

### Set Up Monitoring

#### 1. Container Monitoring

Create `docker-compose.monitoring.yml`:

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"
    restart: unless-stopped

  grafana:
    image: grafana/grafana
    volumes:
      - grafana-data:/var/lib/grafana
    ports:
      - "3000:3000"
    restart: unless-stopped

volumes:
  prometheus-data:
  grafana-data:
```

#### 2. Log Monitoring

```bash
# View logs
docker-compose logs -f

# Check specific service
docker-compose logs -f kuhmpel-codeserver

# Monitor resource usage
docker stats kuhmpel-dev-environment
```

### Backup Strategy

#### 1. Automated Backups

Create `/etc/cron.daily/kuhmpel-backup`:

```bash
#!/bin/bash
BACKUP_DIR="/backup/kuhmpel"
DATE=$(date +%Y%m%d)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup workspace
cd /opt/kuhmpel
tar -czf "$BACKUP_DIR/workspace-$DATE.tar.gz" workspace/

# Backup environment (excluding secrets)
cp .env.example "$BACKUP_DIR/.env.example-$DATE"

# Keep only last 7 days
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

# Optional: Upload to S3/cloud storage
# aws s3 sync "$BACKUP_DIR" s3://your-bucket/kuhmpel/
```

Make it executable:
```bash
sudo chmod +x /etc/cron.daily/kuhmpel-backup
```

#### 2. Database/Volume Backups

```bash
# Backup Docker volumes
docker run --rm \
  -v kuhmpel_code-server-config:/source \
  -v /backup:/backup \
  alpine tar -czf /backup/code-server-config.tar.gz -C /source .
```

### Update Procedure

```bash
# 1. Backup current state
./test-docker.sh
docker-compose down
tar -czf backup-$(date +%Y%m%d).tar.gz workspace/ .env

# 2. Pull updates
git pull

# 3. Rebuild and restart
./start.sh --build

# 4. Verify
docker-compose logs -f
curl https://code.yourdomain.com/healthz
```

## 🔍 Health Checks

### Regular Checks

- [ ] Code Server accessible via HTTPS
- [ ] Aider API responding (if enabled)
- [ ] Docker container running
- [ ] Disk space sufficient (>10GB free)
- [ ] Memory usage normal (<80%)
- [ ] CPU usage normal (<80%)
- [ ] Logs clean (no repeated errors)
- [ ] SSL certificate valid (>30 days)

### Automated Health Check Script

Create `/usr/local/bin/kuhmpel-health`:

```bash
#!/bin/bash

echo "Kuhmpel Health Check"
echo "===================="

# Check container
if docker ps | grep -q kuhmpel-dev-environment; then
    echo "✅ Container running"
else
    echo "❌ Container not running"
    exit 1
fi

# Check Code Server
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8443/healthz | grep -q "200"; then
    echo "✅ Code Server healthy"
else
    echo "❌ Code Server unhealthy"
    exit 1
fi

# Check disk space
DISK_USAGE=$(df -h /opt/kuhmpel | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    echo "✅ Disk space OK ($DISK_USAGE%)"
else
    echo "⚠️  Disk space high ($DISK_USAGE%)"
fi

# Check memory
MEM_USAGE=$(free | grep Mem | awk '{print ($3/$2) * 100.0}' | cut -d. -f1)
if [ "$MEM_USAGE" -lt 80 ]; then
    echo "✅ Memory OK ($MEM_USAGE%)"
else
    echo "⚠️  Memory high ($MEM_USAGE%)"
fi

echo "✅ All checks passed"
```

## 🆘 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs

# Check disk space
df -h

# Check Docker status
sudo systemctl status docker

# Restart Docker
sudo systemctl restart docker
./start.sh --build
```

### High Resource Usage

```bash
# Check container stats
docker stats

# Reduce resource limits in docker-compose.yml
# Restart with new limits
docker-compose down
docker-compose up -d
```

### SSL Certificate Issues

```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Restart reverse proxy
sudo systemctl restart nginx  # or caddy
```

## 📞 Support and Updates

### Stay Updated

- [ ] Subscribe to repository releases
- [ ] Join Discord for announcements
- [ ] Check for updates monthly
- [ ] Review security advisories

### Emergency Contacts

- **GitHub Issues**: https://github.com/rkendel1/clauder/issues
- **Discord**: https://discord.gg/Fn97SD34qk
- **Documentation**: Check DOCKER.md and AIDER.md

## ✅ Post-Deployment Verification

- [ ] Access Code Server via HTTPS
- [ ] Log in with new password
- [ ] Verify Kuhmpel extension loaded
- [ ] Configure AI provider
- [ ] Create test project
- [ ] Test Aider integration (if enabled)
- [ ] Verify backups running
- [ ] Check monitoring alerts
- [ ] Document configuration
- [ ] Train team on usage

## 📝 Documentation

Document your deployment:

1. Server details (IP, domain, provider)
2. Configuration choices
3. Custom modifications
4. Backup procedures
5. Recovery procedures
6. Contact information
7. API key locations (securely!)

---

**Congratulations on your production deployment!** 🎉

Remember to:
- Keep systems updated
- Monitor regularly
- Back up frequently
- Review security periodically
