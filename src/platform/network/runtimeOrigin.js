import { isNativePlatform } from '../runtime.js'

function trimTrailingSlash(value) {
  return String(value || '').trim().replace(/\/+$/, '')
}

export function resolveApiOrigin(env = import.meta.env) {
  const configured = trimTrailingSlash(env?.VITE_PINAX_API_ORIGIN)
  if (!configured) return ''
  if (!/^https?:\/\//i.test(configured)) {
    throw new Error('VITE_PINAX_API_ORIGIN 必须是 http(s) URL')
  }
  const allowCleartext = String(env?.VITE_PINAX_ALLOW_CLEARTEXT || '') === 'true'
  if (isNativePlatform() && configured.startsWith('http://') && !allowCleartext) {
    throw new Error('移动端 API 必须使用 HTTPS；仅本地调试可显式启用明文地址')
  }
  return configured
}

export function resolveApiUrl(path, env = import.meta.env) {
  const normalizedPath = `/${String(path || '').replace(/^\/+/, '')}`
  return `${resolveApiOrigin(env)}${normalizedPath}`
}

export function resolveApiBaseUrl(env = import.meta.env) {
  return resolveApiUrl('/api', env)
}
