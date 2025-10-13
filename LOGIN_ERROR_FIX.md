# Login Error Handling Fix

## Problem
When login failed (e.g., invalid credentials), the frontend was showing a generic "Network error" message instead of the actual error message from the API.

## Root Cause
The error handling chain was losing the API error message:

1. **API Client** (`lib/api/client.ts`): When the API returned an error response (non-2xx status), it created an `ApiError` object with the message from the server. However, when catching errors in the request method, it didn't preserve `ApiError` objects - it only handled `Error` instances, causing API errors to be replaced with a generic "Network error".

2. **Auth Service** (`lib/api/auth.ts`): The login/register methods were re-throwing errors without properly extracting the message from `ApiError` objects.

3. **Login Page** (`app/auth/login/page.tsx`): Was checking for specific keywords but the actual API error messages were being lost before reaching this point.

## Solution

### 1. API Client Error Preservation
Updated `lib/api/client.ts` to preserve `ApiError` objects thrown from `handleResponse()`:

```typescript
// In the request() method catch block
// If it's an ApiError (thrown from handleResponse), preserve it
if (error && typeof error === 'object' && 'message' in error && 'status' in error) {
  throw error;
}
```

### 2. Auth Service Error Extraction
Updated `lib/api/auth.ts` login and register methods to properly extract error messages from `ApiError` objects:

```typescript
catch (error) {
  // Handle ApiError with proper message extraction
  if (error && typeof error === 'object' && 'message' in error) {
    const apiError = error as { message: string; status?: number; errors?: Record<string, string[]> };
    
    // If there are validation errors, format them
    if (apiError.errors) {
      const errorMessages = Object.values(apiError.errors).flat();
      throw new Error(errorMessages[0] || apiError.message);
    }
    
    throw new Error(apiError.message);
  }
  
  const errorMessage = error instanceof Error ? error.message : 'Login failed';
  throw new Error(errorMessage);
}
```

### 3. Improved Login Page Error Display
Enhanced `app/auth/login/page.tsx` to better categorize and display errors:

```typescript
// Handle different types of errors with case-insensitive matching
if (errorMessage.toLowerCase().includes('credential') || 
    errorMessage.toLowerCase().includes('password') || 
    errorMessage.toLowerCase().includes('unauthorized')) {
  setErrors({ general: 'Invalid email or password. Please try again.' });
} else if (errorMessage.toLowerCase().includes('deactivated') || 
           errorMessage.toLowerCase().includes('inactive')) {
  setErrors({ general: 'Your account has been deactivated. Please contact support.' });
} else if (errorMessage.toLowerCase().includes('timeout')) {
  setErrors({ general: 'Request timed out. Please check your connection and try again.' });
} else if (errorMessage.toLowerCase().includes('network')) {
  setErrors({ general: 'Network error. Please check your internet connection and try again.' });
} else {
  // Display the actual error message from the API
  setErrors({ general: errorMessage });
}
```

## API Error Messages
Based on the backend code, the API returns these specific error messages:

- **Invalid Credentials**: `"Invalid credentials"` (HTTP 401)
- **Deactivated Account**: `"Account is deactivated"` (HTTP 403)
- **Validation Errors**: Structured validation errors (HTTP 422)
- **General Errors**: Various error messages with appropriate status codes

## Test Scenarios

### 1. Invalid Credentials
- **Input**: Wrong email or password
- **Expected**: "Invalid email or password. Please try again."
- **API Response**: 401 with message "Invalid credentials"

### 2. Deactivated Account
- **Input**: Correct credentials for deactivated account
- **Expected**: "Your account has been deactivated. Please contact support."
- **API Response**: 403 with message "Account is deactivated"

### 3. Network Error
- **Input**: API server down or no internet
- **Expected**: "Network error. Please check your internet connection and try again."
- **API Response**: Network timeout or connection refused

### 4. Timeout
- **Input**: API takes too long to respond
- **Expected**: "Request timed out. Please check your connection and try again."
- **API Response**: AbortError from fetch timeout

### 5. Validation Errors
- **Input**: Invalid data format (handled by form validation, but if it reaches the API)
- **Expected**: First validation error message from API
- **API Response**: 422 with validation errors object

## Files Modified

1. `/Users/isaac/Projects/edwuma-web-frontend/lib/api/client.ts`
   - Preserved `ApiError` objects in the request method catch block

2. `/Users/isaac/Projects/edwuma-web-frontend/lib/api/auth.ts`
   - Enhanced error handling in login() method
   - Enhanced error handling in register() method
   - Properly extract messages from ApiError objects
   - Handle validation errors by showing the first error

3. `/Users/isaac/Projects/edwuma-web-frontend/app/auth/login/page.tsx`
   - Improved error categorization with case-insensitive matching
   - Added specific handling for timeout errors
   - Added specific handling for network errors
   - Fallback to displaying actual API message for other errors

## Benefits

1. **Better User Experience**: Users now see meaningful error messages instead of generic "Network error"
2. **Accurate Error Reporting**: Actual API error messages are preserved and displayed
3. **Better Debugging**: Console still logs the full error for debugging purposes
4. **Consistent Error Handling**: Same pattern applied to both login and register
5. **Validation Support**: Properly handles and displays validation errors from the API

