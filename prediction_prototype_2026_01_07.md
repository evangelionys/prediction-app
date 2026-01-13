# Probable - 预测平台原型文档

**版本日期**: 2026-01-07  
**项目名称**: Probable Prediction Platform  
**版本号**: 1.0.0

---

## 📋 目录

1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [项目结构](#项目结构)
4. [核心功能](#核心功能)
5. [组件列表](#组件列表)
6. [数据模型](#数据模型)
7. [UI/UX特性](#uiux特性)
8. [部署信息](#部署信息)
9. [版本历史](#版本历史)
10. [待办事项](#待办事项)

---

## 项目概述

Probable 是一个基于 React 的预测平台应用，允许用户参与预测、贡献驱动因素和机会、追踪个人认知能力成长，并与社区互动。

### 核心价值主张

- **认知能力可视化**: 通过 Cognitive Profile（认知档案）雷达图展示用户的6个认知维度
- **AI智能分析**: 基于用户行为数据提供个性化的AI洞察和建议
- **社区协作**: 通过 Drivers（驱动因素）和 Opportunities（机会）促进集体推理
- **社交功能**: 排行榜、关注系统、用户互动等社交元素

---

## 技术栈

### 前端框架
- **React 18.2.0**: UI框架
- **Vite 4.5.14**: 构建工具和开发服务器

### 样式
- **Tailwind CSS 3.3.3**: 实用优先的CSS框架
- **PostCSS 8.4.27**: CSS后处理器
- **Autoprefixer 10.4.14**: 自动添加浏览器前缀

### 图标库
- **Lucide React 0.263.1**: 图标组件库

### AI集成
- **Google Gemini API**: AI聊天和分析功能

### 部署
- **Vercel**: 生产环境部署平台

---

## 项目结构

```
prediction-app/
├── src/
│   ├── App.jsx                    # 主应用组件，包含路由和状态管理
│   ├── main.jsx                   # React应用入口
│   ├── index.css                  # 全局样式和动画
│   └── components/
│       ├── FeedView.jsx           # Signal Tab - 预测流视图
│       ├── SearchView.jsx         # 搜索功能视图
│       ├── FollowedView.jsx       # Followed Tab - 关注内容视图
│       ├── TrendView.jsx          # Trend Tab - 排行榜视图
│       ├── MyGrowthView.jsx       # Me Tab - 个人成长视图（基础版）
│       ├── MyGrowthView.basic-1222.jsx    # Me Tab - 基础版本
│       ├── MyGrowthView.cognition-1222.jsx # Me Tab - 认知版本（当前使用）
│       ├── UserProfileView.jsx    # 用户主页视图
│       ├── DetailPage.jsx         # 预测详情页
│       ├── NewsDetailPage.jsx     # 新闻详情页
│       ├── SettledDetailPage.jsx  # 已结算预测详情页
│       ├── PredictionCard.jsx     # 预测卡片组件
│       ├── DriverCard.jsx         # 驱动因素卡片
│       ├── OpportunityCard.jsx    # 机会卡片
│       ├── CommentCard.jsx        # 评论卡片
│       ├── DriversListView.jsx    # 驱动因素列表
│       ├── OpportunitiesListView.jsx # 机会列表
│       ├── AIChatView.jsx         # AI聊天视图
│       ├── CollectiveReasoningView.jsx # 集体推理视图
│       ├── AddDriverView.jsx      # 添加驱动因素视图
│       └── GenericListView.jsx    # 通用列表视图
├── index.html                     # HTML入口文件
├── package.json                   # 项目配置和依赖
├── vite.config.js                 # Vite配置
├── tailwind.config.js             # Tailwind配置
├── postcss.config.js              # PostCSS配置
├── vercel.json                    # Vercel部署配置
└── README.md                       # 项目说明文档
```

---

## 核心功能

### 1. Signal Tab（预测流）

- **预测卡片浏览**: 显示所有预测题，支持分类筛选（Latest, Business, Politics, Tech）
- **搜索功能**: 可搜索预测题和新闻
- **预测详情**: 点击卡片查看详细信息，包含4个Tab：
  - Question: 预测问题和投票统计
  - Reasoning: 驱动因素（Drivers）列表
  - Opportunities: 机会（Opportunities）列表
  - Discussions: 评论和讨论

### 2. Followed Tab（关注）

- **关注的预测题更新**: 显示关注的预测题的最新动态
  - 新驱动因素（Driver）
  - 新机会（Opportunity）
  - 投票比例大幅变化
- **关注的用户动态**: 显示关注用户的活动
  - 发表新驱动因素
  - 发表新机会
  - 进行预测
  - 发表评论

### 3. Trend Tab（排行榜）

包含三个排行榜：

#### Influence Leaderboard（影响力榜）
- 根据用户贡献的 Drivers 和 Opportunities 获得的投票数排名
- 支持分类筛选（All, Business, Politics, Tech）
- 支持时间筛选（This Month, Last Month, 2 Months Ago, 3 Months Ago）
- 显示用户自己的数据对比（底部固定）

#### Accuracy Leaderboard（准确率榜）
- 根据用户预测准确率排名，相同准确率时按预测数量排序
- 包含AI模型对比（Miromind, Gemini-3, Claude-4, GPT-5）
- AI模型有特殊标识和样式
- 支持分类和时间筛选
- 显示用户自己的数据对比（底部固定）

#### Momentum Leaderboard（动量榜）
- 显示本周被社区认同度最高的机会
- 支持分类筛选
- 支持时间筛选（This Week, Last Week, 2 Weeks Ago, 3 Weeks Ago）
- 点击机会可跳转到对应预测题的 Opportunities Tab

### 4. Me Tab（个人主页）

#### Cognitive Profile（认知档案）
- **6维度雷达图**:
  - Breadth（广度）: 参与预测的总数
  - Versatility（多样性）: 覆盖的领域/标签数量
  - Accuracy（准确率）: 预测正确率
  - Conviction（信念度）: 正确预测的平均置信度
  - Influence（影响力）: 粉丝数、贡献获得的投票数
  - Judgment（判断力）: 投票行为和贡献数量
- **等级系统**:
  - Core（核心）: 平均分 < 4
  - Advanced（高级）: 平均分 4-7
  - Expert（专家）: 平均分 ≥ 7
- **动态大脑背景**: 根据等级显示不同样式和颜色
- **维度详情**: 点击维度可查看详细解释和趋势图

#### AI Insight（AI洞察）
- **Behavioral Pattern（行为模式）**: 分析用户的预测行为模式
- **Exclusive Opportunity（专属机会）**: 基于能力模型匹配的预测题推荐
- **深度分析**: 点击进入AI聊天界面，可进行对话式分析
- **历史记录**: 显示近3天的AI洞察内容

#### Activities（活动记录）
三个Tab分类显示：
- **Prediction**: 预测历史，显示top 2选项及百分比
- **Contribution**: 贡献的 Drivers 和 Opportunities，显示投票数和相关预测题
- **Interaction**: 投票历史，显示投票对象和相关预测题

#### 用户信息
- 头像、姓名、简介
- 粉丝数、关注数
- ~~徽章系统（当前已隐藏）~~

### 5. 用户主页（客态）

- 查看其他用户的个人主页
- 显示用户的 Cognitive Profile
- 显示用户的 Activities
- **不显示** AI Insight（客态隐藏）
- 支持关注/取消关注
- 支持分享

### 6. 搜索功能

- 从 Signal Tab 访问
- 两个Tab：
  - Predictions: 搜索预测题问题
  - News: 搜索新闻标题
- 实时搜索过滤
- 点击结果跳转到详情页

### 7. AI功能

- **AI聊天**: 在预测详情页可调用AI助手分析
- **AI Insight**: 个人成长分析
- **Logic Chain**: 机会的推理链展示
- 使用 Gemini API 实现

---

## 组件列表

### 页面级组件

| 组件 | 说明 | 主要功能 |
|------|------|----------|
| `FeedView` | Signal Tab主视图 | 预测流、搜索入口、分类筛选 |
| `SearchView` | 搜索页面 | 预测题和新闻搜索 |
| `FollowedView` | Followed Tab主视图 | 关注内容更新 |
| `TrendView` | Trend Tab主视图 | 三个排行榜 |
| `MyGrowthView.cognition-1222` | Me Tab主视图（当前版本） | 个人成长、认知档案 |
| `UserProfileView` | 用户主页 | 其他用户的个人主页 |
| `DetailPage` | 预测详情页 | 预测题详细信息 |
| `NewsDetailPage` | 新闻详情页 | 新闻内容 |
| `SettledDetailPage` | 已结算详情页 | 已结束的预测结果 |

### 卡片组件

| 组件 | 说明 |
|------|------|
| `PredictionCard` | 预测卡片 |
| `DriverCard` | 驱动因素卡片 |
| `OpportunityCard` | 机会卡片 |
| `CommentCard` | 评论卡片 |

### 功能组件

| 组件 | 说明 |
|------|------|
| `AIChatView` | AI聊天界面 |
| `CollectiveReasoningView` | 集体推理视图 |
| `AddDriverView` | 添加驱动因素 |
| `DriversListView` | 驱动因素列表 |
| `OpportunitiesListView` | 机会列表 |
| `GenericListView` | 通用列表视图 |

---

## 数据模型

### 预测题（Prediction）

```javascript
{
  id: number,
  category: "Politics" | "Tech" | "Business" | "Space",
  newsTitle: string,
  question: string,
  imageGradient: string,
  stats: { yes: number, no: number },
  trending: 'yes' | 'no',
  followers: number,
  drivers: number,
  timeLeft: string
}
```

### 用户档案（User Profile）

```javascript
{
  name: string,
  handle: string,
  bio: string,
  avatar: string,
  followers: number,
  following: number,
  badges: Array<{
    type: 'identity' | 'achievement',
    label: string,
    level: number,
    icon: string,
    color: string
  }>
}
```

### 认知维度（Cognitive Dimensions）

```javascript
{
  breadth: { score: number, explanation: string },
  versatility: { score: number, explanation: string },
  accuracy: { score: number, explanation: string },
  conviction: { score: number, explanation: string },
  influence: { score: number, explanation: string },
  judgment: { score: number, explanation: string }
}
```

### 驱动因素（Driver）

```javascript
{
  id: number,
  title: string,
  content: string,
  author: string,
  votes: number,
  timestamp: string,
  reasoningChain?: string
}
```

### 机会（Opportunity）

```javascript
{
  id: number,
  title: string,
  content: string,
  action: string,
  author: string,
  votes: number,
  confidence?: number,
  reasoningChain?: string
}
```

---

## UI/UX特性

### 设计风格

- **现代简约**: 白色背景，清晰的层次结构
- **科技感**: 使用渐变、发光效果、网格背景等元素
- **移动优先**: 响应式设计，适配移动端和桌面端

### 颜色系统

- **主色调**: 青色（Cyan #06b6d4）
- **次要色**: 紫色（Purple #8b5cf6）
- **成功色**: 绿色（Emerald #10b981）
- **警告色**: 黄色（Yellow #f59e0b）
- **错误色**: 红色（Red #ef4444）

### 动画效果

- `float-animation`: 浮动动画
- `pulse-glow`: 脉冲发光
- `scan-line`: 扫描线效果
- `grid-background`: 网格背景
- `hover-glow`: 悬停发光

### 交互设计

- 卡片悬停效果
- 平滑过渡动画
- 点击反馈
- 加载状态提示

---

## 部署信息

### 部署平台

- **Vercel**: 生产环境部署
- **部署URL**: 
  - 主URL: https://prediction-app-lovat.vercel.app
  - 备用URL: https://prediction-kvv4s3nn1-evans-projects-722b62fc.vercel.app

### 部署配置

- **构建命令**: `npm run build`
- **输出目录**: `dist`
- **框架**: Vite
- **路由配置**: SPA路由重写规则已配置

### 环境要求

- Node.js 18+
- npm 或 yarn

---

## 版本历史

### 2026-01-07 (当前版本)

#### 主要更新

1. **品牌重命名**: Predix → Probable
2. **Cognitive Profile**: 
   - 名称从 "Cognitive Radar" 改为 "Cognitive Profile"
   - 维度名称: Analysis → Judgment
   - 等级名称: Normal → Core, Master → Expert
3. **徽章系统**: 已隐藏（待后续启用）
4. **Me页面版本**: 使用 `cognition-1222` 版本

#### 功能特性

- ✅ 完整的4个Tab导航（Signal, Followed, Trend, Me）
- ✅ Cognitive Profile 雷达图（6维度）
- ✅ AI Insight 功能
- ✅ Activities 分类（Prediction, Contribution, Interaction）
- ✅ 三个排行榜（Influence, Accuracy, Momentum）
- ✅ 搜索功能
- ✅ 用户主页（客态）
- ✅ 关注系统

#### 已知限制

- 使用模拟数据（MOCK_DATA）
- AI功能需要配置 Gemini API 密钥
- 徽章功能已隐藏

---

## 待办事项

### 功能增强

- [ ] 实现真实的后端API集成
- [ ] 用户认证和登录系统
- [ ] 数据持久化
- [ ] 实时通知系统
- [ ] 徽章系统重新启用
- [ ] 更多AI分析功能

### 优化改进

- [ ] 性能优化（代码分割、懒加载）
- [ ] 可访问性（A11y）改进
- [ ] 国际化支持
- [ ] 单元测试和集成测试
- [ ] 错误处理和边界情况处理

### 技术债务

- [ ] 代码重构和模块化
- [ ] TypeScript 迁移
- [ ] 状态管理优化（考虑 Redux/Zustand）
- [ ] API层抽象

---

## 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 环境配置

在 `src/App.jsx` 中配置 Gemini API 密钥：

```javascript
const apiKey = "YOUR_GEMINI_API_KEY";
```

### 代码规范

- 使用函数式组件和 Hooks
- 组件命名使用 PascalCase
- 文件命名使用 PascalCase.jsx
- 使用 Tailwind CSS 进行样式设计
- 保持组件单一职责

---

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目仓库: [GitHub Repository]
- 问题反馈: [Issue Tracker]

---

**文档生成时间**: 2026-01-07  
**最后更新**: 2026-01-07

