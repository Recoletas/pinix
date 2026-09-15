# 验证与发布

## 证据等级

每个结论只标一个实际等级：未测、已实施、合同通过、Web 通过、Android sync 通过、APK 构建通过、Android 真机通过、真实模型样本通过。后一级不由前一级自动推出。

## 本地命令

```bash
npm ci
npm run doctor
npm run verify:full
npm run ci:authoring-smoke
npm run eval:authoring-context-lifecycle
npm run smoke:narrative-stream
npm run smoke:narrative-recovery
npm run mobile:check
npm run build:mobile
npm run mobile:sync
npm run mobile:android:debug
```

- `verify:full`：20 文件/200 用例预算、lint delta、Web build、diff check、VitePress build。
- `ci:authoring-smoke`：无 Key 合成作品主路径和隐私边界。
- context/stream/recovery：先看脚本是否需要本地 server/provider；fixture 只证明合同。
- `mobile:check`：本地资源、配置、remote、Android 工程和 skill 链接。
- `build:mobile` / `mobile:sync`：证明 Web 资源可打包和 Android 工程可同步，不证明 APK 或设备行为。
- `mobile:android:debug`：需 JDK/Android SDK；产物应为 `android/app/build/outputs/apk/debug/app-debug.apk`。

## 当前环境记录（2026-09-15）

Node 22.22.3、npm 10.9.8。继承基线与适配后 `npm ci`、doctor、verify:full 通过（20/20、200/200）。无 Key authoring smoke、context lifecycle 6/6、SSE/recovery fixture 通过；Capacitor add/sync 和 mobile build 通过。UI audit 为 55 captures、0 console errors、0 scenario failures，同时保留 20 个上游既有 a11y 告警，不能解释为无障碍全绿。

`./gradlew assembleDebug` 已实际执行并以 1 退出：`JAVA_HOME` 未设置且系统无 `java`。当前机器也未发现 Android SDK 或 adb，因此 APK 和真机为未测；不能提交空 APK 路径或把 sync 称为构建成功。

## 真机最小矩阵

| 场景 | 通过条件 |
|---|---|
| 无 Key/断网 | 作品、正文、资料、保存、备份/导出可用；AI 错误不拖垮输入 |
| 中文 IME | 组合输入不断字、不重复、不跳光标；AI 流不抢焦点 |
| 参照往返 | 查/改资料后回到原书、章、单元、选区和可解释滚动位置 |
| 切书/切章生成 | 迟到结果不写新目标；候选状态清楚 |
| 来源变化 | 采用前 revision 复核，旧候选不静默进入正文 |
| 范围授权 | 排除资料不能经工具旁路返回；未来参考不冒充已发生事实 |
| 保存失败/重复采用 | 明确未保存；重试不重复插入或副作用 |
| 前后台/强杀/升级 | 已确认保存恢复；待提交按恢复策略；迁移失败不覆盖旧数据 |
| 导入/恢复/导出 | ID/revision/结构兼容；媒体与来源是否包含说明准确 |
| 长篇性能 | 100章/约30万字合成书和长章记录冷启、切章、保存、首反馈 |
| 隐私 | 日志、截图、fixture、备份、诊断无 Key/非必要正文 |

记录设备型号、Android/WebView 版本、构建 SHA、方向、键盘、耗时与失败。缩小桌面浏览器不能代替真机。

## API 与真实模型

原生构建通过 `VITE_PINAX_API_ORIGIN=https://...` 注入 Pinax server 地址。正式只用 HTTPS；开发明文必须显式打开且不得进入发布配置。共享 Key 在 server，客户端日志/备份不回显。真实模型 smoke 需维护者授权、限定次数、使用合成稿并记录 provider/model/请求数；确定性 fixture 明确标注。

## 发布前门槛

1. 正式品牌、唯一包名、版本、图标；Android 签名和可重复升级安装。
2. 许可/第三方通知/团队新增贡献授权明确；当前 PolyForm Noncommercial 未改变。
3. 隐私说明与实际网络请求、第三方模型、权限、日志和训练政策一致。
4. Google Play 当时的 SDK、数据安全、内容、审核和支付规则重新核对；生成 APK 不等于可上架。
5. 若有账号，补项目授权、删除账号、同步冲突和服务端权限；若收费，不限制用户取回作品。
6. 演示用合成作品、失败降级、服务配置和手工验收清单。参赛材料分列既有 Pinax、本期新增和第三方；课程资格向老师/组委会确认。
7. iOS 只有在 macOS/Xcode 环境真实生成、签名和验证后建立状态；届时重新核对 Apple Review Guidelines。

当前 Android manifest 禁用系统自动备份，避免未经产品级加密/披露就把稿件和应用私有恢复快照带入云备份；未来若开放系统备份，必须先定义排除 Key、恢复兼容与用户说明。`*.jks`/`*.keystore` 被 Android `.gitignore` 明确排除。
