import { createWebHashHistory, createWebHistory } from 'vue-router'
import { isNativePlatform } from '../platform/runtime.js'

export function createPinaxRouterHistory(scope = globalThis) {
  return scope?.pinaxDesktop?.platform === 'desktop' || isNativePlatform()
    ? createWebHashHistory()
    : createWebHistory()
}
