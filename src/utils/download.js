import { exportTextDocument } from '../platform/files/mobileDocumentFiles.js'
import { isNativePlatform } from '../platform/runtime.js'

/**
 * Download text content as a file via Blob + ObjectURL.
 * Shared by the current Authoring and backup/export flows.
 */

export function downloadTextFile(content, filename, mimeType = 'text/plain;charset=utf-8') {
  if (isNativePlatform()) return exportTextDocument(content, filename, mimeType)
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  return Promise.resolve({ ok: true, handled: true })
}

export function downloadJsonFile(data, filename) {
  const json = JSON.stringify(data, null, 2)
  return downloadTextFile(json, filename, 'application/json;charset=utf-8')
}

export function timestampForFilename() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${yyyy}${mm}${dd}-${hh}${mi}`
}
