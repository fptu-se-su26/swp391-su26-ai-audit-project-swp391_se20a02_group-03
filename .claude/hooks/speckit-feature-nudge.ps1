# spec-kit new-feature nudge (UserPromptSubmit hook)
# Reads the submitted prompt from stdin (JSON), folds Vietnamese diacritics to
# ASCII so the keyword list stays pure-ASCII (this file is 100% ASCII to avoid
# Windows PowerShell 5.1 codepage issues), and if the prompt looks like a NEW
# FEATURE request, injects a reminder to start with the spec-kit workflow.
# Never blocks; always exits 0.

$ErrorActionPreference = 'SilentlyContinue'

try {
  $stdin  = [Console]::OpenStandardInput()
  $reader = New-Object System.IO.StreamReader($stdin, [System.Text.Encoding]::UTF8)
  $raw    = $reader.ReadToEnd()
} catch { exit 0 }

if ([string]::IsNullOrWhiteSpace($raw)) { exit 0 }
try { $data = $raw | ConvertFrom-Json } catch { exit 0 }
$prompt = [string]$data.prompt
if ([string]::IsNullOrWhiteSpace($prompt)) { exit 0 }

# Fold diacritics: NFD normalize, drop combining marks, map d-stroke by code
# point (0x0111 / 0x0110), lowercase. Keeps this source file pure-ASCII.
$norm  = $prompt.Normalize([System.Text.NormalizationForm]::FormD)
$ascii = ($norm -replace '\p{Mn}', '')
$ascii = $ascii.Replace([char]0x0111, 'd').Replace([char]0x0110, 'd').ToLowerInvariant()

$pattern = 'tinh nang moi|them tinh nang|them chuc nang|lam tinh nang|lam chuc nang|xay tinh nang|xay dung tinh nang|tao tinh nang|chuc nang moi|xay chuc nang|new feature|add (a |an )?feature|implement (a |an )?feature|build (a |an )?feature|create (a |an )?feature|add functionality'

if ($ascii -match $pattern) {
  $msg = 'Yeu cau nay co ve la MOT TINH NANG MOI. Theo quy uoc du an (spec-driven voi spec-kit): bat dau bang /speckit-specify de tao spec, roi /speckit-plan -> /speckit-tasks -> /speckit-implement. Neu nguoi dung da co spec, dang sua bug, hoac noi ro muon bo qua thi cu tiep tuc binh thuong (khong ep buoc).'
  $obj = @{ hookSpecificOutput = @{ hookEventName = 'UserPromptSubmit'; additionalContext = $msg } }
  [Console]::Out.Write(($obj | ConvertTo-Json -Compress))
}
exit 0
