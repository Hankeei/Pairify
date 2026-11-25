@echo off
setlocal
where node >nul 2>&1
if errorlevel 1 (
    echo Node.js is required. Install it from https://nodejs.org/ and try again.
    pause
    exit /b 1
)

node "%~dp0server.js"
if errorlevel 1 (
    pause
    exit /b 1
)
