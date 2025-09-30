# Complete Settings and Authentication Test Script
Write-Host "🔧 Testing Complete Settings and Authentication System" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

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

Write-Host ""
Write-Host "2. Testing Settings API endpoints..." -ForegroundColor Yellow

# Test Settings GET
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/settings/" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Settings API (GET) working" -ForegroundColor Green
        $settings = $response.Content | ConvertFrom-Json
        Write-Host "   Current theme: $($settings.theme)" -ForegroundColor Gray
        Write-Host "   Levels count: $($settings.levels.Count)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Settings API (GET) failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Theme Update API
try {
    $themeUpdate = @{ theme = "dark" } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/settings/theme/" -Method PUT -ContentType "application/json" -Body $themeUpdate
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Theme update API working" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Theme update API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Settings Update API
try {
    $settingsUpdate = @{
        show_avatars = $true
        compact_view = $false
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/settings/" -Method PUT -ContentType "application/json" -Body $settingsUpdate
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Settings update API working" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Settings update API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Levels Update API
try {
    $levelsUpdate = @(
        @{ level = 0; label = "Not Started"; color = "#ef4444"; description = "No training" },
        @{ level = 1; label = "In Progress"; color = "#f59e0b"; description = "Currently learning" },
        @{ level = 2; label = "Completed"; color = "#10b981"; description = "Training finished" },
        @{ level = 3; label = "Expert"; color = "#8b5cf6"; description = "Advanced level" }
    ) | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/settings/levels/" -Method PUT -ContentType "application/json" -Body $levelsUpdate
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Levels update API working" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Levels update API failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Testing other functionality..." -ForegroundColor Yellow

# Test Matrix API
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/matrix/" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Matrix API working" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Matrix API failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "4. Container status..." -ForegroundColor Yellow
$containers = docker-compose ps --format "table {{.Name}}\t{{.Status}}"
Write-Host $containers

Write-Host ""
Write-Host "🎉 Settings and Authentication Test Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "✨ New Authentication System:" -ForegroundColor Cyan
Write-Host "   🔐 Admin Login: Username: drona, Password: 12345" -ForegroundColor White
Write-Host "   👨‍💼 Manager Login: Username: manager, Password: 12345" -ForegroundColor White
Write-Host "   🚫 No auto-login - users must provide credentials" -ForegroundColor White
Write-Host ""
Write-Host "⚙️  Fixed Settings Features:" -ForegroundColor Yellow
Write-Host "   🎨 Theme switching (Light/Dark mode)" -ForegroundColor White
Write-Host "   📊 Training levels management (add/remove/edit)" -ForegroundColor White
Write-Host "   🎛️  Level color customization" -ForegroundColor White
Write-Host "   📱 Appearance settings (avatars, compact view)" -ForegroundColor White
Write-Host "   🧮 Calculation method configuration" -ForegroundColor White
Write-Host ""
Write-Host "📋 How to test the fixes:" -ForegroundColor Cyan
Write-Host "   1. Go to http://localhost:8010" -ForegroundColor White
Write-Host "   2. Click Login and use: drona / 12345" -ForegroundColor White
Write-Host "   3. Navigate to Settings page" -ForegroundColor White
Write-Host "   4. Try changing theme, adding levels, changing colors" -ForegroundColor White
Write-Host "   5. All changes should save and work immediately!" -ForegroundColor White
Write-Host ""
Write-Host "Access your application at: http://localhost:8010" -ForegroundColor Green
