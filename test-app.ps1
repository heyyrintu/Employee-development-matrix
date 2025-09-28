# Test script for Employee Development Matrix
Write-Host "🧪 Testing Employee Development Matrix Application" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "1. Testing main application..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8010" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Main application is accessible" -ForegroundColor Green
    } else {
        Write-Host "❌ Main application returned status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Main application is not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Testing health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8010/health" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Health endpoint is working" -ForegroundColor Green
        $healthData = $response.Content | ConvertFrom-Json
        Write-Host "   Service: $($healthData.service)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Health endpoint returned status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Health endpoint is not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Testing API endpoints..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/matrix/analytics" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Analytics API is working" -ForegroundColor Green
        $analyticsData = $response.Content | ConvertFrom-Json
        Write-Host "   Total employees: $($analyticsData.total_employees)" -ForegroundColor Gray
        Write-Host "   Total trainings: $($analyticsData.total_trainings)" -ForegroundColor Gray
        Write-Host "   Completion rate: $($analyticsData.completion_rate)%" -ForegroundColor Gray
    } else {
        Write-Host "❌ Analytics API returned status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Analytics API is not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "4. Testing matrix data..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8010/api/matrix/" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Matrix API is working" -ForegroundColor Green
        $matrixData = $response.Content | ConvertFrom-Json
        Write-Host "   Employees: $($matrixData.employees.Count)" -ForegroundColor Gray
        Write-Host "   Training columns: $($matrixData.columns.Count)" -ForegroundColor Gray
        Write-Host "   Scores: $($matrixData.scores.Count)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Matrix API returned status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Matrix API is not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "5. Container status..." -ForegroundColor Yellow
$containers = docker-compose ps --format "table {{.Name}}\t{{.Status}}"
Write-Host $containers

Write-Host ""
Write-Host "🎉 Application Test Complete!" -ForegroundColor Green
Write-Host "If all tests passed, you can access the application at:" -ForegroundColor Cyan
Write-Host "   http://localhost:8010" -ForegroundColor White
Write-Host "   http://localhost:8010/settings (Admin only)" -ForegroundColor White
