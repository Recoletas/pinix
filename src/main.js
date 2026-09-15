import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useWorkspaceTabsStore } from './stores/workspaceTabsStore'
import { installWorkspaceRouteAdapter } from './services/workspace/workspaceRouteAdapter'
import { installMobileLifecycle } from './platform/lifecycle/mobileLifecycle.js'
import { installNativeStorageMirror } from './platform/storage/nativeStorageMirror.js'
import './styles/main.css'
import './styles/themes/legacy.css'
import './styles/experience-reading.css'
import './styles/workbench-controls.css'
import './styles/mobile-native.css'

async function bootstrap() {
  const storageMirror = installNativeStorageMirror()
  const hydration = await storageMirror.hydrate()
  if (!hydration.ok) throw hydration.error || new Error('移动存储恢复失败')

  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)

  // 工作台标签会话与路由双向同步：AppShell 只消费 store，导航真源仍是 URL。
  installWorkspaceRouteAdapter(useWorkspaceTabsStore(pinia), router)
  await router.isReady()
  await installMobileLifecycle(router)
  app.mount('#app')
}

bootstrap().catch((error) => {
  console.error('[bootstrap] failed', error)
  const root = document.querySelector('#app')
  if (root) root.textContent = '启动失败：无法安全读取本地作品。请重启应用或导入备份。'
})
