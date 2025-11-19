# Dashboard App Example - With Authentication

Complete example of a dashboard app with authentication and protected routes.

## Features

- ✅ **Full authentication** - Login, register, logout
- ✅ **Protected routes** - Auth required for dashboard
- ✅ **User profile** - View and edit profile
- ✅ **Role-based access** - Admin and user roles
- ✅ **Mock API support** - Dev mode with mock data
- ✅ **Real API ready** - Production ready
- ✅ **Dashboard stats** - User statistics
- ✅ **User management** - Admin panel (for admins)
- ✅ **Theme support** - Light/dark mode

## Architecture

### With Authentication
- Login/register required
- Token-based auth
- Protected routes
- Auth state management with Zustand
- Automatic token refresh
- Logout functionality

### Route Structure
```
app/
├── (auth)/                 # Public routes (not logged in)
│   ├── login.tsx           # Login screen
│   └── register.tsx        # Register screen
├── (tabs)/                 # Protected routes (logged in)
│   ├── index.tsx           # Dashboard home
│   ├── profile.tsx         # User profile
│   └── settings.tsx        # Settings
└── (admin)/                # Admin only routes
    └── users.tsx           # User management
```

## Files Structure

```
src/
├── types/
│   ├── auth.types.ts           # Auth & user types
│   └── dashboard.types.ts      # Dashboard data types
├── services/
│   ├── authService.ts          # Auth API service
│   ├── userService.ts          # User API service
│   └── mockApi/
│       ├── auth.mock.ts        # Mock auth endpoints
│       └── users.mock.ts       # Mock user data
├── store/
│   └── authStore.ts            # Auth state (Zustand)
├── hooks/
│   ├── useAuth.ts              # Auth hook
│   └── useDashboard.ts         # Dashboard data hook
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx  # Route guard
│   └── dashboard/
│       ├── StatCard.tsx        # Stat display card
│       └── UserCard.tsx        # User card component
└── app/
    ├── (auth)/                 # Auth screens
    ├── (tabs)/                 # Protected screens
    └── _layout.tsx             # Root layout with auth check
```

## Implementation Steps

### 1. Keep Authentication (Already in Template)

The template already includes:
- ✅ `app/(auth)/login.tsx`
- ✅ `app/(auth)/register.tsx`
- ✅ `src/store/authStore.ts`
- ✅ `src/services/authService.ts`
- ✅ `src/components/auth/ProtectedRoute.tsx`

### 2. Auth Store (Already Exists)
```typescript
// src/store/authStore.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email, password) => {
    const response = await authService.login({ email, password });
    await storage.setToken(response.token);
    set({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await storage.removeToken();
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = await storage.getToken();
    if (token) {
      const user = await authService.getCurrentUser();
      set({ user, token, isAuthenticated: true });
    }
  },
}));
```

### 3. Protected Route Guard
```typescript
// src/components/auth/ProtectedRoute.tsx
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;
  return children;
}
```

### 4. Root Layout with Auth Check
```typescript
// app/_layout.tsx
export default function RootLayout() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth(); // Check if user is logged in on app start
  }, []);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
```

### 5. Create Dashboard Types
```typescript
// src/types/dashboard.types.ts
export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasksumber;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

### 6. Add Mock Data
```json
// server/db.json
{
  "users": [
    {
      "id": "1",
      "email": "admin@example.com",
      "password": "admin123",
      "name": "Admin User",
      "role": "admin",
      "status": "active",
      "avatar": "https://i.pravatar.cc/150?u=admin",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "2",
      "email": "user@example.com",
      "password": "user123",
      "name": "John Doe",
      "role": "user",
      "status": "active",
      "avatar": "https://i.pravatar.cc/150?u=user",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "tasks": [
    {
      "id": "1",
      "title": "Complete project proposal",
      "description": "Write and submit the project proposal",
      "status": "in_progress",
      "priority": "high",
      "dueDate": "2024-11-20T00:00:00.000Z",
      "userId": "2",
      "createdAt": "2024-11-18T00:00:00.000Z",
      "updatedAt": "2024-11-18T00:00:00.000Z"
    }
  ]
}
```

### 7. Create Dashboard Service
```typescript
// src/services/dashboardService.ts
import { api } from './api';
import { mockApi } from './mockApi';
import { API_CONFIG } from '@/utils/constants';

export const dashboardService = {
  getStats: async (userId: string) => {
    if (API_CONFIG.MOCK_API) {
      // Calculate stats from mock tasks
      const tasks = await mockApi.get(`/tasks?userId=${userId}`);
      return {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
        pendingTasks: tasks.filter(t => t.status === 'pending').length,
        overdueTasks: tasks.filter(t => new Date(t.dueDate) < new Date()).length,
      };
    }
    return await api.get(`/dashboard/stats/${userId}`);
  },

  getUserTasks: async (userId: string) => {
    if (API_CONFIG.MOCK_API) {
      const tasks = await mockApi.get('/tasks');
      return tasks.filter(t => t.userId === userId);
    }
    return await api.get(`/tasks?userId=${userId}`);
  },
};
```

### 8. Create Dashboard Hook
```typescript
// src/hooks/useDashboard.ts
export function useDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    if (!user) return;

    try {
      const [statsData, tasksData] = await Promise.all([
        dashboardService.getStats(user.id),
        dashboardService.getUserTasks(user.id),
      ]);
      setStats(statsData);
      setTasks(tasksData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  return { stats, tasks, loading, refresh: fetchDashboard };
}
```

### 9. Create Dashboard Screen
```typescript
// app/(tabs)/index.tsx
export default function DashboardScreen() {
  const { user, logout } = useAuthStore();
  const { stats, tasks, loading, refresh } = useDashboard();
  const isDark = useThemeStore(s => s.colorScheme === 'dark');

  if (loading) return <Loading />;

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: isDark ? '#000' : '#F9FAFB' }}>
      {/* Welcome Header */}
      <View className="p-6">
        <Text className={isDark ? 'text-white' : 'text-gray-900'}>
          Welcome back, {user?.name}!
        </Text>
      </View>

      {/* Stats Grid */}
      <View className="flex-row flex-wrap px-4">
        <StatCard title="Total Tasks" value={stats.totalTasks} />
        <StatCard title="Completed" value={stats.completedTasks} color="green" />
        <StatCard title="Pending" value={stats.pendingTasks} color="blue" />
        <StatCard title="Overdue" value={stats.overdueTasks} color="red" />
      </View>

      {/* Recent Tasks */}
      <View className="p-4">
        <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Recent Tasks
        </Text>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </View>
    </ScrollView>
  );
}
```

### 10. Role-Based Access
```typescript
// app/(admin)/users.tsx
export default function UserManagementScreen() {
  const { user } = useAuthStore();
  const router = useRouter();

  // Check if user is admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      Toast.show({
        type: 'error',
        text1: 'Access Denied',
        text2: 'Admin access required',
      });
      router.replace('/(tabs)');
    }
  }, [user]);

  if (user?.role !== 'admin') return null;

  // Admin panel content...
}
```

## Key Features Implementation

### Auto Token Refresh
```typescript
// src/services/api.ts
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      try {
        const newToken = await authService.refreshToken();
        // Retry original request with new token
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api(error.config);
      } catch {
        // Refresh failed, logout user
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);
```

### Persistent Login
```typescript
// app/_layout.tsx
useEffect(() => {
  const checkAuth = async () => {
    const token = await storage.getToken();
    if (token) {
      // User was logged in, restore session
      await authStore.checkAuth();
    }
  };
  checkAuth();
}, []);
```

## When to Use

Use this pattern for:
- Business apps with user accounts
- Productivity apps (tasks, projects)
- SaaS applications
- Employee/team dashboards
- Apps with personalized content
- Admin panels

## Advantages

- ✅ **Secure** - Protected user data
- ✅ **Personalized** - User-specific content
- ✅ **Role-based** - Different access levels
- ✅ **Analytics** - Track user behavior
- ✅ **Scalable** - Multi-user support

## When NOT to Use

Don't use this pattern for:
- Simple utility apps
- Public content only
- Calculator/converter apps
- When auth adds unnecessary friction
