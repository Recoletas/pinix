# Pinax Mobile 架构

## 原则与边界

移动产品复用 Pinax 业务内核，不维护第二份移动数据模型。布局可以重构，业务写入必须回到原 owner。平台层只翻译存储、文件、网络、生命周期和宿主能力。

```text
Vue 页面 / authoring 组件
        ↓
composable（任务与交互编排）
        ↓
领域服务 / transaction / repository（唯一业务 owner）
        ↓                         ↘
useStorage 同步工作集             compiler → manifest → authorization
        ↓                                      ↓
nativeStorageMirror durable ack        frozen run / orchestrator / stream
                                               ↓
                                       editable Ghost → explicit adoption
```

## 模块责任

| 责任 | 实际路径 | owner 规则 |
|---|---|---|
| 启动与路由 | `src/main.js`, `src/router/`, `src/layouts/AppShell.vue` | 原生用 hash history；启动恢复结束前不 mount |
| 正文与结构 | `src/components/writing/`, `src/services/writing/` | schema、unit ID、revision 和 repository 不在平台层复制 |
| 写作工作台 | `src/pages/Authoring.vue`, `src/components/authoring/`, `src/composables/useAuthoring*` | 现有正式入口；移动交互从组件切片演进，不复制整页 |
| 世界书与资料 | `src/stores/worldStore.js`, `src/components/worldbook/`, `src/services/worldbook*` | bookId→worldbookId 优先；active 仅显式回退 |
| AI 上下文 | `src/services/agents/context/` | eligibility/conflict/representation/packing 与 manifest 授权是唯一链路 |
| 会话与工具 | `src/services/agents/authoring/`, `narrativeAgentOrchestrator.js`, `narrativeToolRegistry.js` | 冻结目标、版本依赖、取消/迟到结果、工具身份不由移动 UI 绕过 |
| 候选采用 | `useAuthoringGhostAdoptionWorkflow.js` 及写作事务 | 候选不等于正文；显式采用、保护点、幂等重试、durable ack 后清候选 |
| 平台差异 | `src/platform/` | 不拥有 book/worldbook/candidate，只提供 capability adapter |
| Android 宿主 | `android/`, `capacitor.config.json` | 只加载 `dist` 本地资源；不配置远程 `server.url` |
| provider 服务 | `server/` | 共享 Key 和 provider 代理留服务端；移动 bundle 不引用 Node/Electron 实现 |

## 持久化决策 ADR-M001

现有 repository 依赖同步 `localStorage` 成功布尔值，直接替换为异步插件会让 Promise 被误判为成功并波及大量 owner。本轮采用渐进桥接：

1. localStorage 仍是进程内同步工作集，所有旧 owner 和 schema 不变。
2. Android 使用 Filesystem 应用私有 Data 目录写两份交替快照；每份有 schema、单调 revision 和内容校验值。模型/研究密钥配置与大体量二进制媒体明确排除，不被复制进恢复快照。
3. 启动 mount 前读取两槽中最新有效快照，只补回 WebView 工作集中缺失的键，不用旧快照覆盖仍存在的新值；一槽写坏仍可回退。
4. `setItem/setTextItem/removeItem` 安排后台镜像；正文“已保存”和 Ghost“已采用”额外等待显式 `flushNativeStorageMirror()`。
5. 落盘失败保留正文恢复稿或 pending adoption，重试不重新生成、不重复插入。

这是一条已接核心写作链的可靠迁移桥，不是“全部数据已具备数据库事务”的声明。下一阶段要让世界书、媒体索引和导入恢复逐 owner 返回异步提交回执；跨正文与资料的多 owner 更新仍需恢复日志或明确补偿策略。

## 网络决策 ADR-M002

`src/platform/network/runtimeOrigin.js` 是设备 API 地址唯一入口。Web 未配置时保持 `/api` 相对请求和 Vite 代理；原生通过 `VITE_PINAX_API_ORIGIN` 指向可达 HTTPS 服务。axios、SSE fetch、Mem0、世界书研究和内置媒体网关均使用同一解析器。原协议的 AbortSignal、requestId/toolCallId 和 SSE reducer 保留。

服务端 base URL 与模型 provider base URL 是两个概念：前者定位 Pinax 代理，后者仍在原模型配置合同中。客户端哨兵 Key 不替代服务端授权、限流或项目权限。

## 生命周期决策 ADR-M003

- native 启动先恢复，避免空状态先渲染后覆盖。
- App 进入后台与系统返回先 flush；自定义 `pinax:mobile-back` 可由上层抽屉/对话框拦截。
- Keyboard 事件只提供根 class 和高度变量，不在输入组合态重建编辑器。
- pagehide/visibilitychange 继续保留，但不宣称系统强杀必有回调。
- Android 文件导出写 Cache 后调用系统 Share；Web 保留 Blob 下载。

## Harness 不变量

```text
明确书/章/单元/意图
→ 有来源/版本的候选资料
→ eligibility / conflict / representation / character packing
→ CompiledContextManifest + tool authorization
→ frozen run + tool loop + SSE/cancel
→ validated editable candidate
→ live dependency recheck
→ explicit adoption transaction
→ durable persistence confirmation
→ history / observer / derived state
```

`totalChars` 是字符预算，不是精确 token。正文已发生事实、已确认计划、未采纳灵感和备选走法保持原 representation/authority 边界；“截至本章”不自动等价于人物知识。

## 能力开关与品牌

品牌开发值在 `src/config/product.js`，原生 manifest 在 `capacitor.config.json`；`mobile:check` 防止二者关键值漂移（正式换品牌仍应集中提交）。大型地图、漫画/画布、体验和多人协作源码保留，移动发布入口是否开放由后续真实适配证据决定，不能以删代码换轻量。
