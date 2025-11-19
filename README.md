# Expo React Native Boilerplate - Agent Generator Edition

A minimal, production-ready boilerplate optimized for AI code generation. Build any kind of React Native app: News, Todo, Survey, Ecommerce, Social Media, and more.

## 🤖 Built for AI Code Generation

This template is designed to work seamlessly with AI agents for rapid development:

- **Simple Structure** - Clear, predictable folder organization
- **Code Examples** - Actual working code patterns in `examples/`
- **AI Context** - Path configuration in `ai-context.json`
- **General Purpose** - Not tied to any specific app type
- **Type Safe** - Full TypeScript support
- **Theme Ready** - Dark/Light mode out of the box

### 📖 For AI Agents - Start Here!

**First time in this project?** Read these files in order:

1. **[TEMPLATE_VARIANTS.md](TEMPLATE_VARIANTS.md)** ⭐ **START HERE** - Choose template variant
2. **[AI_GUIDE.md](AI_GUIDE.md)** - Complete AI onboarding guide
3. **[ai-context.json](ai-context.json)** - Path mappings
4. **[GENERATE_RULES.md](GENERATE_RULES.md)** - Code generation patterns
5. **[CONVENTIONS.md](CONVENTIONS.md)** - Coding standards
6. **[SERVER_GUIDE.md](SERVER_GUIDE.md)** - Mock API & dummy data guide
7. **[examples/](examples/)** - Actual working code to copy

## Quick Start

```bash
npx create-ern-boilerplate my-app --template agent-generator
cd my-app
npm install
npm start
```

## Project Structure

```
.
├── app
│   ├── (auth)              # Auth pages (login, register)
│   ├── (tabs)              # Main app tabs (home, settings)
│   └── _layout.tsx         # Root layout
│
├── examples                # Code examples for AI
│   ├── screens/            # Screen examples for different scenarios
│   │   ├── list-screen-no-auth.example.tsx      # Public content list
│   │   ├── list-screen-with-auth.example.tsx    # Protected content list
│   │   ├── form-screen.example.tsx              # Create/edit form
│   │   └── detail-screen.example.tsx            # Detail page
│   ├── services/           # Service examples for different setups
│   │   ├── service-with-mock.example.ts         # API with mock support
│   │   ├── service-without-mock.example.ts      # Direct API only
│   │   └── offline-service.example.ts           # Offline storage
│   ├── apps/               # Complete mini app examples
│   │   ├── todo-offline/                        # Offline todo app
│   │   ├── news-no-auth/                        # Public news app
│   │   └── dashboard-with-auth/                 # Protected dashboard
│   ├── component.example.tsx  # Component pattern
│   ├── hook.example.ts        # Custom hook pattern
│   ├── screen.example.tsx     # Screen pattern
│   └── service.example.ts     # API service pattern
│
├── src
│   ├── components          # Reusable UI components
│   │   ├── common          # Button, Card, Input, Loading
│   │   ├── shared          # Shared business components
│   │   └── auth            # Auth-specific components
│   ├── hooks               # Custom React hooks
│   ├── screens             # Screen components
│   ├── services            # API services
│   │   └── api.ts          # Axios instance
│   ├── store               # Zustand stores
│   │   ├── authStore.ts    # Authentication state
│   │   └── themeStore.ts   # Theme state
│   ├── theme               # Theme configuration
│   ├── types               # TypeScript types
│   └── utils               # Utility functions
│
├── ai-context.json         # AI path configuration
├── CONVENTIONS.md          # Coding standards
├── GENERATE_RULES.md       # Code generation rules
└── package.json
```

## Features

- ✅ **Expo SDK 54** - Latest Expo features
- ✅ **Expo Router** - File-based routing with tabs
- ✅ **TypeScript** - Full type safety
- ✅ **NativeWind (Tailwind)** - Utility-first styling
- ✅ **Zustand** - Simple state management
- ✅ **Auth Ready** - Login/register flow included
- ✅ **Theme Support** - Light/Dark mode
- ✅ **Path Aliases** - Clean imports with `@`
- ✅ **API Client** - Axios with interceptors
- ✅ **Mock Server** - JSON Server ready

## AI Code Generation

### Context Configuration

The `ai-context.json` tells AI where to generate code:

```json
{
  "screensPath": "app",
  "componentsPath": "src/components",
  "hooksPath": "src/hooks",
  "servicesPath": "src/services",
  "mockApiPath": "src/services/mockApi",
  "storePath": "src/store",
  "typesPath": "src/types",
  "mockDataPath": "server/db.json",
  "examples": "examples",
  "aiGuide": "AI_GUIDE.md",
  "serverGuide": "SERVER_GUIDE.md",
  "rules": "GENERATE_RULES.md",
  "conventions": "CONVENTIONS.md"
}
```

### Code Examples

Check `examples/` folder for comprehensive patterns:

**Screen Patterns:**
- **`screens/list-screen-no-auth.example.tsx`** - Public content list (no auth)
- **`screens/list-screen-with-auth.example.tsx`** - Protected list (with auth)
- **`screens/form-screen.example.tsx`** - Create/edit forms with validation
- **`screens/detail-screen.example.tsx`** - Detail page with actions

**Service Patterns:**
- **`services/service-with-mock.example.ts`** - API service with mock support
- **`services/service-without-mock.example.ts`** - Direct API connection
- **`services/offline-service.example.ts`** - Offline storage (AsyncStorage)

**Complete App Examples:**
- **`apps/todo-offline/`** - Offline todo app (no auth, no API)
- **`apps/news-no-auth/`** - Public news app (no auth, with API)
- **`apps/dashboard-with-auth/`** - Protected dashboard (with auth, with API)

**Legacy Examples:**
- **`screen.example.tsx`** - Generic list screen
- **`component.example.tsx`** - Reusable component
- **`hook.example.ts`** - Data fetching hook
- **`service.example.ts`** - CRUD API service

### Generating Code

Example prompts for AI:

**For Public Content App:**
```
Build a news app following examples/apps/news-no-auth/
Use the list-screen-no-auth pattern for the main screen
Use service-with-mock pattern for the article service
```

**For Offline App:**
```
Create a todo app following examples/apps/todo-offline/
Use offline-service pattern for data storage
No auth or API needed
```

**For Protected Dashboard:**
```
Build a dashboard following examples/apps/dashboard-with-auth/
Use list-screen-with-auth for the main screen
Keep authentication as-is
Use service-with-mock for data
```

**Individual Components:**
```
Create a product list screen following examples/screens/list-screen-no-auth.example.tsx
Generate a create product form using examples/screens/form-screen.example.tsx
Build a product detail page using examples/screens/detail-screen.example.tsx
Create a product service using examples/services/service-with-mock.example.ts
```

## State Management

Using Zustand for simple, scalable state:

```typescript
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  const { user, login, logout } = useAuthStore();
  // Use store state and actions
}
```

## Theming

Theme automatically follows system preference:

```typescript
import { useThemeStore } from '@/store/themeStore';

function MyComponent() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ backgroundColor: isDark ? '#000' : '#fff' }}>
      <Text className={isDark ? 'text-white' : 'text-gray-900'}>
        Hello World
      </Text>
    </View>
  );
}
```

## Routing

### Tabs

Main app tabs in `app/(tabs)/`:

- `index.tsx` - Home screen
- `settings.tsx` - Settings screen

Add more tabs by creating new files.

### Auth

Auth flow in `app/(auth)/`:

- `login.tsx` - Login screen
- `register.tsx` - Register screen

## API Services

```typescript
import { apiClient } from '@/services/api';

// Create a service
export const newsService = {
  getNews: async () => {
    const response = await apiClient.get('/news');
    return response.data;
  },
};
```

## Components

### Button

```typescript
import { Button } from '@/components/common/Button';

<Button
  title="Press Me"
  onPress={() => console.log('Pressed')}
  loading={false}
  disabled={false}
/>
```

### Card

```typescript
import { Card } from '@/components/common/Card';

<Card className="mb-4">
  <Text>Card content</Text>
</Card>
```

### Input

```typescript
import { Input } from '@/components/common/Input';

<Input
  placeholder="Enter text"
  value={value}
  onChangeText={setValue}
/>
```

## Available Scripts

```bash
# Development
npm start                 # Start Expo dev server
npm run android          # Run on Android
npm run ios              # Run on iOS
npm run web              # Run on web

# Build
npm run build            # Build for production
npm run type-check       # TypeScript check
npm run lint             # ESLint check
```

## Environment Configuration

Configure API URLs in `src/utils/constants.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://localhost:3001'
    : 'https://api.yourapp.com',
  TIMEOUT: 10000,
};
```

## Building Your App

This boilerplate is intentionally minimal and general. Customize it for your specific needs:

### For a News App:
- Create `newsService.ts` in `src/services/`
- Add `useNews.ts` hook in `src/hooks/`
- Build news screens in `app/(tabs)/`

### For a Todo App:
- Create `todoStore.ts` in `src/store/`
- Build todo screens and components
- Add CRUD operations

### For an Ecommerce App:
- Create product/cart services
- Add product listing screens
- Build checkout flow

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind](https://www.nativewind.dev/)
- [Zustand](https://docs.pmnd.rs/zustand/)

## License

MIT - Use freely for your projects

---

**Made for Humans + AI Developers**
