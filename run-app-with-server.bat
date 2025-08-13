@echo off
echo Starting Vow Venues Mobile App with Server...
echo.

REM Check if we're in the right directory
if not exist "mobile" (
    echo ERROR: Please run this script from the main project directory
    echo Current directory should contain both 'mobile' and 'server' folders
    pause
    exit /b 1
)

REM Start the server in a new command window
echo Starting server...
start "Vow Venues Server" cmd /k "npm run dev"

REM Wait a few seconds for server to start
echo Waiting for server to start...
timeout /t 5 /nobreak

REM Navigate to mobile directory and start the app
echo Starting mobile app...
cd mobile
npx react-native run-android

echo.
echo Both server and mobile app are now running!
echo Close the server window manually when you're done testing.
pause
