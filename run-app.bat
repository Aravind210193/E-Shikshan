@echo off
echo Starting E-Shikshan Local Environment...

start cmd /k "cd server && npm run dev"
start cmd /k "cd client && npm run dev"

echo Backend and Frontend are starting in separate windows.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
pause
