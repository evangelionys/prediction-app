# Probable - 预测平台

这是一个基于React的预测平台应用，使用Vite作为构建工具，Tailwind CSS进行样式设计。

## 功能特性

- 📊 预测卡片浏览和详情查看
- 🤖 AI助手集成（Gemini API）
- 💬 社区讨论和评论
- 📈 个人成长数据追踪
- 🎯 驱动因素和机会分析
- 📱 移动端优化的响应式设计

## 技术栈

- React 18
- Vite
- Tailwind CSS
- Lucide React (图标库)
- Gemini API (AI功能)

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 配置API密钥（可选）：
在 `src/App.jsx` 中设置你的Gemini API密钥：
```javascript
const apiKey = "YOUR_API_KEY_HERE";
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 构建生产版本：
```bash
npm run build
```

## 项目结构

```
src/
├── App.jsx                 # 主应用组件
├── main.jsx                # 入口文件
├── index.css               # 全局样式
└── components/             # 组件目录
    ├── FeedView.jsx        # 信息流视图
    ├── PredictionCard.jsx  # 预测卡片
    ├── DetailPage.jsx      # 详情页面
    ├── NewsDetailPage.jsx  # 新闻详情
    ├── SettledDetailPage.jsx # 已结算详情
    ├── DriverCard.jsx      # 驱动因素卡片
    ├── OpportunityCard.jsx # 机会卡片
    ├── CommentCard.jsx     # 评论卡片
    ├── AIChatView.jsx      # AI聊天视图
    ├── MyGrowthView.jsx    # 个人成长视图
    └── ...                 # 其他组件
```

## 注意事项

- 应用使用模拟数据（MOCK_DATA）进行演示
- AI功能需要配置有效的Gemini API密钥
- 应用设计为移动端优先，最大宽度为md断点

