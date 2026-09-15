# Pinax 复用台账

## 来源

- 选定源：`/home/recoletas/jiuguan/pinax-integration-20260906`
- 分支/提交：`main` / `c70c3b4ae21ab4aa537227b73e2b20c2aa02824e`
- 导入方式：从独立 clone 检出固定提交和移动适配后，按维护者决定压为 Pinix 单一根提交；Git ancestry 不作为上游来源记录
- 远程：`pinax-upstream` 保持 fetch-only 语义；Pinix 使用 `origin` → `git@github.com:Recoletas/pinix.git`
- 独立性：`.git/objects/info/alternates` 不存在；目标不含指向源代码的符号链接
- 源状态：所选源工作区干净。初始 cwd 的旧集成树有未提交工作，因此未作为基线、未复制其私人 `LOCAL.md` 或未登记 diff。
- 基线环境：Node 22.22.3，npm 10.9.8，lockfile 原样安装
- 许可证：保留上游 `LICENSE`（PolyForm Noncommercial）与 `THIRD_PARTY_NOTICES.md`；本轮未换许可证

## 资产分类

| 上游资产 | 目标位置 | 分类 | 本轮差异 / 验证 |
|---|---|---|---|
| `src/pages/Authoring.vue`, `src/components/authoring/` | 原路径 | 适配 | 保留完整工作台；注入 durable persistence；Web build/原测试待终验 |
| `src/components/writing/`, `src/services/writing/` | 原路径 | 原样 | Tiptap、writing units、schema、repository、历史与导出不重写 |
| `src/services/agents/context/` | 原路径 | 原样 | compiler/manifest/authorization 完整保留；没有另造 mobile context |
| `src/services/agents/authoring/`, orchestrator/tool registry | 原路径 | 原样 | session/tool loop/SSE/取消/恢复完整保留 |
| Ghost/Block/Rehearsal/IF composables | 原路径 | 适配 | Ghost 采用增加 durable flush；其余合同不变 |
| `authoringKnowledgeQuerySession.js` | 原路径 | 原样 | 来源/scope/revision 保留；未宣称任意历史人物知识完整上线 |
| project/memory services | 原路径 | 原样 | 权威与候选分界保留；Mem0 服务请求改集中 origin |
| world store/components/context/import | 原路径 | 适配 | 数据和 UI 原样；研究 fetch 仅改服务 origin，三条导入未改 |
| media/source/archive | 原路径 | 适配 | 原 owner 保留；内置媒体代理集中 origin；文本导出增加 Android Share |
| `src/services/api.js`, server | 原路径 | 适配 | 所有核心 axios/SSE 走 runtime origin；Express/provider 仍独立运行 |
| `shared/` | 原路径 | 原样 | 合同无 Vue/原生依赖，完整迁入 |
| tests/scripts/build config | 原路径 | 适配 | 保留 20/200 预算与门禁；新增 mobile check/build/sync |
| responsive CSS / 390px authoring sheet | 原路径 | 原样 | 作为移动试验保留；不是 Android 真机通过证据 |
| Electron/协作/地图/漫画/游戏体验 | 原路径 | 暂不默认产品化 | 源码与依赖保留，避免拆断闭包；后续按入口和包体证据处理 |
| docs/skills/collaboration files | 原路径 | 适配 | 历史源码文档仍在 Git；当前 STATUS/PLAN/README 换为移动事实，新增三 skills |
| `src/platform/`, `android/`, Capacitor config | 新路径 | 新增 | 平台 adapter 与 Android 宿主；不拥有第二份业务模型 |
| `ios/` | 不存在 | 未建立 | 无 macOS/Xcode 证据，不建空目录冒充支持 |

## 未提交源差异政策

本轮没有从其他源工作区带入未提交代码。以后如需吸收 Pinax 修复，先 fetch 并固定上游 SHA；单根历史与上游没有共同祖先，因此在任务分支按补丁语义 cherry-pick 或生成 documented patch，并记录原提交、目标文件、语义差异和回归，不手工复制后抹去来源。

## 依赖与许可增量

新增 Capacitor 8 系列：core/cli/android、App、Filesystem、Keyboard、Share、StatusBar，均从 npm 锁定进 `package-lock.json`；版本选择遵守仓库 Node 22 约束并保持 core/android 同代。正式发布前仍需复核锁定版本的通知、Android 传递依赖和商店合规，更新 `THIRD_PARTY_NOTICES.md` 的生成口径。
