/**
 * List Screen Example - No Authentication Required
 *
 * Use this pattern for:
 * - Public content (news, articles, products)
 * - Apps without authentication
 * - Simple data display apps
 *
 * Features:
 * - Fetches data from API or mock API
 * - Loading and error states
 * - Pull to refresh
 * - Theme support (light/dark)
 * - No auth required
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

// Example: News interface
interface NewsItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  publishedAt: string;
}

// Example: Mock service (replace with your actual service)
const mockNewsService = {
  getNews: async (): Promise<NewsItem[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: '1',
        title: 'Breaking News',
        description: 'This is a sample news article',
        imageUrl: 'https://picsum.photos/400/300?random=1',
        publishedAt: '2024-11-18T10:00:00Z',
      },
      {
        id: '2',
        title: 'Technology Update',
        description: 'Latest tech trends',
        imageUrl: 'https://picsum.photos/400/300?random=2',
        publishedAt: '2024-11-17T14:00:00Z',
      },
    ];
  },
};

export default function NewsListScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  // State management
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  const fetchNews = async () => {
    try {
      setError(null);
      const data = await mockNewsService.getNews();
      setNews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Pull to refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  // Navigate to detail
  const handleItemPress = (item: NewsItem) => {
    router.push(`/news/${item.id}`);
  };

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Loading news...
        </Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
        <Text className="text-red-500 text-lg font-semibold mb-2">Error</Text>
        <Text className={`text-center mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={fetchNews}
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Empty state
  if (news.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
        <Text className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          No news available
        </Text>
      </View>
    );
  }

  // Main content
  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
      <FlatList
        data={news}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleItemPress(item)}
            className={`mx-4 mt-4 rounded-lg overflow-hidden ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                className="w-full h-48"
                resizeMode="cover"
              />
            )}
            <View className="p-4">
              <Text className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {item.title}
              </Text>
              <Text className={`mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.description}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {new Date(item.publishedAt).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}
