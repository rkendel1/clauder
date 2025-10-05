#!/bin/bash
# One-command startup script for Kuhmpel Development Environment
# This script builds and launches the Docker container with Code Server and Aider

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}Kuhmpel Development Environment Startup${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed.${NC}"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed.${NC}"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if .env file exists, if not create from example
if [ ! -f .env ]; then
    echo -e "${YELLOW}No .env file found. Creating from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${YELLOW}Please edit .env file to add your API keys.${NC}"
        echo -e "${YELLOW}Press Enter to continue with default values, or Ctrl+C to exit and configure.${NC}"
        read -r
    else
        echo -e "${YELLOW}Warning: .env.example not found. Proceeding with defaults.${NC}"
    fi
fi

# Create workspace directory if it doesn't exist
if [ ! -d "workspace" ]; then
    echo -e "${GREEN}Creating workspace directory...${NC}"
    mkdir -p workspace
fi

# Parse command line arguments
BUILD_FLAG=""
DETACH_FLAG="-d"

while [[ $# -gt 0 ]]; do
    case $1 in
        --build)
            BUILD_FLAG="--build"
            shift
            ;;
        --no-detach)
            DETACH_FLAG=""
            shift
            ;;
        --help)
            echo "Usage: ./start.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --build       Force rebuild of Docker image"
            echo "  --no-detach   Run in foreground (don't detach)"
            echo "  --help        Show this help message"
            echo ""
            echo "Examples:"
            echo "  ./start.sh              # Start with cached image"
            echo "  ./start.sh --build      # Rebuild and start"
            echo "  ./start.sh --no-detach  # Start in foreground"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Build and start the container
echo -e "${GREEN}Starting Docker containers...${NC}"
if [ -n "$BUILD_FLAG" ]; then
    echo -e "${YELLOW}Building Docker image (this may take a few minutes)...${NC}"
fi

docker-compose up $BUILD_FLAG $DETACH_FLAG

# If running in detached mode, show connection info
if [ -n "$DETACH_FLAG" ]; then
    echo ""
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN}Environment Started Successfully!${NC}"
    echo -e "${GREEN}================================================${NC}"
    echo ""
    echo -e "${GREEN}Code Server:${NC} http://localhost:8443"
    echo -e "${GREEN}Default Password:${NC} kuhmpel2024 (change in .env)"
    echo ""
    echo -e "${GREEN}Aider API:${NC} http://localhost:8080"
    echo -e "${YELLOW}(Only available if AIDER_API_KEY is set in .env)${NC}"
    echo ""
    echo -e "${GREEN}Workspace:${NC} ./workspace"
    echo ""
    echo -e "To view logs: ${YELLOW}docker-compose logs -f${NC}"
    echo -e "To stop: ${YELLOW}docker-compose down${NC}"
    echo ""
fi
