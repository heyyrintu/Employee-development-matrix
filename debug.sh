#!/bin/bash

echo "🔍 Employee Development Matrix - Debug Script"
echo "=============================================="

echo ""
echo "1. Checking Docker installation..."
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed"
    docker --version
else
    echo "❌ Docker is not installed or not in PATH"
    exit 1
fi

echo ""
echo "2. Checking Docker Compose installation..."
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose is installed"
    docker-compose --version
else
    echo "❌ Docker Compose is not installed or not in PATH"
    exit 1
fi

echo ""
echo "3. Checking if ports are available..."
if lsof -Pi :8010 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8010 is already in use"
    echo "   You may need to stop the service using this port"
else
    echo "✅ Port 8010 is available"
fi

if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8000 is already in use"
else
    echo "✅ Port 8000 is available"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use"
else
    echo "✅ Port 3000 is available"
fi

echo ""
echo "4. Checking project structure..."
if [ -d "backend" ]; then
    echo "✅ Backend directory exists"
else
    echo "❌ Backend directory missing"
fi

if [ -d "frontend" ]; then
    echo "✅ Frontend directory exists"
else
    echo "❌ Frontend directory missing"
fi

if [ -f "docker-compose.yml" ]; then
    echo "✅ docker-compose.yml exists"
else
    echo "❌ docker-compose.yml missing"
fi

if [ -f "nginx.conf" ]; then
    echo "✅ nginx.conf exists"
else
    echo "❌ nginx.conf missing"
fi

echo ""
echo "5. Checking Docker daemon..."
if docker info &> /dev/null; then
    echo "✅ Docker daemon is running"
else
    echo "❌ Docker daemon is not running"
    echo "   Please start Docker Desktop or Docker daemon"
    exit 1
fi

echo ""
echo "6. Cleaning up any existing containers..."
docker-compose down --remove-orphans 2>/dev/null || true

echo ""
echo "7. Building and starting services..."
echo "   This may take a few minutes on first run..."
docker-compose up --build

echo ""
echo "🎉 If everything worked, the application should be available at:"
echo "   http://localhost:8010"
