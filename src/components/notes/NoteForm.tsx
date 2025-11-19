/**
 * NoteForm Component
 *
 * Modal form for creating and editing notes
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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import type { Note, CreateNoteDto, UpdateNoteDto } from '@/types/note.types';

interface NoteFormProps {
  visible: boolean;
  note?: Note | null;
  onClose: () => void;
  onSubmit: (data: CreateNoteDto | UpdateNoteDto) => void;
}

export function NoteForm({ visible, note, onClose, onSubmit }: NoteFormProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category || '');
      setTagsInput(note.tags?.join(', ') || '');
      setIsPinned(note.isPinned);
    } else {
      resetForm();
    }
  }, [note, visible]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('');
    setTagsInput('');
    setIsPinned(false);
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const data: CreateNoteDto | UpdateNoteDto = {
      title: title.trim(),
      content: content.trim(),
      category: category.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      isPinned,
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end"
      >
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
                {note ? 'Edit Catatan' : 'Tambah Catatan Baru'}
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
                placeholder="Masukkan judul catatan"
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                className={`border rounded-lg px-4 py-3 ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </View>

            {/* Content Input */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Konten *
              </Text>
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Tulis catatan Anda di sini..."
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                className={`border rounded-lg px-4 py-3 ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </View>

            {/* Category Input */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Kategori
              </Text>
              <TextInput
                value={category}
                onChangeText={setCategory}
                placeholder="Contoh: Pekerjaan, Personal"
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                className={`border rounded-lg px-4 py-3 ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </View>

            {/* Tags Input */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Tags
              </Text>
              <TextInput
                value={tagsInput}
                onChangeText={setTagsInput}
                placeholder="Contoh: penting, urgent (pisahkan dengan koma)"
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                className={`border rounded-lg px-4 py-3 ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </View>

            {/* Pin Toggle */}
            <TouchableOpacity
              onPress={() => setIsPinned(!isPinned)}
              className={`flex-row items-center justify-between p-4 rounded-lg border mb-6 ${
                isPinned
                  ? isDark
                    ? 'bg-yellow-900/20 border-yellow-700'
                    : 'bg-yellow-50 border-yellow-300'
                  : isDark
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-300'
              }`}
            >
              <Text
                className={`font-medium ${
                  isPinned
                    ? isDark
                      ? 'text-yellow-400'
                      : 'text-yellow-600'
                    : isDark
                    ? 'text-gray-300'
                    : 'text-gray-700'
                }`}
              >
                📌 Pin Catatan
              </Text>
              <View
                className={`w-12 h-6 rounded-full p-1 ${
                  isPinned ? 'bg-yellow-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              >
                <View
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    isPinned ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </View>
            </TouchableOpacity>

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
                disabled={!title.trim() || !content.trim()}
                className={`flex-1 py-4 rounded-lg ${
                  !title.trim() || !content.trim()
                    ? 'bg-gray-400'
                    : 'bg-blue-500'
                }`}
              >
                <Text className="text-center font-semibold text-white">
                  {note ? 'Simpan' : 'Tambah'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
