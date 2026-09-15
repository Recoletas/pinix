# 团队协作流程

## 第一次上手

1. 安装 Node 22，运行 `npm ci && npm run doctor`。
2. 阅读 `docs/STATUS.md`、`docs/architecture.md`、`docs/reuse-ledger.md` 和 `AGENTS.md`。
3. 从 `main` 建 `feat/<scope>-<task>` 或 `fix/<scope>-<task>`；在 STATUS 登记 owner、分支/worktree、写入文件、依赖和接口影响。
4. 先找到上游实现、数据 owner 和适用 skill，再写代码。无 Android SDK 也可完成 Web/合同切片，但不得标真机通过。

## 责任域与首批任务

| 责任 | 写入范围 | 首个可领取任务 | 验收 |
|---|---|---|---|
| 集成维护者 | 核心合同、lockfile、router、API、storage、Capacitor | 配置 SDK/签名占位，审查原生持久化接口 | 完整门禁+关键 owner review |
| 移动编辑 | writing editor、authoring 移动交互/CSS | 真机中文 IME/焦点回位，修一个实测问题 | 视频/截图+设备记录+回归 |
| 作品资料 | worldbook/outline/ideas 与往返 UI | 正文→改资料→返回选区并 durable 保存 | 真实点击旅程+错库保护 |
| AI 呈现 | context/reference/candidate/rehearsal UI | 手机候选审阅与本次参考，不新建 loop | harness 合同+迟到/取消 |
| 平台质量 | `src/platform`, Android, scripts, CI | debug APK、重启恢复、导入导出 | APK 路径+真机矩阵 |

人少可兼任，人多再拆；每人都提交实现、验证和交接，核心存储/harness 必须由维护者复核。

## Issue / PR / Commit

Issue 必须写：作者任务、范围与不做项、依赖、入口、读写数据、验收、负责人。一个 PR 是一个可运行切片，不把基线迁入、平台适配和多个 UI 重写压成不可审查提交。

Commit：`<type>(<scope>): <subject>`。保留上游历史和真实作者身份，不伪造组员/AI署名，不强推或改写公共历史。

PR 必须说明：

- 作者问题与入口；复用路径和新增差异；
- 唯一数据 owner、临时/正式写入、协议/迁移影响；
- 实跑命令、退出码、截图/设备、未测范围；
- 回滚方式与已知限制；
- 合成数据且无私人正文、Key、dump、证书。

共享高冲突文件（lockfile、router、shared contract、API origin、storage、Capacitor config）先由维护者协调。新增依赖说明必要性、维护状态、Node/Android 兼容、许可和包体，不重复引入编辑器、状态库、AI SDK 或存储层。

## Review 与合并

作者先自查，另一成员/维护者 review；CI 不替代真机。合并后更新 STATUS/PLAN/LOG/复用表中的单一事实，关闭任务并同步 main。交接只写改了什么、入口、owner、如何测、限制和下一项，不粘贴完整 Agent 日志。

真实 GitHub 用户名未知，因此暂不提交虚假 CODEOWNERS。配置成员账号后再由维护者建立真实责任映射和远程分支保护。

