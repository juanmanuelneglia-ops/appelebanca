/**
 * Ofusca la clave del panel (SHA-256) y genera deploy_panel.zip aparte.
 * Uso: node scripts/obfuscate-panel-pass.mjs
 */
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  cpSync,
} from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const PASSWORD = "YZoatuWxwMqVzjq46s";
const HASH = createHash("sha256").update(PASSWORD, "utf8").digest("hex");

const panelJs = join(root, "public", "panel", "js", "panel.js");
let src = readFileSync(panelJs, "utf8");

const gateBlock = `const LANE_COUNT = 5
const API = '/api/ops/sessions'
/** Hash SHA-256 de la clave (no va en texto plano). */
const PANEL_PASSWORD_HASH = '${HASH}'
const PANEL_AUTH_KEY = 'ba_panel_auth_v1'

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

const gate = document.getElementById('panelGate')
const dash = document.getElementById('panelDash')
const gateForm = document.getElementById('panelGateForm')
const gateInput = document.getElementById('panelGateInput')
const gateError = document.getElementById('panelGateError')

function isPanelUnlocked() {
  try {
    return sessionStorage.getItem(PANEL_AUTH_KEY) === '1'
  } catch (_) {
    return false
  }
}

function unlockPanel() {
  try {
    sessionStorage.setItem(PANEL_AUTH_KEY, '1')
  } catch (_) {
    /* ignore */
  }
  if (gate) gate.hidden = true
  if (dash) dash.hidden = false
}

function showGate() {
  if (gate) gate.hidden = false
  if (dash) dash.hidden = true
  gateError && (gateError.hidden = true)
  window.setTimeout(() => gateInput?.focus(), 50)
}

if (!isPanelUnlocked()) {
  showGate()
} else {
  unlockPanel()
}

gateForm?.addEventListener('submit', (e) => {
  e.preventDefault()
  const value = String(gateInput?.value || '').trim()
  const btn = gateForm.querySelector('button[type="submit"]')
  if (btn) btn.disabled = true
  void sha256Hex(value)
    .then((hex) => {
      if (hex === PANEL_PASSWORD_HASH) {
        unlockPanel()
        startPanel()
        return
      }
      if (gateError) gateError.hidden = false
      if (gateInput) {
        gateInput.value = ''
        gateInput.focus()
      }
    })
    .catch(() => {
      if (gateError) {
        gateError.hidden = false
        gateError.textContent = 'No se pudo validar la clave'
      }
    })
    .finally(() => {
      if (btn) btn.disabled = false
    })
})
`;

if (!src.includes("const LANE_COUNT = 5")) {
  throw new Error("panel.js inesperado");
}

// Reemplaza desde LANE_COUNT hasta el cierre del submit listener original
const start = src.indexOf("const LANE_COUNT = 5");
const marker = "const emptyState = document.getElementById('emptyState')";
const end = src.indexOf(marker);
if (start < 0 || end < 0) {
  throw new Error("No se encontraron anclas en panel.js");
}
src = src.slice(0, start) + gateBlock + "\n" + src.slice(end);
writeFileSync(panelJs, src, "utf8");

// Carpeta staging solo panel ofuscado
const stage = join(root, ".panel-secure");
if (existsSync(stage)) rmSync(stage, { recursive: true, force: true });
mkdirSync(stage, { recursive: true });
cpSync(join(root, "public", "panel"), join(stage, "panel"), { recursive: true });

// También sincroniza out/panel si existe
const outPanel = join(root, "out", "panel");
if (existsSync(outPanel)) {
  cpSync(join(root, "public", "panel"), outPanel, { recursive: true });
}

const zipPath = join(root, "deploy_panel.zip");
const scriptPath = join(root, "scripts", "_zip-panel.ps1");
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
    "Write-Host 'PANEL ZIP OK'",
  ].join("\r\n"),
  "utf8",
);

execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}"`, {
  stdio: "inherit",
  cwd: root,
});

writeFileSync(
  join(root, "CLAVE-PANEL.txt"),
  [
    "Clave del panel (18 caracteres):",
    PASSWORD,
    "",
    "Sube SOLO deploy_panel.zip y descomprime en public_html",
    "(reemplaza la carpeta panel/).",
    "El sitio principal sigue en deploy_cpanel.zip.",
    "",
  ].join("\n"),
  "utf8",
);

console.log("OK: clave ofuscada + deploy_panel.zip");
