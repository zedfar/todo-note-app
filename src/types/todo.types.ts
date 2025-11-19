/**
 * Todo Types
 *
 * Type definitions for Todo items with full CRUD support
 */

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface UpdateTodoDto extends Partial<CreateTodoDto> {
  completed?: boolean;
}

export type TodoFilter = 'all' | 'active' | 'completed';
export type TodoPriority = Todo['priority'];
