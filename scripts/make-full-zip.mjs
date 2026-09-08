/**
 * Genera deploy_FULL.zip — instalación limpia (borrar todo public_html y subir).
 * Incluye sessions.json vacío {}. No usar para actualizar encima de un sitio vivo.
 */
import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const src = join(root, ".obfuscated-out");
const stage = join(root, ".full-fresh-out");
const zipPath = join(root, "deploy_FULL.zip");

if (!existsSync(src)) {
  console.error("Falta .obfuscated-out. Corre antes: npm run build:obfuscated");
  process.exit(1);
}

if (existsSync(stage)) rmSync(stage, { recursive: true, force: true });
cpSync(src, stage, { recursive: true });

const dataDir = join(stage, "api", "ops", "data");
mkdirSync(dataDir, { recursive: true });
writeFileSync(join(dataDir, "sessions.json"), "{}", "utf8");
writeFileSync(join(dataDir, ".htaccess"), "Require all denied\n", "utf8");

const uploads = join(stage, "api", "ops", "uploads");
mkdirSync(uploads, { recursive: true });
if (!existsSync(join(uploads, ".htaccess"))) {
  writeFileSync(join(uploads, ".htaccess"), "Options -Indexes\n", "utf8");
}

writeFileSync(
  join(stage, "INSTALACION_LIMPIA.txt"),
  [
    "INSTALACION LIMPIA (borrar todo y subir este zip)",
    "",
    "1. En cPanel File Manager: entra a public_html",
    "2. Borra TODO el contenido de public_html",
    "3. Sube deploy_FULL.zip",
    "4. Extrae en public_html (archivos en la raiz, no en subcarpeta)",
    "5. Borra el zip despues de extraer",
    "6. Permisos: api/ops/data = 755 o 775",
    "",
    "Panel: /panel/",
    "Login: /login/",
    "",
    "Este zip trae sessions.json vacio — cola nueva.",
    "Para actualizar sin borrar cola: deploy_obfuscated.zip y NO toques api/ops/data/",
    "",
  ].join("\n"),
  "utf8",
);

const scriptPath = join(root, "scripts", "_zip-full.ps1");
const psPath = (p) => p.replace(/'/g, "''");
writeFileSync(
  scriptPath,
  [
    "$ErrorActionPreference = 'Stop'",
    "Add-Type -AssemblyName System.IO.Compression.FileSystem",
    `$zipPath = '${psPath(zipPath)}'`,
    `$root = '${psPath(stage)}'`,
    "if (Test-Path -LiteralPath $zipPath) { Remove-Item -LiteralPath $zipPath -Force }",
    "$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')",
    "Get-ChildItem -LiteralPath $root -Recurse -File -Force | ForEach-Object {",
    "  $rel = $_.FullName.Substring($root.Length) -replace '^[\\\\/]+','' -replace '\\\\','/'",
    "  [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel, 'Optimal')",
    "}",
    "$zip.Dispose()",
    "Write-Host 'FULL ZIP OK'",
  ].join("\r\n"),
  "utf8",
);

execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}"`, {
  stdio: "inherit",
});

const mb = (statSync(zipPath).size / 1024 / 1024).toFixed(2);
console.log(`\nListo: ${zipPath}`);
console.log(`Tamaño: ${mb} MB`);
console.log("Borra TODO public_html y sube SOLO este zip.\n");
