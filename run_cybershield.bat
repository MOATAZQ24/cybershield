@echo off
title CyberShield Project Setup and Execution
echo Starting CyberShield Project Setup and Execution...

REM =======================
REM CHECK PYTHON
REM =======================
where python >nul 2>nul
IF ERRORLEVEL 1 (
    echo ERROR: Python is not installed or not in PATH.
    echo Please install Python 3.8+ from https://python.org/downloads/
    pause
    exit /b
)

REM =======================
REM CHECK NODE.JS
REM =======================
where node >nul 2>nul
IF ERRORLEVEL 1 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

REM Detect Python command
set PYTHON_CMD=python
for /f "tokens=1" %%v in ('python --version') do (
    if "%%v"=="Python" set PYTHON_CMD=python
)

REM =======================
REM BACKEND SETUP
REM =======================
echo.
echo --- Setting up Backend (Flask) ---
cd cybershield-backend

REM Create venv if not exists
if not exist venv (
    echo Creating Python virtual environment...
    %PYTHON_CMD% -m venv venv
)

REM Activate venv
call venv\Scripts\activate

REM Upgrade pip and install dependencies
echo Installing Python dependencies...
pip install --upgrade pip
pip install flask flask-cors flask-socketio

REM Start backend
echo Starting Flask backend...
start cmd /k "cd /d %cd% && call venv\Scripts\activate && %PYTHON_CMD% src/main.py"

cd ..

REM =======================
REM FRONTEND SETUP
REM =======================
echo.
echo --- Setting up Frontend (React) ---
cd cybershield-frontend

REM Install dependencies (force resolve conflicts)
echo Installing Node.js dependencies...
npm install --legacy-peer-deps
npm install vite --save-dev

REM Start frontend
echo Starting React frontend...
start cmd /k "cd /d %cd% && npm run dev"

cd ..

echo.
echo CyberShield setup complete. Both backend and frontend are running.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo To stop them, close the opened terminal windows.
pause
