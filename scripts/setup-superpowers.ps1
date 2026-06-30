#Requires -Version 5.1
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "==> ProSport Superpowers setup" -ForegroundColor Cyan

if (-not (Test-Path ".superpowers\skills\using-superpowers\SKILL.md")) {
    Write-Host "Init submodule .superpowers ..."
    git submodule update --init --recursive .superpowers
}

if (-not (Test-Path ".superpowers\skills\using-superpowers\SKILL.md")) {
    throw "Missing .superpowers submodule. Run: git submodule update --init .superpowers"
}

$skillsDest = Join-Path $Root ".cursor\skills"
New-Item -ItemType Directory -Force -Path $skillsDest | Out-Null

Get-ChildItem ".superpowers\skills" -Directory | ForEach-Object {
    $link = Join-Path $skillsDest $_.Name
    if (Test-Path $link) { return }
    cmd /c "mklink /J `"$link`" `"$($_.FullName)`"" | Out-Null
    Write-Host "  + skill junction: $($_.Name)"
}

$bash = "C:\Program Files\Git\bin\bash.exe"
if (Test-Path $bash) {
    Write-Host "Git Bash: OK" -ForegroundColor Green
} else {
    Write-Warning "Git Bash not found. Install Git for Windows for sessionStart hook."
}

# Enable Superpowers plugin for this project (equivalent to /add-plugin superpowers in Agent chat)
$cursorSettingsPath = Join-Path $Root ".cursor\settings.json"
$cursorDir = Split-Path $cursorSettingsPath -Parent
New-Item -ItemType Directory -Force -Path $cursorDir | Out-Null

$pluginConfig = @'
{
  "plugins": {
    "superpowers": {
      "enabled": true
    }
  }
}
'@
Set-Content -Path $cursorSettingsPath -Value $pluginConfig -Encoding utf8
Write-Host "Plugin config: .cursor/settings.json (superpowers enabled)" -ForegroundColor Green

Write-Host ""
Write-Host "Testing hook output (first line):"
$out = & (Join-Path $Root ".cursor\hooks\superpowers-session-start.cmd") 2>&1 | Select-Object -First 1
Write-Host $out

Write-Host ""
Write-Host "Done. Open a NEW Agent chat or restart Cursor." -ForegroundColor Green
Write-Host "Project hooks/rules/skills are configured - /add-plugin . is optional." -ForegroundColor DarkGray
