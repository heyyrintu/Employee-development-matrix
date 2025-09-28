# Troubleshooting Guide

## Common Issues and Solutions

### 1. Docker Compose Not Working

**Problem**: `docker-compose up --build` fails or doesn't work

**Solutions**:
1. **Check Docker is running**:
   ```bash
   docker --version
   docker info
   ```

2. **Check Docker Compose is installed**:
   ```bash
   docker-compose --version
   ```

3. **Run the debug script**:
   ```powershell
   # On Windows
   .\debug.ps1
   
   # On Linux/Mac
   ./debug.sh
   ```

4. **Check port availability**:
   - Port 8010 (main app)
   - Port 8000 (backend API)
   - Port 3000 (frontend dev server)

### 2. Port Already in Use

**Problem**: Error about ports being already in use

**Solutions**:
1. **Find what's using the port**:
   ```powershell
   # Windows
   netstat -ano | findstr :8010
   
   # Linux/Mac
   lsof -i :8010
   ```

2. **Kill the process**:
   ```powershell
   # Windows (replace PID with actual process ID)
   taskkill /PID <PID> /F
   ```

3. **Use different ports**:
   Edit `docker-compose.yml` and change the port mappings:
   ```yaml
   ports:
     - "8011:8010"  # Use port 8011 instead
   ```

### 3. Build Failures

**Problem**: Docker build fails

**Solutions**:
1. **Clean Docker cache**:
   ```bash
   docker system prune -a
   docker-compose build --no-cache
   ```

2. **Check file permissions** (Linux/Mac):
   ```bash
   chmod +x debug.sh
   ```

3. **Check disk space**:
   ```bash
   docker system df
   ```

### 4. Database Issues

**Problem**: Database not found or connection errors

**Solutions**:
1. **Ensure data directory exists**:
   ```bash
   mkdir -p data
   ```

2. **Check database file permissions**:
   ```bash
   ls -la data/
   ```

3. **Reset database**:
   ```bash
   rm -rf data/app.db
   docker-compose up --build
   ```

### 5. Frontend Not Loading

**Problem**: Frontend shows blank page or errors

**Solutions**:
1. **Check browser console** for JavaScript errors
2. **Verify API connection**:
   - Check if backend is running: http://localhost:8000/docs
   - Check if frontend can reach API
3. **Clear browser cache**
4. **Check CORS settings** in backend

### 6. Backend API Not Working

**Problem**: API returns errors or doesn't respond

**Solutions**:
1. **Check backend logs**:
   ```bash
   docker-compose logs backend
   ```

2. **Test API directly**:
   ```bash
   curl http://localhost:8000/health
   ```

3. **Check database connection**:
   ```bash
   docker-compose exec backend python -c "from app.core.database import engine; print(engine.url)"
   ```

### 7. Nginx Issues

**Problem**: 502 Bad Gateway or routing issues

**Solutions**:
1. **Check nginx logs**:
   ```bash
   docker-compose logs nginx
   ```

2. **Verify nginx configuration**:
   ```bash
   docker-compose exec nginx nginx -t
   ```

3. **Check if backend and frontend are running**:
   ```bash
   docker-compose ps
   ```

## Step-by-Step Debugging

### 1. Run Debug Script
```powershell
# Windows
.\debug.ps1

# Linux/Mac
./debug.sh
```

### 2. Check Container Status
```bash
docker-compose ps
```

### 3. Check Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs nginx
```

### 4. Rebuild Everything
```bash
# Stop and remove everything
docker-compose down --volumes --remove-orphans

# Remove all images
docker rmi $(docker images -q)

# Rebuild from scratch
docker-compose up --build
```

### 5. Development Mode
If production build doesn't work, try development mode:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

## Getting Help

If you're still having issues:

1. **Check the logs** for specific error messages
2. **Run the debug script** to identify the problem
3. **Try the development setup** first
4. **Check Docker Desktop** is running (Windows/Mac)
5. **Verify system requirements**:
   - Docker 20.10+
   - Docker Compose 2.0+
   - 4GB+ RAM
   - 10GB+ free disk space

## Quick Fixes

### Reset Everything
```bash
# Nuclear option - removes everything
docker-compose down --volumes --remove-orphans
docker system prune -a --volumes
docker-compose up --build
```

### Use Development Mode
```bash
# Use development docker-compose
docker-compose -f docker-compose.dev.yml up --build
```

### Check Specific Service
```bash
# Test backend only
docker-compose up backend

# Test frontend only (in another terminal)
docker-compose up frontend
```
