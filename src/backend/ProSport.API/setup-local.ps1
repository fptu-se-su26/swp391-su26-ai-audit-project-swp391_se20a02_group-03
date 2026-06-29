# Thiết lập backend local — chạy một lần sau clone repo.
# Usage: .\setup-local.ps1
#        .\setup-local.ps1 -GoogleClientId "123456789-xxxx.apps.googleusercontent.com"

param(
    [string]$GoogleClientId = ""
)

$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendRoot = Join-Path $here "..\..\frontend"

$example = Join-Path $here "appsettings.Development.example.json"
$target = Join-Path $here "appsettings.Development.json"

if (-not (Test-Path $example)) {
    Write-Error "Không tìm thấy appsettings.Development.example.json"
}

Copy-Item -Path $example -Destination $target -Force
Write-Host "[OK] Da tao appsettings.Development.json (gitignored)"

$userJwt = [Environment]::GetEnvironmentVariable("JWT_SECRET_KEY", "User")
if ([string]::IsNullOrWhiteSpace($userJwt)) {
    $stagingJwt = "ProSport-Staging-Local-JWT-Secret-Key-256bits-DevOnly!!"
    [Environment]::SetEnvironmentVariable("JWT_SECRET_KEY", $stagingJwt, "User")
    Write-Host "[OK] Da set JWT_SECRET_KEY (User scope) cho Staging/Production local"
    Write-Host "     Mo terminal moi de env co hieu luc. Tren server that: dung CI/CD secret."
} else {
    Write-Host "[SKIP] JWT_SECRET_KEY da ton tai (User scope)"
}

if ([string]::IsNullOrWhiteSpace($GoogleClientId)) {
    $GoogleClientId = [Environment]::GetEnvironmentVariable("GOOGLE_CLIENT_ID", "User")
}

if (-not [string]::IsNullOrWhiteSpace($GoogleClientId)) {
    $json = Get-Content $target -Raw | ConvertFrom-Json
    $json.GoogleAuth.ClientId = $GoogleClientId.Trim()
    $json | ConvertTo-Json -Depth 20 | Set-Content $target -Encoding UTF8
    Write-Host "[OK] Da ghi GoogleAuth:ClientId vao appsettings.Development.json"
} else {
    Write-Host "[WARN] Chua co Google Client ID - dang nhap Google se khong hoat dong."
    Write-Host '       Dat bien GOOGLE_CLIENT_ID (User) hoac chay setup-local.ps1 -GoogleClientId "YOUR_ID.apps.googleusercontent.com"'
}

# Frontend .env
$feExample = Join-Path $frontendRoot ".env.example"
$feTarget = Join-Path $frontendRoot ".env"
if (Test-Path $feExample) {
    Copy-Item -Path $feExample -Destination $feTarget -Force
    if (-not [string]::IsNullOrWhiteSpace($GoogleClientId)) {
        $envContent = Get-Content $feTarget -Raw
        if ($envContent -match '(?m)^VITE_GOOGLE_CLIENT_ID=.*$') {
            $envContent = [regex]::Replace($envContent, '(?m)^VITE_GOOGLE_CLIENT_ID=.*$', "VITE_GOOGLE_CLIENT_ID=$($GoogleClientId.Trim())")
        } else {
            $envContent += "`nVITE_GOOGLE_CLIENT_ID=$($GoogleClientId.Trim())`n"
        }
        Set-Content -Path $feTarget -Value $envContent -Encoding utf8NoBOM
    }
    Write-Host "[OK] Da tao src/frontend/.env (gitignored)"
    if (-not [string]::IsNullOrWhiteSpace($GoogleClientId)) {
        Write-Host "     VITE_GOOGLE_CLIENT_ID da dong bo voi backend"
    }
} else {
    Write-Host "[WARN] Khong tim thay src/frontend/.env.example"
}

Write-Host ""
Write-Host "Google Cloud Console - Authorized JavaScript origins (them CA HAI):"
Write-Host "  http://localhost:5173"
Write-Host "  http://127.0.0.1:5173"
Write-Host ""
Write-Host "Chay API dev:   dotnet run --project ProSport.API.csproj"
Write-Host "Chay frontend:  cd src/frontend && npm run dev"
Write-Host "Test Staging:   dotnet run --launch-profile Staging"
