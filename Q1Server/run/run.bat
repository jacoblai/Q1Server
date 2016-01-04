@echo off
cls   

echo.
echo 
     %cd%\node %cd%\node_modules\koa-cluster\bin\koa-cluster ../app.js
echo.
pause