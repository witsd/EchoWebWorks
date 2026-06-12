@echo off
REM ====================================================================
REM ECHO WEBWORKS - FULLY AUTOMATED EMAIL CAMPAIGN
REM ====================================================================
REM Double-click to run. Finds NEW leads, validates they are real and
REM active, writes personalised cold emails, and creates Gmail drafts.
REM Everything runs automatically. No manual steps required.
REM ====================================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

set PROJECT_DIR=%CD%
set LOG_FILE=%PROJECT_DIR%\email-automation.log
set PROMPT_FILE=%PROJECT_DIR%\automation-prompt-v2.txt

cls
echo.
echo ============================================================
echo        ECHO WEBWORKS - AUTOMATED EMAIL CAMPAIGN
echo ============================================================
echo.
echo Starting at: %date% %time%
echo.

echo [%date% %time%] Starting automated campaign >> "%LOG_FILE%"

REM --- CHECK 1: Prompt file exists ---
if not exist "%PROMPT_FILE%" (
    echo ERROR: automation-prompt-v2.txt not found.
    echo Expected location: %PROJECT_DIR%
    echo.
    pause
    exit /b 1
)
echo [OK] Campaign instructions found

REM --- CHECK 2: Claude Code CLI available ---
claude --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Claude Code CLI not found in PATH.
    echo Make sure Claude Code desktop app is installed.
    echo.
    pause
    exit /b 1
)
echo [OK] Claude Code CLI found

echo.
echo ============================================================
echo  RUNNING CAMPAIGN - DO NOT CLOSE THIS WINDOW - 5-10 MINS
echo ============================================================
echo.
echo Steps being run automatically:
echo   1. Load all previously contacted businesses (no duplicates)
echo   2. Search for 10 new eligible UK businesses
echo   3. Validate each is real, active, and has no website
echo   4. Write a personalised cold email for each one
echo   5. Create Gmail drafts ready for you to review and send
echo   6. Update your tracking spreadsheets
echo.
echo Live output below:
echo ------------------------------------------------------------
echo.

REM --- DELETE STALE CACHE FILES to force a fresh run every time ---
if exist "%PROJECT_DIR%\email-search-queries.json" del "%PROJECT_DIR%\email-search-queries.json"
if exist "%PROJECT_DIR%\leads-to-process.json" del "%PROJECT_DIR%\leads-to-process.json"

REM --- RUN THE FULL AUTOMATION via Claude Code CLI ---
powershell -ExecutionPolicy Bypass -NoProfile -File "%PROJECT_DIR%\run-campaign.ps1" -PromptFile "%PROMPT_FILE%"

if %errorlevel% neq 0 (
    echo.
    echo WARNING: Campaign finished with an error. Check the output above.
    echo [%date% %time%] Campaign finished with errors >> "%LOG_FILE%"
) else (
    echo.
    echo [%date% %time%] Campaign finished successfully >> "%LOG_FILE%"
)

echo.
echo ============================================================
echo                        ALL DONE
echo ============================================================
echo.
echo Next steps:
echo   1. Open Gmail and check your Drafts folder
echo   2. Read each email before sending
echo   3. Send when you are happy with them
echo.
echo Log: %LOG_FILE%
echo.
pause
