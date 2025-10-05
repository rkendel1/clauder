# Kuhmpel Docker Deployment Guide

This guide explains how to deploy Kuhmpel VS Code Extension with Code Server and Aider integration using Docker.

## 🎯 What's Included

The Docker container provides a complete development environment with:

- **Code Server**: VS Code running in your browser
- **Kuhmpel Extension**: Pre-installed and ready to use
- **Aider**: AI pair programming tool with API server
- **All Dependencies**: Node.js, Python, and all required packages

## 🚀 Quick Start (One Command)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rkendel1/clauder.git
   cd clauder
   ```

2. **Configure environment** (optional):
   ```bash
   cp .env.example .env
   # Edit .env to add your API keys
   nano .env  # or use your preferred editor
   ```

3. **Start everything**:
   ```bash
   ./start.sh
   ```

4. **Access Code Server**:
   - Open your browser to: http://localhost:8443
   - Default password: `kuhmpel2024` (change in `.env`)

That's it! 🎉

## 📋 Prerequisites

- Docker (20.10 or later)
- Docker Compose (2.0 or later)
- At least 4GB RAM available for the container

### Install Docker

**macOS/Windows**: Download Docker Desktop from https://www.docker.com/products/docker-desktop

**Linux**: 
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Code Server
CODE_SERVER_PASSWORD=your-secure-password

# Aider (optional)
AIDER_API_KEY=sk-...  # Your OpenAI/Anthropic/etc. API key
AIDER_MODEL=gpt-4     # Model to use with Aider

# Extension API Keys (configure in VS Code settings)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
DEEPSEEK_API_KEY=sk-...
```

### Ports

The container exposes:
- **8443**: Code Server web interface
- **8080**: Aider API server (if configured)

To change ports, edit `docker-compose.yml`:

```yaml
ports:
  - "9000:8443"  # Map Code Server to port 9000
  - "9001:8080"  # Map Aider to port 9001
```

## 🔧 Advanced Usage

### Start Script Options

```bash
# Force rebuild the Docker image
./start.sh --build

# Run in foreground (see logs)
./start.sh --no-detach

# Both options
./start.sh --build --no-detach
```

### Docker Compose Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Restart containers
docker-compose restart

# Rebuild and start
docker-compose up --build -d
```

### Using Aider

Once the container is running with `AIDER_API_KEY` configured:

1. **In Kuhmpel Extension**:
   - Open settings (gear icon)
   - Select "Aider" as provider
   - Use `http://localhost:8080/v1` as base URL
   - Enter your API key (same as `AIDER_API_KEY`)

2. **Direct Aider CLI** (inside container):
   ```bash
   docker exec -it kuhmpel-dev-environment bash
   aider --help
   ```

## 📁 Data Persistence

Your data is persisted in Docker volumes:

- **workspace/**: Your project files (mapped to `./workspace`)
- **code-server-config**: Code Server settings
- **code-server-extensions**: Installed extensions
- **aider-data**: Aider chat history

### Backup Your Data

```bash
# Backup workspace
tar -czf workspace-backup.tar.gz workspace/

# Backup all volumes
docker run --rm \
  -v kuhmpel_code-server-config:/config \
  -v $(pwd):/backup \
  alpine tar -czf /backup/config-backup.tar.gz -C /config .
```

## 🐛 Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs

# Remove old containers and volumes
docker-compose down -v

# Rebuild from scratch
docker-compose up --build
```

### Can't access Code Server

1. Check if container is running: `docker ps`
2. Check port mapping: `docker port kuhmpel-dev-environment`
3. Try accessing: http://127.0.0.1:8443

### Aider not working

1. Ensure `AIDER_API_KEY` is set in `.env`
2. Check Aider logs: `docker-compose logs | grep -i aider`
3. Verify the API key is valid for your chosen model

### Out of memory errors

Increase memory limits in `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      memory: 8G  # Increase from 4G
```

## 🔐 Security Considerations

1. **Change the default password**: Edit `CODE_SERVER_PASSWORD` in `.env`
2. **Don't commit `.env`**: It's already in `.gitignore`
3. **Use HTTPS in production**: Set up a reverse proxy (nginx, Caddy)
4. **Restrict network access**: Use firewall rules or Docker networks

### Production Deployment

For production use, consider:

1. **Reverse proxy with SSL**:
   ```bash
   # Example with Caddy
   localhost:443 {
       reverse_proxy localhost:8443
   }
   ```

2. **Secure authentication**: Use OAuth or other auth providers
3. **Regular backups**: Automate workspace backups
4. **Resource monitoring**: Set up monitoring for CPU/memory usage

## 🔄 Updating

To update to the latest version:

```bash
# Pull latest code
git pull

# Rebuild and restart
./start.sh --build
```

## 🌐 Remote Access

To access from other machines on your network:

1. Find your machine's IP: `hostname -I` (Linux) or `ipconfig` (Windows)
2. Access via: `http://YOUR_IP:8443`
3. **Important**: Ensure firewall allows connections on port 8443

For internet access, use a tunnel service:
- ngrok: `ngrok http 8443`
- cloudflared: `cloudflared tunnel --url http://localhost:8443`

## 📚 Additional Resources

- [Code Server Documentation](https://coder.com/docs/code-server)
- [Aider Documentation](https://aider.chat/docs)
- [Kuhmpel Extension Guide](./README.md)
- [Docker Documentation](https://docs.docker.com/)

## 💡 Tips

1. **Use a dedicated workspace**: Keep each project in `workspace/project-name`
2. **Configure Git inside the container**: 
   ```bash
   docker exec -it kuhmpel-dev-environment bash
   git config --global user.name "Your Name"
   git config --global user.email "your@email.com"
   ```
3. **Install additional extensions**: Use Code Server's extension marketplace
4. **Customize Code Server**: Edit settings through the web UI

## 🤝 Support

If you encounter issues:

1. Check the [troubleshooting section](#-troubleshooting)
2. Search existing issues: https://github.com/rkendel1/clauder/issues
3. Join our Discord: https://discord.gg/Fn97SD34qk
4. Create a new issue with logs and configuration details

---

**Happy Coding! 🚀**
