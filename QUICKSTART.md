# Kuhmpel Quick Reference Guide

Quick reference for common tasks with Kuhmpel, Aider, and Docker deployment.

## 🚀 Quick Start Commands

### Docker Deployment

```bash
# One-command start
./start.sh

# Force rebuild
./start.sh --build

# Run in foreground (see logs)
./start.sh --no-detach

# Stop everything
docker-compose down

# View logs
docker-compose logs -f
```

### Access Points

- **Code Server**: http://localhost:8443 (password: `kuhmpel2024`)
- **Aider API**: http://localhost:8080/v1

## ⚙️ Configuration Files

### `.env` - Environment Configuration

```bash
CODE_SERVER_PASSWORD=your-password
AIDER_API_KEY=your-api-key
AIDER_MODEL=gpt-4
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
```

### `docker-compose.yml` - Docker Services

```yaml
ports:
  - "8443:8443"  # Code Server
  - "8080:8080"  # Aider

volumes:
  - ./workspace:/workspace  # Your projects
```

## 🔌 Provider Configuration

### In Kuhmpel Extension

1. Open settings (gear icon)
2. Select provider
3. Configure:

#### Aider Provider
- **Provider**: Aider
- **Base URL**: `http://localhost:8080/v1`
- **API Key**: Your OpenAI/Anthropic key
- **Model**: `gpt-4`, `claude-3-5-sonnet-20241022`, etc.

#### Direct Providers
- **Anthropic**: Use API key directly
- **OpenAI**: Use API key directly
- **DeepSeek**: Use API key directly
- **Google**: Use API key directly

## 🐛 Common Issues

### Container Won't Start

```bash
# Check status
docker ps -a

# Check logs
docker-compose logs

# Clean restart
docker-compose down -v
./start.sh --build
```

### Can't Access Code Server

```bash
# Check port
docker port kuhmpel-dev-environment

# Try 127.0.0.1
open http://127.0.0.1:8443
```

### Aider Not Working

```bash
# Check Aider logs
docker-compose logs | grep -i aider

# Restart with API key
# Edit .env to add AIDER_API_KEY
docker-compose restart
```

### Extension Not Loaded

```bash
# Rebuild with extension
./start.sh --build

# Check extensions in Code Server
# Settings > Extensions
```

## 📁 File Locations

### Inside Container

- Workspace: `/workspace`
- Extensions: `/home/coder/.local/share/code-server/extensions`
- Config: `/home/coder/.config/code-server`
- Aider: `/opt/aider-venv`

### On Host

- Projects: `./workspace/`
- Config: `.env`
- Logs: `docker-compose logs`

## 🔑 API Keys

### Get API Keys

- **OpenAI**: https://platform.openai.com/api-keys
- **Anthropic**: https://console.anthropic.com/
- **DeepSeek**: https://platform.deepseek.com/
- **Google**: https://makersuite.google.com/app/apikey

### Set API Keys

```bash
# In .env file
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
DEEPSEEK_API_KEY=sk-...

# Or in Code Server settings
# Kuhmpel > Settings > API Keys
```

## 🔄 Common Workflows

### Start New Project

```bash
# Create project in workspace
mkdir workspace/my-project
cd workspace/my-project
git init

# Access in Code Server
# Open http://localhost:8443
# Open folder: /workspace/my-project
```

### Use Aider

```bash
# 1. Ensure AIDER_API_KEY is set in .env
# 2. Start container: ./start.sh
# 3. In Kuhmpel: Select Aider provider
# 4. Start coding!
```

### Update Extension

```bash
# Get latest code
git pull

# Rebuild
./start.sh --build
```

### Backup Data

```bash
# Backup workspace
tar -czf backup.tar.gz workspace/

# Backup all volumes
docker-compose down
tar -czf volumes-backup.tar.gz \
  ~/.docker/volumes/clauder_*
```

## 🌐 Remote Access

### Local Network

```bash
# Find your IP
hostname -I  # Linux
ipconfig     # Windows

# Access from another device
http://YOUR_IP:8443
```

### Internet (Tunnel)

```bash
# Using ngrok
ngrok http 8443

# Using cloudflared
cloudflared tunnel --url http://localhost:8443
```

## 📊 Resource Management

### Check Resource Usage

```bash
# Container stats
docker stats kuhmpel-dev-environment

# Disk usage
docker system df
```

### Adjust Resources

Edit `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '4'      # Increase CPU
      memory: 8G     # Increase RAM
```

## 🧪 Testing

### Test Aider Connection

```bash
curl http://localhost:8080/v1/models
```

### Test Code Server

```bash
curl http://localhost:8443/healthz
```

### Test Extension

1. Open Code Server
2. Open Kuhmpel
3. Start simple task: "Create hello.py"
4. Verify file created

## 🔐 Security Checklist

- [ ] Change `CODE_SERVER_PASSWORD` in `.env`
- [ ] Don't commit `.env` file
- [ ] Use HTTPS in production (reverse proxy)
- [ ] Restrict network access (firewall)
- [ ] Rotate API keys regularly
- [ ] Review AI-generated code before use

## 📚 Documentation Links

- [Full Docker Guide](./DOCKER.md)
- [Aider Integration Guide](./AIDER.md)
- [Main README](./README.md)
- [Provider Support](./PROVIDER-SUPPORT.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🆘 Getting Help

1. Check documentation above
2. Search issues: https://github.com/rkendel1/clauder/issues
3. Join Discord: https://discord.gg/Fn97SD34qk
4. Create issue with:
   - Error messages
   - `docker-compose logs` output
   - Configuration (without API keys!)

## 💡 Pro Tips

1. **Use Git**: Initialize repos for best Aider results
2. **Clear instructions**: Be specific in task descriptions
3. **Review changes**: Always check AI suggestions
4. **Save often**: Use Code Server auto-save
5. **Backup regularly**: Automate workspace backups
6. **Monitor usage**: Track API costs
7. **Start small**: Test with simple tasks first

---

**Need more details?** Check the full guides:
- [DOCKER.md](./DOCKER.md) - Complete Docker documentation
- [AIDER.md](./AIDER.md) - Aider integration details
