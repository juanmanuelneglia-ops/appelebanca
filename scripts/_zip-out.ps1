$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipPath = 'C:\Users\Camil\Documents\agricola\deploy_cpanel.zip'
$root = 'C:\Users\Camil\Documents\agricola\out'
if (Test-Path -LiteralPath $zipPath) { Remove-Item -LiteralPath $zipPath -Force }
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')
Get-ChildItem -LiteralPath $root -Recurse -File -Force | ForEach-Object {
  $rel = $_.FullName.Substring($root.Length) -replace '^[\\/]+','' -replace '\\','/'
  [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel, 'Optimal')
}
$zip.Dispose()
Write-Host "ZIP OK entries check:"
$z = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
$sample = $z.Entries | Where-Object { $_.FullName -like '*chunks/*.css' } | Select-Object -First 1 -ExpandProperty FullName
$z.Dispose()
Write-Host $sample
if (-not $sample -or $sample -notlike 'next-assets/*') { throw "ZIP paths invalid: $sample" }