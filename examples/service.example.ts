/**
 * SERVICE EXAMPLE
 *
 * This example shows how to create an API service with:
 * - CRUD operations
 * - TypeScript types
 * - Error handling
 * - Request/response types
 * - Pagination support
 */

import { apiClient } from '@/services/api';

// Example: Item Service

// Types
export interface Item {
  id: string;
  name: string;
  description: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemDto {
  name: string;
  description: string;
  price?: number;
  category?: string;
  imageUrl?: string;
}

export interface UpdateItemDto extends Partial<CreateItemDto> {}

export interface GetItemsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface GetItemsResponse {
  items: Item[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Service
export const itemService = {
  /**
   * Get all items with optional filters
   */
  getItems: async (params?: GetItemsParams): Promise<GetItemsResponse> => {
    const response = await apiClient.get<GetItemsResponse>('/items', { params });
    return response.data;
  },

  /**
   * Get single item by ID
   */
  getItemById: async (id: string): Promise<Item> => {
    const response = await apiClient.get<Item>(`/items/${id}`);
    return response.data;
  },

  /**
   * Create new item
   */
  createItem: async (data: CreateItemDto): Promise<Item> => {
    const response = await apiClient.post<Item>('/items', data);
    return response.data;
  },

  /**
   * Update existing item
   */
  updateItem: async (id: string, data: UpdateItemDto): Promise<Item> => {
    const response = await apiClient.put<Item>(`/items/${id}`, data);
    return response.data;
  },

  /**
   * Delete item
   */
  deleteItem: async (id: string): Promise<void> => {
    await apiClient.delete(`/items/${id}`);
  },

  /**
   * Search items
   */
  searchItems: async (query: string): Promise<Item[]> => {
    const response = await apiClient.get<Item[]>('/items/search', {
      params: { q: query },
    });
    return response.data;
  },

  /**
   * Get items by category
   */
  getItemsByCategory: async (category: string): Promise<Item[]> => {
    const response = await apiClient.get<Item[]>(`/items/category/${category}`);
    return response.data;
  },
};

// Usage example:
/*
import { itemService } from '@/services/itemService';

// Get all items
const items = await itemService.getItems({
  page: 1,
  limit: 20,
  category: 'electronics',
  sortBy: 'price',
  sortOrder: 'desc'
});

// Get single item
const item = await itemService.getItemById('123');

// Create item
const newItem = await itemService.createItem({
  name: 'New Item',
  description: 'Item description',
  price: 99.99,
  category: 'electronics',
});

// Update item
const updatedItem = await itemService.updateItem('123', {
  price: 79.99,
});

// Delete item
await itemService.deleteItem('123');

// Search items
const searchResults = await itemService.searchItems('laptop');

// Get by category
const categoryItems = await itemService.getItemsByCategory('electronics');
*/
