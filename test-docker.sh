#!/bin/bash
# Docker Integration Test Script
# This script validates the Docker setup and configuration

set -e

echo "🧪 Kuhmpel Docker Integration Tests"
echo "===================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TESTS_RUN=$((TESTS_RUN + 1))
    echo -n "Test $TESTS_RUN: $test_name... "
    
    if eval "$test_command" &> /dev/null; then
        echo -e "${GREEN}PASSED${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}FAILED${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Check prerequisites
echo "📋 Checking Prerequisites"
echo "-------------------------"

run_test "Docker is installed" "command -v docker"
run_test "Docker is running" "docker ps"
run_test "Docker Compose is available" "docker compose version || command -v docker-compose"

echo ""

# Check files
echo "📁 Checking Configuration Files"
echo "-------------------------------"

run_test "Dockerfile exists" "test -f Dockerfile"
run_test "docker-compose.yml exists" "test -f docker-compose.yml"
run_test ".env.example exists" "test -f .env.example"
run_test "start.sh exists and is executable" "test -x start.sh"

echo ""

# Check Dockerfile structure
echo "🏗️  Validating Dockerfile"
echo "-------------------------"

run_test "Dockerfile has FROM directive" "grep -q '^FROM' Dockerfile"
run_test "Dockerfile installs Aider" "grep -q 'aider' Dockerfile"
run_test "Dockerfile exposes ports" "grep -q 'EXPOSE' Dockerfile"
run_test "Dockerfile has entrypoint" "grep -q 'ENTRYPOINT' Dockerfile"

echo ""

# Check docker-compose.yml structure
echo "🔧 Validating docker-compose.yml"
echo "--------------------------------"

run_test "docker-compose has services" "grep -q 'services:' docker-compose.yml"
run_test "docker-compose exposes Code Server port" "grep -q '8443:8443' docker-compose.yml"
run_test "docker-compose exposes Aider port" "grep -q '8080:8080' docker-compose.yml"
run_test "docker-compose has volumes" "grep -q 'volumes:' docker-compose.yml"
run_test "docker-compose has environment variables" "grep -q 'environment:' docker-compose.yml"

echo ""

# Check documentation
echo "📚 Validating Documentation"
echo "---------------------------"

run_test "DOCKER.md exists" "test -f DOCKER.md"
run_test "AIDER.md exists" "test -f AIDER.md"
run_test "QUICKSTART.md exists" "test -f QUICKSTART.md"
run_test "README.md mentions Docker" "grep -qi 'docker' README.md"

echo ""

# Check .env.example
echo "⚙️  Validating Environment Template"
echo "-----------------------------------"

run_test ".env.example has CODE_SERVER_PASSWORD" "grep -q 'CODE_SERVER_PASSWORD' .env.example"
run_test ".env.example has AIDER_API_KEY" "grep -q 'AIDER_API_KEY' .env.example"
run_test ".env.example has AIDER_MODEL" "grep -q 'AIDER_MODEL' .env.example"

echo ""

# Optional: Test Docker build (commented out by default as it takes time)
if [ "$RUN_BUILD_TEST" = "true" ]; then
    echo "🏗️  Testing Docker Build (this may take several minutes)..."
    echo "-----------------------------------------------------------"
    
    if run_test "Docker image builds successfully" "docker build -t kuhmpel-test ."; then
        # Clean up test image
        docker rmi kuhmpel-test &> /dev/null || true
    fi
    
    echo ""
fi

# Summary
echo "📊 Test Summary"
echo "==============="
echo -e "Total tests run: $TESTS_RUN"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    echo ""
    echo "Your Docker setup is ready to use!"
    echo "Run './start.sh' to launch the environment."
    exit 0
else
    echo -e "${RED}❌ Some tests failed!${NC}"
    echo ""
    echo "Please fix the issues above before proceeding."
    exit 1
fi
