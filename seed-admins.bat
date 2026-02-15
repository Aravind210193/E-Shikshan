@echo off
echo Seeding Admin Users...
cd server
node seedAdmins.js
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to seed admins
    pause
) else (
    echo.
    echo SUCCESS: Admin users created
    pause
)
