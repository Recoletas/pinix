## 作者任务

<!-- 这个 PR 解决写作者的什么问题？ -->

## 改动内容

<!-- 入口文件/命令；读哪些数据；哪些是会话内临时状态、哪些落盘 -->

## 复用与平台差异

<!-- 上游/现有实现路径；唯一 owner；为何需要新增 adapter；Web/Android 差异 -->

## 验证范围

<!-- 按 CONTRIBUTING 的表格勾选实际执行的检查 -->

- [ ] `npm run test:run`
- [ ] `npm run lint:delta`
- [ ] `npm run build`
- [ ] `npm run verify:full`
- [ ] `npm run verify:mobile`（移动改动）
- [ ] `npm run mobile:sync`（Android/Capacitor 改动）
- [ ] APK/真机设备与版本已记录；若未测，在限制中明确写出
- [ ] UI 改动附前后对比截图（1440 + 窄屏或深色）
- [ ] 模型功能：mock 与真实样本分开说明

## 数据边界

- [ ] 截图与描述不含私人书稿内容、真实密钥、全量浏览器 dump

## 迁移、回滚与已知限制

<!-- 数据/协议变化如何迁移和回退；fixture/Web/sync/APK/真机/真实模型证据分开 -->
