import { ValidationError } from '../types';

// 验证文章标题
export function validateArticleTitle(title: string): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!title.trim()) {
    errors.push({
      field: 'title',
      message: '文章标题不能为空'
    });
  }
  
  if (title.length > 200) {
    errors.push({
      field: 'title',
      message: '文章标题不能超过200个字符'
    });
  }
  
  return errors;
}

// 验证 Todo 内容
export function validateTodoContent(content: string): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (content.length > 1000) {
    errors.push({
      field: 'content',
      message: 'Todo 内容不能超过1000个字符'
    });
  }
  
  return errors;
}

// 验证缩进层级
export function validateIndentLevel(level: number): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (level < 0 || level > 3) {
    errors.push({
      field: 'indentLevel',
      message: '缩进层级必须在0-3之间'
    });
  }
  
  return errors;
}

// 通用验证函数
export function isValidId(id: string): boolean {
  return typeof id === 'string' && id.length > 0;
}

export function isValidOrder(order: number): boolean {
  return typeof order === 'number' && order >= 0;
}