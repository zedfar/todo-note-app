/**
 * Note Types
 *
 * Type definitions for Note items with full CRUD support
 */

export interface Note {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  isPinned?: boolean;
}

export interface UpdateNoteDto extends Partial<CreateNoteDto> {}

export type NoteFilter = 'all' | 'pinned';
