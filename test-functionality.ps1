# Comprehensive Functionality Test Script
Write-Host "🧪 Testing Employee Development Matrix - All Functionality" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "1. Testing GET endpoints..." -ForegroundColor Yellow

# Test Matrix API
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/matrix/" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Matrix API (GET) working" -ForegroundColor Green
        $matrixData = $response.Content | ConvertFrom-Json
        Write-Host "   Current employees: $($matrixData.employees.Count)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Matrix API (GET) failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Settings API
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/settings/" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Settings API (GET) working" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Settings API (GET) failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Testing POST endpoints (Create operations)..." -ForegroundColor Yellow

# Test Employee Creation
try {
    $employeeData = @{
        name = "Test Employee $(Get-Date -Format 'HHmmss')"
        role = "Test Role"
        department = "Test Department"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/employees/" -Method POST -ContentType "application/json" -Body $employeeData
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Employee Creation (POST) working" -ForegroundColor Green
        $newEmployee = $response.Content | ConvertFrom-Json
        Write-Host "   Created employee ID: $($newEmployee.id)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Employee Creation (POST) failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Training Column Creation
try {
    $columnData = @{
        title = "Test Training $(Get-Date -Format 'HHmmss')"
        description = "Test Description"
        category = "Test Category"
        target_level = 2
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/columns/" -Method POST -ContentType "application/json" -Body $columnData
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Training Column Creation (POST) working" -ForegroundColor Green
        $newColumn = $response.Content | ConvertFrom-Json
        Write-Host "   Created column ID: $($newColumn.id)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Training Column Creation (POST) failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Testing PUT endpoints (Update operations)..." -ForegroundColor Yellow

# Test Settings Update
try {
    $settingsData = @{
        show_avatars = $true
        compact_view = $false
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/settings/" -Method PUT -ContentType "application/json" -Body $settingsData
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Settings Update (PUT) working" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Settings Update (PUT) failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Score Creation/Update
try {
    $scoreData = @{
        employee_id = 1
        column_id = "c1"
        level = 2
        notes = "Test completion"
        updated_by = "test_user"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/scores/" -Method POST -ContentType "application/json" -Body $scoreData
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Score Update (POST) working" -ForegroundColor Green
        $score = $response.Content | ConvertFrom-Json
        Write-Host "   Updated score ID: $($score.id)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Score Update (POST) failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "4. Testing Analytics..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/matrix/analytics" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Analytics API working" -ForegroundColor Green
        $analytics = $response.Content | ConvertFrom-Json
        Write-Host "   Completion rate: $($analytics.completion_rate)%" -ForegroundColor Gray
        Write-Host "   Total employees: $($analytics.total_employees)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Analytics API failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "5. Container Status..." -ForegroundColor Yellow
$containers = docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
Write-Host $containers

Write-Host ""
Write-Host "🎉 Functionality Test Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "✨ All CRUD operations should now work in the web interface:" -ForegroundColor Cyan
Write-Host "   📊 Add employees: Click 'Add Employee' button" -ForegroundColor White
Write-Host "   🎯 Add training modules: Click 'Add Training' button" -ForegroundColor White
Write-Host "   ✏️  Edit scores: Click any cell in the matrix" -ForegroundColor White
Write-Host "   ⚙️  Change settings: Go to /settings page" -ForegroundColor White
Write-Host "   📈 View analytics: Check the right panel" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Access your application at: http://localhost:8010" -ForegroundColor Green
