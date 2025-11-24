# MTP - Meeting Tutoring Platform
# Script để chạy tất cả các servers

Write-Host "🚀 Starting MTP System..." -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js chưa được cài đặt!" -ForegroundColor Red
    Write-Host "Vui lòng cài đặt Node.js từ: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "Node.js: $(node --version)" -ForegroundColor Green
Write-Host "npm: $(npm --version)" -ForegroundColor Green
Write-Host ""

# Kiểm tra các thư mục tồn tại
$folders = @("sso-cas-server", "mtp-backend", "mtp-frontend")
foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        Write-Host "❌ Không tìm thấy thư mục: $folder" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Kiểm tra dependencies..." -ForegroundColor Yellow
Write-Host ""

# Kiểm tra và cài đặt dependencies
foreach ($folder in $folders) {
    if (!(Test-Path "$folder\node_modules")) {
        Write-Host "Cài đặt dependencies cho $folder..." -ForegroundColor Cyan
        Push-Location $folder
        npm install
        Pop-Location
        Write-Host "Đã cài đặt dependencies cho $folder" -ForegroundColor Green
    } else {
        Write-Host "Dependencies đã có sẵn cho $folder" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Khởi động các servers..." -ForegroundColor Cyan
Write-Host ""

# Khởi động CAS Server
Write-Host "Starting CAS Server (Port 4000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "Write-Host 'CAS Authentication Server' -ForegroundColor Magenta; " +
    "Write-Host 'Port: 4000' -ForegroundColor Cyan; " +
    "Write-Host ''; " +
    "cd '$PWD\sso-cas-server'; npm start"

Start-Sleep -Seconds 2

# Khởi động Backend
Write-Host "Starting Backend API (Port 3001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "Write-Host 'MTP Backend API' -ForegroundColor Blue; " +
    "Write-Host 'Port: 3001' -ForegroundColor Cyan; " +
    "Write-Host ''; " +
    "cd '$PWD\mtp-backend'; npm start"

Start-Sleep -Seconds 2

# Khởi động Frontend
Write-Host "Starting Frontend Server (Port 3002)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "Write-Host 'MTP Frontend' -ForegroundColor Green; " +
    "Write-Host 'Port: 3002' -ForegroundColor Cyan; " +
    "Write-Host ''; " +
    "cd '$PWD\mtp-frontend'; npm start; " +
    "Write-Host ''; " +
    "Write-Host 'Mở trình duyệt tại: http://localhost:3002' -ForegroundColor Yellow"

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Tất cả servers đã được khởi động!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "   URLs:" -ForegroundColor Yellow
Write-Host "   CAS Server:  http://localhost:4000" -ForegroundColor Magenta
Write-Host "   Backend API: http://localhost:3001/api" -ForegroundColor Blue
Write-Host "   Frontend:    http://localhost:3002" -ForegroundColor Green
Write-Host ""
Write-Host "   Tài khoản test:" -ForegroundColor Yellow
Write-Host "   Student: nhu.nguyen@hcmut.edu.vn / 123456" -ForegroundColor White
Write-Host "   Tutor:   mdtrung@hcmut.edu.vn / 123456" -ForegroundColor White
Write-Host ""
Write-Host "   Mở trình duyệt..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
Start-Process "http://localhost:3002"