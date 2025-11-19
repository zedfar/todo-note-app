/**
 * NoteDetail Component
 *
 * Modal to display full note details
 * Supports light/dark theme
 */

import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { X, Pin, Calendar } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import type { Note } from '@/types/note.types';

interface NoteDetailProps {
  visible: boolean;
  note: Note | null;
  onClose: () => void;
}

export function NoteDetail({ visible, note, onClose }: NoteDetailProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  if (!note) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View
          className={`flex-1 mt-16 rounded-t-3xl ${
            isDark ? 'bg-gray-900' : 'bg-white'
          }`}
        >
          <ScrollView className="flex-1 px-6 pt-6 pb-8">
            {/* Header */}
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1 mr-4">
                <Text
                  className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {note.title}
                </Text>
              </View>

              <TouchableOpacity onPress={onClose} className="p-2">
                <X size={24} color={isDark ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>

            {/* Metadata */}
            <View className="flex-row flex-wrap items-center gap-3 mb-6">
              {/* Pinned Badge */}
              {note.isPinned && (
                <View
                  className={`flex-row items-center gap-1 px-2 py-1 rounded ${
                    isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'
                  }`}
                >
                  <Pin
                    size={14}
                    color={isDark ? '#fbbf24' : '#f59e0b'}
                    fill={isDark ? '#fbbf24' : '#f59e0b'}
                  />
                  <Text
                    className={`text-xs font-medium ${
                      isDark ? 'text-yellow-400' : 'text-yellow-600'
                    }`}
                  >
                    Dipasang
                  </Text>
                </View>
              )}

              {/* Category Badge */}
              {note.category && (
                <View
                  className={`px-2 py-1 rounded ${
                    isDark ? 'bg-blue-900/30' : 'bg-blue-100'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}
                  >
                    {note.category}
                  </Text>
                </View>
              )}
            </View>

            {/* Content */}
            <View className="mb-6">
              <Text
                className={`text-base leading-6 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {note.content}
              </Text>
            </View>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <View className="mb-6">
                <Text
                  className={`text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Tags:
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {note.tags.map((tag, index) => (
                    <View
                      key={index}
                      className={`px-3 py-1 rounded-full ${
                        isDark ? 'bg-gray-800' : 'bg-gray-200'
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        #{tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Dates */}
            <View
              className={`border-t pt-4 ${
                isDark ? 'border-gray-800' : 'border-gray-200'
              }`}
            >
              <View className="flex-row items-center gap-2 mb-2">
                <Calendar size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text
                  className={`text-sm ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}
                >
                  Dibuat: {formatDate(note.createdAt)}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Calendar size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text
                  className={`text-sm ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}
                >
                  Diperbarui: {formatDate(note.updatedAt)}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Close Button */}
          <View className="px-6 pb-8">
            <TouchableOpacity
              onPress={onClose}
              className="bg-blue-500 py-4 rounded-lg"
            >
              <Text className="text-center font-semibold text-white">
                Tutup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
