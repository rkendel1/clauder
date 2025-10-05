#!/bin/bash
# verify-aider-installation.sh
# Script to verify Aider source installation in the Clauder repository

set -e

echo "=================================="
echo "Aider Source Installation Verifier"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0

check_pass() {
    echo -e "${GREEN}✓ $1${NC}"
    PASS=$((PASS + 1))
}

check_fail() {
    echo -e "${RED}✗ $1${NC}"
    FAIL=$((FAIL + 1))
}

check_warn() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

echo "Checking repository structure..."
echo ""

# Check if aider-source directory exists
if [ -d "aider-source" ]; then
    check_pass "aider-source directory exists"
else
    check_fail "aider-source directory NOT found"
fi

# Check if aider-source has main files
if [ -f "aider-source/pyproject.toml" ]; then
    check_pass "aider-source/pyproject.toml found"
else
    check_fail "aider-source/pyproject.toml NOT found"
fi

if [ -f "aider-source/requirements.txt" ]; then
    check_pass "aider-source/requirements.txt found"
else
    check_fail "aider-source/requirements.txt NOT found"
fi

if [ -d "aider-source/aider" ]; then
    check_pass "aider-source/aider package directory found"
else
    check_fail "aider-source/aider package directory NOT found"
fi

echo ""
echo "Checking Dockerfile..."
echo ""

# Check if Dockerfile references aider-source
if grep -q "aider-source" Dockerfile; then
    check_pass "Dockerfile references aider-source"
else
    check_fail "Dockerfile does NOT reference aider-source"
fi

# Check if Dockerfile uses pip install from local source
if grep -q "pip install /tmp/aider-source" Dockerfile; then
    check_pass "Dockerfile installs from local source"
else
    check_fail "Dockerfile does NOT install from local source"
fi

# Check if old pip install is removed
if grep -q "pip install aider-chat" Dockerfile; then
    check_fail "Dockerfile still contains 'pip install aider-chat' (should be removed)"
else
    check_pass "Old PyPI installation removed from Dockerfile"
fi

echo ""
echo "Checking configuration files..."
echo ""

# Check .env.example
if grep -q "AIDER_BASE_URL" .env.example; then
    check_pass ".env.example contains AIDER_BASE_URL"
else
    check_fail ".env.example does NOT contain AIDER_BASE_URL"
fi

# Check docker-compose.yml
if grep -q "AIDER_BASE_URL" docker-compose.yml; then
    check_pass "docker-compose.yml contains AIDER_BASE_URL"
else
    check_fail "docker-compose.yml does NOT contain AIDER_BASE_URL"
fi

echo ""
echo "Checking documentation..."
echo ""

# Check if AIDER-SOURCE.md exists
if [ -f "AIDER-SOURCE.md" ]; then
    check_pass "AIDER-SOURCE.md documentation exists"
else
    check_fail "AIDER-SOURCE.md documentation NOT found"
fi

# Check if README.md references AIDER-SOURCE.md
if grep -q "AIDER-SOURCE.md" README.md; then
    check_pass "README.md references AIDER-SOURCE.md"
else
    check_warn "README.md does NOT reference AIDER-SOURCE.md"
fi

# Check if DOCKER.md references AIDER-SOURCE.md
if grep -q "AIDER-SOURCE.md" DOCKER.md; then
    check_pass "DOCKER.md references AIDER-SOURCE.md"
else
    check_warn "DOCKER.md does NOT reference AIDER-SOURCE.md"
fi

# Check if AIDER.md mentions source installation
if grep -q "source" AIDER.md; then
    check_pass "AIDER.md mentions source installation"
else
    check_warn "AIDER.md does NOT mention source installation"
fi

echo ""
echo "Checking startup script configuration..."
echo ""

# Check if Dockerfile creates .aider.conf.yml
if grep -q ".aider.conf.yml" Dockerfile; then
    check_pass "Dockerfile creates auto-generated .aider.conf.yml"
else
    check_fail "Dockerfile does NOT create auto-generated config"
fi

# Check if startup script sets AIDER_BASE_URL
if grep -q 'AIDER_BASE_URL.*localhost.*AIDER_PORT' Dockerfile; then
    check_pass "Startup script sets AIDER_BASE_URL dynamically"
else
    check_fail "Startup script does NOT set AIDER_BASE_URL"
fi

echo ""
echo "=================================="
echo "Verification Summary"
echo "=================================="
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Aider source installation is properly configured.${NC}"
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Please review the errors above.${NC}"
    exit 1
fi
