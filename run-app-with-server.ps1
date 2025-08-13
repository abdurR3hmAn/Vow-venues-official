# PowerShell script to run Vow Venues Mobile App with Server

Write-Host "Starting Vow Venues Mobile App with Server..." -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "mobile") -or -not (Test-Path "server")) {
    Write-Host "ERROR: Please run this script from the main project directory" -ForegroundColor Red
    Write-Host "Current directory should contain both 'mobile' and 'server' folders" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Android emulator or device is connected
Write-Host "Checking for Android devices..." -ForegroundColor Yellow
try {
    $devices = adb devices
    if ($devices -match "device$") {
        Write-Host "✅ Android device/emulator found" -ForegroundColor Green
    } else {
        Write-Host "⚠️  No Android device/emulator detected. Make sure to start your emulator first." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  ADB not found. Make sure Android SDK is installed and adb is in PATH" -ForegroundColor Yellow
}

Write-Host ""

# Start the server in a new PowerShell window
Write-Host "Starting server..." -ForegroundColor Yellow
$serverJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -PassThru

# Wait a few seconds for server to start
Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Test if server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -TimeoutSec 5
    Write-Host "✅ Server is running and healthy" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Server might not be ready yet, but continuing..." -ForegroundColor Yellow
}

# Navigate to mobile directory and start the app
Write-Host "Starting mobile app..." -ForegroundColor Yellow
Set-Location mobile

try {
    npx react-native run-android
    Write-Host ""
    Write-Host "✅ Mobile app started successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to start mobile app" -ForegroundColor Red
    Write-Host "Make sure Android Studio and emulator are properly set up" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📱 Both server and mobile app should now be running!" -ForegroundColor Green
Write-Host "🔍 Check the server window for API logs" -ForegroundColor Cyan
Write-Host "🛑 Close the server window manually when you're done testing" -ForegroundColor Yellow

Read-Host "Press Enter to exit"
