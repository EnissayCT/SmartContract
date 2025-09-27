# Script de test pour créer un contrat sur Hedera (Test 2)
# Exécutez avec : .\test-contract.ps1

# Créer les données du contrat en JSON
$body = @{
    title = "Test Contrat Simple"
    parties = @(
        @{ email = "test1@example.com" },
        @{ email = "test2@example.com" }
    )
    description = "Ceci est un test automatique pour Hedera."
    obligations = "Obligation 1: Paiement. Obligation 2: Livraison."
    startDate = "2024-01-01"
    endDate = "2024-12-31"
    userEmail = "votre.email@test.com"
} | ConvertTo-Json -Depth 3

Write-Host "Envoi du Test 2 vers le backend Hedera..." -ForegroundColor Green

# Envoyer la requête POST
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/contracts/form" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Succès ! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Réponse complète :" -ForegroundColor Yellow
    $response.Content
} catch {
    Write-Host "Erreur lors du test : $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Vérifiez que le serveur tourne (node server.js) et qu'il n'y a pas d'erreur dans la console serveur." -ForegroundColor Red
}