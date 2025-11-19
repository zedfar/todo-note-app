/**
 * Service Example - With Mock API Support
 *
 * Use this pattern for:
 * - Apps that need mock API during development
 * - Testing with dummy data
 * - Apps that will use real API in production
 *
 * Features:
 * - Switches between mock and real API based on environment
 * - Full CRUD operations
 * - Type-safe with TypeScript
 * - Error handling
 */

import { api } from '@/services/api';
import { mockApi } from '@/services/mockApi';
import { API_CONFIG } from '@/utils/constants';

// Type definitions
export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleDto {
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
}

export interface UpdateArticleDto extends Partial<CreateArticleDto> {}

/**
 * Article Service
 *
 * Automatically switches between mock API and real API based on API_CONFIG.MOCK_API
 * - In development (dev): Uses mock API from src/services/mockApi
 * - In staging/production: Uses real API from server
 */
class ArticleService {
  /**
   * Get all articles
   */
  async getArticles(): Promise<Article[]> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get<Article[]>('/articles');
    }
    return await api.get<Article[]>('/articles');
  }

  /**
   * Get single article by ID
   */
  async getArticleById(id: string): Promise<Article> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get<Article>(`/articles/${id}`);
    }
    return await api.get<Article>(`/articles/${id}`);
  }

  /**
   * Create new article
   */
  async createArticle(data: CreateArticleDto): Promise<Article> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.post<Article>('/articles', data);
    }
    return await api.post<Article>('/articles', data);
  }

  /**
   * Update existing article
   */
  async updateArticle(id: string, data: UpdateArticleDto): Promise<Article> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.put<Article>(`/articles/${id}`, data);
    }
    return await api.put<Article>(`/articles/${id}`, data);
  }

  /**
   * Delete article
   */
  async deleteArticle(id: string): Promise<void> {
    if (API_CONFIG.MOCK_API) {
      await mockApi.delete(`/articles/${id}`);
    } else {
      await api.delete(`/articles/${id}`);
    }
  }

  /**
   * Search articles by title
   */
  async searchArticles(query: string): Promise<Article[]> {
    if (API_CONFIG.MOCK_API) {
      // In mock mode, we fetch all and filter client-side
      const articles = await mockApi.get<Article[]>('/articles');
      return articles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    // In production, server handles search
    return await api.get<Article[]>('/articles/search', { params: { q: query } });
  }

  /**
   * Get articles by author
   */
  async getArticlesByAuthor(author: string): Promise<Article[]> {
    if (API_CONFIG.MOCK_API) {
      const articles = await mockApi.get<Article[]>('/articles');
      return articles.filter(article => article.author === author);
    }
    return await api.get<Article[]>(`/articles/author/${author}`);
  }
}

// Export singleton instance
export const articleService = new ArticleService();

/**
 * Usage Examples:
 *
 * 1. Get all articles:
 *    const articles = await articleService.getArticles();
 *
 * 2. Get single article:
 *    const article = await articleService.getArticleById('123');
 *
 * 3. Create article:
 *    const newArticle = await articleService.createArticle({
 *      title: 'My Article',
 *      content: 'Article content...',
 *      author: 'John Doe',
 *    });
 *
 * 4. Update article:
 *    const updated = await articleService.updateArticle('123', {
 *      title: 'Updated Title',
 *    });
 *
 * 5. Delete article:
 *    await articleService.deleteArticle('123');
 *
 * 6. Search articles:
 *    const results = await articleService.searchArticles('react');
 */
