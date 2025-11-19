/**
 * Detail Screen Example - Display Single Item
 *
 * Use this pattern for:
 * - Showing detail of a single item (product, post, user, etc.)
 * - Screens that receive parameters from navigation
 * - Detail pages with actions (edit, delete, share, etc.)
 *
 * Features:
 * - Receives ID from route params
 * - Fetches single item data
 * - Loading and error states
 * - Action buttons (edit, delete, etc.)
 * - Theme support (light/dark)
 * - Back navigation
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

// Example: Product interface
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  createdAt: string;
}

// Example: Mock service (replace with your actual service)
const mockProductService = {
  getProductById: async (id: string): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id,
      name: 'Wireless Headphones',
      description: 'Premium wireless headphones with active noise cancellation. Enjoy crystal clear sound quality with up to 30 hours of battery life.',
      price: 1500000,
      category: 'Electronics',
      stock: 25,
      imageUrl: 'https://picsum.photos/400/300?random=1',
      createdAt: '2024-11-18T10:00:00Z',
    };
  },
  deleteProduct: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
};

export default function ProductDetailScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Get product ID from params
  const productId = params.id as string;

  // State management
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data
  const fetchProduct = async () => {
    try {
      setError(null);
      const data = await mockProductService.getProductById(productId);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    } else {
      setError('No product ID provided');
      setLoading(false);
    }
  }, [productId]);

  // Handle edit
  const handleEdit = () => {
    router.push(`/products/edit/${productId}`);
  };

  // Handle delete
  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    if (!product) return;

    setDeleting(true);
    try {
      await mockProductService.deleteProduct(product.id);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Product deleted successfully',
      });
      router.back();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete product',
      });
    } finally {
      setDeleting(false);
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);
  };

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Loading product...
        </Text>
      </View>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
        <Text className="text-red-500 text-lg font-semibold mb-2">Error</Text>
        <Text className={`text-center mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {error || 'Product not found'}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Main content
  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
      <ScrollView>
        {/* Product Image */}
        {product.imageUrl && (
          <Image
            source={{ uri: product.imageUrl }}
            className="w-full h-80"
            resizeMode="cover"
          />
        )}

        {/* Product Info */}
        <View className="p-6">
          {/* Name and Price */}
          <View className="mb-4">
            <Text className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {product.name}
            </Text>
            <Text className="text-blue-500 text-3xl font-bold">
              {formatPrice(product.price)}
            </Text>
          </View>

          {/* Stock Status */}
          <View className="mb-4">
            <View className="flex-row items-center">
              <Text className={`mr-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Stock:
              </Text>
              <View className={`px-3 py-1 rounded-full ${
                product.stock > 10 ? 'bg-green-500' : 'bg-red-500'
              }`}>
                <Text className="text-white text-sm font-semibold">
                  {product.stock} units
                </Text>
              </View>
            </View>
          </View>

          {/* Category */}
          <View className="mb-4">
            <Text className={`mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Category
            </Text>
            <Text className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {product.category}
            </Text>
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className={`mb-2 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </Text>
            <Text className={`leading-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {product.description}
            </Text>
          </View>

          {/* Created Date */}
          <View className="mb-6">
            <Text className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Added on {new Date(product.createdAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={handleEdit}
              className="bg-blue-500 py-4 rounded-lg"
              disabled={deleting}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Edit Product
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className={`py-4 rounded-lg ${isDark ? 'bg-red-900' : 'bg-red-100'}`}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator color="#ef4444" />
              ) : (
                <Text className="text-red-500 text-center font-semibold text-lg">
                  Delete Product
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
