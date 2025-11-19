/**
 * Service Example - Offline Storage (No API)
 *
 * Use this pattern for:
 * - Offline-first apps
 * - Local data storage (todos, notes, settings)
 * - Apps without backend
 * - Client-side only features
 *
 * Features:
 * - Uses AsyncStorage for persistence
 * - No network required
 * - Full CRUD operations
 * - Type-safe with TypeScript
 * - Works offline
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Type definitions
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

/**
 * Todo Service - Offline Storage
 *
 * Stores todos in AsyncStorage (device local storage)
 * No API connection required - works completely offline
 */
class TodoService {
  private STORAGE_KEY = '@todos';

  /**
   * Get all todos from storage
   */
  async getTodos(): Promise<Todo[]> {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading todos:', error);
      return [];
    }
  }

  /**
   * Get single todo by ID
   */
  async getTodoById(id: string): Promise<Todo | null> {
    const todos = await this.getTodos();
    return todos.find(todo => todo.id === id) || null;
  }

  /**
   * Create new todo
   */
  async createTodo(data: CreateTodoDto): Promise<Todo> {
    const todos = await this.getTodos();

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      completed: false,
      priority: data.priority || 'medium',
      dueDate: data.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    todos.push(newTodo);
    await this.saveTodos(todos);

    return newTodo;
  }

  /**
   * Update existing todo
   */
  async updateTodo(id: string, data: UpdateTodoDto): Promise<Todo | null> {
    const todos = await this.getTodos();
    const index = todos.findIndex(todo => todo.id === id);

    if (index === -1) {
      throw new Error('Todo not found');
    }

    const updatedTodo: Todo = {
      ...todos[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    todos[index] = updatedTodo;
    await this.saveTodos(todos);

    return updatedTodo;
  }

  /**
   * Delete todo
   */
  async deleteTodo(id: string): Promise<void> {
    const todos = await this.getTodos();
    const filtered = todos.filter(todo => todo.id !== id);
    await this.saveTodos(filtered);
  }

  /**
   * Toggle todo completion
   */
  async toggleTodo(id: string): Promise<Todo | null> {
    const todo = await this.getTodoById(id);
    if (!todo) return null;

    return await this.updateTodo(id, { completed: !todo.completed });
  }

  /**
   * Get todos by status
   */
  async getTodosByStatus(completed: boolean): Promise<Todo[]> {
    const todos = await this.getTodos();
    return todos.filter(todo => todo.completed === completed);
  }

  /**
   * Get todos by priority
   */
  async getTodosByPriority(priority: Todo['priority']): Promise<Todo[]> {
    const todos = await this.getTodos();
    return todos.filter(todo => todo.priority === priority);
  }

  /**
   * Search todos by title
   */
  async searchTodos(query: string): Promise<Todo[]> {
    const todos = await this.getTodos();
    return todos.filter(todo =>
      todo.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Clear all todos
   */
  async clearAllTodos(): Promise<void> {
    await AsyncStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Get todos count
   */
  async getTodosCount(): Promise<{ total: number; completed: number; pending: number }> {
    const todos = await this.getTodos();
    return {
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
      pending: todos.filter(t => !t.completed).length,
    };
  }

  /**
   * Private: Save todos to storage
   */
  private async saveTodos(todos: Todo[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
      throw new Error('Failed to save todos');
    }
  }
}

// Export singleton instance
export const todoService = new TodoService();

/**
 * Usage Examples:
 *
 * 1. Get all todos:
 *    const todos = await todoService.getTodos();
 *
 * 2. Create todo:
 *    const newTodo = await todoService.createTodo({
 *      title: 'Buy groceries',
 *      description: 'Milk, eggs, bread',
 *      priority: 'high',
 *      dueDate: '2024-11-20T00:00:00Z',
 *    });
 *
 * 3. Update todo:
 *    const updated = await todoService.updateTodo('123', {
 *      title: 'Updated title',
 *      completed: true,
 *    });
 *
 * 4. Toggle todo:
 *    await todoService.toggleTodo('123');
 *
 * 5. Delete todo:
 *    await todoService.deleteTodo('123');
 *
 * 6. Get pending todos:
 *    const pending = await todoService.getTodosByStatus(false);
 *
 * 7. Search todos:
 *    const results = await todoService.searchTodos('groceries');
 *
 * 8. Get stats:
 *    const stats = await todoService.getTodosCount();
 */

/**
 * Alternative: Using Zustand for Offline Storage
 *
 * You can also use Zustand store for offline data:
 *
 * import { create } from 'zustand';
 * import { persist, createJSONStorage } from 'zustand/middleware';
 * import AsyncStorage from '@react-native-async-storage/async-storage';
 *
 * export const useTodoStore = create(
 *   persist(
 *     (set, get) => ({
 *       todos: [],
 *       addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
 *       removeTodo: (id) => set((state) => ({
 *         todos: state.todos.filter(t => t.id !== id)
 *       })),
 *     }),
 *     {
 *       name: 'todo-storage',
 *       storage: createJSONStorage(() => AsyncStorage),
 *     }
 *   )
 * );
 */
