# Reading Steiner (命运探知) 代码结构文档

本文档详细介绍了项目的代码结构以及各个文件对应的功能模块。

## 目录结构概览

```
src/
├── assets/          # 静态资源
├── components/      # 通用 UI 组件
├── context/         # 全局状态管理 (React Context)
├── data/            # 模拟数据源
├── pages/           # 页面级组件 (路由页面)
├── App.tsx          # 根组件 & 路由配置
├── main.tsx         # 入口文件
├── types.ts         # TypeScript 类型定义
└── index.css        # 全局样式 (Tailwind)
```

## 核心文件与功能对应表

### 1. 核心逻辑与数据模型

| 文件路径 | 功能描述 | 关键代码/类型 |
| :--- | :--- | :--- |
| `src/types.ts` | **类型定义**。定义了游戏的核心数据结构，包括事件节点、选项、游戏状态等。 | `EventNode`, `Choice`, `GameState` |
| `src/data/mockData.ts` | **数据源**。存储了特朗普的人生事件树，包含史实（收束点）和虚构（变动点）分支。 | `MOCK_NODES` (JSON 树结构) |
| `src/context/GameContext.tsx` | **状态管理**。管理全局游戏状态（当前节点、历史路径、属性数值），提供状态更新方法。 | `GameContext`, `useGame`, `makeChoice` |

### 2. 页面视图 (Pages)

| 文件路径 | 功能描述 | 对应 UI/交互 |
| :--- | :--- | :--- |
| `src/pages/LandingPage.tsx` | **首页**。提供极简科幻风格的入口和搜索模拟。 | 搜索框、辉光特效标题 |
| `src/pages/LoadingPage.tsx` | **加载页**。模拟系统解析因果律的过程，作为转场动画。 | 进度条、打字机效果文案 |
| `src/pages/GamePage.tsx` | **游戏主界面**。核心玩法页，包含卡牌滑动交互和属性反馈。 | Framer Motion 卡牌堆叠、左右滑动手势 |
| `src/pages/MapPage.tsx` | **世界线地图**。可视化展示当前的时间线路径和已探索节点。 | Cytoscape.js 节点图 |

### 3. 组件 (Components)

| 文件路径 | 功能描述 | 依赖 |
| :--- | :--- | :--- |
| `src/components/StatusHud.tsx` | **状态显示栏**。显示财富、声望、健康、理智四个维度的数值。 | 接收 `stats` 对象，使用 Lucide 图标 |

### 4. 基础设施

| 文件路径 | 功能描述 |
| :--- | :--- |
| `src/App.tsx` | **路由配置**。定义了 URL 路径与页面的映射关系 (`/`, `/game`, `/map` 等)。 |
| `src/main.tsx` | **应用入口**。挂载 React 应用到 DOM。 |
| `src/index.css` | **全局样式**。引入 Tailwind CSS 指令，定义全局背景色和重置样式。 |

## 数据流向说明

1.  **初始化**: `GameContext` 加载 `mockData.ts` 中的 `root` 节点。
2.  **交互**: 用户在 `GamePage` 滑动卡牌 -> 调用 `GameContext.makeChoice`。
3.  **状态更新**:
    *   `currentNodeId` 更新为下一个节点 ID。
    *   `stats` 根据节点的 `status_effect` 进行增减。
    *   `history` 数组追加新的节点 ID。
4.  **反馈**:
    *   `GamePage` 重新渲染显示新卡牌。
    *   `StatusHud` 更新数值条。
    *   `MapPage` (如果打开) 重新计算并高亮新的路径。
