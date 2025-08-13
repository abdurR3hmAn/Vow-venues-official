# Set Android environment variables permanently
$androidHome = "$env:LOCALAPPDATA\Android\Sdk"
$platformTools = "$androidHome\platform-tools"
$emulatorPath = "$androidHome\emulator"

Write-Host "Setting ANDROID_HOME to: $androidHome" -ForegroundColor Green

# Set system environment variables (requires admin privileges)
try {
    [Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidHome, "User")
    
    # Get current PATH
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    
    # Add Android paths if they don't exist
    if (-not $currentPath.Contains($platformTools)) {
        $newPath = "$currentPath;$platformTools"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        Write-Host "Added platform-tools to PATH" -ForegroundColor Green
    }
    
    if (-not $currentPath.Contains($emulatorPath)) {
        $newPath = [Environment]::GetEnvironmentVariable("Path", "User")
        $newPath = "$newPath;$emulatorPath"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        Write-Host "Added emulator to PATH" -ForegroundColor Green
    }
    
    Write-Host "✅ Android environment variables set successfully!" -ForegroundColor Green
    Write-Host "⚠️  Please restart your PowerShell session for changes to take effect." -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Failed to set environment variables: $($_.Exception.Message)" -ForegroundColor Red
}

# Set for current session
$env:ANDROID_HOME = $androidHome
$env:PATH = "$platformTools;$emulatorPath;$env:PATH"
Write-Host "✅ Environment variables set for current session" -ForegroundColor Green
