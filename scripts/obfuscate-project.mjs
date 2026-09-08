/**
 * Ofusca el export estático (out/) y genera deploy_obfuscated.zip
 * (aparte de deploy_cpanel.zip).
 *
 * Uso:
 *   npm run build:cpanel
 *   node scripts/obfuscate-project.mjs
 */
import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, extname, relative } from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const srcOut = join(root, "out");
const stage = join(root, ".obfuscated-out");
const zipPath = join(root, "deploy_obfuscated.zip");

if (!existsSync(srcOut)) {
  console.error("No existe out/. Corre antes: npm run build:cpanel");
  process.exit(1);
}

const JavaScriptObfuscator = createRequire(import.meta.url)(
  "javascript-obfuscator",
);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

if (existsSync(stage)) rmSync(stage, { recursive: true, force: true });
mkdirSync(stage, { recursive: true });
cpSync(srcOut, stage, { recursive: true });

// Por si out/ traía un sessions.json vacío: no meterlo al zip ofuscado
const sessionsFile = join(stage, "api", "ops", "data", "sessions.json");
if (existsSync(sessionsFile)) rmSync(sessionsFile, { force: true });

const files = walk(stage).filter((f) => extname(f).toLowerCase() === ".js");
let ok = 0;
let skip = 0;

for (const file of files) {
  const rel = relative(stage, file).replace(/\\/g, "/");
  const code = readFileSync(file, "utf8");
  if (!code.trim() || code.length < 40) {
    skip += 1;
    continue;
  }

  // Panel: ofuscación más fuerte. Chunks Next: más suave (si no, rompe React).
  const isPanel = rel.startsWith("panel/");
  const options = isPanel
    ? {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.5,
        deadCodeInjection: false,
        debugProtection: false,
        disableConsoleOutput: false,
        identifierNamesGenerator: "hexadecimal",
        renameGlobals: false,
        selfDefending: false,
        stringArray: true,
        stringArrayEncoding: ["base64"],
        stringArrayThreshold: 0.75,
        splitStrings: true,
        splitStringsChunkLength: 6,
        transformObjectKeys: true,
        unicodeEscapeSequence: false,
      }
    : {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: false,
        disableConsoleOutput: false,
        identifierNamesGenerator: "hexadecimal",
        renameGlobals: false,
        selfDefending: false,
        stringArray: true,
        stringArrayEncoding: ["base64"],
        stringArrayThreshold: 0.5,
        splitStrings: false,
        transformObjectKeys: false,
        unicodeEscapeSequence: false,
        // Preserve Next/Turbopack runtime bits
        reservedNames: ["^__NEXT", "^self$", "^globalThis$", "^TURBOPACK"],
        reservedStrings: ["/_next/", "/next-assets/", "/api/", "/login", "/panel"],
      };

  try {
    const result = JavaScriptObfuscator.obfuscate(code, options);
    writeFileSync(file, result.getObfuscatedCode(), "utf8");
    ok += 1;
  } catch (err) {
    console.warn(`Skip (error): ${rel} — ${err.message}`);
    skip += 1;
  }
}

console.log(`Ofuscados: ${ok} | omitidos: ${skip}`);

const scriptPath = join(root, "scripts", "_zip-obfuscated.ps1");
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
    "Write-Host 'OBFUSCATED ZIP OK'",
  ].join("\r\n"),
  "utf8",
);

execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}"`, {
  stdio: "inherit",
  cwd: root,
});

console.log(`\nListo: ${zipPath}`);
console.log("Sube deploy_obfuscated.zip a public_html (proyecto ofuscado).");
console.log("deploy_cpanel.zip sigue siendo la versión normal sin ofuscar.\n");
