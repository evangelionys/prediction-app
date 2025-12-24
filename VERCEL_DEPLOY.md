# Vercel 部署步骤

## 当前状态
Vercel 登录已启动，需要你完成以下步骤：

1. **访问链接并登录**：
   - 访问：https://vercel.com/oauth/device?user_code=BDHK-JCWP
   - 或者直接在浏览器中打开上面的链接
   - 使用 GitHub、Google 或 Email 登录 Vercel

2. **完成登录后**，在终端按 [ENTER] 键继续

3. **登录成功后**，运行以下命令部署：
   ```bash
   vercel --prod
   ```

## 或者使用网页部署（更简单）

1. 访问 https://vercel.com
2. 使用 GitHub 登录
3. 点击 "Add New..." → "Project"
4. 如果项目在 GitHub，可以直接导入
5. 如果不在 GitHub，可以：
   - 先推送到 GitHub
   - 或者使用 Vercel CLI 部署（需要先完成上面的登录）

