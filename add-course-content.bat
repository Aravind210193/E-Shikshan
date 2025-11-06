@echo off
echo Adding video lectures and assignments to courses...
echo.
cd server
node add-course-content.js
echo.
pause
