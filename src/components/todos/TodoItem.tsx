/**
 * TodoItem Component
 *
 * Displays a single todo item with checkbox, title, priority indicator, and actions
 * Supports light/dark theme
 */

import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { CheckCircle2, Circle, Trash2, Edit } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import type { Todo } from '@/types/todo.types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const handleDelete = () => {
    Alert.alert(
      'Hapus Todo',
      'Apakah Anda yakin ingin menghapus todo ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => onDelete(todo.id),
        },
      ],
      { cancelable: true }
    );
  };

  const getPriorityColor = () => {
    switch (todo.priority) {
      case 'high':
        return isDark ? 'text-red-400' : 'text-red-600';
      case 'medium':
        return isDark ? 'text-yellow-400' : 'text-yellow-600';
      case 'low':
        return isDark ? 'text-green-400' : 'text-green-600';
      default:
        return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getPriorityBg = () => {
    switch (todo.priority) {
      case 'high':
        return isDark ? 'bg-red-900/30' : 'bg-red-100';
      case 'medium':
        return isDark ? 'bg-yellow-900/30' : 'bg-yellow-100';
      case 'low':
        return isDark ? 'bg-green-900/30' : 'bg-green-100';
      default:
        return isDark ? 'bg-gray-800' : 'bg-gray-100';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <View
      className={`rounded-lg p-4 mb-3 border ${
        isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}
    >
      <View className="flex-row items-start">
        {/* Checkbox */}
        <TouchableOpacity
          onPress={() => onToggle(todo.id)}
          className="mr-3 mt-1"
        >
          {todo.completed ? (
            <CheckCircle2
              size={24}
              color={isDark ? '#10b981' : '#059669'}
            />
          ) : (
            <Circle
              size={24}
              color={isDark ? '#6b7280' : '#9ca3af'}
            />
          )}
        </TouchableOpacity>

        {/* Content */}
        <View className="flex-1">
          {/* Title */}
          <Text
            className={`text-base font-semibold ${
              todo.completed
                ? isDark
                  ? 'text-gray-500 line-through'
                  : 'text-gray-400 line-through'
                : isDark
                ? 'text-white'
                : 'text-gray-900'
            }`}
          >
            {todo.title}
          </Text>

          {/* Description */}
          {todo.description && (
            <Text
              className={`text-sm mt-1 ${
                todo.completed
                  ? isDark
                    ? 'text-gray-600'
                    : 'text-gray-400'
                  : isDark
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
              numberOfLines={2}
            >
              {todo.description}
            </Text>
          )}

          {/* Priority & Due Date */}
          <View className="flex-row items-center mt-2 gap-2">
            {/* Priority Badge */}
            <View className={`px-2 py-1 rounded ${getPriorityBg()}`}>
              <Text className={`text-xs font-medium ${getPriorityColor()}`}>
                {todo.priority.toUpperCase()}
              </Text>
            </View>

            {/* Due Date */}
            {todo.dueDate && (
              <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                📅 {formatDate(todo.dueDate)}
              </Text>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-2 ml-2">
          <TouchableOpacity
            onPress={() => onEdit(todo)}
            className="p-2"
          >
            <Edit
              size={18}
              color={isDark ? '#9ca3af' : '#6b7280'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            className="p-2"
          >
            <Trash2
              size={18}
              color={isDark ? '#ef4444' : '#dc2626'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
