# 博客应用设置指南

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置数据库

#### 创建 Neon 数据库

1. 访问 [Neon](https://neon.tech) 并注册账户
2. 创建一个新的项目
3. 复制数据库连接字符串

#### 配置环境变量

1. 复制 `.env.example` 为 `.env`
2. 将 Neon 数据库连接字符串替换到 `.env` 文件中：

```env
DATABASE_URL="postgresql://your-username:your-password@ep-xxx-xxx.us-east-1.aws.neon.tech/your-database?sslmode=require"
```

### 3. 初始化数据库

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库 schema
npm run db:push

# 填充示例数据（可选）
npm run db:seed
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看博客
访问 http://localhost:3000/admin 进入管理后台

## 故障排除

### 数据库连接问题

如果看到 "Database not configured" 警告：

1. 确保 `.env` 文件存在且包含正确的 `DATABASE_URL`
2. 确保 Neon 数据库正在运行
3. 检查连接字符串格式是否正确

### 构建错误

如果遇到构建错误：

1. 删除 `.next` 文件夹：`rm -rf .next`
2. 重新安装依赖：`npm install`
3. 重新生成 Prisma 客户端：`npm run db:generate`

### TypeScript 错误

如果遇到 TypeScript 路径解析错误：

1. 重启 TypeScript 服务器
2. 检查 `tsconfig.json` 中的路径配置

## 功能测试

### 前台功能

- [ ] 访问首页显示文章列表
- [ ] 点击文章标题进入详情页
- [ ] 检查响应式设计

### 后台功能

- [ ] 访问 `/admin` 查看管理面板
- [ ] 创建新文章
- [ ] 编辑现有文章
- [ ] 管理分类和标签

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 添加环境变量 `DATABASE_URL`
4. 部署完成后运行：`npx prisma db push`

## 需要帮助？

查看完整的 [README.md](./README.md) 文件获取更多信息。
