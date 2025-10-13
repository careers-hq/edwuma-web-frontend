# Cloudflare Turnstile - Frontend Setup

This document explains the Cloudflare Turnstile implementation in the Edwuma frontend.

## Quick Start

### 1. Install Dependencies

Already installed:
```bash
npm install @marsidev/react-turnstile
```

### 2. Environment Variables

Create/update `.env.local`:

```env
# Cloudflare Turnstile Site Key (public - safe to expose)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key_here
```

Get your site key from: https://dash.cloudflare.com/?to=/:account/turnstile

### 3. Start Development Server

```bash
npm run dev
```

---

## Implementation Details

### Component Structure

#### Turnstile Component
**Location**: `components/ui/Turnstile.tsx`

Reusable wrapper around Cloudflare Turnstile widget:

```tsx
<Turnstile
  onSuccess={(token) => setTurnstileToken(token)}
  onError={() => setTurnstileToken('')}
  onExpire={() => setTurnstileToken('')}
/>
```

**Features**:
- Auto-displays widget when site key is configured
- Shows development warning if key is missing
- Handles success, error, and expiration events
- Customizable styling via className prop

### Pages with Turnstile

All the following pages include Turnstile protection:

1. **Login** - `app/auth/login/page.tsx`
2. **Register** - `app/auth/register/page.tsx`
3. **Forgot Password** - `app/auth/forgot-password/page.tsx` ✨ NEW
4. **Reset Password** - `app/auth/reset-password/page.tsx` ✨ NEW
5. **Contact Form** - `app/contact/page.tsx`

### API Types

**Location**: `lib/api/types.ts`

All auth request types include the turnstile token:

```typescript
export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
  'cf-turnstile-response'?: string; // ✨ NEW
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  agree_to_terms_and_policy: boolean;
  'cf-turnstile-response'?: string; // ✨ NEW
}

export interface ForgotPasswordRequest {
  email: string;
  'cf-turnstile-response'?: string; // ✨ NEW
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
  'cf-turnstile-response'?: string; // ✨ NEW
}
```

---

## Usage Example

### In a Form Component

```tsx
import { Turnstile } from '@/components/ui/Turnstile';
import { useState } from 'react';

function MyForm() {
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate turnstile token
    if (!turnstileToken && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      setErrors({ turnstile: 'Please complete the security verification' });
      return;
    }

    // Include token in API request
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        'cf-turnstile-response': turnstileToken,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      
      {/* Turnstile Widget */}
      <Turnstile
        onSuccess={(token) => {
          setTurnstileToken(token);
          setErrors(prev => ({ ...prev, turnstile: '' }));
        }}
        onError={() => setTurnstileToken('')}
        onExpire={() => setTurnstileToken('')}
      />
      {errors.turnstile && (
        <p className="text-sm text-red-600">{errors.turnstile}</p>
      )}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Development Mode

### Without Site Key

If `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is not set, the component will:

1. **Development**: Show a warning message
   ```
   ⚠️ Turnstile disabled: Add NEXT_PUBLIC_TURNSTILE_SITE_KEY to .env.local
   ```

2. **Production**: Not render anything (silent fail)

This allows development without Turnstile configured.

### With Site Key

The Turnstile widget will appear and function normally.

---

## Styling

The Turnstile widget uses Cloudflare's default styling. You can customize the container:

```tsx
<Turnstile
  className="my-4 flex justify-center"
  onSuccess={(token) => setTurnstileToken(token)}
/>
```

Widget options (configured in component):
- **Theme**: `light` (can be changed to `dark`)
- **Size**: `normal` (can be changed to `compact`)

---

## Testing

### Test Without Backend

You can test the frontend Turnstile integration without a working backend:

1. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in `.env.local`
2. Navigate to any auth page
3. Verify the widget appears
4. Check browser console for token on form submission

### Test With Backend

1. Ensure backend is running with Turnstile configured
2. Submit a form with Turnstile widget
3. Token should be sent to API
4. Backend will verify the token

---

## Error Handling

### Common Errors

**"Please complete the security verification"**
- User hasn't completed Turnstile challenge
- Token hasn't been generated yet
- Solution: Wait for widget to complete

**"Security verification failed"**
- Token expired (5 min limit)
- Token already used (single-use)
- Invalid token
- Solution: Refresh page and try again

**Widget not appearing**
- Site key not configured
- Site key invalid
- Domain not allowed in Turnstile settings
- Solution: Check environment variables and Cloudflare dashboard

---

## Browser Compatibility

Cloudflare Turnstile supports:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance

### Bundle Size
- Package: `@marsidev/react-turnstile` (~20KB)
- Cloudflare Script: (~20KB)
- Total: ~40KB (minimal impact)

### Loading Strategy
- Widget loads asynchronously
- No blocking of page render
- Lazy-loaded on form pages only

---

## Security Notes

1. ✅ **Site key is public** - Safe to expose in frontend code
2. ✅ **Secret key stays on backend** - Never expose in frontend
3. ✅ **Token is single-use** - Cannot be reused
4. ✅ **Token expires** - 5 minute lifetime
5. ✅ **No user tracking** - Privacy-focused

---

## Production Checklist

Before deploying to production:

- [ ] Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in production environment
- [ ] Verify production domain is added to Cloudflare Turnstile settings
- [ ] Test all forms with Turnstile widget
- [ ] Verify backend is configured with matching site key
- [ ] Check error handling works correctly
- [ ] Monitor Cloudflare dashboard for verification stats

---

## Troubleshooting

### Widget Not Showing

1. Check `.env.local` has `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
2. Restart dev server after adding env variable
3. Check browser console for errors
4. Verify site key is correct

### Form Submission Failing

1. Check that token is being captured in `onSuccess`
2. Verify token is included in API request body
3. Check network tab to see request payload
4. Verify backend is expecting `cf-turnstile-response` field

### Development Warning Persists

1. Ensure `.env.local` exists in project root
2. Variable must start with `NEXT_PUBLIC_`
3. Restart Next.js dev server
4. Clear browser cache

---

## Additional Resources

- [Cloudflare Turnstile Docs](https://developers.cloudflare.com/turnstile/)
- [React Turnstile Package](https://github.com/marsidev/react-turnstile)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## Summary

✅ **Package Installed**: `@marsidev/react-turnstile`  
✅ **Component Created**: `components/ui/Turnstile.tsx`  
✅ **Pages Updated**: Login, Register, Forgot/Reset Password, Contact  
✅ **Types Updated**: All auth request interfaces  
✅ **Environment Variable**: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`  

Your frontend is now protected with Cloudflare Turnstile! 🎉

