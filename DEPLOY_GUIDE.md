# 获取永久公网链接 - 部署指南

## 方案 1：Vercel 网页部署（最简单，推荐）

### 步骤：

1. **访问 Vercel**：
   - 打开 https://vercel.com
   - 使用 GitHub 账号登录（如果没有，可以注册）

2. **创建新项目**：
   - 点击 "Add New..." → "Project"
   - 如果项目已在 GitHub，直接选择导入
   - 如果项目不在 GitHub，先推送到 GitHub：
     ```bash
     # 在 GitHub 创建新仓库，然后：
     git remote add origin https://github.com/你的用户名/仓库名.git
     git push -u origin main
     ```

3. **配置项目**：
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **部署**：
   - 点击 "Deploy"
   - 等待部署完成（约 1-2 分钟）
   - 获得永久链接：`https://your-project.vercel.app`

## 方案 2：使用 Vercel CLI

### 步骤：

1. **登录 Vercel**：
   ```bash
   vercel login
   ```
   - 会打开浏览器，完成登录

2. **部署**：
   ```bash
   vercel --prod
   ```
   - 按照提示操作
   - 获得永久链接

## 方案 3：使用 Netlify（备选）

1. 访问 https://app.netlify.com
2. 使用 GitHub 登录
3. 拖拽 `dist` 文件夹到 Netlify
4. 或连接 GitHub 仓库自动部署

