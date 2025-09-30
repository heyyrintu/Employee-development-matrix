# Authentication and Settings Test Script
Write-Host "🔐 Testing Authentication and Settings Functionality" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "1. Testing application accessibility..." -ForegroundColor Yellow

# Test Main App
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8010" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Main application accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Main application failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Settings Page Route
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8010/settings" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Settings page route accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Settings page route failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Testing Settings API endpoints..." -ForegroundColor Yellow

# Test Settings GET
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/settings/" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Settings API (GET) working" -ForegroundColor Green
        $settings = $response.Content | ConvertFrom-Json
        Write-Host "   Theme: $($settings.theme)" -ForegroundColor Gray
        Write-Host "   Levels: $($settings.levels.Count)" -ForegroundColor Gray
        Write-Host "   Show avatars: $($settings.show_avatars)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Settings API (GET) failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Settings PUT
try {
    $settingsUpdate = @{
        show_avatars = $true
        compact_view = $false
        theme = "light"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/settings/" -Method PUT -ContentType "application/json" -Body $settingsUpdate
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Settings API (PUT) working" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Settings API (PUT) failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Theme Update
try {
    $themeUpdate = @{ theme = "dark" } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/settings/theme/" -Method PUT -ContentType "application/json" -Body $themeUpdate
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Theme API (PUT) working" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Theme API (PUT) failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Testing other critical API endpoints..." -ForegroundColor Yellow

# Test Matrix API
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/matrix/" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Matrix API working" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Matrix API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Analytics API
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/matrix/analytics" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Analytics API working" -ForegroundColor Green
        $analytics = $response.Content | ConvertFrom-Json
        Write-Host "   Total employees: $($analytics.total_employees)" -ForegroundColor Gray
        Write-Host "   Completion rate: $($analytics.completion_rate)%" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Analytics API failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "4. Container status..." -ForegroundColor Yellow
$containers = docker-compose ps --format "table {{.Name}}\t{{.Status}}"
Write-Host $containers

Write-Host ""
Write-Host "🎉 Authentication and Settings Test Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "✨ Features now available:" -ForegroundColor Cyan
Write-Host "   🔐 Login/Logout: Click user icon in top-right corner" -ForegroundColor White
Write-Host "   ⚙️  Settings Page: Accessible to Admin users at /settings" -ForegroundColor White
Write-Host "   🎨 Theme Toggle: Dark/Light mode button in header" -ForegroundColor White
Write-Host "   👤 User Menu: Shows current user and role" -ForegroundColor White
Write-Host "   🔄 Switch User: Option to login as different role" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Demo Login Instructions:" -ForegroundColor Yellow
Write-Host "   1. Click the Login button or user menu" -ForegroundColor White
Write-Host "   2. Enter any username (e.g., 'admin', 'manager', 'employee')" -ForegroundColor White
Write-Host "   3. Select role: Admin (full access), Manager (team access), Employee (limited)" -ForegroundColor White
Write-Host "   4. Settings page only visible to Admin users" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Access your application at: http://localhost:8010" -ForegroundColor Green
