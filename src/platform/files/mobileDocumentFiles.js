import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { isNativePlatform } from '../runtime.js'

function safeFilename(filename) {
  return String(filename || 'pinax-export.txt').replace(/[\\/:*?"<>|]+/g, '_')
}

export async function exportTextDocument(content, filename, mimeType = 'text/plain;charset=utf-8') {
  if (!isNativePlatform()) return { ok: false, handled: false }
  const path = `exports/${Date.now()}-${safeFilename(filename)}`
  try {
    await Filesystem.writeFile({
      path,
      data: String(content ?? ''),
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
      recursive: true
    })
    const uri = await Filesystem.getUri({ path, directory: Directory.Cache })
    await Share.share({ title: safeFilename(filename), url: uri.uri, dialogTitle: '导出作品' })
    return { ok: true, handled: true, path, mimeType }
  } catch (error) {
    return { ok: false, handled: true, error }
  }
}
