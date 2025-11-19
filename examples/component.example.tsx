/**
 * COMPONENT EXAMPLE
 *
 * This example shows how to create a reusable component with:
 * - TypeScript props interface
 * - Theme support
 * - Variants and sizes
 * - Accessibility
 * - Touch feedback
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

// Example: Item Card Component
interface ItemCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  onPress?: () => void;
  variant?: 'default' | 'highlighted';
  className?: string;
}

export function ItemCard({
  title,
  description,
  imageUrl,
  onPress,
  variant = 'default',
  className = '',
}: ItemCardProps) {
  const { colors, isDark } = useTheme();

  const baseClasses = `rounded-lg p-4 ${className}`;
  const variantClasses = variant === 'highlighted'
    ? isDark ? 'bg-blue-900/50 border-2 border-blue-500' : 'bg-blue-50 border-2 border-blue-500'
    : isDark ? 'bg-gray-800' : 'bg-white';

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      className={`${baseClasses} ${variantClasses}`}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      accessible={!!onPress}
      accessibilityRole={onPress ? 'button' : 'none'}
      accessibilityLabel={title}
    >
      {imageUrl && (
        <View className="w-full h-40 rounded-lg mb-3 bg-gray-300" />
        // TODO: Add actual image component
        // <Image source={{ uri: imageUrl }} className="w-full h-40 rounded-lg mb-3" />
      )}

      <Text className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </Text>

      <Text
        className={isDark ? 'text-gray-400' : 'text-gray-600'}
        numberOfLines={3}
      >
        {description}
      </Text>

      {variant === 'highlighted' && (
        <View className="mt-3">
          <Text className="text-blue-500 font-semibold">
            Featured
          </Text>
        </View>
      )}
    </Wrapper>
  );
}

// Usage example:
/*
import { ItemCard } from '@/components/ItemCard';

<ItemCard
  title="Item Title"
  description="Item description goes here"
  onPress={() => console.log('Item pressed')}
  variant="default"
/>
*/
