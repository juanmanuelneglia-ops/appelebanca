/**
 * Build estático para cPanel (HTML + PHP API).
 * Temporalmente aparta API routes y middleware de Next (no soportados en export).
 * Renombra `_next` → `next-assets` porque varios hosts omiten/bloquean carpetas `_`.
 */
import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, extname } from "node:path";

const root = process.cwd();
const apiDir = join(root, "src", "app", "api");
const apiPark = join(root, ".cpanel-park", "api");
const mwFile = join(root, "src", "middleware.ts");
const mwPark = join(root, ".cpanel-park", "middleware.ts");
const parkDir = join(root, ".cpanel-park");
const ASSET_DIR = "next-assets";

function park() {
  mkdirSync(parkDir, { recursive: true });
  if (existsSync(apiDir)) {
    if (existsSync(apiPark)) rmSync(apiPark, { recursive: true, force: true });
    renameSync(apiDir, apiPark);
  }
  if (existsSync(mwFile)) {
    if (existsSync(mwPark)) rmSync(mwPark, { force: true });
    renameSync(mwFile, mwPark);
  }
}

function restore() {
  if (existsSync(apiPark) && !existsSync(apiDir)) {
    renameSync(apiPark, apiDir);
  }
  if (existsSync(mwPark) && !existsSync(mwFile)) {
    renameSync(mwPark, mwFile);
  }
}

function walkFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

function rewriteAssetPaths(outDir) {
  const fromDir = join(outDir, "_next");
  const toDir = join(outDir, ASSET_DIR);
  if (!existsSync(fromDir)) {
    throw new Error("No existe out/_next tras el build");
  }
  if (existsSync(toDir)) rmSync(toDir, { recursive: true, force: true });
  renameSync(fromDir, toDir);

  const textExt = new Set([
    ".html",
    ".js",
    ".css",
    ".json",
    ".txt",
    ".map",
    ".xml",
    ".svg",
  ]);
  const files = walkFiles(outDir);
  let changed = 0;
  for (const file of files) {
    if (!textExt.has(extname(file).toLowerCase())) continue;
    const before = readFileSync(file, "utf8");
    if (!before.includes("/_next/") && !before.includes("\\_next\\")) continue;
    const after = before
      .replaceAll("/_next/", `/${ASSET_DIR}/`)
      .replaceAll("\\_next\\", `\\${ASSET_DIR}\\`);
    if (after !== before) {
      writeFileSync(file, after, "utf8");
      changed += 1;
    }
  }
  console.log(`Renombrado _next → ${ASSET_DIR} (archivos actualizados: ${changed})`);
}

/** Zip con rutas Unix vía PowerShell (.NET), sin Compress-Archive. */
function makeUnixZip(outDir, zipPath) {
  if (existsSync(zipPath)) rmSync(zipPath, { force: true });
  const scriptPath = join(root, "scripts", "_zip-out.ps1");
  // Rutas en comillas simples de PS: sin lío de \\ ni TrimStart comiendo "next"
  const psPath = (p) => p.replace(/'/g, "''");
  writeFileSync(
    scriptPath,
    [
      "$ErrorActionPreference = 'Stop'",
      "Add-Type -AssemblyName System.IO.Compression.FileSystem",
      `$zipPath = '${psPath(zipPath)}'`,
      `$root = '${psPath(outDir)}'`,
      "if (Test-Path -LiteralPath $zipPath) { Remove-Item -LiteralPath $zipPath -Force }",
      "$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')",
      "Get-ChildItem -LiteralPath $root -Recurse -File -Force | ForEach-Object {",
      "  $rel = $_.FullName.Substring($root.Length) -replace '^[\\\\/]+','' -replace '\\\\','/'",
      "  [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel, 'Optimal')",
      "}",
      "$zip.Dispose()",
      "Write-Host \"ZIP OK entries check:\"",
      "$z = [System.IO.Compression.ZipFile]::OpenRead($zipPath)",
      "$sample = $z.Entries | Where-Object { $_.FullName -like '*chunks/*.css' } | Select-Object -First 1 -ExpandProperty FullName",
      "$z.Dispose()",
      "Write-Host $sample",
      "if (-not $sample -or $sample -notlike 'next-assets/*') { throw \"ZIP paths invalid: $sample\" }",
    ].join("\r\n"),
    "utf8",
  );
  execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}"`, {
    stdio: "inherit",
    cwd: root,
  });
}

try {
  park();
  execSync("npx next build", {
    stdio: "inherit",
    env: { ...process.env, CPANEL: "1" },
    cwd: root,
  });

  const outDir = join(root, "out");
  if (!existsSync(outDir)) {
    throw new Error("No se generó la carpeta out/");
  }

  rewriteAssetPaths(outDir);

  const dataDir = join(outDir, "api", "ops", "data");
  mkdirSync(dataDir, { recursive: true });
  // NUNCA meter sessions.json vacío en el zip: al descomprimir borra la cola en cPanel.
  const sessionsInOut = join(dataDir, "sessions.json");
  if (existsSync(sessionsInOut)) rmSync(sessionsInOut, { force: true });
  writeFileSync(join(dataDir, ".htaccess"), "Require all denied\n", "utf8");
  writeFileSync(
    join(dataDir, "README.txt"),
    "sessions.json se crea solo en el servidor. No lo sobrescribas al actualizar.\n",
    "utf8",
  );

  writeFileSync(
    join(outDir, "SUBIR-A-CPANEL.txt"),
    [
      "1. Primera vez: borra public_html y sube este zip completo.",
      "2. Actualizaciones: NO borres api/ops/data/ (ahí está la cola del panel).",
      "   Mejor reemplaza carpetas sin tocar data/, o excluye sessions.json.",
      "3. Deben quedar: index.html, next-assets, api, panel, .htaccess.",
      "4. Permisos: api/ops/data → 755 o 775.",
      "5. Panel: /panel/   Login: /login/",
      "",
    ].join("\n"),
    "utf8",
  );

  makeUnixZip(outDir, join(root, "deploy_cpanel.zip"));

  console.log("\nOK: out/ + deploy_cpanel.zip listos para public_html\n");
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  restore();
}
