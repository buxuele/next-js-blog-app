import { TodoItem } from '@prisma/client';

// 按顺序排序 Todo 项目
export function sortTodosByOrder(todos: TodoItem[]): TodoItem[] {
  return [...todos].sort((a, b) => a.order - b.order);
}

// 重新计算 Todo 项目的顺序
export function reorderTodos(
  todos: TodoItem[],
  fromIndex: number,
  toIndex: number
): TodoItem[] {
  const sortedTodos = sortTodosByOrder(todos);
  const [movedTodo] = sortedTodos.splice(fromIndex, 1);
  sortedTodos.splice(toIndex, 0, movedTodo);

  return sortedTodos.map((todo, index) => ({
    ...todo,
    order: index,
  }));
}

// 获取下一个可用的顺序号
export function getNextOrder(todos: TodoItem[]): number {
  if (todos.length === 0) return 0;
  return Math.max(...todos.map((t) => t.order)) + 1;
}

// 在指定位置插入新的 Todo
export function insertTodoAtPosition(
  todos: TodoItem[],
  newTodo: Omit<TodoItem, 'order'>,
  position: number
): TodoItem[] {
  const sortedTodos = sortTodosByOrder(todos);
  const todoWithOrder = { ...newTodo, order: position } as TodoItem;

  // 更新后续项目的顺序
  const updatedTodos = sortedTodos.map((todo) =>
    todo.order >= position ? { ...todo, order: todo.order + 1 } : todo
  );

  return [...updatedTodos, todoWithOrder];
}

// 调整缩进层级
export function adjustIndentLevel(
  currentLevel: number,
  direction: 'increase' | 'decrease'
): number {
  if (direction === 'increase') {
    return Math.min(currentLevel + 1, 3);
  } else {
    return Math.max(currentLevel - 1, 0);
  }
}

// 复制 Todo 项目
export function copyTodo(
  todo: TodoItem,
  targetOrder: number
): Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    content: todo.content,
    completed: false, // 复制的项目默认未完成
    order: targetOrder,
    indentLevel: todo.indentLevel,
    articleId: todo.articleId,
  };
}

// 获取缩进样式类名
export function getIndentClassName(level: number): string {
  const indentMap = {
    0: '',
    1: 'ml-6',
    2: 'ml-12',
    3: 'ml-18',
  };
  return indentMap[level as keyof typeof indentMap] || '';
}

// 检查是否可以增加缩进
export function canIncreaseIndent(currentLevel: number): boolean {
  return currentLevel < 3;
}

// 检查是否可以减少缩进
export function canDecreaseIndent(currentLevel: number): boolean {
  return currentLevel > 0;
}
