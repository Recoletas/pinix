import { App as CapacitorApp } from '@capacitor/app'
import { Keyboard } from '@capacitor/keyboard'
import { StatusBar, Style } from '@capacitor/status-bar'
import { flushNativeStorageMirror } from '../storage/nativeStorageMirror.js'
import { isNativePlatform } from '../runtime.js'

export async function installMobileLifecycle(router) {
  if (!isNativePlatform()) return () => {}
  document.documentElement.classList.add('pinax-native')
  await StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {})
  await StatusBar.setStyle({ style: Style.Default }).catch(() => {})

  const listeners = await Promise.all([
    CapacitorApp.addListener('appStateChange', async ({ isActive }) => {
      if (!isActive) await flushNativeStorageMirror()
    }),
    CapacitorApp.addListener('backButton', async () => {
      const event = new CustomEvent('pinax:mobile-back', { cancelable: true })
      if (!window.dispatchEvent(event)) return
      const persisted = await flushNativeStorageMirror()
      if (!persisted.ok) return
      if (window.history.length > 1) router.back()
      else await CapacitorApp.minimizeApp().catch(() => {})
    }),
    Keyboard.addListener('keyboardWillShow', ({ keyboardHeight }) => {
      document.documentElement.classList.add('pinax-keyboard-open')
      document.documentElement.style.setProperty('--pinax-keyboard-height', `${keyboardHeight}px`)
    }),
    Keyboard.addListener('keyboardWillHide', () => {
      document.documentElement.classList.remove('pinax-keyboard-open')
      document.documentElement.style.removeProperty('--pinax-keyboard-height')
    })
  ])
  return () => listeners.forEach((listener) => listener.remove())
}
