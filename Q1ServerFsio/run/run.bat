@echo off
cls   

echo.
echo 
     %cd%\node --max-old-space-size=7168 ../start.js
echo.
pause