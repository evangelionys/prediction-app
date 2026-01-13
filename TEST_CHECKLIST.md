# 应用测试清单

## 部署信息
- **生产环境 URL**: https://prediction-kvv4s3nn1-evans-projects-722b62fc.vercel.app
- **别名 URL**: https://prediction-app-lovat.vercel.app
- **部署状态**: ✅ Ready

## 功能测试清单

### 1. 基础导航测试
- [ ] 应用能够正常加载
- [ ] 底部导航栏显示 4 个 Tab：Signal, Followed, Trend, Me
- [ ] 点击各个 Tab 能够正常切换

### 2. Signal Tab（预测流）
- [ ] 显示预测卡片列表
- [ ] 点击预测卡片能够进入详情页
- [ ] 详情页显示 4 个 Tab：Question, Reasoning, Opportunities, Discussions
- [ ] 右上角搜索图标可以点击
- [ ] 搜索功能能够正常工作（Predictions 和 News）

### 3. Followed Tab（关注）
- [ ] 显示两个子 Tab：Predictions 和 Users
- [ ] Predictions Tab 显示关注的预测题更新
- [ ] Users Tab 显示关注的用户动态
- [ ] 点击预测卡片能够跳转到详情页
- [ ] 点击用户头像能够跳转到用户主页

### 4. Trend Tab（排行榜）
- [ ] 显示三个子 Tab：Influence, Accuracy, Momentum
- [ ] Influence Tab 显示影响力排行榜
- [ ] Accuracy Tab 显示准确率排行榜（包含 AI 模型）
- [ ] Momentum Tab 显示机会排行榜
- [ ] 分类筛选功能正常（All, Business, Politics, Tech）
- [ ] 时间筛选功能正常（月份/周数）
- [ ] 点击用户头像能够跳转到用户主页
- [ ] 点击机会能够跳转到对应预测题的 Opportunities Tab
- [ ] 底部用户数据卡片显示正确

### 5. Me Tab（个人主页）
- [ ] 显示用户头像、姓名、简介
- [ ] 显示徽章（最多 3 个，隐藏 "U.S. Politics Expert"）
- [ ] 显示认知雷达图（6 个维度：Breadth, Versatility, Accuracy, Conviction, Influence, Judgment）
- [ ] 雷达图显示大脑背景（根据等级：Normal/Advanced/Master）
- [ ] 点击雷达图维度能够打开详情浮层
- [ ] 显示 AI Insight 卡片
- [ ] 点击 AI Insight 卡片能够进入详情页
- [ ] Activities 部分显示三个 Tab：Prediction, Contribution, Interaction
- [ ] 各个 Tab 的内容显示正确
- [ ] Prediction Tab 显示 top 2 选项及百分比
- [ ] Contribution Tab 显示预测题标题
- [ ] Interaction Tab 显示预测题标题

### 6. 搜索功能
- [ ] 从 Signal Tab 点击搜索图标能够打开搜索页面
- [ ] 搜索页面显示两个 Tab：Predictions（默认）和 News
- [ ] Predictions 搜索能够匹配预测题问题
- [ ] News 搜索能够匹配新闻标题
- [ ] 搜索结果能够点击跳转到详情页

### 7. 用户主页（客态）
- [ ] 从排行榜点击用户头像能够进入用户主页
- [ ] 用户主页样式与 Me Tab 类似
- [ ] 显示 Follow/Following 按钮
- [ ] 显示 Share 按钮
- [ ] **不显示** AI Insight 内容（客态隐藏）
- [ ] 认知雷达图显示正确
- [ ] Activities 显示正确

### 8. AI Insight 详情页
- [ ] 标题显示为 "AI Insight"（不是 "AI Assistant"）
- [ ] 显示初始消息：Behavioral Pattern 和 Exclusive Opportunity
- [ ] 消息卡片样式与 Me 页面的 Insight 卡片一致
- [ ] 输入框占位符为 "Ask follow-up questions about AI Insight"
- [ ] 右上角显示 History 按钮
- [ ] 点击 History 能够显示近 3 天的历史记录

### 9. 预测详情页
- [ ] 从 Trend Tab 的 Momentum 点击机会能够跳转到 Opportunities Tab
- [ ] 各个 Tab 的内容显示正确
- [ ] Drivers 和 Opportunities 列表显示正确
- [ ] 评论功能正常

### 10. 响应式设计
- [ ] 在不同屏幕尺寸下显示正常
- [ ] 移动端体验良好
- [ ] 所有交互元素可点击

### 11. 性能测试
- [ ] 页面加载速度正常
- [ ] 切换 Tab 流畅
- [ ] 没有明显的卡顿

## 已知问题
- 部署状态为 Ready，但可能存在 DNS 传播延迟
- 如果无法访问，请等待几分钟后重试

## 测试建议
1. 使用 Chrome/Edge 浏览器测试
2. 清除浏览器缓存后测试
3. 在不同设备上测试（桌面端、移动端）
4. 测试所有导航路径
5. 检查控制台是否有错误

