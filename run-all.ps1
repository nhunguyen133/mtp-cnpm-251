Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd sso-cas-server; npm start"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mtp-backend; npm start"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mtp-frontend; npm start"