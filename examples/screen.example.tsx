/**
 * SCREEN EXAMPLE
 *
 * This example shows how to create a screen with:
 * - Data fetching from API
 * - Loading and error states
 * - Theme support
 * - List rendering with empty state
 * - Pull to refresh
 */

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '@/store/themeStore';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

// Example: News List Screen
interface NewsItem {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
}

export default function NewsListScreen() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  // State management
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  const fetchNews = async () => {
    try {
      setError(null);
      // TODO: Replace with actual API call
      // const response = await newsService.getNews();
      // setNews(response);

      // Mock data for example
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNews([
        { id: '1', title: 'Example News 1', description: 'Description 1', publishedAt: new Date().toISOString() },
        { id: '2', title: 'Example News 2', description: 'Description 2', publishedAt: new Date().toISOString() },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  // Render item
  const renderItem = ({ item }: { item: NewsItem }) => (
    <Card className="mb-3">
      <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {item.title}
      </Text>
      <Text className={`mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {item.description}
      </Text>
      <Text className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
        {new Date(item.publishedAt).toLocaleDateString()}
      </Text>
    </Card>
  );

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
        <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Oops! Something went wrong
        </Text>
        <Text className={`mb-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {error}
        </Text>
        <Button title="Try Again" onPress={fetchNews} />
      </View>
    );
  }

  // Empty state
  if (news.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
        <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          No news available
        </Text>
        <Text className={`mb-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Check back later for updates
        </Text>
        <Button title="Refresh" onPress={fetchNews} />
      </View>
    );
  }

  // Main content
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
        }
      />
    </SafeAreaView>
  );
}
