# Reading Steiner (命运探知) MVP

## 项目概述
本项目是“Reading Steiner”网页应用的 MVP 版本，演示了基于大语言模型（模拟）的人生世界线观测与模拟系统。

## 功能特性
1.  **Landing Page**: 极简科幻风格入口。
2.  **Mock Data Engine**: 内置唐纳德·特朗普的 1980-2024 关键事件树（包含史实与虚构分支）。
3.  **Gameplay**: 类似 Reigns 的卡牌滑动决策机制。
4.  **Worldline Map**: 使用 Cytoscape 可视化展示当前的世界线路径。

## 技术栈
- React
- TypeScript
- Tailwind CSS
- Framer Motion (动画)
- Cytoscape.js (图表)
- React Router (路由)

## 运行方式

1. 安装依赖:
   ```bash
   yarn install
   ```

2. 启动开发服务器:
   ```bash
   yarn dev
   ```

3. 打开浏览器访问 `http://localhost:5173`

## 交互说明
- 在首页输入框输入 "Donald Trump" (或直接点击 Go) 开始。
- 在游戏界面，**左滑**或**右滑**卡片进行选择。
- 点击右上角**地图图标**查看当前世界线进度。
