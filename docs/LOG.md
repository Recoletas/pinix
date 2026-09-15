# Pinax Mobile 日志

## 2026-09-15 — 独立移动基线

- 选择干净且已验证的 Pinax `main@c70c3b4ae21ab4aa537227b73e2b20c2aa02824e`，导入完整源码树到 `/home/recoletas/Pinax`；无 alternates，源仓库未修改。
- 基线：Node 22.22.3、npm 10.9.8；`npm ci`、`npm run doctor`、`npm run verify:full` 通过（20/20 文件、200/200 用例、Web/docs build）。
- 安装同代 Capacitor 8.5.2 core/cli/android 及 App、Filesystem、Keyboard、Share、StatusBar；生成并同步 `android/`。
- 新增平台层：API origin、原生双槽校验快照、启动恢复、前后台/返回/键盘、安全区和分享导出。
- 写作自动保存和 Ghost 采用接入 durable flush；原生落盘失败不会显示已保存或清除待采用事务。
- 建立移动产品/竞争、架构、复用、团队、验证文档，重写新库 STATUS/PLAN/README；新增三个 canonical skills 和双客户端链接。
- 环境边界：未发现 Java、Android SDK、adb 或 Gradle，因此没有 APK 或真机结论；未使用任何模型 Key。
- 最终验证：`verify:full` exit 0（20/20、200/200、Web/docs build）；`ci:authoring-smoke` PASS；context lifecycle 6/6；stream/recovery PASS；`verify:mobile` 22/22 + mobile build；`cap sync android` 成功。
- 历史重建前的平台与核心链节点为 `46d5bfd feat(mobile): establish Android platform foundation`；其内容已并入 Pinix 根快照。
- `./gradlew assembleDebug` 实跑 exit 1，原因是 `JAVA_HOME` 未设置且系统无 `java`。UI audit 在启动 5173 后完成：55 captures、0 console errors、0 scenario failures、20 个上游既有 a11y 告警，详见 STATUS。

## 2026-09-15 — Pinix 单根仓库历史

- 按维护者明确决定，将 Pinix `main` 从上游继承历史改为单一根提交；此前 413 提交的本地安全引用为 `backup/pre-pinix-root-rewrite-20260915`，未推送该引用。
- 推送远端为 `origin` → `git@github.com:Recoletas/pinix.git`；`pinax-upstream` 保持 fetch-only 语义。
- Git ancestry 不再承载上游血缘；来源继续由固定基线 SHA、`LICENSE`、`THIRD_PARTY_NOTICES.md` 和 `docs/reuse-ledger.md` 追踪。运行时代码、依赖和平台接口未因历史重建而改变。
- CI 的 push diff 基准会检测旧提交可达性和共同祖先；首次 push 或历史重建时回退为空树检查，避免强推后的三点 diff 无 merge base。
