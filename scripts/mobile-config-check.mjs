import { existsSync, lstatSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const failures = []
const checks = []

function check(name, condition, details = '') {
  checks.push({ name, ok: Boolean(condition), details })
  if (!condition) failures.push(`${name}${details ? `: ${details}` : ''}`)
}

const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
const capacitorConfig = readFileSync(resolve(root, 'capacitor.config.json'), 'utf8')
const nativeConfig = JSON.parse(capacitorConfig)
const productConfig = readFileSync(resolve(root, 'src/config/product.js'), 'utf8')
const networkConfig = readFileSync(resolve(root, 'src/platform/network/runtimeOrigin.js'), 'utf8')
const reuseLedger = readFileSync(resolve(root, 'docs/reuse-ledger.md'), 'utf8')
const androidManifest = readFileSync(resolve(root, 'android/app/src/main/AndroidManifest.xml'), 'utf8')
const androidIgnore = readFileSync(resolve(root, 'android/.gitignore'), 'utf8')

check('Capacitor core pinned with Android peer', packageJson.dependencies['@capacitor/core'] === packageJson.dependencies['@capacitor/android'])
check('mobile build uses local-assets mode', packageJson.scripts['build:mobile']?.includes('--mode mobile'))
check('Capacitor has no remote server.url', !/"url"\s*:/.test(capacitorConfig))
check('Android cleartext is not globally enabled', capacitorConfig.includes('"allowMixedContent": false'))
check('brand name stays aligned', productConfig.includes(`name: '${nativeConfig.appName}'`))
check('development app id stays aligned', productConfig.includes(`appId: '${nativeConfig.appId}'`))
check('native API origin rejects implicit cleartext', networkConfig.includes('VITE_PINAX_ALLOW_CLEARTEXT'))
check('Android project exists', existsSync(resolve(root, 'android/app/build.gradle')))
check('Android automatic cloud backup is disabled', androidManifest.includes('android:allowBackup="false"'))
check('Android signing material is ignored', androidIgnore.includes('*.jks') && androidIgnore.includes('*.keystore'))
check('reuse ledger pins an upstream SHA', /[0-9a-f]{40}/.test(reuseLedger))
check('clone has no object alternates', !existsSync(resolve(root, '.git/objects/info/alternates')))

for (const host of ['.agents', '.claude']) {
  const skillRoot = resolve(root, host, 'skills')
  for (const skill of ['commit-conventions', 'testing-verification', 'pinax-reuse-workflow', 'mobile-platform-workflow', 'harness-change-check']) {
    const target = resolve(skillRoot, skill)
    const linked = existsSync(target) && lstatSync(target).isSymbolicLink()
    check(`${host}/${skill} uses canonical skill link`, linked)
  }
}

checks.forEach(({ ok, name, details }) => console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${details ? ` — ${details}` : ''}`))
console.log(`\n${checks.length - failures.length}/${checks.length} mobile foundation checks passed`)
if (failures.length) process.exitCode = 1
