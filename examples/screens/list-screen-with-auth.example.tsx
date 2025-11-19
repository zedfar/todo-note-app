/**
 * List Screen Example - With Authentication
 *
 * Use this pattern for:
 * - Protected content (user's data, dashboard)
 * - Apps requiring authentication
 * - Personalized content
 *
 * Features:
 * - Requires user to be logged in
 * - Fetches user-specific data
 * - Loading and error states
 * - Pull to refresh
 * - Theme support (light/dark)
 * - Auth check with redirect
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';

// Example: User's task interface
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  userId: string;
}

// Example: Mock service (replace with your actual service)
const mockTaskService = {
  getUserTasks: async (userId: string): Promise<Task[]> => {
    // Simulate API call with auth token
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Write the initial project proposal',
        status: 'in_progress',
        dueDate: '2024-11-20T00:00:00Z',
        userId,
      },
      {
        id: '2',
        title: 'Review code changes',
        description: 'Review PR #123',
        status: 'pending',
        dueDate: '2024-11-19T00:00:00Z',
        userId,
      },
    ];
  },
};

export default function TaskListScreen() {
  const { colors, isDark } = useTheme();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // State management
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth check - redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  // Fetch data
  const fetchTasks = async () => {
    if (!user) return;

    try {
      setError(null);
      const data = await mockTaskService.getUserTasks(user.id);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchTasks();
    }
  }, [user, isAuthenticated]);

  // Pull to refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  // Navigate to detail
  const handleTaskPress = (task: Task) => {
    router.push(`/tasks/${task.id}`);
  };

  // Get status color
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get status text
  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Loading your tasks...
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
          onPress={fetchTasks}
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
        <Text className={`text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          No tasks yet
        </Text>
        <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Create your first task to get started
        </Text>
      </View>
    );
  }

  // Main content
  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
      {/* Header with user info */}
      <View className={`px-4 py-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Welcome, {user?.name}
        </Text>
        <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          You have {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={tasks}
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
            onPress={() => handleTaskPress(item)}
            className={`mx-4 mt-4 p-4 rounded-lg ${
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
            <View className="flex-row justify-between items-start mb-2">
              <Text className={`flex-1 text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {item.title}
              </Text>
              <View className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
                <Text className="text-white text-xs font-semibold">
                  {getStatusText(item.status)}
                </Text>
              </View>
            </View>
            <Text className={`mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {item.description}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Due: {new Date(item.dueDate).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}
