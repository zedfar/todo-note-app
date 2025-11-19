/**
 * Todo Service - Offline Storage
 *
 * Manages todos using AsyncStorage for offline persistence
 * No API connection required - works completely offline
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '@/types/todo.types';

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
    return todos.find((todo) => todo.id === id) || null;
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
    const index = todos.findIndex((todo) => todo.id === id);

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
    const filtered = todos.filter((todo) => todo.id !== id);
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
    return todos.filter((todo) => todo.completed === completed);
  }

  /**
   * Get todos by priority
   */
  async getTodosByPriority(priority: Todo['priority']): Promise<Todo[]> {
    const todos = await this.getTodos();
    return todos.filter((todo) => todo.priority === priority);
  }

  /**
   * Search todos by title
   */
  async searchTodos(query: string): Promise<Todo[]> {
    const todos = await this.getTodos();
    const lowerQuery = query.toLowerCase();
    return todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(lowerQuery) ||
        todo.description?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Clear all todos
   */
  async clearAllTodos(): Promise<void> {
    await AsyncStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Get todos statistics
   */
  async getTodosStats(): Promise<{
    total: number;
    completed: number;
    active: number;
    highPriority: number;
  }> {
    const todos = await this.getTodos();
    return {
      total: todos.length,
      completed: todos.filter((t) => t.completed).length,
      active: todos.filter((t) => !t.completed).length,
      highPriority: todos.filter((t) => t.priority === 'high' && !t.completed)
        .length,
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
