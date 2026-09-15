# Pinax Mobile 状态

更新时间：2026-09-15

## 当前基线

- 仓库：`/home/recoletas/Pinax`
- 分支：`main`（Pinix 单根提交主线，不跟踪 Pinax 上游分支）
- 上游：`pinax-upstream` → `https://github.com/Recoletas/Pinax.git`
- 推送远端：`origin` → `git@github.com:Recoletas/pinix.git`
- 继承提交：`c70c3b4ae21ab4aa537227b73e2b20c2aa02824e`
- 当前写锁：集成维护者；范围为移动平台 adapter、Android、核心保存接缝、文档与协作基础
- 禁止：向 `pinax-upstream` push；改写 `origin`、部署、付费调用、换许可证或商店发布均需维护者明确处理
- 历史策略：按维护者决定，Pinix `main` 从单一根提交开始；上游来源通过固定 SHA、许可、通知和复用台账追踪

## 已实施

- 从固定 Pinax 基线导入完整源码树后压为独立根提交，无 Git alternates；源仓库未修改。
- 全量生产源码、server/shared、测试、脚本、文档和 canonical skills 继承。
- Capacitor 8 Android 宿主、本地资源构建、hash history 和五个原生插件。
- `src/platform/`：网络 origin、双槽原生持久化镜像、生命周期、分享导出。
- 正文自动保存与 Ghost 采用在成功提示/清候选前等待原生 durable flush；失败保留恢复稿或 pending adoption。
- `/api` 的 axios、流式 fetch、Mem0、研究、内置图片与视频网关统一经运行时 origin。
- 新仓库协作规范、三个移动 skills、文档和 CI 移动检查。

## 验证状态

| 项目 | 状态 |
|---|---|
| 继承基线 `npm ci` / `doctor` / `verify:full` | 通过；20 文件 / 200 用例 |
| 移动 Web build | 通过 |
| `cap add android` / `cap sync android` | 通过 |
| 原生快照合同 | 通过；双槽最新 revision 恢复断言并入既有测试 |
| 无 Key 作者 smoke | 通过；导入→编辑标题→进入正文→刷新恢复 |
| 上下文/流式/恢复 fixture | 通过；context 6/6，SSE/tool/error 与 abort/late-result 均通过 |
| UI 自动审计 | 55 截图、0 console、0 scenario；20 个继承 a11y 告警未修 |
| APK build | 未测：本机无 Java/Android SDK |
| Android 真机、中文 IME、系统强杀 | 未测：无设备环境 |
| 真实模型移动链 | 未测：本轮未读取 Key、未调用付费渠道 |

## 最高风险

1. 双槽快照已接正文关键确认点，但世界书和所有旧调用者尚未逐一提升为显式异步提交回执；大体量二进制媒体与密钥配置有意排除，不能宣传完整原生事务或全量媒体恢复。
2. Capacitor WebView 对 Tiptap 的中文组合输入、长按、键盘和系统返回仍需真机验证。
3. API origin 已统一主要调用面，仍需在后续新增 endpoint 时由 `mobile-platform-workflow` 门禁防止回流相对地址。
4. Android 包名、品牌、JDK/SDK、签名、远程仓库和团队授权均未决定。
5. UI audit 的既有告警：散文页五档宽度各 1 个裁切；漫画、结构化设定、地图空态五档宽度键盘不可达。它们不是本轮新增，但属于移动打磨待办。

## 下一步领取

- M1 编辑体验：真实 Android 中文 IME、长章、前后台和焦点回位，修至少一个实测问题。
- M2 资料联动：正文→人物/设定编辑→返回原选区；验证设定保存的 durable 状态。
- M3 AI 呈现：手机本次参考/来源/候选审阅与迟到结果，不另造 loop。
- M4 平台质量：配置 SDK，构建并安装 debug APK，执行重启/磁盘失败/备份恢复矩阵。
- M5 产品横评：作家助手、纯纯写作、Novelist 使用同一合成稿件记录步骤和失败。
