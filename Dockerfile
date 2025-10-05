# Dockerfile for Kuhmpel VS Code Extension with Aider and Code Server
# This container provides a complete development environment with:
# - Code Server (VS Code in browser)
# - Kuhmpel VS Code extension
# - Aider AI pair programming tool
# - All necessary dependencies

FROM codercom/code-server:latest

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive \
    CODE_SERVER_PORT=8443 \
    AIDER_PORT=8080 \
    WORKSPACE_DIR=/workspace

# Install system dependencies
USER root
RUN apt-get update && apt-get install -y \
    # Build essentials
    build-essential \
    git \
    curl \
    wget \
    # Python for Aider
    python3 \
    python3-pip \
    python3-venv \
    # Node.js tools (if not already included)
    nodejs \
    npm \
    # Other utilities
    jq \
    unzip \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm

# Copy Aider source code
COPY --chown=root:root ./aider-source /tmp/aider-source

# Install Aider from local source
# Create a virtual environment for Aider to avoid conflicts
RUN python3 -m venv /opt/aider-venv && \
    /opt/aider-venv/bin/pip install --upgrade pip && \
    /opt/aider-venv/bin/pip install /tmp/aider-source && \
    rm -rf /tmp/aider-source

# Create symbolic link for easy access
RUN ln -s /opt/aider-venv/bin/aider /usr/local/bin/aider

# Create workspace directory
RUN mkdir -p ${WORKSPACE_DIR} && \
    chown -R coder:coder ${WORKSPACE_DIR}

# Switch back to coder user
USER coder

# Create directory for VS Code extensions
RUN mkdir -p /home/coder/.local/share/code-server/extensions

# Copy the extension source code
COPY --chown=coder:coder ./extension /tmp/kuhmpel-extension

# Build and install the extension
WORKDIR /tmp/kuhmpel-extension
RUN npm install --legacy-peer-deps && \
    npm run install:all && \
    npm run package && \
    code-server --install-extension kuhmpel-*.vsix && \
    rm -rf /tmp/kuhmpel-extension

# Create startup script
USER root
RUN cat > /usr/local/bin/start-services.sh << 'EOF'
#!/bin/bash
set -e

echo "Starting Kuhmpel Development Environment..."

# Set default AIDER_BASE_URL for extension integration
export AIDER_BASE_URL="${AIDER_BASE_URL:-http://localhost:${AIDER_PORT}/v1}"

# Create default Aider configuration if it doesn't exist
AIDER_CONFIG_DIR="/home/coder/.aider"
mkdir -p "$AIDER_CONFIG_DIR"

# Create .aider.conf.yml with default settings for CA Code Extension integration
cat > "$AIDER_CONFIG_DIR/.aider.conf.yml" << 'AIDERCONF'
# Aider configuration for CA Code Extension integration
# This file is auto-generated on container startup
# You can override these settings by modifying this file

# API settings (will be overridden by command-line args)
model: gpt-4
auto-commits: false
yes: true

# Performance settings
cache-prompts: true
map-tokens: 1024

# Editor integration
edit-format: diff
show-diffs: true
AIDERCONF

chown -R coder:coder "$AIDER_CONFIG_DIR"

# Start Aider server in the background if API key is provided
if [ -n "$AIDER_API_KEY" ]; then
    echo "Starting Aider service on port ${AIDER_PORT}..."
    echo "Aider API will be available at: ${AIDER_BASE_URL}"
    /opt/aider-venv/bin/aider \
        --api-key "$AIDER_API_KEY" \
        --model "${AIDER_MODEL:-gpt-4}" \
        --no-auto-commits \
        --yes \
        --listen 0.0.0.0:${AIDER_PORT} &
    AIDER_PID=$!
    echo "Aider started with PID $AIDER_PID"
else
    echo "AIDER_API_KEY not set, skipping Aider service startup"
    echo "You can set it via environment variable or configure it later"
fi

# Start code-server
echo "Starting Code Server on port ${CODE_SERVER_PORT}..."
exec code-server \
    --bind-addr 0.0.0.0:${CODE_SERVER_PORT} \
    --auth "${CODE_SERVER_AUTH:-password}" \
    ${WORKSPACE_DIR}
EOF

RUN chmod +x /usr/local/bin/start-services.sh

# Expose ports
# 8443 - Code Server web interface
# 8080 - Aider API server
EXPOSE ${CODE_SERVER_PORT} ${AIDER_PORT}

# Set working directory
WORKDIR ${WORKSPACE_DIR}

# Switch back to coder user for runtime
USER coder

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:${CODE_SERVER_PORT}/healthz || exit 1

# Start services
ENTRYPOINT ["/usr/local/bin/start-services.sh"]
