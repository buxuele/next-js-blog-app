// 从 Prisma 客户端导入生成的类型
import { Article, TodoItem } from '@prisma/client';

// 扩展的 Article 类型，包含关联的 todos
export type ArticleWithTodos = Article & {
  todos: TodoItem[];
};

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 创建文章的请求类型
export interface CreateArticleRequest {
  title?: string;
}

// 更新文章的请求类型
export interface UpdateArticleRequest {
  title?: string;
}

// 创建 Todo 的请求类型
export interface CreateTodoRequest {
  content?: string;
  articleId: string;
  order?: number;
  indentLevel?: number;
}

// 更新 Todo 的请求类型
export interface UpdateTodoRequest {
  content?: string;
  completed?: boolean;
  order?: number;
  indentLevel?: number;
}

// 重新排序 Todo 的请求类型
export interface ReorderTodosRequest {
  todoIds: string[];
}

// 复制 Todo 的请求类型
export interface CopyTodoRequest {
  targetArticleId?: string;
  insertAfterOrder?: number;
}

// 组件 Props 类型
export interface TodoItemProps {
  todo: TodoItem;
  onUpdate: (id: string, updates: UpdateTodoRequest) => void;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onIndent: (id: string, direction: 'increase' | 'decrease') => void;
}

export interface ArticleListProps {
  articles: Article[];
  selectedArticleId?: string;
  onSelectArticle: (id: string) => void;
  onCreateArticle: () => void;
  onDeleteArticle: (id: string) => void;
}

export interface ArticleEditorProps {
  article: ArticleWithTodos | null;
  onUpdateArticle: (id: string, updates: UpdateArticleRequest) => void;
  onCreateTodo: (articleId: string, todo: CreateTodoRequest) => void;
  onUpdateTodo: (id: string, updates: UpdateTodoRequest) => void;
  onDeleteTodo: (id: string) => void;
  onReorderTodos: (articleId: string, todoIds: string[]) => void;
}

// 自动保存状态类型
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface AutoSaveState {
  status: SaveStatus;
  lastSaved?: Date;
  error?: string;
}

// 错误处理类型
export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

// 拖拽相关类型
export interface DragItem {
  id: string;
  type: 'todo';
  index: number;
}

export interface DropResult {
  dragIndex: number;
  hoverIndex: number;
}

// 上下文菜单类型
export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface ContextMenuItem {
  label: string;
  icon?: string;
  action: () => void;
  disabled?: boolean;
  separator?: boolean;
}

// 键盘事件类型
export type KeyboardShortcut = {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
};

// 布局相关类型
export interface LayoutState {
  sidebarWidth: number;
  sidebarCollapsed: boolean;
}

// 加载状态类型
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Hook 返回类型
export interface UseArticlesReturn {
  articles: Article[];
  selectedArticle: ArticleWithTodos | null;
  loading: boolean;
  error: string | null;
  createArticle: () => Promise<Article>;
  updateArticle: (id: string, updates: UpdateArticleRequest) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  selectArticle: (id: string) => Promise<void>;
}

export interface UseAutoSaveReturn {
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  error: string | null;
  save: () => Promise<void>;
  reset: () => void;
}

export interface UseTodosReturn {
  createTodo: (articleId: string, todo: CreateTodoRequest) => Promise<TodoItem>;
  updateTodo: (id: string, updates: UpdateTodoRequest) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  reorderTodos: (articleId: string, todoIds: string[]) => Promise<void>;
  copyTodo: (id: string, request: CopyTodoRequest) => Promise<TodoItem>;
}

// 表单验证类型
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  values: T;
  errors: ValidationError[];
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
}

// 通用组件 Props 类型
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
}

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export interface AutoSaveIndicatorProps {
  status: SaveStatus;
  lastSaved?: Date;
  error?: string;
  onRetry?: () => void;
}
