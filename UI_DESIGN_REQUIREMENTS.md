# Edwuma Job Portal - UI Design & Requirements

## Design System

### Color Palette
- **Primary Green**: `#244034` - Main brand color for headers, primary buttons, and accents
- **Accent Yellow**: `#d2f34c` - Call-to-action buttons, highlights, and interactive elements
- **Success Green**: `#00bf58` - Success states, confirmations, and positive feedback
- **Text Primary**: `rgba(0, 0, 0, 0.7)` - Main text color with 70% opacity
- **Background**: `#ffffff` - Clean white background
- **Surface**: `#f8fafc` - Card backgrounds and subtle sections

### Typography
- **Primary Font**: Gordita (custom font files in `/public/assets/`)
- **Secondary Font**: "EB Garamond", serif - For elegant headings and special content
- **Font Weight**: 400 (regular)
- **Base Font Size**: 14px
- **Line Height**: 28px (2x font size for optimal readability)

### Typography Scale
```css
/* Headings */
h1: 32px / 64px line-height
h2: 28px / 56px line-height  
h3: 24px / 48px line-height
h4: 20px / 40px line-height
h5: 18px / 36px line-height
h6: 16px / 32px line-height

/* Body Text */
body: 14px / 28px line-height
small: 12px / 24px line-height
```

## Page Structure & Components

### 1. Homepage

#### Header Navigation
```markdown
- Logo: "edwuma" (Gordita, 24px, #244034)
- Navigation: Browse Jobs | Blog | FAQ | Contact (14px, rgba(0,0,0,0.7))
- Auth Buttons: Login | Register (14px, #244034 background, white text)
- Mobile: Hamburger menu with slide-out navigation
```

#### Hero Section
```markdown
- Background: Clean gradient or professional imagery
- Main Headline: "Explore, Apply, Succeed and Thrive" (Gordita, 32px, #244034)
- Subheadline: "Simplify your job search with personalized matches and seamless applications" (14px, rgba(0,0,0,0.7))
- CTA Button: "Browse Jobs" (#d2f34c background, #244034 text, 16px)
- Layout: Centered content with ample whitespace
```

#### Featured Jobs Section
```markdown
- Section Title: "Latest Job Opportunities" (Gordita, 24px, #244034)
- Job Cards: Clean white cards with subtle shadows
- Card Content:
  - Job Title (16px, #244034)
  - Company Name (14px, rgba(0,0,0,0.7))
  - Location & Experience (12px, rgba(0,0,0,0.5))
  - Apply Button (#00bf58 background, white text)
- Layout: 3-column grid on desktop, 1-column on mobile
```

### 2. Job Listings Page

#### Filter Sidebar
```markdown
- Background: White with subtle border
- Section Headers: "Categories", "Location", "Job Type", "Experience" (16px, #244034)
- Filter Options: Checkboxes with labels (14px, rgba(0,0,0,0.7))
- Apply Button: "Filter Jobs" (#d2f34c background, #244034 text)
- Clear Button: "Clear All" (text link, #244034)
```

#### Job Listings Display
```markdown
- Search Bar: Full-width input with search icon
- Results Count: "X jobs found" (14px, rgba(0,0,0,0.7))
- Job Cards:
  - Job Title (16px, #244034, bold)
  - Company Name (14px, rgba(0,0,0,0.7))
  - Location & Type (12px, rgba(0,0,0,0.5))
  - Posted Date (12px, rgba(0,0,0,0.5))
  - Apply Button (#00bf58 background, white text)
- Pagination: Numbered pages with prev/next arrows
```

### 3. Job Detail Page

#### Job Header
```markdown
- Job Title (Gordita, 28px, #244034)
- Company Name (18px, rgba(0,0,0,0.7))
- Meta Info: Location, Type, Experience (14px, rgba(0,0,0,0.7))
- Posted Date (12px, rgba(0,0,0,0.5))
- Apply Button: Large, prominent (#d2f34c background, #244034 text, 18px)
```

#### Job Description
```markdown
- Section Headers: "Job Description", "Requirements", "Benefits" (18px, #244034)
- Content: Well-formatted text (14px, rgba(0,0,0,0.7), 28px line-height)
- Lists: Bulleted and numbered lists with proper spacing
- Company Info: Separate section with company overview
```

### 4. User Authentication

#### Login/Register Forms
```markdown
- Form Container: White background with subtle shadow
- Form Title: "Login" or "Register" (24px, #244034)
- Input Fields:
  - Labels: 14px, #244034
  - Inputs: 14px, rgba(0,0,0,0.7), 1px solid #e5e7eb
  - Focus: 2px solid #244034
- Submit Button: Full-width (#244034 background, white text, 16px)
- Links: "Forgot Password?", "Don't have account?" (14px, #244034)
```

### 5. User Dashboard

#### Dashboard Layout
```markdown
- Sidebar Navigation:
  - Profile, Saved Jobs, Applications, Settings (14px, rgba(0,0,0,0.7))
  - Active State: #244034 background, white text
- Main Content Area:
  - Section Headers: 20px, #244034
  - Content Cards: White background with subtle borders
  - Action Buttons: #d2f34c background, #244034 text
```

#### Profile Management
```markdown
- Form Sections: Personal Info, Experience, Education, Skills
- Input Groups: Logical grouping with section headers
- File Upload: Resume upload with drag-and-drop
- Save Button: #00bf58 background, white text
```

### 6. Blog Page

#### Blog Listings
```markdown
- Article Cards: White background with subtle shadows
- Article Title: 18px, #244034
- Excerpt: 14px, rgba(0,0,0,0.7), 28px line-height
- Meta Info: Author, Date (12px, rgba(0,0,0,0.5))
- Read More Link: 14px, #244034
```

#### Blog Detail
```markdown
- Article Title: 28px, #244034
- Author Info: 14px, rgba(0,0,0,0.7)
- Publication Date: 12px, rgba(0,0,0,0.5)
- Article Content: 14px, rgba(0,0,0,0.7), 28px line-height
- Social Sharing: Icon buttons with hover states
```

### 7. FAQ Page

#### Accordion Design
```markdown
- Question Headers: 16px, #244034, clickable
- Answer Content: 14px, rgba(0,0,0,0.7), 28px line-height
- Expand/Collapse: Smooth transitions
- Hover States: Subtle background color changes
```

### 8. Contact Page

#### Contact Form
```markdown
- Form Fields: Name, Email, Subject, Message
- Field Labels: 14px, #244034
- Input Styling: Consistent with other forms
- Submit Button: #244034 background, white text
- Success Message: #00bf58 text with checkmark icon
```

### 9. Footer

#### Footer Sections
```markdown
- Background: #244034
- Text Color: White (rgba(255,255,255,0.9))
- Section Headers: 16px, white
- Links: 14px, rgba(255,255,255,0.7)
- Newsletter Signup: Input field with #d2f34c button
- Social Icons: White icons with hover effects
```

## Component Specifications

### Buttons
```css
/* Primary Button */
background: #244034;
color: white;
padding: 12px 24px;
border-radius: 6px;
font-size: 14px;
font-weight: 400;

/* Secondary Button */
background: #d2f34c;
color: #244034;
padding: 12px 24px;
border-radius: 6px;
font-size: 14px;
font-weight: 400;

/* Success Button */
background: #00bf58;
color: white;
padding: 12px 24px;
border-radius: 6px;
font-size: 14px;
font-weight: 400;
```

### Form Elements
```css
/* Input Fields */
border: 1px solid #e5e7eb;
border-radius: 6px;
padding: 12px 16px;
font-size: 14px;
color: rgba(0,0,0,0.7);
background: white;

/* Input Focus */
border: 2px solid #244034;
outline: none;
box-shadow: 0 0 0 3px rgba(36, 64, 52, 0.1);
```

### Cards
```css
/* Card Container */
background: white;
border-radius: 8px;
box-shadow: 0 1px 3px rgba(0,0,0,0.1);
padding: 24px;
margin-bottom: 16px;
```

### Navigation
```css
/* Active Navigation Item */
background: #244034;
color: white;
padding: 8px 16px;
border-radius: 4px;

/* Hover States */
background: rgba(36, 64, 52, 0.1);
transition: background-color 0.2s ease;
```

## Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile Adaptations
- Hamburger menu for navigation
- Single-column layouts
- Touch-friendly button sizes (44px minimum)
- Swipe gestures for job cards
- Collapsible filter sidebar

### Tablet Adaptations
- 2-column job listings
- Side-by-side forms
- Larger touch targets
- Optimized spacing

### Desktop Enhancements
- 3-column job listings
- Hover effects and animations
- Multi-column layouts
- Advanced interactions

## Accessibility Requirements

### Color Contrast
- Text on white: 4.5:1 minimum ratio
- Text on colored backgrounds: 3:1 minimum ratio
- Interactive elements: Clear focus indicators

### Keyboard Navigation
- Tab order follows logical flow
- Skip links for main content
- Keyboard shortcuts for common actions
- Focus indicators on all interactive elements

### Screen Reader Support
- Semantic HTML structure
- Alt text for all images
- ARIA labels for complex interactions
- Descriptive link text

## Animation & Interactions

### Transitions
- Button hover: 0.2s ease
- Form focus: 0.15s ease
- Page transitions: 0.3s ease
- Loading states: Smooth spinners

### Micro-interactions
- Button press feedback
- Form validation animations
- Success/error state transitions
- Loading skeleton screens

## Implementation Notes

### Font Loading
```html
<!-- Preload Gordita font -->
<link rel="preload" href="/assets/fonts/gordita-regular.woff2" as="font" type="font/woff2" crossorigin>

<!-- Fallback fonts -->
font-family: 'Gordita', 'EB Garamond', serif, -apple-system, BlinkMacSystemFont, sans-serif;
```

### Color Usage Guidelines
- Use #244034 for primary actions and headers
- Use #d2f34c sparingly for CTAs and highlights
- Use #00bf58 for success states and confirmations
- Maintain consistent opacity levels for text hierarchy

### Spacing System
- Base unit: 8px
- Common spacing: 8px, 16px, 24px, 32px, 48px
- Component padding: 16px-24px
- Section margins: 32px-48px

This design system ensures consistency across all pages while maintaining the professional, clean aesthetic that reflects Edwuma's brand identity.
