# Authentication System

This directory contains the authentication system for the Edwuma frontend application.

## Overview

The authentication system provides:
- Centralized API client with token management
- React context for authentication state
- Protected route components
- Type-safe authentication services

## Structure

### API Layer (`/lib/api/`)
- `config.ts` - API configuration and endpoints
- `types.ts` - TypeScript interfaces for API requests/responses
- `client.ts` - HTTP client with authentication headers
- `auth.ts` - Authentication service methods
- `index.ts` - Central exports

### Auth Layer (`/lib/auth/`)
- `AuthContext.tsx` - React context and hooks for auth state
- `ProtectedRoute.tsx` - Route protection components
- `index.ts` - Central exports

## Usage

### 1. Setup

The `AuthProvider` is already configured in the root layout (`app/layout.tsx`).

### 2. Environment Variables

Create a `.env.local` file with:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Using Authentication in Components

```tsx
import { useAuth } from '@/lib/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user?.first_name}!</div>;
}
```

### 4. Protecting Routes

```tsx
import { ProtectedRoute } from '@/lib/auth';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This page requires authentication</div>
    </ProtectedRoute>
  );
}
```

### 5. Role-based Access

```tsx
import { ProtectedRoute } from '@/lib/auth';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div>Admin only content</div>
    </ProtectedRoute>
  );
}
```

## API Integration

The system integrates with the Laravel API endpoints:
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh token

## Features

- **Token Management**: Automatic token storage and refresh
- **Type Safety**: Full TypeScript support
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Role-based Access**: Support for role-based route protection
- **Persistent State**: Authentication state persists across page reloads
- **Loading States**: Built-in loading states for better UX

## Security

- Tokens are stored in localStorage (consider upgrading to httpOnly cookies for production)
- Automatic token refresh on API calls
- Secure logout that clears all stored data
- CSRF protection via Laravel Sanctum
