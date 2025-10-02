# Edwuma Job Portal - Frontend

A modern, responsive job portal built with Next.js 15, React 19, and Tailwind CSS. This frontend application provides a seamless job search experience with advanced filtering, user authentication, and role-based dashboards.

## 🚀 Features

### Core Functionality
- **Job Search & Filtering**: Advanced search with category, location, job type, and experience filters
- **User Authentication**: Secure login/register with social authentication options
- **Responsive Design**: Mobile-first approach with tablet and desktop optimizations
- **Role-based Access**: Different dashboards for job seekers, recruiters, and admins

### UI Components
- **Design System**: Consistent color palette, typography, and spacing
- **Reusable Components**: Button, Input, Card, Badge, Select, and more
- **Layout Components**: Header, Footer, Navigation with mobile support
- **Job Components**: JobCard, JobFilters, FeaturedJobs

### Pages
- **Homepage**: Hero section with featured jobs and trust indicators
- **Job Listings**: Comprehensive job search with filters and pagination
- **Authentication**: Login and registration with form validation
- **Dashboard**: Role-based user dashboards (coming soon)

## 🎨 Design System

### Colors
- **Primary**: `#244034` (Dark Green)
- **Accent**: `#d2f34c` (Bright Yellow)
- **Success**: `#00bf58` (Green)
- **Text**: `rgba(0, 0, 0, 0.7)` (70% opacity black)

### Typography
- **Primary Font**: Gordita (custom font)
- **Secondary Font**: EB Garamond (serif)
- **Base Size**: 14px
- **Line Height**: 28px
- **Weight**: 400 (regular)

### Spacing
- **Base Unit**: 8px
- **Common Spacing**: 8px, 16px, 24px, 32px, 48px

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **React**: 19.1.0
- **Styling**: Tailwind CSS v4
- **TypeScript**: Full type safety
- **Fonts**: Gordita (custom), EB Garamond
- **Icons**: SVG icons with Heroicons-style
- **State Management**: React hooks (useState, useEffect)
- **Form Handling**: Controlled components with validation

## 📁 Project Structure

```
app/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Select.tsx
│   ├── layout/             # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── home/               # Homepage components
│   │   ├── HeroSection.tsx
│   │   └── FeaturedJobs.tsx
│   └── job/                # Job-related components
│       ├── JobCard.tsx
│       └── JobFilters.tsx
├── auth/                   # Authentication pages
│   ├── login/
│   └── register/
├── jobs/                   # Job listings page
├── globals.css             # Global styles and design system
├── layout.tsx              # Root layout
└── page.tsx                # Homepage
lib/
├── design-system.ts        # Design system configuration
└── utils.ts                # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd edwuma-web-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Add font files**
   - Place Gordita font files in `/public/assets/fonts/`
   - Ensure `gordita-regular.woff2` is available

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 🎯 Key Features Implementation

### Design System
- CSS custom properties for consistent theming
- Tailwind CSS with custom configuration
- Responsive breakpoints and utilities
- Custom font loading with fallbacks

### Components
- **Button**: Multiple variants (primary, secondary, success, outline, ghost)
- **Input**: Form inputs with labels, errors, and icons
- **Card**: Flexible card components with header, content, footer
- **Badge**: Status indicators with different variants
- **Select**: Dropdown selects with proper accessibility

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface
- Optimized for all screen sizes

### Accessibility
- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios
- Focus indicators

## 🔧 Customization

### Colors
Update the color palette in `lib/design-system.ts` and `app/globals.css`:

```typescript
export const colors = {
  primary: '#244034',
  accent: '#d2f34c',
  success: '#00bf58',
  // ... other colors
};
```

### Typography
Modify font families and sizes in `app/globals.css`:

```css
body {
  font-family: 'Gordita', 'EB Garamond', serif;
  font-size: 14px;
  line-height: 28px;
}
```

### Components
All components are built with TypeScript and include:
- Proper prop types
- Default values
- Error handling
- Accessibility features

## 📱 Mobile Optimization

- Touch-friendly buttons (44px minimum)
- Swipe gestures for job cards
- Collapsible navigation
- Optimized images and assets
- Fast loading times

## 🔒 Security Features

- Form validation on client and server
- XSS protection
- CSRF protection
- Secure authentication flows
- Input sanitization

## 🚀 Performance

- Next.js 15 optimizations
- Image optimization
- Font loading optimization
- Code splitting
- Lazy loading
- Bundle size optimization

## 📈 SEO Features

- Semantic HTML structure
- Meta tags and Open Graph
- Structured data
- Sitemap generation
- Fast loading times
- Mobile-friendly design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ by the Edwuma Team