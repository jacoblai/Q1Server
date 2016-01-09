@echo off
cls   

echo.
echo 
     %cd%\node ../node_modules/koa-cluster/bin/koa-cluster ../app.js
echo.
pause