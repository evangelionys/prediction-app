# Vercel 部署步骤（方法2）

## 方式 A：使用 Vercel CLI 直接部署（推荐，无需 GitHub）

### 步骤：

1. **登录 Vercel**（如果还没登录）：
   ```bash
   vercel login
   ```
   - 会显示一个链接，在浏览器中打开并完成登录
   - 登录成功后，在终端按回车继续

2. **部署到生产环境**：
   ```bash
   vercel --prod
   ```
   - 按照提示操作
   - 选择项目设置（可以直接使用默认值）
   - 部署完成后会显示永久链接

---

## 方式 B：使用 Vercel 网页部署（需要 GitHub）

### 步骤：

1. **将项目推送到 GitHub**：
   - 在 GitHub 创建新仓库
   - 然后运行：
     ```bash
     git remote add origin https://github.com/你的用户名/仓库名.git
     git push -u origin main
     ```

2. **在 Vercel 网页部署**：
   - 访问：https://vercel.com
   - 登录（使用 GitHub）
   - 点击 "Add New..." → "Project"
   - 选择刚创建的 GitHub 仓库
   - 点击 "Import"
   - Vercel 会自动检测 Vite 配置
   - 点击 "Deploy"
   - 等待部署完成，获得永久链接

---

## 当前项目已准备好：
✅ 已构建完成
✅ 已创建 vercel.json 配置
✅ Git 已初始化

**现在可以开始部署了！**

