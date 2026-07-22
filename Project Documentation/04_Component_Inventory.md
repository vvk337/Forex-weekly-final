# Document 04: Component Inventory

## 1. Reusable Control Room Layout Components

### 1.1 `ControlRoomLayout`
- **File**: `src/components/admin/ControlRoomLayout.tsx`
- **Purpose**: Outer container for Control Room screens. Manages responsive width metrics, collapsible desktop sidebar offsets, and mobile drawer overlays.
- **Props**:
  - `children`: `React.ReactNode`
  - `sidebar`: `React.ReactNode`
  - `header`: `React.ReactNode`
  - `isSidebarCollapsed`: `boolean`
  - `showMobileSidebar`: `boolean`
  - `setShowMobileSidebar`: `(show: boolean) => void`
- **Used By**: `/admin/dashboard`, `/admin/dashboard/create`, `/admin/dashboard/profile`
- **Dependencies**: React

### 1.2 `ControlRoomHeader`
- **File**: `src/components/admin/ControlRoomHeader.tsx`
- **Purpose**: Top horizontal bar containing logo, Workspace Selector dropdown, global search console input, notification bell with unread badge, and profile menu.
- **Props**:
  - `currentUser`: `DbUser | null`
  - `activeWorkspace`: `string`
  - `setActiveWorkspace`: `(ws: string) => void`
  - `searchQuery`: `string`
  - `setSearchQuery`: `(q: string) => void`
  - `showProfileMenu`: `boolean`
  - `setShowProfileMenu`: `(show: boolean) => void`
  - `handleLogout`: `() => void`
  - `setShowMobileSidebar`: `(show: boolean) => void`
- **Used By**: `ControlRoomLayout`
- **Dependencies**: React, Next.js Link/Router

### 1.3 `ControlRoomSidebar`
- **File**: `src/components/admin/ControlRoomSidebar.tsx`
- **Purpose**: Vertical navigation menu with collapsible state persistence via `localStorage`. Renders active tab highlights filtered by user role.
- **Props**:
  - `activeTab`: `string`
  - `setActiveTab`: `(tab: any) => void`
  - `currentUser`: `DbUser | null`
  - `isCollapsed`: `boolean`
  - `setIsCollapsed`: `(collapsed: boolean) => void`
- **Used By**: `ControlRoomLayout`
- **Dependencies**: React, `localStorage`
