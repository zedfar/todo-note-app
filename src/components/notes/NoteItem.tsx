/**
 * NoteItem Component
 *
 * Displays a single note item with title, content preview, pin status, and actions
 * Supports light/dark theme
 */

import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Pin, Trash2, Edit } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import type { Note } from '@/types/note.types';

interface NoteItemProps {
  note: Note;
  onPress: (note: Note) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
}

export function NoteItem({
  note,
  onPress,
  onTogglePin,
  onDelete,
  onEdit,
}: NoteItemProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const handleDelete = () => {
    Alert.alert(
      'Hapus Catatan',
      'Apakah Anda yakin ingin menghapus catatan ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => onDelete(note.id),
        },
      ],
      { cancelable: true }
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(note)}
      activeOpacity={0.7}
      className={`rounded-lg p-4 mb-3 border ${
        note.isPinned
          ? isDark
            ? 'bg-yellow-900/20 border-yellow-700'
            : 'bg-yellow-50 border-yellow-300'
          : isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Header */}
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-2">
          <Text
            className={`text-base font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
            numberOfLines={1}
          >
            {note.title}
          </Text>
        </View>

        {/* Pin Indicator */}
        {note.isPinned && (
          <Pin
            size={16}
            color={isDark ? '#fbbf24' : '#f59e0b'}
            fill={isDark ? '#fbbf24' : '#f59e0b'}
          />
        )}
      </View>

      {/* Content Preview */}
      <Text
        className={`text-sm mb-3 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}
        numberOfLines={3}
      >
        {note.content}
      </Text>

      {/* Footer */}
      <View className="flex-row items-center justify-between">
        {/* Category & Date */}
        <View className="flex-1 flex-row items-center gap-2">
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

          <Text
            className={`text-xs ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`}
          >
            {formatDate(note.updatedAt)}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => onTogglePin(note.id)}
            className="p-1"
          >
            <Pin
              size={16}
              color={
                note.isPinned
                  ? isDark
                    ? '#fbbf24'
                    : '#f59e0b'
                  : isDark
                  ? '#9ca3af'
                  : '#6b7280'
              }
              fill={note.isPinned ? (isDark ? '#fbbf24' : '#f59e0b') : 'none'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onEdit(note)}
            className="p-1"
          >
            <Edit size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            className="p-1"
          >
            <Trash2 size={16} color={isDark ? '#ef4444' : '#dc2626'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <View className="flex-row flex-wrap gap-1 mt-2">
          {note.tags.map((tag, index) => (
            <View
              key={index}
              className={`px-2 py-0.5 rounded ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            >
              <Text
                className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                #{tag}
              </Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}
