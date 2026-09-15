# 移动产品与竞品输入

## 产品判断

Pinax Mobile 面向小说、网文、剧本和世界观创作者，是手机上能独立完成构思、正文、资料与交付的长篇工作台。AI 必须进入作者当前作品、范围与采用流程，而不是成为首页无上下文聊天。无账号、无 Key、无网络时，基础编辑、资料读取、保存与导出仍可用。

优先级：数据安全与 harness 正确性 → 复用 → 手机完整任务 → 团队可维护 → 品牌与商业能力。首期不做空订阅、平台收益后台、社区排行榜、全量云同步或自研模型叙事。

## 关键工作面合同

| 工作面 | 入口 | 读/写 owner | 焦点/保存/返回 | 手机与平板 |
|---|---|---|---|---|
| 正文 | 最近作品→Authoring | writing repository/document schema | mount 前恢复；正文保存需 durable ack；恢复原章/单元 | 手机正文主位+抽屉，平板可并列 |
| 人物/设定/大纲/灵感 | 正文工具或资料页 | book 绑定 worldbook、project services | 可编辑；回正文保持项目、章、选区/滚动 | 手机顺序页/底部 sheet，平板可参照并列 |
| 作品问答 | 当前作品/选文 | knowledge session + source catalog | 显示 scope/sourceRef/revision；引用可跳转再返回 | 调试 manifest 折叠 |
| 选文辅助 | 选区工具 | authoring session + Ghost transaction | 候选可编辑；明确采用后才写正文并 durable ack | 候选不覆盖键盘和正文 |
| 普通推演/比较 | 正文右侧工具 | rehearsal workflow + frozen session | 走法独立；比较不重跑；试稿归属明确 | 手机在正文后顺序展开，平板右栏 |
| 上下文控制 | 本次参考 | compiler/manifest authorization | 固定/排除/资料变化真实可核对 | 默认通俗，诊断详情折叠 |

正文事实、作者确认计划、未采纳灵感和备选走法不能混成“作品真相”。“截至这里”是资料时序边界，不承诺人物视角知识，除非证据模型实际支持。

## 赛题映射

演示主线：打开作品续写 → 查设定并跳回原文 → 选择截至这里 → 提交下一段意图 → 查看本次参考 → 原 harness 流式执行 → 编辑候选 → 确认采用 → 查看历史并导出。证据必须来自合成作品、真实 manifest/引用、取消与失败恢复、APK/设备记录；fixture 不能冒充真实模型。

既有 Pinax 与本期移动新增必须分列。大量复用是否符合课程“从零”或赛期工作量要求仍需向老师/组委会确认，不能靠改名或清历史隐藏来源。[赛题页面](https://www.swcontest.com.cn/topic/questionDetails?id=d6062b302f3446eb9906c6b85a3fdaed)

## 已核实竞品输入（2026-09-15）

| 产品 | 借鉴 | 不照搬 / 待人工验证 |
|---|---|---|
| [作家助手](https://apps.apple.com/cn/app/作家助手/id1044537226) | 写作现场悬浮参照、全书问答引用、未发布章节可编辑 | 不复制平台后台；组员核实 Android/中文输入 |
| [番茄作家助手](https://apps.apple.com/cn/app/番茄作家助手/id1560557075) | 草稿状态、保存、统计和写一章到交付一章 | 不伪装平台发布或收益能力 |
| [纯纯写作](https://play.google.com/store/apps/details?id=com.drakeet.purewriter&hl=zh) | 输入不中断、历史/备份、标点/快捷栏、查找替换 | “绝不丢失”只作产品目标，必须自己验证 |
| [橙瓜](https://apps.apple.com/cn/app/橙瓜/id1042545642) | 写到一半快速收灵感、大纲参照、误删恢复 | 社区、拼字、排行榜后置 |
| [Novelist](https://play.google.com/store/apps/details?id=it.returntrue.novelist&hl=en_US) | 手机独立 Plot/Write/Organize/Export，允许先写后补资料 | 备份不等于同步 |
| [Scrivener iOS](https://apps.apple.com/us/app/scrivener/id972387337) | 同一任务按手机/平板重构，研究资料往返 | 不把 iPad 并排假定成手机能力 |
| [Ulysses](https://ulysses.app/) | 克制主界面、连续写作、明确输出 | 不照搬 Apple 技术或收费 |
| [LivingWriter](https://guides.livingwriter.com/product-documentation/mobile-app-guide) | AI 从作品任务进入 | 移动能力需逐项真机核实，不移算官网总体功能 |
| [Campfire](https://campfirewriting.com/apps) | 手机保留多类设定编辑，简化大型可视化 | 不接受“手机必须在线”作为本项目默认 |
| [Novelcrafter Codex](https://www.novelcrafter.com/features/codex) | 别名、出现位置和 progression 说明长期状态价值 | 未核实原生手机 App，不宣称动态记忆独有 |

## 首批横评协议

成员用同一合成稿件测试作家助手、纯纯写作、Novelist：连续输入 20 分钟、打开参照并返回原位置、误删恢复、断网编辑、导出再导入。记录设备/版本、步骤数、耗时、焦点是否丢失、失败与恢复；营销页只作假设，不作通过证据。借鉴交互，不复制代码、图标、商标或素材。

