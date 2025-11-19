/**
 * Note List Screen
 *
 * Main screen for managing notes with search, pin, and CRUD operations
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
import { Plus, Search } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { noteService } from '@/services/noteService';
import { NoteItem } from '@/components/notes/NoteItem';
import { NoteForm } from '@/components/notes/NoteForm';
import { NoteDetail } from '@/components/notes/NoteDetail';
import type { Note, CreateNoteDto, UpdateNoteDto } from '@/types/note.types';

export default function NotesScreen() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await noteService.getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadNotes();
  };

  const handleCreateNote = async (data: CreateNoteDto) => {
    try {
      const newNote = await noteService.createNote(data);
      setNotes((prev) => [newNote, ...prev]);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async (data: UpdateNoteDto) => {
    if (!editingNote) return;

    try {
      const updated = await noteService.updateNote(editingNote.id, data);
      if (updated) {
        setNotes((prev) =>
          prev.map((note) => (note.id === updated.id ? updated : note))
        );
        // Re-sort after update (pinned notes first)
        loadNotes();
      }
      setEditingNote(null);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      const updated = await noteService.togglePinNote(id);
      if (updated) {
        // Reload to re-sort
        loadNotes();
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await noteService.deleteNote(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleNotePress = (note: Note) => {
    setSelectedNote(note);
    setShowDetail(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedNote(null);
  };

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;

    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.category?.toLowerCase().includes(query) ||
        note.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [notes, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: notes.length,
      pinned: notes.filter((n) => n.isPinned).length,
    };
  }, [notes]);

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
          Catatan
        </Text>
        <Text className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          {stats.total} catatan, {stats.pinned} dipasang
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
            placeholder="Cari catatan..."
            placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
            className={`flex-1 py-3 px-3 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          />
        </View>
      </View>

      {/* Note List */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteItem
            note={item}
            onPress={handleNotePress}
            onTogglePin={handleTogglePin}
            onDelete={handleDeleteNote}
            onEdit={handleEditNote}
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
                ? 'Tidak ada catatan yang ditemukan'
                : 'Belum ada catatan. Tambahkan yang pertama!'}
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

      {/* Note Form Modal */}
      <NoteForm
        visible={showForm}
        note={editingNote}
        onClose={handleCloseForm}
        onSubmit={(data) => {
          if (editingNote) {
            handleUpdateNote(data as UpdateNoteDto);
          } else {
            handleCreateNote(data as CreateNoteDto);
          }
        }}
      />

      {/* Note Detail Modal */}
      <NoteDetail
        visible={showDetail}
        note={selectedNote}
        onClose={handleCloseDetail}
      />
    </View>
  );
}
