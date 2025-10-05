# Aider Source Installation Guide

This document explains the Aider source code installation in this repository and how it integrates with the CA Code Extension (Kuhmpel).

## 📂 Repository Structure

```
clauder/
├── aider-source/           # Aider source code (cloned from official repository)
│   ├── aider/             # Main Aider package
│   ├── requirements.txt   # Aider dependencies
│   ├── pyproject.toml     # Aider package configuration
│   └── ...
├── Dockerfile             # Modified to install from aider-source/
├── docker-compose.yml     # Pre-configured with AIDER_BASE_URL
├── .env.example           # Includes AIDER_BASE_URL configuration
└── ...
```

## 🎯 Why Install from Source?

Installing Aider from the source code included in this repository provides several advantages:

1. **Version Control**: Locked to a specific, tested version of Aider
2. **Reproducibility**: Ensures consistent builds across all environments
3. **Customization**: Easier to modify or extend Aider functionality if needed
4. **Integration**: Better integration with the CA Code Extension
5. **Offline Capability**: No dependency on external package repositories during build

## 🔧 How It Works

### 1. Source Code Inclusion

The Aider source code is included in the `aider-source/` directory:
- Cloned from the official Aider repository
- `.git` directory removed to avoid nested git repositories
- All source files, tests, and documentation included

### 2. Docker Installation

The `Dockerfile` installs Aider from the local source:

```dockerfile
# Copy Aider source code
COPY --chown=root:root ./aider-source /tmp/aider-source

# Install Aider from local source
RUN python3 -m venv /opt/aider-venv && \
    /opt/aider-venv/bin/pip install --upgrade pip && \
    /opt/aider-venv/bin/pip install /tmp/aider-source && \
    rm -rf /tmp/aider-source
```

This approach:
- Creates a Python virtual environment for isolation
- Installs Aider and all dependencies from the local source
- Cleans up the source directory after installation

### 3. Pre-configured Integration

The container automatically configures Aider for CA Code Extension:

#### Environment Variables
- `AIDER_BASE_URL`: Set to `http://localhost:8080/v1` by default
- `AIDER_PORT`: Default port 8080
- `AIDER_API_KEY`: Your AI provider API key
- `AIDER_MODEL`: Default model to use (gpt-4)

#### Auto-generated Configuration
The startup script creates `/home/coder/.aider/.aider.conf.yml`:

```yaml
# Aider configuration for CA Code Extension integration
model: gpt-4
auto-commits: false
yes: true
cache-prompts: true
map-tokens: 1024
edit-format: diff
show-diffs: true
```

## 🚀 Usage

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rkendel1/clauder.git
   cd clauder
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   nano .env  # Add your AIDER_API_KEY
   ```

3. **Start the container**:
   ```bash
   ./start.sh
   ```

4. **Access Code Server**:
   - Open http://localhost:8443
   - Aider API is available at http://localhost:8080/v1

### Verifying Installation

To verify Aider is installed correctly:

```bash
# Check Aider version
docker exec -it kuhmpel-dev-environment aider --version

# Test Aider CLI
docker exec -it kuhmpel-dev-environment aider --help

# Check if Aider service is running
curl http://localhost:8080/v1/models
```

## 🔄 Updating Aider

To update to a newer version of Aider:

1. **Update the source**:
   ```bash
   cd aider-source
   git pull origin main  # or checkout a specific version
   cd ..
   ```

2. **Rebuild the Docker image**:
   ```bash
   ./start.sh --build
   ```

## 🛠️ Customization

### Modifying Aider Source

If you need to customize Aider:

1. Make changes in `aider-source/`
2. Rebuild the Docker image: `./start.sh --build`
3. Your changes will be included in the installation

### Changing Default Configuration

Edit the startup script section in `Dockerfile`:

```dockerfile
RUN cat > /usr/local/bin/start-services.sh <<'EOF' && \
chmod +x /usr/local/bin/start-services.sh
#!/bin/bash
# ... modify the .aider.conf.yml generation here ...
EOF
```

## 📋 Configuration Reference

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `AIDER_API_KEY` | - | API key for AI provider (required) |
| `AIDER_MODEL` | `gpt-4` | Default AI model to use |
| `AIDER_BASE_URL` | `http://localhost:8080/v1` | Aider API endpoint |
| `AIDER_PORT` | `8080` | Port for Aider API server |

### Default Aider Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `model` | `gpt-4` | AI model to use |
| `auto-commits` | `false` | Safer - review changes before committing |
| `yes` | `true` | Auto-confirm actions |
| `cache-prompts` | `true` | Better performance |
| `map-tokens` | `1024` | Repository map size |
| `edit-format` | `diff` | Clearer change visualization |
| `show-diffs` | `true` | Display diffs for changes |

## 🐛 Troubleshooting

### Build Fails

If the Docker build fails:

```bash
# Clean and rebuild
docker-compose down -v
./start.sh --build
```

### Aider Not Starting

Check the logs:

```bash
docker-compose logs | grep -i aider
```

Common issues:
- `AIDER_API_KEY` not set
- Invalid API key
- Model not available with your API key

### API Connection Issues

Verify the Aider API is accessible:

```bash
# From host
curl http://localhost:8080/v1/models

# From container
docker exec -it kuhmpel-dev-environment curl http://localhost:8080/v1/models
```

## 📚 Additional Resources

- [Official Aider Documentation](https://aider.chat)
- [Aider GitHub Repository](https://github.com/paul-gauthier/aider)
- [Docker Deployment Guide](./DOCKER.md)
- [Aider Integration Guide](./AIDER.md)
- [CA Code Extension Documentation](./README.md)

## 🔍 Technical Details

### Aider Version

The current version of Aider included in this repository:

```bash
cd aider-source
git log -1 --oneline
```

### Python Dependencies

All Aider dependencies are listed in `aider-source/requirements.txt` and are automatically installed during the Docker build.

### Virtual Environment

Aider runs in an isolated Python virtual environment at `/opt/aider-venv/`:
- Prevents conflicts with system Python packages
- Includes all Aider dependencies
- Accessible via symlink: `/usr/local/bin/aider`

## ✅ Benefits Summary

- ✅ **Reproducible builds**: Same version across all deployments
- ✅ **No external dependencies**: Works without internet access during build
- ✅ **Pre-configured**: Ready to use with CA Code Extension
- ✅ **Customizable**: Easy to modify if needed
- ✅ **Version locked**: Tested and stable version
- ✅ **Transparent**: All source code available for inspection
