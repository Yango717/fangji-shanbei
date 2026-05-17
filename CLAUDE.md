# 方剂闪背 — 项目指引

## 项目简介

一个 Web App，帮助中医学生高效记忆方剂。支持翻转卡片学习、错题追踪、进度统计。

**用户身份**：中医学生，产品需简洁易用。

---

## 技术栈

- Vite 6 + Vue 3 (Composition API)
- Vue Router 4 (Hash 模式)
- Pinia + localStorage（状态持久化）
- 纯 CSS + CSS Variables（国风配色）

---

## 文档索引

| 文档 | 路径 | 说明 |
|------|------|------|
| 设计规范 | [docs/design-spec.md](docs/design-spec.md) | 配色、字体、组件样式 |
| 技术选型 | [docs/tech-stack.md](docs/tech-stack.md) | 技术栈与版本 |
| 开发流程 | [docs/dev-process.md](docs/dev-process.md) | 阶段定义、验证标准 |
| 需求规格 | [docs/requirements.md](docs/requirements.md) | 功能需求 |
| 开发日志 | [devlogs/](devlogs/) | 每日开发记录 |

---

## 工作原则

1. **小步推进**：一次只做一个 Phase，完成并验证后再做下一个
2. **保持可运行**：每个 Phase 结束后 `npm run dev` 必须正常启动
3. **配色严格遵循**：CSS 变量定义在 `src/assets/styles/variables.css`
4. **不得主动提交 git**：只有用户明确要求时才 commit
5. **会话结束前**：将完成和待办事项追加写入 `devlogs/YYYY-MM-DD.md`

---

## 开发阶段

- **Phase 0**：项目脚手架 ✅ 进行中
- **Phase 1**：数据层（100 首方剂 + Store）
- **Phase 2**：着陆页
- **Phase 3**：学习卡片页（核心）
- **Phase 4**：错题本
- **Phase 5**：收尾（动画 + 响应式 + Favicon）
- **Phase 6**：项目文档

---

## 启动命令

```bash
cd d:/方剂闪背
npm run dev
```
