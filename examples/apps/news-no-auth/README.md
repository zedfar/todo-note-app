# News App Example - No Authentication

Complete example of a news app with API but without authentication.

## Features

- ✅ **No authentication required** - Public content
- ✅ **Mock API support** - Dev mode with mock data
- ✅ **Real API ready** - Switch to production API
- ✅ **News list** - Browse all articles
- ✅ **News detail** - Read full article
- ✅ **Categories** - Filter by category
- ✅ **Search** - Search articles
- ✅ **Pull to refresh** - Refresh content
- ✅ **Theme support** - Light/dark mode

## Architecture

### No Authentication
- All content is public
- No login/register needed
- Remove auth folder from app structure
- Remove auth store
- Remove protected routes

### API Structure
```
API Endpoints:
GET  /articles          - List all articles
GET  /articles/:id      - Single article
GET  /categories        - List categories
GET  /articles?category - Filter by category
GET  /articles?search   - Search articles
```

## Files Structure

```
src/
├── types/
│   ├── article.types.ts        # Article type definitions
│   └── category.types.ts       # Category types
├── services/
│   ├── articleService.ts       # Article API service
│   └── mockApi/
│       ├── articles.mock.ts    # Mock articles data
│       └── categories.mock.ts  # Mock categories
├── hooks/
│   ├── useArticles.ts          # Fetch articles hook
│   └── useCategories.ts        # Fetch categories hook
├── components/
│   └── articles/
│       ├── ArticleCard.tsx     # Article preview card
│       ├── ArticleList.tsx     # List of articles
│       └── CategoryFilter.tsx  # Category filter chips
└── app/
    └── (tabs)/
        ├── index.tsx           # Articles list screen
        ├── categories.tsx      # Browse by category
        ├── search.tsx          # Search screen
        └── [id].tsx            # Article detail screen
```

## Implementation Steps

### 1. Remove Authentication

Remove these files/folders:
```bash
rm -rf app/(auth)/
rm src/store/authStore.ts
rm src/services/authService.ts
rm src/components/auth/
```

Update `app/_layout.tsx`:
```typescript
// Remove auth check and auth routes
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
```

### 2. Create Types
```typescript
// src/types/article.types.ts
export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  imageUrl?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
}
```

### 3. Add Mock Data
```json
// server/db.json
{
  "articles": [
    {
      "id": "1",
      "title": "Breaking News Title",
      "content": "Full article content...",
      "excerpt": "Short summary...",
      "author": "John Doe",
      "category": "technology",
      "imageUrl": "https://picsum.photos/400/300?random=1",
      "publishedAt": "2024-11-18T10:00:00Z",
      "createdAt": "2024-11-18T09:00:00Z",
      "updatedAt": "2024-11-18T09:00:00Z"
    }
  ],
  "categories": [
    {
      "id": "1",
      "name": "Technology",
      "slug": "technology",
      "icon": "💻",
      "color": "#3b82f6"
    }
  ]
}
```

### 4. Create Mock API
```typescript
// src/services/mockApi/articles.mock.ts
import * as db from 'server/db.json';

let articles = [...db.articles];

export async function get<T = any>(url: string): Promise<T> {
  if (url === '/articles') {
    return articles as unknown as T;
  }

  // Single article
  const match = url.match(/\/articles\/(\w+)/);
  if (match) {
    const article = articles.find(a => a.id === match[1]);
    if (!article) throw new Error('Article not found');
    return article as unknown as T;
  }

  throw new Error(`Unknown GET endpoint: ${url}`);
}
```

### 5. Create Service
```typescript
// src/services/articleService.ts
import { api } from './api';
import { mockApi } from './mockApi';
import { API_CONFIG } from '@/utils/constants';

export const articleService = {
  getArticles: async () => {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get('/articles');
    }
    return await api.get('/articles');
  },

  getArticleById: async (id: string) => {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get(`/articles/${id}`);
    }
    return await api.get(`/articles/${id}`);
  },

  getArticlesByCategory: async (category: string) => {
    if (API_CONFIG.MOCK_API) {
      const articles = await mockApi.get('/articles');
      return articles.filter(a => a.category === category);
    }
    return await api.get(`/articles?category=${category}`);
  },
};
```

### 6. Create Custom Hook
```typescript
// src/hooks/useArticles.ts
export function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticles = async () => {
    try {
      const data = await articleService.getArticles();
      setArticles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return { articles, loading, error, refresh: fetchArticles };
}
```

### 7. Create Components
```typescript
// src/components/articles/ArticleCard.tsx
export function ArticleCard({ article, onPress }) {
  const isDark = useThemeStore(s => s.colorScheme === 'dark');

  return (
    <TouchableOpacity onPress={onPress} className="mb-4">
      {article.imageUrl && (
        <Image source={{ uri: article.imageUrl }} className="w-full h-48" />
      )}
      <View className="p-4">
        <Text className={isDark ? 'text-white' : 'text-gray-900'}>
          {article.title}
        </Text>
        <Text className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          {article.excerpt}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
```

### 8. Create Screens
```typescript
// app/(tabs)/index.tsx
export default function ArticlesScreen() {
  const { articles, loading, error, refresh } = useArticles();
  const router = useRouter();

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <FlatList
      data={articles}
      renderItem={({ item }) => (
        <ArticleCard
          article={item}
          onPress={() => router.push(`/articles/${item.id}`)}
        />
      )}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={refresh} />
      }
    />
  );
}
```

### 9. Update Navigation
```typescript
// app/(tabs)/_layout.tsx
<Tabs>
  <Tabs.Screen
    name="index"
    options={{
      title: 'News',
      tabBarIcon: ({ color }) => <NewsIcon color={color} />,
    }}
  />
  <Tabs.Screen
    name="categories"
    options={{ title: 'Categories' }}
  />
  <Tabs.Screen
    name="search"
    options={{ title: 'Search' }}
  />
</Tabs>
```

## Key Features Implementation

### Category Filter
```typescript
const [selectedCategory, setSelectedCategory] = useState(null);

const filteredArticles = useMemo(() => {
  if (!selectedCategory) return articles;
  return articles.filter(a => a.category === selectedCategory);
}, [articles, selectedCategory]);
```

### Search
```typescript
const [searchQuery, setSearchQuery] = useState('');

const searchResults = useMemo(() => {
  if (!searchQuery) return [];
  return articles.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [articles, searchQuery]);
```

## When to Use

Use this pattern for:
- News/blog apps
- Public content apps
- Documentation browsers
- Recipe apps
- Educational content
- Any app with public read-only content

## Advantages

- ✅ **Simple** - No auth complexity
- ✅ **Fast onboarding** - Users can start immediately
- ✅ **Lower barrier** - No registration required
- ✅ **Better SEO** - Public content is indexable
- ✅ **Wider reach** - Accessible to everyone

## When NOT to Use

Don't use this pattern for:
- Personalized content
- User-generated content
- Private/sensitive data
- Apps requiring user tracking
- Social features
