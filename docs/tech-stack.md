# 方剂闪背 — 技术选型

## 技术栈

| 层 | 技术 | 版本 |
|----|------|------|
| 构建工具 | Vite | 8.x |
| 前端框架 | Vue 3 (Composition API) | 3.x |
| 路由 | Vue Router | 4.x |
| 状态管理 | Pinia | 3.x |
| 持久化 | localStorage（浏览器原生） | — |
| 样式 | 纯 CSS + CSS Variables | — |

## 选型理由

### Vite
- 开发服务器秒级启动，HMR 极快
- 生产构建基于 Rollup，产出体积小
- 零配置支持 Vue SFC

### Vue 3 Composition API
- 响应式系统天然适合卡片状态管理（翻转、评分、进度）
- `<script setup>` 语法简洁
- 单文件组件 (SFC) 保持模板/逻辑/样式内聚

### Vue Router (Hash 模式)
- SPA 路由，无页面刷新
- Hash 模式无需服务器配置，适合静态部署
- 路由懒加载减小首屏体积

### Pinia
- Vue 3 官方推荐的状态管理库
- 轻量，TypeScript 友好
- Composition API 风格，与 Vue 3 完美集成

### 纯 CSS + CSS Variables
- 无额外构建依赖
- CSS Variables 实现国风色板，一键换主题
- 保持项目简洁，降低维护成本

## 项目结构

```
src/
├── main.js              # 应用入口
├── App.vue              # 根组件
├── router/              # 路由配置
├── stores/              # Pinia 状态管理
├── views/               # 页面组件
├── components/          # 可复用组件
├── composables/         # 组合式函数
├── data/                # 静态数据
└── assets/styles/       # 全局样式
```

## 关键设计决策

1. **无 TypeScript**：保持简单，降低维护门槛
2. **无 HTTP 请求库**：纯静态数据，无后端依赖
3. **Hash 路由**：`createWebHashHistory()` 避免部署时的服务器配置
4. **localStorage 持久化**：进度和错题数据存储在浏览器本地
