@echo off
echo.
echo ===============================================
echo    E-Shikshan - Seeding Gamification Badges
echo ===============================================
echo.

cd server
node seedBadges.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===============================================
    echo    Badges seeded successfully!
    echo ===============================================
) else (
    echo.
    echo ===============================================
    echo    Error seeding badges!
    echo ===============================================
)

echo.
pause
