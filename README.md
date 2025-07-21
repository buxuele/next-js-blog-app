# 个人博客应用

基于 Next.js 15 + TypeScript + Prisma + Neon 数据库构建的现代化个人博客系统。

## 功能特性

### 前台功能

- 📝 文章列表展示
- 📖 文章详情页面
- 🏷️ 分类和标签筛选
- 📱 响应式设计
- ⚡ SSG 静态生成优化

### 后台管理

- ✍️ 文章创建和编辑
- 📂 分类管理
- 🏷️ 标签管理
- 📊 数据统计面板
- 🔍 文章搜索和筛选

### 技术特性

- 🚀 Next.js 15 App Router
- 💎 TypeScript 类型安全
- 🎨 Tailwind CSS 样式
- 🗄️ Prisma ORM
- 🐘 Neon PostgreSQL 数据库
- 📦 shadcn/ui 组件库

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd personal-blog-app
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置数据库

1. 在 [Neon](https://neon.tech) 创建一个新的数据库项目
2. 复制 `.env.example` 为 `.env`
3. 将 Neon 数据库连接字符串填入 `.env` 文件：

```env
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/database?sslmode=require"
```

### 4. 初始化数据库

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库 schema
npm run db:push

# 填充示例数据（可选）
npm run db:seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看前台页面
访问 [http://localhost:3000/admin](http://localhost:3000/admin) 进入管理后台

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── admin/             # 管理后台页面
│   ├── api/               # API 路由
│   ├── posts/             # 文章详情页面
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── layout/           # 布局组件
│   ├── ui/               # UI 基础组件
│   └── post-editor.tsx   # 文章编辑器
└── lib/                  # 工具函数和配置
    ├── prisma.ts         # Prisma 客户端
    └── utils.ts          # 工具函数

prisma/
├── schema.prisma         # 数据库 schema
└── seed.ts              # 种子数据
```

## API 接口

### 文章 API

- `GET /api/posts` - 获取文章列表
- `POST /api/posts` - 创建文章
- `GET /api/posts/[id]` - 获取单个文章
- `PUT /api/posts/[id]` - 更新文章
- `DELETE /api/posts/[id]` - 删除文章

### 分类 API

- `GET /api/categories` - 获取分类列表
- `POST /api/categories` - 创建分类

### 标签 API

- `GET /api/tags` - 获取标签列表
- `POST /api/tags` - 创建标签

## 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 在 Vercel 项目设置中添加环境变量：
   - `DATABASE_URL`: Neon 数据库连接字符串
4. 部署完成后，运行数据库迁移：

```bash
npx prisma db push
```

## 开发命令

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 数据库相关
npm run db:generate    # 生成 Prisma 客户端
npm run db:push       # 推送 schema 到数据库
npm run db:seed       # 填充示例数据
npm run db:studio     # 打开 Prisma Studio
```

## 自定义配置

### 修改主题颜色

编辑 `tailwind.config.ts` 文件中的颜色配置。

### 添加新的文章字段

1. 修改 `prisma/schema.prisma` 中的 Post 模型
2. 运行 `npm run db:push` 更新数据库
3. 更新相关的 TypeScript 类型和组件

### 自定义样式

编辑 `src/app/globals.css` 文件添加全局样式。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
