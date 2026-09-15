# Pinax Mobile

Pinax Mobile 是从 [Pinax](https://github.com/Recoletas/Pinax) 独立出来的移动优先长篇创作工作台。它不是 AI 聊天套壳或桌面查看器：不登录、不配置模型时仍可组织作品、编辑正文与资料、保存、备份和导出；启用 AI 后沿用 Pinax 的上下文编译、工具授权、冻结会话、可编辑候选和作者确认采用链路。

当前工程代号和包名是开发占位：`Pinax` / `dev.pinax.mobile`。正式品牌、包名和商店身份尚未决定。

## 当前真实状态

- Web：继承的完整产品可以开发运行，原基线 `verify:full` 为 20/20 文件、200/200 用例。
- Android：Capacitor 8 宿主已生成，前端资源本地打包，App/Filesystem/Keyboard/Share/StatusBar 插件已同步。
- 移动适配：原生双槽恢复快照、正文保存/候选采用的 durable flush、集中 API origin、系统返回/前后台/键盘基础生命周期、原生分享导出已接入。
- 未验收：APK 构建和 Android 真机（当前机器无 JDK/Android SDK/设备）；中文 IME、系统强杀、长章性能和真实模型移动链仍待设备验证。
- iOS、账号同步、付费和商店发布未建立。实验性的地图、漫画、体验、协作等源码仍保留，但不等于移动端已完成产品化。

详见 [当前状态](docs/STATUS.md)、[架构](docs/architecture.md)、[复用台账](docs/reuse-ledger.md) 与 [验证发布](docs/verification-and-release.md)。

## 环境

- Node `>=22.13.0 <23`（使用 `.nvmrc`）
- npm 10+
- Android 构建另需兼容 Capacitor 8 的 JDK 与 Android SDK；以 `android/variables.gradle` 和 Capacitor 官方文档为准

```bash
nvm use
npm ci
npm run doctor
```

无模型 Key 可以启动并使用本地写作能力：

```bash
npm run dev
# 可选，在另一个终端启动 AI/provider 代理
npm run server
```

## Web 与 Android

```bash
# Web 生产构建
npm run build

# 移动资源构建与配置检查
npm run verify:mobile

# 将最新 Web 资源和插件同步到 android/
npm run mobile:sync

# 已配置 JDK/Android SDK 后生成 debug APK
npm run mobile:android:debug
```

预期 APK：`android/app/build/outputs/apk/debug/app-debug.apk`。只有文件真实存在并安装到设备后才能标记 APK/真机通过。

原生 App 不把远程网页作为入口。AI 服务地址通过构建环境配置：

```bash
VITE_PINAX_API_ORIGIN=https://your-api.example npm run mobile:sync
```

设备上的 `localhost` 是设备自身。明文 HTTP 只允许显式本地调试：`VITE_PINAX_ALLOW_CLEARTEXT=true`；正式配置必须使用 HTTPS，且 Android 默认不开放全局 mixed content。

## 验证

```bash
npm run verify:full
npm run ci:authoring-smoke
npm run eval:authoring-context-lifecycle
npm run smoke:narrative-stream
npm run smoke:narrative-recovery
npm run verify:mobile
```

后四项中涉及服务或真实 provider 的命令应按 [验证发布说明](docs/verification-and-release.md) 区分 fixture、服务联通和真实模型证据，不擅自使用密钥或消耗额度。

## 数据与隐私

浏览器模式沿用 Pinax 的本地数据 owner。Android 启动前从应用私有目录的校验双槽快照恢复，并在关键保存/采用后等待落盘。该基础层降低 WebView 存储被回收风险，但尚不能替代真机强杀、升级、磁盘满和完整媒体恢复验证。

备份默认排除模型密钥。不要在 issue、日志、截图、fixture 或提交中放私人稿件、Key、完整 localStorage、签名证书或真实账号。

## 协作与来源

本仓库以单一根提交保存移动端初始快照；源码来源基线为 Pinax `c70c3b4ae21ab4aa537227b73e2b20c2aa02824e`，来源与适配分类记录在复用台账中。`pinax-upstream` 只用于读取上游更新，Pinix 的推送远端为 `origin`。

开始贡献前阅读 [CONTRIBUTING.md](CONTRIBUTING.md)、[团队流程](docs/team-workflow.md) 和 `AGENTS.md`。当前许可证仍为仓库中的 PolyForm Noncommercial；本次没有改许可证。商业发布与团队新增贡献的授权需维护者另行确认。
