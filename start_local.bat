@echo off

echo === MEDA Local Development Mode ===
echo Switching to SQLite database for easy setup.

cd apps/web && echo VITE_API_URL=http://localhost:3008/api > .env
cd ../portal && echo VITE_API_URL=http://localhost:3008/api > .env
cd ../../

echo Starting API (Background)...
start cmd /k "cd apps/api && npm run dev"

echo Starting Web Dashboard (Background)...
start cmd /k "cd apps/web && npm run dev"

echo Starting Borrower Portal (Background)...
start cmd /k "cd apps/portal && npm run dev"

echo Starting Database Studio (Background)...
start cmd /k "cd apps/api && npx prisma studio"

echo.
echo === ALL SERVICES STARTED ===
echo Dashboard: http://localhost:5173
echo Portal: http://localhost:5174
echo API: http://localhost:3008
echo Database Editor: http://localhost:5555
echo.
pause
