/**
 * Note Service - Offline Storage
 *
 * Manages notes using AsyncStorage for offline persistence
 * No API connection required - works completely offline
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Note, CreateNoteDto, UpdateNoteDto } from '@/types/note.types';

class NoteService {
  private STORAGE_KEY = '@notes';

  /**
   * Get all notes from storage
   */
  async getNotes(): Promise<Note[]> {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEY);
      const notes = data ? JSON.parse(data) : [];
      // Sort by pinned first, then by updatedAt descending
      return notes.sort((a: Note, b: Note) => {
        if (a.isPinned !== b.isPinned) {
          return a.isPinned ? -1 : 1;
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  }

  /**
   * Get single note by ID
   */
  async getNoteById(id: string): Promise<Note | null> {
    const notes = await this.getNotes();
    return notes.find((note) => note.id === id) || null;
  }

  /**
   * Create new note
   */
  async createNote(data: CreateNoteDto): Promise<Note> {
    const notes = await this.getNotes();

    const newNote: Note = {
      id: Date.now().toString(),
      title: data.title,
      content: data.content,
      category: data.category,
      tags: data.tags || [],
      isPinned: data.isPinned || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    notes.push(newNote);
    await this.saveNotes(notes);

    return newNote;
  }

  /**
   * Update existing note
   */
  async updateNote(id: string, data: UpdateNoteDto): Promise<Note | null> {
    const notes = await this.getNotes();
    const index = notes.findIndex((note) => note.id === id);

    if (index === -1) {
      throw new Error('Note not found');
    }

    const updatedNote: Note = {
      ...notes[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    notes[index] = updatedNote;
    await this.saveNotes(notes);

    return updatedNote;
  }

  /**
   * Delete note
   */
  async deleteNote(id: string): Promise<void> {
    const notes = await this.getNotes();
    const filtered = notes.filter((note) => note.id !== id);
    await this.saveNotes(filtered);
  }

  /**
   * Toggle note pin status
   */
  async togglePinNote(id: string): Promise<Note | null> {
    const note = await this.getNoteById(id);
    if (!note) return null;

    return await this.updateNote(id, { isPinned: !note.isPinned });
  }

  /**
   * Get pinned notes
   */
  async getPinnedNotes(): Promise<Note[]> {
    const notes = await this.getNotes();
    return notes.filter((note) => note.isPinned);
  }

  /**
   * Get notes by category
   */
  async getNotesByCategory(category: string): Promise<Note[]> {
    const notes = await this.getNotes();
    return notes.filter((note) => note.category === category);
  }

  /**
   * Search notes by title or content
   */
  async searchNotes(query: string): Promise<Note[]> {
    const notes = await this.getNotes();
    const lowerQuery = query.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery) ||
        note.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get all unique categories
   */
  async getCategories(): Promise<string[]> {
    const notes = await this.getNotes();
    const categories = notes
      .map((note) => note.category)
      .filter((category): category is string => !!category);
    return Array.from(new Set(categories));
  }

  /**
   * Get all unique tags
   */
  async getAllTags(): Promise<string[]> {
    const notes = await this.getNotes();
    const allTags = notes.flatMap((note) => note.tags || []);
    return Array.from(new Set(allTags));
  }

  /**
   * Clear all notes
   */
  async clearAllNotes(): Promise<void> {
    await AsyncStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Get notes statistics
   */
  async getNotesStats(): Promise<{
    total: number;
    pinned: number;
    categories: number;
    tags: number;
  }> {
    const notes = await this.getNotes();
    const categories = await this.getCategories();
    const tags = await this.getAllTags();

    return {
      total: notes.length,
      pinned: notes.filter((n) => n.isPinned).length,
      categories: categories.length,
      tags: tags.length,
    };
  }

  /**
   * Private: Save notes to storage
   */
  private async saveNotes(notes: Note[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
      throw new Error('Failed to save notes');
    }
  }
}

// Export singleton instance
export const noteService = new NoteService();
