# Aider Integration Guide

This guide explains how to use Aider as an AI provider with the Kuhmpel VS Code Extension.

## 🤔 What is Aider?

[Aider](https://aider.chat) is an AI pair programming tool that works directly with git repositories. It can:
- Edit existing code with precise modifications
- Create new files and features
- Understand entire codebases through git integration
- Work with multiple AI models (OpenAI, Anthropic, etc.)

## 🎯 Why Use Aider with Kuhmpel?

Combining Aider with Kuhmpel gives you:

1. **Best of Both Worlds**: Use Kuhmpel's VS Code integration + Aider's code editing capabilities
2. **Git-Aware AI**: Aider understands your repository history and structure
3. **Multiple Models**: Switch between different AI providers seamlessly
4. **Local or Remote**: Run Aider locally or connect to a remote instance

## 🚀 Setup Options

### Option 1: Docker (Recommended)

The easiest way is using the provided Docker setup:

```bash
# 1. Configure your API key
cp .env.example .env
nano .env  # Add your AIDER_API_KEY

# 2. Start everything
./start.sh

# 3. Access Code Server at http://localhost:8443
```

Aider will be available at `http://localhost:8080/v1`

### Option 2: Standalone Aider

Run Aider separately on your machine:

#### Install Aider

```bash
# Using pip
pip install aider-chat

# Or with pipx (recommended)
pipx install aider-chat
```

#### Start Aider Server

```bash
# With OpenAI
export OPENAI_API_KEY=sk-...
aider --listen 0.0.0.0:8080 --model gpt-4

# With Anthropic
export ANTHROPIC_API_KEY=sk-...
aider --listen 0.0.0.0:8080 --model claude-3-5-sonnet-20241022

# With custom options
aider --listen 0.0.0.0:8080 \
      --model gpt-4 \
      --no-auto-commits \
      --yes
```

## ⚙️ Configuring Kuhmpel to Use Aider

### In VS Code / Code Server:

1. **Open Kuhmpel Settings**
   - Click the gear icon in Kuhmpel sidebar
   - Or use Command Palette: "Kuhmpel: Settings"

2. **Add Aider Provider**
   - Provider: Select "Aider"
   - Base URL: `http://localhost:8080/v1` (or your Aider server URL)
   - API Key: Your OpenAI/Anthropic/etc. API key
   - Model: Select from available models

3. **Test the Connection**
   - Start a new task in Kuhmpel
   - The extension will communicate with Aider

### Configuration Examples

#### Local Aider (Docker)
```json
{
  "provider": "aider",
  "baseUrl": "http://localhost:8080/v1",
  "apiKey": "your-api-key",
  "model": "gpt-4"
}
```

#### Remote Aider Server
```json
{
  "provider": "aider",
  "baseUrl": "https://your-server.com/v1",
  "apiKey": "your-api-key",
  "model": "claude-3-5-sonnet-20241022"
}
```

#### Aider with Custom Port
```json
{
  "provider": "aider",
  "baseUrl": "http://localhost:9090/v1",
  "apiKey": "your-api-key",
  "model": "gpt-3.5-turbo"
}
```

## 🔑 API Keys

Aider requires an API key from one of the supported providers:

### OpenAI
1. Get key from: https://platform.openai.com/api-keys
2. Models: `gpt-4`, `gpt-4-turbo`, `gpt-3.5-turbo`
3. Set: `OPENAI_API_KEY=sk-...`

### Anthropic
1. Get key from: https://console.anthropic.com/
2. Models: `claude-3-opus-20240229`, `claude-3-5-sonnet-20241022`
3. Set: `ANTHROPIC_API_KEY=sk-ant-...`

### Other Providers
Aider supports many providers. See: https://aider.chat/docs/llms.html

## 🎛️ Aider Configuration Options

### Command Line Options

```bash
# Model selection
aider --model gpt-4                    # Use GPT-4
aider --model claude-3-5-sonnet        # Use Claude

# Server settings
aider --listen 0.0.0.0:8080           # Bind to all interfaces
aider --listen 127.0.0.1:8080         # Local only

# Git settings
aider --no-auto-commits               # Don't auto-commit changes
aider --auto-commits                  # Auto-commit changes
aider --yes                           # Auto-confirm actions

# Performance
aider --cache-prompts                 # Cache prompts for speed
aider --no-stream                     # Disable streaming responses

# Context
aider --map-tokens 1024               # Set repository map size
aider --read file1.py file2.py        # Add files to context
```

### Environment Variables

```bash
# API Keys
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...

# Configuration
export AIDER_MODEL=gpt-4
export AIDER_AUTO_COMMITS=false
export AIDER_CACHE_PROMPTS=true
```

## 🔄 Workflow Integration

### Typical Workflow

1. **Start Aider** (if not using Docker)
   ```bash
   aider --listen 0.0.0.0:8080 --model gpt-4
   ```

2. **Open VS Code/Code Server**
   - Configure Aider as provider
   - Open your project

3. **Use Kuhmpel with Aider**
   - Create tasks
   - Aider handles code modifications
   - Review changes in VS Code

4. **Git Integration**
   - Aider tracks changes via git
   - Review diffs before committing
   - Kuhmpel provides UI for changes

### Best Practices

1. **Use Git**: Initialize a git repo for best results
   ```bash
   cd workspace/your-project
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Clear Instructions**: Be specific about what you want
   - ✅ "Add error handling to the login function in auth.js"
   - ❌ "Fix the login"

3. **Review Changes**: Always review before committing
   - Use VS Code's diff viewer
   - Check Aider's proposed changes
   - Test the code

4. **Manage Context**: Keep relevant files in focus
   - Aider automatically includes important files
   - Manually add files if needed: `/add file.py`

## 🧪 Testing Aider Integration

### 1. Test Aider Server

```bash
# Check if Aider is running
curl http://localhost:8080/v1/models

# Expected response: List of available models
```

### 2. Test from Kuhmpel

1. Open Kuhmpel in VS Code
2. Start a new task
3. Ask something simple: "Create a hello.py file that prints 'Hello, World!'"
4. Verify the file is created

### 3. Test with Code Server

```bash
# Access Code Server
open http://localhost:8443

# In Code Server:
# 1. Open Kuhmpel extension
# 2. Configure Aider provider
# 3. Test with a simple task
```

## 🐛 Troubleshooting

### Aider Server Not Starting

```bash
# Check if port is in use
lsof -i :8080

# Try a different port
aider --listen 0.0.0.0:8081

# Update Kuhmpel settings to use new port
```

### Connection Refused

1. Verify Aider is running: `curl http://localhost:8080/v1/models`
2. Check firewall settings
3. Ensure correct base URL in Kuhmpel settings
4. Check Docker logs: `docker-compose logs`

### API Key Errors

1. Verify API key is valid
2. Check environment variable: `echo $AIDER_API_KEY`
3. Try key directly in Aider: `aider --api-key sk-...`
4. Check provider status page

### Model Not Available

```bash
# List available models
aider --models

# Use a different model
aider --model gpt-3.5-turbo
```

### Performance Issues

1. **Reduce context size**:
   ```bash
   aider --map-tokens 512
   ```

2. **Enable caching**:
   ```bash
   aider --cache-prompts
   ```

3. **Use faster model**:
   ```bash
   aider --model gpt-3.5-turbo
   ```

## 🔐 Security

1. **Protect API Keys**
   - Never commit keys to git
   - Use environment variables
   - Rotate keys regularly

2. **Network Security**
   - Bind to localhost only: `--listen 127.0.0.1:8080`
   - Use firewall rules
   - Consider VPN for remote access

3. **Code Review**
   - Always review AI-generated code
   - Test changes before deploying
   - Use version control

## 📊 Monitoring

### Check Aider Status

```bash
# Docker
docker-compose logs aider

# Standalone
# Aider logs to console
```

### Monitor API Usage

- OpenAI: https://platform.openai.com/usage
- Anthropic: https://console.anthropic.com/settings/usage

## 🎓 Learning Resources

- [Aider Documentation](https://aider.chat/docs)
- [Aider GitHub](https://github.com/paul-gauthier/aider)
- [Kuhmpel Guide](./README.md)
- [Docker Guide](./DOCKER.md)

## 💡 Advanced Features

### Custom Models

```bash
# Use a custom endpoint
aider --model custom-model \
      --openai-api-base http://your-endpoint/v1
```

### Multiple Contexts

```bash
# Add specific files to context
aider --read src/main.py src/utils.py

# Add directory
aider --read src/
```

### Scripting

```bash
# Batch process with Aider
echo "Fix all TODO comments" | aider --yes --no-stream
```

## 🤝 Support

Need help?
- Discord: https://discord.gg/Fn97SD34qk
- GitHub Issues: https://github.com/rkendel1/clauder/issues
- Aider Discord: https://discord.gg/Tv2uQnR4jj

---

**Happy Coding with Aider! 🤖**
