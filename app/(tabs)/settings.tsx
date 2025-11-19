import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Moon, Sun, Trash2 } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { todoService } from '@/services/todoService';
import { noteService } from '@/services/noteService';
import { Card } from '@/components/common/Card';

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useThemeStore();
  const isDark = colorScheme === 'dark';

  const [todoCount, setTodoCount] = useState(0);
  const [noteCount, setNoteCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const todos = await todoService.getTodos();
    const notes = await noteService.getNotes();
    setTodoCount(todos.length);
    setNoteCount(notes.length);
  };

  const toggleTheme = () => {
    setColorScheme(isDark ? 'light' : 'dark');
  };

  const handleClearAllTodos = () => {
    Alert.alert(
      'Hapus Semua Todo',
      'Apakah Anda yakin ingin menghapus semua todo? Tindakan ini tidak dapat dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            await todoService.clearAllTodos();
            setTodoCount(0);
            Alert.alert('Berhasil', 'Semua todo telah dihapus');
          },
        },
      ]
    );
  };

  const handleClearAllNotes = () => {
    Alert.alert(
      'Hapus Semua Catatan',
      'Apakah Anda yakin ingin menghapus semua catatan? Tindakan ini tidak dapat dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            await noteService.clearAllNotes();
            setNoteCount(0);
            Alert.alert('Berhasil', 'Semua catatan telah dihapus');
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}
    >
      <View className="p-4 pt-12">
        <Text
          className={`text-3xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Pengaturan
        </Text>

        {/* Appearance Card */}
        <Card className="mb-4">
          <Text
            className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Tampilan
          </Text>

          <TouchableOpacity
            onPress={toggleTheme}
            className={`flex-row items-center justify-between p-4 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <View className="flex-row items-center">
              {isDark ? (
                <Moon size={20} color="#9CA3AF" />
              ) : (
                <Sun size={20} color="#F59E0B" />
              )}
              <Text className={`ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {isDark ? 'Mode Gelap' : 'Mode Terang'}
              </Text>
            </View>
            <Text className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {isDark ? 'Aktif' : 'Nonaktif'}
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Statistics Card */}
        <Card className="mb-4">
          <Text
            className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Statistik
          </Text>

          <View className="space-y-3">
            <View className="flex-row justify-between items-center py-2">
              <Text className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Total Todo
              </Text>
              <Text
                className={`font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {todoCount}
              </Text>
            </View>
            <View className="flex-row justify-between items-center py-2">
              <Text className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Total Catatan
              </Text>
              <Text
                className={`font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {noteCount}
              </Text>
            </View>
          </View>
        </Card>

        {/* Data Management Card */}
        <Card>
          <Text
            className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Kelola Data
          </Text>

          <TouchableOpacity
            onPress={handleClearAllTodos}
            className={`flex-row items-center justify-between p-4 rounded-lg mb-3 ${
              isDark ? 'bg-red-900/20' : 'bg-red-50'
            }`}
          >
            <View className="flex-row items-center">
              <Trash2 size={20} color={isDark ? '#ef4444' : '#dc2626'} />
              <Text className={`ml-3 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                Hapus Semua Todo
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClearAllNotes}
            className={`flex-row items-center justify-between p-4 rounded-lg ${
              isDark ? 'bg-red-900/20' : 'bg-red-50'
            }`}
          >
            <View className="flex-row items-center">
              <Trash2 size={20} color={isDark ? '#ef4444' : '#dc2626'} />
              <Text className={`ml-3 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                Hapus Semua Catatan
              </Text>
            </View>
          </TouchableOpacity>
        </Card>

        {/* App Info */}
        <View className="mt-6 items-center">
          <Text className={`text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            Todo & Note App v1.0.0
          </Text>
          <Text className={`text-xs mt-1 ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>
            Offline-first • No cloud sync
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
