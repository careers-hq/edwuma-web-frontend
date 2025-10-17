# UI Replication Guide - Edwuma Design System

> A comprehensive guide to replicate the Edwuma UI design system in other projects. This document covers the complete design system, component architecture, and implementation patterns used in the Edwuma job portal.

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Design System Configuration](#design-system-configuration)
3. [Project Structure](#project-structure)
4. [Component Architecture](#component-architecture)
5. [Implementation Guide](#implementation-guide)
6. [Best Practices](#best-practices)
7. [Quick Start Checklist](#quick-start-checklist)

---

## Tech Stack

### Core Dependencies

```json
{
  "dependencies": {
    "next": "15.5.4",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19"
  }
}
```

### Key Technologies

- **Framework**: Next.js 15 with App Router
- **React**: 19.1.0
- **Styling**: Tailwind CSS v4
- **TypeScript**: Full type safety
- **Utility Libraries**: `clsx` + `tailwind-merge` for className management

---

## Design System Configuration

### 1. Color Palette

Create `lib/design-system.ts`:

```typescript
export const colors = {
  primary: '#244034',      // Dark Green - Main brand color
  accent: '#d2f34c',       // Bright Yellow - CTAs & highlights
  success: '#00bf58',      // Green - Success states
  text: {
    primary: 'rgba(0, 0, 0, 0.7)',
    secondary: 'rgba(0, 0, 0, 0.5)',
    inverse: '#ffffff',
  },
  background: {
    white: '#ffffff',
    surface: '#f8fafc',
    primary: '#244034',
  },
  border: {
    light: '#e5e7eb',
    medium: '#d1d5db',
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 1px 3px rgba(0, 0, 0, 0.1)',
    lg: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
} as const;
```

### 2. Typography System

```typescript
export const typography = {
  fontFamily: {
    primary: ['Gordita', 'EB Garamond', 'serif', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
    secondary: ['EB Garamond', 'serif'],
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '32px',
  },
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '2',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;
```

### 3. Spacing System

```typescript
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;
```

### 4. Border Radius

```typescript
export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
} as const;
```

### 5. Breakpoints

```typescript
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
```

### 6. Animations

```typescript
export const animations = {
  transition: {
    fast: '0.15s ease',
    normal: '0.2s ease',
    slow: '0.3s ease',
  },
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
} as const;
```

---

## Project Structure

```
app/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.tsx         # Button with variants
│   │   ├── Input.tsx          # Form input with labels & icons
│   │   ├── Card.tsx           # Card with subcomponents
│   │   ├── Badge.tsx          # Status badges
│   │   ├── Select.tsx         # Dropdown select
│   │   └── LoadingSpinner.tsx # Loading states
│   ├── layout/                # Layout components
│   │   ├── Header.tsx         # Main navigation
│   │   └── Footer.tsx         # Site footer
│   ├── home/                  # Feature-specific components
│   │   ├── HeroSection.tsx
│   │   └── FeaturedJobs.tsx
│   └── job/                   # Domain-specific components
│       ├── JobCard.tsx
│       └── JobFilters.tsx
├── globals.css                # Global styles & design system
├── layout.tsx                 # Root layout
└── page.tsx                   # Homepage
lib/
├── design-system.ts           # Design system configuration
└── utils.ts                   # Utility functions
public/
└── assets/
    └── fonts/                 # Custom font files
        └── gordita/
            ├── gordita_regular-webfont.woff2
            └── gordita_medium-webfont.woff2
```

---

## Component Architecture

### Utility Function: `cn()` - ClassName Merger

Create `lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Purpose**: Combines and merges Tailwind CSS classes intelligently, preventing conflicts.

---

### Core UI Components

#### 1. Button Component

**File**: `components/ui/Button.tsx`

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-[#244034] text-white hover:bg-[#1a2f26] focus-visible:ring-[#244034]',
      secondary: 'bg-[#d2f34c] text-[#244034] hover:bg-[#c4e03f] focus-visible:ring-[#d2f34c]',
      success: 'bg-[#00bf58] text-white hover:bg-[#00a64d] focus-visible:ring-[#00bf58]',
      outline: 'border border-[#244034] text-[#244034] hover:bg-[#244034] hover:text-white focus-visible:ring-[#244034]',
      ghost: 'text-[#244034] hover:bg-[#f8fafc] focus-visible:ring-[#244034]',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
```

**Features**:
- 5 variants: primary, secondary, success, outline, ghost
- 3 sizes: sm, md, lg
- Built-in loading state with spinner
- Full accessibility with ARIA support
- TypeScript with proper types

**Usage**:
```tsx
<Button variant="primary" size="md">Click Me</Button>
<Button variant="secondary" loading>Processing...</Button>
<Button variant="outline" size="sm">Cancel</Button>
```

---

#### 2. Input Component

**File**: `components/ui/Input.tsx`

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    const inputId = React.useId();
    const errorId = React.useId();
    const helperId = React.useId();

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[#244034] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-[rgba(0,0,0,0.7)] placeholder:text-gray-400 focus:border-[#244034] focus:outline-none focus:ring-2 focus:ring-[#244034] focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
```

**Features**:
- Label support
- Error and helper text
- Left and right icon support
- Automatic unique IDs for accessibility
- Focus states with brand colors
- Disabled state styling

**Usage**:
```tsx
<Input label="Email" type="email" placeholder="you@example.com" />
<Input label="Password" type="password" error="Password is required" />
<Input placeholder="Search" leftIcon={<SearchIcon />} />
```

---

#### 3. Card Component

**File**: `components/ui/Card.tsx`

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border border-gray-200 bg-white shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight text-[#244034]', className)} {...props}>
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-[rgba(0,0,0,0.7)]', className)} {...props}>
      {children}
    </p>
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

**Features**:
- Composable subcomponents
- Consistent padding and spacing
- Clean white background with subtle shadow
- Flexible and extensible

**Usage**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Job Title</CardTitle>
    <CardDescription>Company Name</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Job description goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>Apply Now</Button>
  </CardFooter>
</Card>
```

---

#### 4. Badge Component

**File**: `components/ui/Badge.tsx`

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center rounded-full font-medium';
    
    const variants = {
      default: 'bg-[#244034] text-white',
      secondary: 'bg-[#d2f34c] text-[#244034]',
      success: 'bg-[#00bf58] text-white',
      warning: 'bg-yellow-100 text-yellow-800',
      destructive: 'bg-red-100 text-red-800',
    };

    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-1.5 text-sm',
      lg: 'px-3 py-2 text-base',
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
```

**Usage**:
```tsx
<Badge variant="success">Full-time</Badge>
<Badge variant="secondary" size="sm">Remote</Badge>
<Badge variant="warning">Urgent</Badge>
```

---

### Global Styles Setup

**File**: `app/globals.css`

```css
@import "tailwindcss";

/* Custom Font Loading */
@font-face {
  font-family: 'Gordita';
  src: url('/assets/fonts/gordita/gordita_regular-webfont.woff2') format('woff2'),
       url('/assets/fonts/gordita/gordita_regular-webfont.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Gordita';
  src: url('/assets/fonts/gordita/gordita_medium-webfont.woff2') format('woff2'),
       url('/assets/fonts/gordita/gordita_medium-webfont.woff') format('woff');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

/* CSS Custom Properties */
:root {
  --background: #ffffff;
  --foreground: rgba(0, 0, 0, 0.7);
  --primary: #244034;
  --accent: #d2f34c;
  --success: #00bf58;
  --text-primary: rgba(0, 0, 0, 0.7);
  --text-secondary: rgba(0, 0, 0, 0.5);
  --text-inverse: #ffffff;
  --surface: #f8fafc;
  --border-light: #e5e7eb;
  --border-medium: #d1d5db;
}

/* Tailwind Theme Configuration */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-accent: var(--accent);
  --color-success: var(--success);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-inverse: var(--text-inverse);
  --color-surface: var(--surface);
  --color-border-light: var(--border-light);
  --color-border-medium: var(--border-medium);
  --font-sans: 'Gordita', 'EB Garamond', serif, -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Base Styles */
body {
  background: #F4F2EE;
  color: var(--foreground);
  font-family: 'Gordita', 'EB Garamond', serif, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  line-height: 28px;
  font-weight: 400;
}

/* Typography Scale */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Gordita', 'EB Garamond', serif;
  color: var(--primary);
  font-weight: 400;
}

h1 { font-size: 32px; line-height: 64px; }
h2 { font-size: 28px; line-height: 56px; }
h3 { font-size: 24px; line-height: 48px; }
h4 { font-size: 20px; line-height: 40px; }
h5 { font-size: 18px; line-height: 36px; }
h6 { font-size: 16px; line-height: 32px; }

/* Utility Classes */
.text-primary { color: var(--primary); }
.text-accent { color: var(--accent); }
.text-success { color: var(--success); }
.bg-primary { background-color: var(--primary); }
.bg-accent { background-color: var(--accent); }
.bg-success { background-color: var(--success); }
.bg-surface { background-color: var(--surface); }

/* Focus Styles */
.focus-ring {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Line Clamp Utilities */
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

/* Smooth Scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--surface);
}

::-webkit-scrollbar-thumb {
  background: var(--border-medium);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary);
}
```

---

## Implementation Guide

### Step 1: Install Dependencies

```bash
npm install next react react-dom clsx tailwind-merge
npm install -D @tailwindcss/postcss tailwindcss typescript @types/node @types/react @types/react-dom
```

### Step 2: Setup Utility Functions

Create `lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ClassName merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

// Relative time
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInDays = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

// Text truncation
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Slug generation
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

### Step 3: Create Design System

Create `lib/design-system.ts` with all the configurations from the [Design System Configuration](#design-system-configuration) section.

### Step 4: Setup Global Styles

Create `app/globals.css` with the complete stylesheet from the [Global Styles Setup](#global-styles-setup) section.

### Step 5: Create UI Components

Create each component in the `components/ui/` directory:
- `Button.tsx`
- `Input.tsx`
- `Card.tsx`
- `Badge.tsx`
- `Select.tsx` (if needed)

Refer to the [Component Architecture](#component-architecture) section for full implementations.

### Step 6: Create Layout Components

**Header Component** (`components/layout/Header.tsx`):

```typescript
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Browse Jobs', href: '/' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className={cn('bg-primary shadow-sm', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white">
              YourLogo
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-white hover:text-accent transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login" className="text-white hover:text-accent font-semibold transition-colors">
              Login
            </Link>
            <Link href="/auth/register">
              <Button variant="secondary" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-opacity-20"
            >
              <span className="sr-only">Open menu</span>
              {/* Hamburger icon */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-white hover:text-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
```

---

## Best Practices

### 1. Component Composition

**Good**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

**Avoid**:
```tsx
<div className="card">
  <div className="card-header">
    <h3>Title</h3>
    <p>Description</p>
  </div>
</div>
```

### 2. Use the `cn()` Utility

**Good**:
```tsx
<div className={cn('base-class', isActive && 'active-class', className)}>
```

**Avoid**:
```tsx
<div className={`base-class ${isActive ? 'active-class' : ''} ${className}`}>
```

### 3. TypeScript Props

Always define proper TypeScript interfaces:

```typescript
export interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

### 4. Accessibility First

- Use semantic HTML
- Include ARIA labels
- Ensure keyboard navigation
- Provide focus indicators
- Use proper heading hierarchy

### 5. Responsive Design

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

### 6. Loading States

```tsx
<Button loading={isSubmitting}>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</Button>
```

### 7. Error Handling

```tsx
<Input
  label="Email"
  error={errors.email}
  helperText="We'll never share your email"
/>
```

---

## Quick Start Checklist

### Initial Setup

- [ ] Install dependencies (`clsx`, `tailwind-merge`, `tailwindcss`, etc.)
- [ ] Create `lib/utils.ts` with `cn()` function
- [ ] Create `lib/design-system.ts` with design tokens
- [ ] Setup `app/globals.css` with global styles and CSS variables
- [ ] Configure Tailwind CSS v4

### Core Components

- [ ] Create `Button.tsx` with variants and sizes
- [ ] Create `Input.tsx` with label, error, and icon support
- [ ] Create `Card.tsx` with subcomponents
- [ ] Create `Badge.tsx` with variants
- [ ] Create `Select.tsx` (dropdown)
- [ ] Create `LoadingSpinner.tsx`

### Layout Components

- [ ] Create `Header.tsx` with navigation
- [ ] Create `Footer.tsx`
- [ ] Setup responsive mobile menu

### Utilities

- [ ] Add `formatDate()` function
- [ ] Add `formatRelativeTime()` function
- [ ] Add `truncateText()` function
- [ ] Add `generateSlug()` function
- [ ] Add `debounce()` and `throttle()` functions

### Testing

- [ ] Test components in different screen sizes
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Test color contrast ratios
- [ ] Test loading and error states

---

## Component Usage Examples

### Form Example

```tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Handle login
    setLoading(false);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login to Your Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="••••••••"
          />
          <Button type="submit" className="w-full" loading={loading}>
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### Job Card Example

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  postedDate: string;
}

export function JobCard({ title, company, location, type, salary, postedDate }: JobCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{company}</CardDescription>
          </div>
          <Badge variant="success">{type}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-gray-600">
          <p>📍 {location}</p>
          {salary && <p>💰 {salary}</p>}
          <p className="text-xs text-gray-500">Posted {postedDate}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="primary" className="w-full">
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
}
```

---

## Customization Guide

### Changing Brand Colors

1. Update `lib/design-system.ts`:
```typescript
export const colors = {
  primary: '#YOUR_PRIMARY_COLOR',
  accent: '#YOUR_ACCENT_COLOR',
  success: '#YOUR_SUCCESS_COLOR',
  // ...
};
```

2. Update `app/globals.css`:
```css
:root {
  --primary: #YOUR_PRIMARY_COLOR;
  --accent: #YOUR_ACCENT_COLOR;
  --success: #YOUR_SUCCESS_COLOR;
}
```

3. Update component styles:
```typescript
const variants = {
  primary: 'bg-[#YOUR_PRIMARY_COLOR] text-white hover:bg-[#DARKER_SHADE]',
  // ...
};
```

### Adding New Font

1. Add font files to `/public/assets/fonts/`
2. Update `app/globals.css`:
```css
@font-face {
  font-family: 'YourFont';
  src: url('/assets/fonts/your-font.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```
3. Update font family:
```css
body {
  font-family: 'YourFont', sans-serif;
}
```

### Creating New Component Variants

```typescript
const variants = {
  // Existing variants
  primary: 'bg-[#244034] text-white',
  secondary: 'bg-[#d2f34c] text-[#244034]',
  // New variant
  custom: 'bg-purple-600 text-white hover:bg-purple-700',
};
```

---

## Responsive Breakpoints

```typescript
// Mobile First Approach
className="
  grid grid-cols-1        // Mobile: 1 column
  md:grid-cols-2          // Tablet: 2 columns
  lg:grid-cols-3          // Desktop: 3 columns
  xl:grid-cols-4          // Large: 4 columns
  gap-4                   // Gap between items
"
```

### Common Responsive Patterns

```tsx
{/* Text Sizing */}
<h1 className="text-2xl md:text-3xl lg:text-4xl">Responsive Heading</h1>

{/* Spacing */}
<div className="p-4 md:p-6 lg:p-8">Content</div>

{/* Visibility */}
<div className="hidden md:block">Desktop Only</div>
<div className="block md:hidden">Mobile Only</div>

{/* Layout */}
<div className="flex flex-col md:flex-row">
  <div className="w-full md:w-1/2">Column 1</div>
  <div className="w-full md:w-1/2">Column 2</div>
</div>
```

---

## Performance Optimization

### 1. Code Splitting

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <LoadingSpinner />,
});
```

### 2. Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority // For above-the-fold images
/>
```

### 3. Memoization

```tsx
import { memo, useMemo } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => /* expensive operation */);
  }, [data]);

  return <div>{/* render */}</div>;
});
```

---

## Accessibility Checklist

- [ ] All images have alt text
- [ ] Form inputs have associated labels
- [ ] Color contrast meets WCAG AA standards (4.5:1 for text)
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus indicators are visible
- [ ] ARIA labels used where needed
- [ ] Semantic HTML (header, nav, main, footer, article, section)
- [ ] Skip links for keyboard users
- [ ] Error messages are announced to screen readers
- [ ] Forms provide helpful error messages

---

## Common Patterns

### Modal/Dialog Pattern

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <Card className="relative z-10 max-w-md w-full mx-4">
        {children}
      </Card>
    </div>
  );
}
```

### Toast Notification Pattern

Install `react-hot-toast`:

```bash
npm install react-hot-toast
```

Setup in root layout:

```tsx
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

Usage:

```tsx
import toast from 'react-hot-toast';

// Success
toast.success('Job application submitted!');

// Error
toast.error('Something went wrong');

// Loading
toast.loading('Submitting...');
```

---

## Migration Checklist

When replicating this design system in a new project:

### Phase 1: Foundation (Day 1)
- [ ] Install all dependencies
- [ ] Create folder structure
- [ ] Setup `lib/utils.ts`
- [ ] Setup `lib/design-system.ts`
- [ ] Configure `globals.css`
- [ ] Add custom fonts

### Phase 2: Core Components (Day 2-3)
- [ ] Implement Button component
- [ ] Implement Input component
- [ ] Implement Card component
- [ ] Implement Badge component
- [ ] Test components in isolation

### Phase 3: Layout (Day 4)
- [ ] Create Header component
- [ ] Create Footer component
- [ ] Setup responsive navigation
- [ ] Test mobile menu

### Phase 4: Feature Components (Day 5+)
- [ ] Create domain-specific components
- [ ] Implement forms
- [ ] Add loading states
- [ ] Implement error handling

### Phase 5: Polish (Ongoing)
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Mobile device testing

---

## Additional Resources

### Utility Functions Reference

```typescript
// Date utilities
formatDate('2024-01-15') // "January 15, 2024"
formatRelativeTime('2024-01-15') // "2 days ago"

// Text utilities
truncateText('Long text here...', 50) // "Long text here..."
generateSlug('Hello World!') // "hello-world"

// Performance utilities
const debouncedSearch = debounce(searchFunction, 300);
const throttledScroll = throttle(scrollHandler, 100);

// ClassName utilities
cn('base-class', isActive && 'active', className)
```

### Design Tokens Quick Reference

```typescript
// Colors
colors.primary        // #244034
colors.accent        // #d2f34c
colors.success       // #00bf58

// Typography
typography.fontSize.sm     // 14px
typography.fontSize.lg     // 18px
typography.lineHeight.relaxed // 2

// Spacing
spacing[4]  // 16px
spacing[6]  // 24px
spacing[8]  // 32px

// Breakpoints
breakpoints.md  // 768px
breakpoints.lg  // 1024px
```

---

## Troubleshooting

### Common Issues

**1. Styles not applying**
- Ensure Tailwind CSS is properly configured
- Check that `globals.css` is imported in root layout
- Verify `cn()` utility is being used correctly

**2. Fonts not loading**
- Check font file paths in `globals.css`
- Ensure font files exist in `/public/assets/fonts/`
- Verify `font-display: swap` is set

**3. TypeScript errors**
- Install all `@types/*` packages
- Check `tsconfig.json` configuration
- Ensure proper imports from `@/components/*`

**4. Components not rendering**
- Check for 'use client' directive in client components
- Verify all props are being passed correctly
- Check console for errors

---

## Conclusion

This UI replication guide provides everything needed to implement the Edwuma design system in any project. The modular component architecture, comprehensive design tokens, and best practices ensure consistency and maintainability across your application.

Key takeaways:
- **Use TypeScript** for type safety
- **Leverage Tailwind CSS v4** with custom configuration
- **Build reusable components** with proper composition
- **Prioritize accessibility** from the start
- **Maintain consistent spacing** and colors
- **Test across devices** and browsers

For questions or contributions, refer to the main project repository.

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Maintained by**: Edwuma Team

