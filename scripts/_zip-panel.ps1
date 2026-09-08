$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipPath = 'C:\Users\Camil\Documents\agricola\deploy_panel.zip'
$root = 'C:\Users\Camil\Documents\agricola\.panel-secure'
if (Test-Path -LiteralPath $zipPath) { Remove-Item -LiteralPath $zipPath -Force }
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')
Get-ChildItem -LiteralPath $root -Recurse -File -Force | ForEach-Object {
  $rel = $_.FullName.Substring($root.Length) -replace '^[\\/]+','' -replace '\\','/'
  [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel, 'Optimal')
}
$zip.Dispose()
Write-Host 'PANEL ZIP OK'