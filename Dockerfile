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
    # Other utilities
    jq \
    unzip \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20.x
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest && \
    npm install -g pnpm

# Configure npm to use legacy peer deps by default
RUN npm config set legacy-peer-deps true

# Copy Aider source code
COPY --chown=root:root ./aider-source /tmp/aider-source

# Install Aider from local source
# Create a virtual environment for Aider to avoid conflicts
RUN SETUPTOOLS_SCM_PRETEND_VERSION=0.0.0 \
    python3 -m venv /opt/aider-venv && \
    /opt/aider-venv/bin/pip install --upgrade pip && \
    SETUPTOOLS_SCM_PRETEND_VERSION=0.0.0 /opt/aider-venv/bin/pip install /tmp/aider-source && \
    rm -rf /tmp/aider-source

# Create symbolic link for easy access
RUN ln -s /opt/aider-venv/bin/aider /usr/local/bin/aider

# Create workspace and Aider directories with correct permissions
RUN mkdir -p ${WORKSPACE_DIR} && \
    mkdir -p /home/coder/.aider && \
    chown -R coder:coder ${WORKSPACE_DIR} && \
    chown -R coder:coder /home/coder/.aider && \
    chmod 755 /home/coder/.aider

# Switch to coder user
USER coder

# Create directory for VS Code extensions
RUN mkdir -p /home/coder/.local/share/code-server/extensions

# Copy the extension source code
COPY --chown=coder:coder ./extension /tmp/kuhmpel-extension

# Build and install the extension
WORKDIR /tmp/kuhmpel-extension

# Stage 1: Install dependencies
RUN set -e && \
    echo "Stage 1: Installing dependencies..." && \
    npm install --legacy-peer-deps && \
    npm run install:all && \
    echo "✓ Dependencies installed successfully"

# Stage 2: Build webview
RUN set -e && \
    echo "Stage 2: Building webview..." && \
    cd webview-ui-vite && \
    npm run build && \
    test -d dist && \
    echo "✓ Webview built successfully" && \
    cd ..

# Stage 3: Build extension
RUN set -e && \
    echo "Stage 3: Building extension..." && \
    npm run package && \
    echo "✓ Extension built successfully"

# Stage 4: Create and verify VSIX package
RUN set -e && \
    echo "Stage 4: Creating VSIX package..." && \
    npm run build && \
    test -f kuhmpel-2.3.13.vsix && \
    echo "✓ VSIX package created successfully"

# Stage 5: Install and verify extension
RUN set -e && \
    echo "Stage 5: Installing extension..." && \
    code-server --install-extension kuhmpel-2.3.13.vsix && \
    test -d /home/coder/.local/share/code-server/extensions/rkendel1.kuhmpel-2.3.13 && \
    echo "✓ Extension installed successfully" && \
    rm -rf /tmp/kuhmpel-extension

# Create startup script
USER root
RUN cat > /usr/local/bin/start-services.sh <<'EOF' && \
chmod +x /usr/local/bin/start-services.sh
#!/bin/bash
set -e

echo "Starting Kuhmpel Development Environment..."

# Set default AIDER_BASE_URL for extension integration
export AIDER_BASE_URL="${AIDER_BASE_URL:-http://localhost:${AIDER_PORT}/v1}"

# Create or update Aider configuration
AIDER_CONFIG_DIR="/home/coder/.aider"
AIDER_CONFIG_FILE="$AIDER_CONFIG_DIR/.aider.conf.yml"

# Create config directory if it doesn't exist
if [ ! -d "$AIDER_CONFIG_DIR" ]; then
    mkdir -p "$AIDER_CONFIG_DIR"
    chown coder:coder "$AIDER_CONFIG_DIR"
    chmod 755 "$AIDER_CONFIG_DIR"
fi

# Create config file if it doesn't exist
if [ ! -f "$AIDER_CONFIG_FILE" ]; then
    tee "$AIDER_CONFIG_FILE" > /dev/null <<'AIDERCONF'
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
    chown coder:coder "$AIDER_CONFIG_FILE"
    chmod 644 "$AIDER_CONFIG_FILE"
fi

# Start Aider server in the background
/opt/aider-venv/bin/aider \
    --model "${AIDER_MODEL:-gpt-4}" \
    --no-auto-commits \
    --yes \
    --listen 0.0.0.0:${AIDER_PORT} &

echo "Aider started on port ${AIDER_PORT}"
echo "Aider API will be available at: ${AIDER_BASE_URL}"

# Start code-server
exec code-server \
    --bind-addr 0.0.0.0:${CODE_SERVER_PORT} \
    --auth "${CODE_SERVER_AUTH:-password}" \
    ${WORKSPACE_DIR}
EOF

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
