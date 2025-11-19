/**
 * CUSTOM HOOK EXAMPLE
 *
 * This example shows how to create a custom hook with:
 * - State management
 * - Data fetching
 * - Error handling
 * - Loading states
 * - Refresh functionality
 * - TypeScript types
 */

import { useState, useEffect, useCallback } from 'react';

// Example: Use Items Hook
interface Item {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface UseItemsOptions {
  autoFetch?: boolean;
  limit?: number;
}

interface UseItemsReturn {
  items: Item[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export function useItems(options: UseItemsOptions = {}): UseItemsReturn {
  const { autoFetch = true, limit = 20 } = options;

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = useCallback(async (pageNum: number, reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // const response = await itemService.getItems({ page: pageNum, limit });

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockItems: Item[] = Array.from({ length: limit }, (_, i) => ({
        id: `${pageNum}-${i}`,
        name: `Item ${pageNum}-${i}`,
        description: `Description for item ${pageNum}-${i}`,
        createdAt: new Date().toISOString(),
      }));

      if (reset) {
        setItems(mockItems);
      } else {
        setItems(prev => [...prev, ...mockItems]);
      }

      setHasMore(mockItems.length === limit);
      setPage(pageNum);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch items';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const refresh = useCallback(async () => {
    await fetchItems(1, true);
  }, [fetchItems]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchItems(page + 1, false);
    }
  }, [loading, hasMore, page, fetchItems]);

  useEffect(() => {
    if (autoFetch) {
      fetchItems(1, true);
    }
  }, [autoFetch, fetchItems]);

  return {
    items,
    loading,
    error,
    refresh,
    loadMore,
    hasMore,
  };
}

// Usage example:
/*
import { useItems } from '@/hooks/useItems';

function MyScreen() {
  const { items, loading, error, refresh, loadMore, hasMore } = useItems({
    autoFetch: true,
    limit: 20,
  });

  if (loading && items.length === 0) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={refresh} />;
  }

  return (
    <FlatList
      data={items}
      onRefresh={refresh}
      refreshing={loading}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
    />
  );
}
*/
