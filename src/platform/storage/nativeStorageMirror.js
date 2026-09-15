import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import { isNativePlatform } from '../runtime.js'

const SNAPSHOT_SCHEMA_VERSION = 1
const SNAPSHOT_FILES = Object.freeze(['pinax-state-a.json', 'pinax-state-b.json'])
const EXCLUDED_KEYS = new Set([
  'apiSettings',
  'text_model_configs',
  'image_model_configs',
  'video_model_configs',
  'mem0_settings',
  'worldbook_research_settings_v1',
  'media_assets_v1',
  'comic_pages_v1',
  'prose_image_library',
  'poetry_image_library_v1'
])
let activeMirror = null

function checksum(text) {
  let hash = 2166136261
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

function readStorage(storage) {
  const values = {}
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index)
    if (key !== null && !EXCLUDED_KEYS.has(key)) values[key] = storage.getItem(key)
  }
  return values
}

function encodeSnapshot(values, revision) {
  const payload = JSON.stringify({ schemaVersion: SNAPSHOT_SCHEMA_VERSION, revision, values })
  return JSON.stringify({ payload, checksum: checksum(payload) })
}

function decodeSnapshot(raw) {
  try {
    const envelope = JSON.parse(String(raw || ''))
    if (!envelope?.payload || checksum(envelope.payload) !== envelope.checksum) return null
    const snapshot = JSON.parse(envelope.payload)
    if (snapshot.schemaVersion !== SNAPSHOT_SCHEMA_VERSION || !snapshot.values) return null
    return snapshot
  } catch {
    return null
  }
}

export function createNativeStorageMirror({
  filesystem = Filesystem,
  storage = globalThis.localStorage,
  native = isNativePlatform()
} = {}) {
  let revision = 0
  let timer = null
  let queued = false
  let running = Promise.resolve({ ok: true, skipped: true })

  async function readSlot(path) {
    try {
      const result = await filesystem.readFile({ path, directory: Directory.Data, encoding: Encoding.UTF8 })
      return decodeSnapshot(result.data)
    } catch {
      return null
    }
  }

  async function hydrate() {
    if (!native) return { ok: true, skipped: true, reason: 'web-storage' }
    const snapshots = (await Promise.all(SNAPSHOT_FILES.map(readSlot))).filter(Boolean)
    const latest = snapshots.sort((left, right) => right.revision - left.revision)[0]
    if (!latest) return { ok: true, restored: false, revision: 0 }
    // WebView localStorage remains the live working set. Never overwrite a
    // newer surviving value with an older recovery snapshot; only repair keys
    // that are absent after startup/storage eviction.
    for (const [key, value] of Object.entries(latest.values)) {
      if (storage.getItem(key) === null) storage.setItem(key, String(value))
    }
    revision = Number(latest.revision || 0)
    return { ok: true, restored: true, revision }
  }

  async function writeNow() {
    if (!native) return { ok: true, skipped: true, reason: 'web-storage' }
    revision += 1
    const path = SNAPSHOT_FILES[revision % SNAPSHOT_FILES.length]
    try {
      await filesystem.writeFile({
        path,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
        data: encodeSnapshot(readStorage(storage), revision),
        recursive: true
      })
      return { ok: true, revision, path }
    } catch (error) {
      revision -= 1
      return { ok: false, error, code: 'NATIVE_STORAGE_WRITE_FAILED' }
    }
  }

  function flush() {
    if (timer) clearTimeout(timer)
    timer = null
    queued = false
    running = running.then(writeNow, writeNow)
    return running
  }

  function schedule() {
    if (!native || queued) return
    queued = true
    timer = setTimeout(flush, 250)
  }

  return Object.freeze({ flush, hydrate, schedule })
}

export function installNativeStorageMirror(options = {}) {
  activeMirror = createNativeStorageMirror(options)
  return activeMirror
}

export function scheduleNativeStorageMirror() {
  activeMirror?.schedule()
}

export async function flushNativeStorageMirror() {
  if (!activeMirror) return { ok: true, skipped: true, reason: 'not-installed' }
  return activeMirror.flush()
}
