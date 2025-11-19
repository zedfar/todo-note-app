/**
 * Todo List Screen
 *
 * Main screen for managing todos with filtering, search, and CRUD operations
 * Completely offline using AsyncStorage
 */

import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Plus, Search, Filter } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { todoService } from '@/services/todoService';
import { TodoItem } from '@/components/todos/TodoItem';
import { TodoForm } from '@/components/todos/TodoForm';
import type { Todo, TodoFilter, CreateTodoDto, UpdateTodoDto } from '@/types/todo.types';

export default function TodoScreen() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await todoService.getTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadTodos();
  };

  const handleCreateTodo = async (data: CreateTodoDto) => {
    try {
      const newTodo = await todoService.createTodo(data);
      setTodos((prev) => [...prev, newTodo]);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleUpdateTodo = async (data: UpdateTodoDto) => {
    if (!editingTodo) return;

    try {
      const updated = await todoService.updateTodo(editingTodo.id, data);
      if (updated) {
        setTodos((prev) =>
          prev.map((todo) => (todo.id === updated.id ? updated : todo))
        );
      }
      setEditingTodo(null);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const updated = await todoService.toggleTodo(id);
      if (updated) {
        setTodos((prev) =>
          prev.map((todo) => (todo.id === updated.id ? updated : todo))
        );
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  const filteredTodos = useMemo(() => {
    let result = todos;

    // Apply status filter
    if (filter === 'active') {
      result = result.filter((t) => !t.completed);
    } else if (filter === 'completed') {
      result = result.filter((t) => t.completed);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [todos, filter, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
    };
  }, [todos]);

  if (loading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}
      >
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
      </View>
    );
  }

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}
    >
      {/* Header */}
      <View className="px-4 pt-12 pb-4">
        <Text
          className={`text-3xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Todo List
        </Text>
        <Text className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          {stats.active} aktif, {stats.completed} selesai
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 mb-4">
        <View
          className={`flex-row items-center border rounded-lg px-4 ${
            isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-300'
          }`}
        >
          <Search size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Cari todo..."
            placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
            className={`flex-1 py-3 px-3 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          />
        </View>
      </View>

      {/* Filter Buttons */}
      <View className="flex-row px-4 mb-4 gap-2">
        {(['all', 'active', 'completed'] as TodoFilter[]).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg ${
              filter === f
                ? 'bg-blue-500'
                : isDark
                ? 'bg-gray-800'
                : 'bg-white'
            }`}
          >
            <Text
              className={`font-medium ${
                filter === f
                  ? 'text-white'
                  : isDark
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              {f === 'all' ? 'Semua' : f === 'active' ? 'Aktif' : 'Selesai'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Todo List */}
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onEdit={handleEditTodo}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={isDark ? '#fff' : '#000'}
          />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text
              className={`text-center ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              {searchQuery
                ? 'Tidak ada todo yang ditemukan'
                : filter === 'completed'
                ? 'Belum ada todo yang selesai'
                : filter === 'active'
                ? 'Tidak ada todo aktif'
                : 'Belum ada todo. Tambahkan yang pertama!'}
            </Text>
          </View>
        }
      />

      {/* Add Button */}
      <TouchableOpacity
        onPress={() => setShowForm(true)}
        className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Plus size={28} color="#fff" />
      </TouchableOpacity>

      {/* Todo Form Modal */}
      <TodoForm
        visible={showForm}
        todo={editingTodo}
        onClose={handleCloseForm}
        onSubmit={(data) => {
          if (editingTodo) {
            handleUpdateTodo(data as UpdateTodoDto);
          } else {
            handleCreateTodo(data as CreateTodoDto);
          }
        }}
      />
    </View>
  );
}
