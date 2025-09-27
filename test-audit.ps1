# Script pour Test 3 : Récupérer les logs d'audit
Write-Host "Récupération des logs d'audit..." -ForegroundColor Green

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/audit-logs"
    Write-Host "Succès ! Logs :" -ForegroundColor Yellow
    $response.Content
} catch {
    Write-Host "Erreur : $($_.Exception.Message)" -ForegroundColor Red
}