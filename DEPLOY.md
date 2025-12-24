# 部署到 Vercel 获取公网链接

## 快速部署步骤：

1. **登录 Vercel**（首次需要）：
   ```bash
   vercel login
   ```
   会打开浏览器，使用 GitHub/Google/Email 登录

2. **部署到 Vercel**：
   ```bash
   vercel --prod
   ```
   按照提示操作，完成后会得到一个公网链接，例如：`https://your-app.vercel.app`

3. **访问应用**：
   部署完成后，Vercel 会显示公网链接，可以直接访问。

## 或者使用网页部署：

1. 访问 https://vercel.com
2. 使用 GitHub 登录
3. 点击 "New Project"
4. 导入这个项目（需要先推送到 GitHub）
5. Vercel 会自动检测 Vite 项目并部署

