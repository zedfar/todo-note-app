# Todo App Example - Offline Only

Complete example of a todo app that works completely offline without any API.

## Features

- ✅ **No API required** - Works completely offline
- ✅ **No authentication** - Simple and straightforward
- ✅ **Local storage** - Uses AsyncStorage for persistence
- ✅ **Full CRUD** - Create, read, update, delete todos
- ✅ **Filter & search** - Filter by status, search by title
- ✅ **Priority levels** - Low, medium, high
- ✅ **Due dates** - Set and track due dates
- ✅ **Theme support** - Light/dark mode

## Architecture

### No Authentication
- App is accessible immediately
- No login/register screens needed
- All data is local to the device

### No API
- Uses AsyncStorage for data persistence
- All operations are instant (no network delays)
- Works offline by default

### Storage
```
AsyncStorage
└── @todos
    └── Array<Todo>
```

## Files Structure

```
src/
├── types/
│   └── todo.types.ts           # Todo type definitions
├── services/
│   └── todoService.ts          # Offline todo service (AsyncStorage)
├── hooks/
│   └── useTodos.ts             # Custom hook for todos
├── components/
│   └── todos/
│       ├── TodoItem.tsx        # Single todo item component
│       ├── TodoList.tsx        # Todo list component
│       └── TodoForm.tsx        # Create/edit todo form
└── app/
    └── (tabs)/
        ├── index.tsx           # Todo list screen
        └── stats.tsx           # Todo statistics screen
```

## Implementation Steps

### 1. Create Types
```typescript
// src/types/todo.types.ts
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 2. Create Service
```typescript
// src/services/todoService.ts
// Use the offline-service.example.ts as reference
// All CRUD operations use AsyncStorage
```

### 3. Create Custom Hook
```typescript
// src/hooks/useTodos.ts
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    const data = await todoService.getTodos();
    setTodos(data);
    setLoading(false);
  };

  const addTodo = async (data: CreateTodoDto) => {
    const newTodo = await todoService.createTodo(data);
    setTodos([...todos, newTodo]);
  };

  // ... more methods

  return { todos, loading, addTodo, updateTodo, deleteTodo };
}
```

### 4. Create Components
```typescript
// src/components/todos/TodoItem.tsx
// Displays single todo with checkbox, title, actions
```

### 5. Create Screens
```typescript
// app/(tabs)/index.tsx
// Main todo list screen with:
// - List of todos
// - Filter buttons (All, Active, Completed)
// - Search bar
// - Add new todo button
```

## Key Features Implementation

### Filtering
```typescript
const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

const filteredTodos = useMemo(() => {
  if (filter === 'active') return todos.filter(t => !t.completed);
  if (filter === 'completed') return todos.filter(t => t.completed);
  return todos;
}, [todos, filter]);
```

### Search
```typescript
const [searchQuery, setSearchQuery] = useState('');

const searchedTodos = useMemo(() => {
  if (!searchQuery) return filteredTodos;
  return filteredTodos.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [filteredTodos, searchQuery]);
```

### Statistics
```typescript
const stats = useMemo(() => ({
  total: todos.length,
  completed: todos.filter(t => t.completed).length,
  active: todos.filter(t => !t.completed).length,
  highPriority: todos.filter(t => t.priority === 'high' && !t.completed).length,
}), [todos]);
```

## Usage

1. Copy the service from `examples/services/offline-service.example.ts`
2. Create types in `src/types/todo.types.ts`
3. Create components in `src/components/todos/`
4. Create screens in `app/(tabs)/`
5. Update navigation in `app/(tabs)/_layout.tsx`

## Advantages

- ✅ **Zero latency** - Instant operations
- ✅ **Works offline** - No network required
- ✅ **Simple** - No auth, no API setup
- ✅ **Privacy** - Data stays on device
- ✅ **Cost-free** - No server costs

## Limitations

- ❌ **No sync** - Data is not synced across devices
- ❌ **No backup** - Data lost if app is uninstalled
- ❌ **Single device** - Each device has separate data

## When to Use

Use this pattern for:
- Personal productivity apps (todos, notes, habits)
- Calculator apps
- Settings/preferences
- Offline-first apps
- Apps without user accounts

## When NOT to Use

Don't use this pattern for:
- Multi-device sync required
- User collaboration
- Cloud backup needed
- Real-time updates
- Social features
