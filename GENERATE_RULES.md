# Code Generation Rules

Guidelines for AI agents generating code for this project.

## ⚠️ CRITICAL: Package Management & Tech Stack

### STRICT RULES - Dependencies

**NEVER add new dependencies** without explicit user permission!

1. **DO NOT add new dependencies** - Use only what's in package.json
2. **DO NOT suggest installing** additional libraries
3. **DO NOT upgrade/downgrade** package versions
4. **FOLLOW exact versions** specified in package.json

### Fixed Tech Stack Versions

```json
{
  "react": "19.1.0",
  "react-native": "0.81.4",
  "expo": "^54.0.10",
  "expo-router": "~6.0.12",
  "nativewind": "^4.0.36",
  "zustand": "^5.0.0"
}
```

### Allowed Libraries (Already Installed)

Only use these packages that are already in package.json:

**State Management:**
- `zustand` (^5.0.0) - Global state
- `@tanstack/react-query` (^5.51.0) - Server state
- `react-hook-form` (^7.66.0) - Forms

**UI & Styling:**
- `nativewind` (^4.0.36) - Tailwind CSS
- `lucide-react-native` (^0.546.0) - Icons
- `react-native-toast-message` (^2.3.3) - Toasts
- `react-native-modal` (^13.0.1) - Modals
- `react-native-paper` (^5.12.3) - Material UI

**Navigation:**
- `expo-router` (~6.0.12) - File-based routing

**HTTP & API:**
- `axios` (^1.7.2) - HTTP client

**Expo Modules (SDK 54):**
- All expo-* packages are pinned to SDK 54 compatible versions
- See package.json for complete list

### Examples of What NOT to Do

```typescript
// ❌ DON'T suggest installing new packages
"Let's install react-query for data fetching"
"You need to install expo-image"
"Add lodash for utilities"

// ❌ DON'T use incompatible Expo SDK versions
import { Image } from 'expo-image'; // If not in package.json

// ❌ DON'T suggest version upgrades
"Upgrade to Expo SDK 51"
"Use React 18 instead"

// ✅ DO use existing packages
import { useQuery } from '@tanstack/react-query'; // Already installed
import { Camera } from 'expo-camera'; // Already installed (SDK 54)
```

### What to Do Instead

```typescript
// ✅ Use built-in utilities
const unique = [...new Set(array)]; // Instead of lodash.uniq

// ✅ Use existing packages
import { useQuery } from '@tanstack/react-query'; // ✓ Already installed
import { Camera } from 'expo-camera'; // ✓ Already installed

// ✅ Write custom utilities
// src/utils/helpers.ts
export const debounce = (fn, delay) => { /* ... */ };
```

### When User Asks for New Feature

1. **First**: Check if existing packages can do it
2. **Second**: Implement with vanilla JavaScript/React Native
3. **Last resort**: Ask user if they want to add new dependency

## File Locations

From `ai-context.json`:

```json
{
  "screensPath": "app",
  "componentsPath": "src/components",
  "hooksPath": "src/hooks",
  "servicesPath": "src/services",
  "mockApiPath": "src/services/mockApi",
  "storePath": "src/store",
  "typesPath": "src/types",
  "utilsPath": "src/utils",
  "themePath": "src/theme",
  "mockDataPath": "server/db.json",
  "examples": "examples",
  "examplesScreens": "examples/screens",
  "examplesServices": "examples/services",
  "examplesApps": "examples/apps",
  "templateVariants": "TEMPLATE_VARIANTS.md"
}
```

## General Rules

1. **Check Template Variant First** - Read `TEMPLATE_VARIANTS.md` to understand which variant fits your app
2. **Use TypeScript** - All files must have proper types
3. **Use Path Aliases** - Import with `@/` not `../../`
4. **Follow Examples** - Check `examples/` folder first (see Examples Guide below)
5. **Theme Support** - Always use `useThemeStore` for colors
6. **Keep It Simple** - Don't over-engineer

## 📁 Choosing the Right Examples

Before generating code, determine which examples to follow:

### For Complete App Architecture
Check `examples/apps/` to understand overall structure:
- **`todo-offline/`** - No auth, no API (offline storage)
- **`news-no-auth/`** - No auth, with API (public content)
- **`dashboard-with-auth/`** - With auth, with API (protected content)

### For Screen Patterns
Check `examples/screens/` for specific screen types:
- **`list-screen-no-auth.example.tsx`** - Public list (news, products, recipes)
- **`list-screen-with-auth.example.tsx`** - Protected list (tasks, orders, notifications)
- **`form-screen.example.tsx`** - Create/edit forms with validation
- **`detail-screen.example.tsx`** - Detail page with actions

### For Service Patterns
Check `examples/services/` for data layer:
- **`service-with-mock.example.ts`** - API with mock support (dev/prod switch)
- **`service-without-mock.example.ts`** - Direct API only (third-party APIs)
- **`offline-service.example.ts`** - Offline storage with AsyncStorage

## Screens (app/)

**Location**: `app/(tabs)/` or `app/(auth)/`

**Pattern**:
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

export default function MyScreen() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
      {/* Content */}
    </View>
  );
}
```

**Requirements**:
- Export default
- Handle loading state
- Handle error state
- Support theme
- Use proper TypeScript

## Components (src/components/)

**Location**: `src/components/common/` or `src/components/shared/`

**Pattern**:
```typescript
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

interface MyComponentProps {
  title: string;
  onPress: () => void;
}

export function MyComponent({ title, onPress }: MyComponentProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity onPress={onPress}>
      <Text className={isDark ? 'text-white' : 'text-gray-900'}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
```

**Requirements**:
- Named export (not default)
- TypeScript interface for props
- Support theme
- Use NativeWind classes when possible

## Hooks (src/hooks/)

**Location**: `src/hooks/`

**Pattern**:
```typescript
import { useState, useEffect } from 'react';

interface UseDataReturn {
  data: any[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useData(): UseDataReturn {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      // Fetch logic
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refresh: fetchData };
}
```

**Requirements**:
- Named export with `use` prefix
- Return object with clear names
- Handle loading and error states
- TypeScript return type

## Services (src/services/)

**Location**: `src/services/`

**Pattern**:
```typescript
import { apiClient } from './api';

interface Item {
  id: string;
  name: string;
}

export const itemService = {
  getItems: async (): Promise<Item[]> => {
    const response = await apiClient.get('/items');
    return response.data;
  },

  getItemById: async (id: string): Promise<Item> => {
    const response = await apiClient.get(`/items/${id}`);
    return response.data;
  },

  createItem: async (data: Partial<Item>): Promise<Item> => {
    const response = await apiClient.post('/items', data);
    return response.data;
  },
};
```

**Requirements**:
- Export as const object
- Use apiClient from `./api`
- Async/await
- TypeScript types for all params and returns

## Types (src/types/)

**Location**: `src/types/`

**Pattern**:
```typescript
// item.types.ts

export interface Item {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface CreateItemDto {
  name: string;
  description: string;
}

export type ItemStatus = 'active' | 'inactive' | 'deleted';
```

**Requirements**:
- Use `.types.ts` suffix
- Export all types
- Group related types in one file

## State Management (src/store/)

**Location**: `src/store/`

**Pattern**:
```typescript
import { create } from 'zustand';

interface MyState {
  items: any[];
  loading: boolean;
  fetchItems: () => Promise<void>;
}

export const useMyStore = create<MyState>((set) => ({
  items: [],
  loading: false,

  fetchItems: async () => {
    set({ loading: true });
    try {
      // Fetch logic
      set({ items: [] });
    } finally {
      set({ loading: false });
    }
  },
}));
```

**Requirements**:
- Use Zustand's `create`
- Export with `use` prefix
- TypeScript interface for state

## Styling

**Use NativeWind (Tailwind) classes**:
```typescript
<View className="flex-1 bg-white p-4">
  <Text className="text-lg font-bold text-gray-900">
    Hello
  </Text>
</View>
```

**For theme colors**:
```typescript
const isDark = colorScheme === 'dark';

<View className={isDark ? 'bg-black' : 'bg-white'}>
  <Text className={isDark ? 'text-white' : 'text-gray-900'}>
    Hello
  </Text>
</View>
```

## Imports Order

```typescript
// 1. React
import React, { useState } from 'react';

// 2. React Native
import { View, Text } from 'react-native';

// 3. Third-party
import { useRouter } from 'expo-router';

// 4. Local (with path aliases)
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store/authStore';
```

## Error Handling

```typescript
try {
  const data = await service.getData();
  setData(data);
} catch (error) {
  console.error('Error:', error);
  setError(error.message);
}
```

## Loading States

Always show loading:
```typescript
if (loading) {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}
```

## Checklist

Before generating code:

- [ ] **Check TEMPLATE_VARIANTS.md** - Understand which template variant to use
- [ ] **Check examples/apps/** - See complete app example for your use case
- [ ] **Check examples/screens/** - Use appropriate screen pattern (auth/no-auth)
- [ ] **Check examples/services/** - Use appropriate service pattern (mock/no-mock/offline)
- [ ] Check `examples/` folder for similar pattern
- [ ] Use TypeScript with proper types
- [ ] Use path aliases (`@/`)
- [ ] Support theme (light/dark)
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Follow file naming conventions
- [ ] Export correctly (named vs default)

## Quick Reference

| Type | Location | Export | Naming |
|------|----------|--------|--------|
| Screen | `app/(tabs)/` | default | `my-screen.tsx` |
| Component | `src/components/` | named | `MyComponent.tsx` |
| Hook | `src/hooks/` | named | `useMyHook.ts` |
| Service | `src/services/` | const | `myService.ts` |
| Store | `src/store/` | named | `myStore.ts` |
| Types | `src/types/` | named | `my.types.ts` |

## Examples

Always refer to `examples/` folder for complete, working patterns:

### Complete App Examples
- `examples/apps/todo-offline/README.md` - Offline todo app
- `examples/apps/news-no-auth/README.md` - Public news app
- `examples/apps/dashboard-with-auth/README.md` - Protected dashboard

### Screen Examples
- `examples/screens/list-screen-no-auth.example.tsx` - Public list
- `examples/screens/list-screen-with-auth.example.tsx` - Protected list
- `examples/screens/form-screen.example.tsx` - Create/edit forms
- `examples/screens/detail-screen.example.tsx` - Detail page

### Service Examples
- `examples/services/service-with-mock.example.ts` - API with mock
- `examples/services/service-without-mock.example.ts` - Direct API
- `examples/services/offline-service.example.ts` - Offline storage

### Legacy Examples (Generic Patterns)
- `examples/screen.example.tsx` - Generic list screen
- `examples/component.example.tsx` - Generic component
- `examples/hook.example.ts` - Generic hook
- `examples/service.example.ts` - Generic service

**Follow these patterns exactly - they work!**

Read `TEMPLATE_VARIANTS.md` to choose the right template variant for your app.
