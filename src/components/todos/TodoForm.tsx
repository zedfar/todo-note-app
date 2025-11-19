/**
 * TodoForm Component
 *
 * Modal form for creating and editing todos
 * Supports light/dark theme
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '@/types/todo.types';

interface TodoFormProps {
  visible: boolean;
  todo?: Todo | null;
  onClose: () => void;
  onSubmit: (data: CreateTodoDto | UpdateTodoDto) => void;
}

export function TodoForm({ visible, todo, onClose, onSubmit }: TodoFormProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      setPriority(todo.priority);
      setDueDate(todo.dueDate || '');
    } else {
      resetForm();
    }
  }, [todo, visible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const data: CreateTodoDto | UpdateTodoDto = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
    };

    onSubmit(data);
    resetForm();
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View className="flex-1 justify-end">
        {/* Backdrop */}
        <TouchableOpacity
          className="absolute inset-0 bg-black/50"
          activeOpacity={1}
          onPress={handleCancel}
        />

        {/* Form Content */}
        <View
          className={`rounded-t-3xl ${
            isDark ? 'bg-gray-900' : 'bg-white'
          }`}
          style={{ maxHeight: '90%' }}
        >
          <ScrollView className="px-6 pt-6 pb-8">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text
                className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {todo ? 'Edit Todo' : 'Tambah Todo Baru'}
              </Text>
              <TouchableOpacity onPress={handleCancel}>
                <X size={24} color={isDark ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>

            {/* Title Input */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Judul *
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Masukkan judul todo"
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                className={`border rounded-lg px-4 py-3 ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </View>

            {/* Description Input */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Deskripsi
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Masukkan deskripsi (opsional)"
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className={`border rounded-lg px-4 py-3 ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </View>

            {/* Priority Selection */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Prioritas
              </Text>
              <View className="flex-row gap-2">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPriority(p)}
                    className={`flex-1 py-3 rounded-lg border ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-red-500 border-red-500'
                          : p === 'medium'
                          ? 'bg-yellow-500 border-yellow-500'
                          : 'bg-green-500 border-green-500'
                        : isDark
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <Text
                      className={`text-center font-medium ${
                        priority === p
                          ? 'text-white'
                          : isDark
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}
                    >
                      {p === 'low' ? 'Rendah' : p === 'medium' ? 'Sedang' : 'Tinggi'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Due Date Input */}
            <View className="mb-6">
              <Text
                className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Tanggal Jatuh Tempo
              </Text>
              <TextInput
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="YYYY-MM-DD (opsional)"
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                className={`border rounded-lg px-4 py-3 ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleCancel}
                className={`flex-1 py-4 rounded-lg border ${
                  isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-300'
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Batal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!title.trim()}
                className={`flex-1 py-4 rounded-lg ${
                  !title.trim()
                    ? 'bg-gray-400'
                    : 'bg-blue-500'
                }`}
              >
                <Text className="text-center font-semibold text-white">
                  {todo ? 'Simpan' : 'Tambah'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
