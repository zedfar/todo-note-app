/**
 * Form Screen Example - Create/Edit Data
 *
 * Use this pattern for:
 * - Creating new items (products, posts, tasks, etc.)
 * - Editing existing items
 * - Forms with validation
 *
 * Features:
 * - Create and Edit modes
 * - Form validation
 * - Loading states
 * - Error handling
 * - Theme support (light/dark)
 * - Works with or without auth
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
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
}

// Form data type (omit id for creation)
type ProductFormData = Omit<Product, 'id'>;

// Example: Mock service (replace with your actual service)
const mockProductService = {
  getProductById: async (id: string): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      name: 'Sample Product',
      description: 'This is a sample product',
      price: 50000,
      category: 'Electronics',
      stock: 100,
    };
  },
  createProduct: async (data: ProductFormData): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: Date.now().toString(), ...data };
  },
  updateProduct: async (id: string, data: ProductFormData): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id, ...data };
  },
};

export default function ProductFormScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Check if we're in edit mode
  const isEditMode = !!params.id;
  const productId = params.id as string;

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
  });

  // UI state
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  // Load existing product in edit mode
  useEffect(() => {
    if (isEditMode) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      const product = await mockProductService.getProductById(productId);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load product',
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fix the errors in the form',
      });
      return;
    }

    setSubmitting(true);
    try {
      if (isEditMode) {
        await mockProductService.updateProduct(productId, formData);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Product updated successfully',
        });
      } else {
        await mockProductService.createProduct(formData);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Product created successfully',
        });
      }
      router.back();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: isEditMode ? 'Failed to update product' : 'Failed to create product',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Update field
  const updateField = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}
    >
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <Text className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {isEditMode ? 'Edit Product' : 'Create Product'}
        </Text>

        {/* Product Name */}
        <View className="mb-4">
          <Text className={`mb-2 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Product Name *
          </Text>
          <TextInput
            className={`border rounded-lg px-4 py-3 ${
              errors.name
                ? 'border-red-500'
                : isDark
                ? 'border-gray-700 text-white'
                : 'border-gray-300 text-gray-900'
            }`}
            placeholder="Enter product name"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
          />
          {errors.name && (
            <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>
          )}
        </View>

        {/* Description */}
        <View className="mb-4">
          <Text className={`mb-2 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Description *
          </Text>
          <TextInput
            className={`border rounded-lg px-4 py-3 ${
              errors.description
                ? 'border-red-500'
                : isDark
                ? 'border-gray-700 text-white'
                : 'border-gray-300 text-gray-900'
            }`}
            placeholder="Enter description"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={formData.description}
            onChangeText={(value) => updateField('description', value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.description && (
            <Text className="text-red-500 text-sm mt-1">{errors.description}</Text>
          )}
        </View>

        {/* Price */}
        <View className="mb-4">
          <Text className={`mb-2 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Price *
          </Text>
          <TextInput
            className={`border rounded-lg px-4 py-3 ${
              errors.price
                ? 'border-red-500'
                : isDark
                ? 'border-gray-700 text-white'
                : 'border-gray-300 text-gray-900'
            }`}
            placeholder="Enter price"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={formData.price.toString()}
            onChangeText={(value) => updateField('price', parseFloat(value) || 0)}
            keyboardType="numeric"
          />
          {errors.price && (
            <Text className="text-red-500 text-sm mt-1">{errors.price}</Text>
          )}
        </View>

        {/* Category */}
        <View className="mb-4">
          <Text className={`mb-2 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Category *
          </Text>
          <TextInput
            className={`border rounded-lg px-4 py-3 ${
              errors.category
                ? 'border-red-500'
                : isDark
                ? 'border-gray-700 text-white'
                : 'border-gray-300 text-gray-900'
            }`}
            placeholder="Enter category"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={formData.category}
            onChangeText={(value) => updateField('category', value)}
          />
          {errors.category && (
            <Text className="text-red-500 text-sm mt-1">{errors.category}</Text>
          )}
        </View>

        {/* Stock */}
        <View className="mb-6">
          <Text className={`mb-2 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Stock *
          </Text>
          <TextInput
            className={`border rounded-lg px-4 py-3 ${
              errors.stock
                ? 'border-red-500'
                : isDark
                ? 'border-gray-700 text-white'
                : 'border-gray-300 text-gray-900'
            }`}
            placeholder="Enter stock quantity"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={formData.stock.toString()}
            onChangeText={(value) => updateField('stock', parseInt(value) || 0)}
            keyboardType="numeric"
          />
          {errors.stock && (
            <Text className="text-red-500 text-sm mt-1">{errors.stock}</Text>
          )}
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className={`flex-1 py-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
            disabled={submitting}
          >
            <Text className={`text-center font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            className="flex-1 bg-blue-500 py-3 rounded-lg"
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold">
                {isEditMode ? 'Update' : 'Create'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
