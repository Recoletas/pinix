import { Capacitor } from '@capacitor/core'

export function isNativePlatform() {
  return Capacitor.isNativePlatform()
}

export function currentPlatform() {
  return Capacitor.getPlatform()
}
