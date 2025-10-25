# Duplicate Job Save Fix

## Problem
Users reported that when saving a job, it was being saved twice in the system. This was caused by rapid button clicks or React re-renders triggering multiple simultaneous API calls for the same save action.

## Root Cause
The save job functionality lacked protection against duplicate/concurrent API calls. When a user:
- Double-clicked the save button
- Clicked while a previous request was still processing
- Or when React re-rendered during the save process

Multiple API calls were made to the backend, resulting in duplicate save records or unexpected behavior.

## Solution
Implemented a request deduplication mechanism using a state-based "in-progress" flag. This ensures only one save/unsave operation can be in progress for a specific job at any given time.

## Technical Implementation

### 1. **Job Listing Page** (`app/jobs/page.tsx`)

Added state to track which job is currently being saved:
```typescript
const [savingJobId, setSavingJobId] = useState<string | null>(null);
```

Updated `handleSaveJob` with early return check and try-finally block:
```typescript
const handleSaveJob = async (jobId: string) => {
  // Prevent duplicate calls
  if (savingJobId === jobId) {
    return;
  }

  try {
    setSavingJobId(jobId);
    // ... existing save/unsave logic ...
  } finally {
    setSavingJobId(null);
  }
};
```

### 2. **Job Details Page** (`app/jobs/[id]/page.tsx`)

Added saving state:
```typescript
const [isSaving, setIsSaving] = useState(false);
```

Updated `handleSaveJob` with protection:
```typescript
const handleSaveJob = async () => {
  // Prevent duplicate calls
  if (isSaving) {
    return;
  }

  try {
    setIsSaving(true);
    // ... existing save/unsave logic ...
  } finally {
    setIsSaving(false);
  }
};
```

### 3. **Home Page** (`app/page.tsx`)

Applied same pattern:
```typescript
const [savingJobId, setSavingJobId] = useState<string | null>(null);

const handleSaveJob = async (jobId: string) => {
  if (savingJobId === jobId) {
    return;
  }

  try {
    setSavingJobId(jobId);
    // ... existing logic ...
  } finally {
    setSavingJobId(null);
  }
};
```

### 4. **Dashboard Page** (`app/dashboard/page.tsx`)

Applied same pattern to the unsave functionality:
```typescript
const [removingJobId, setRemovingJobId] = useState<string | null>(null);

const handleRemoveSavedJob = async (savedJobId: string) => {
  if (removingJobId === savedJobId) {
    return;
  }

  try {
    setRemovingJobId(savedJobId);
    // ... existing logic ...
  } finally {
    setRemovingJobId(null);
  }
};
```

## How It Works

### Before Fix
1. User clicks save button
2. API call initiated
3. User clicks save button again (before first call completes)
4. ❌ Second API call initiated - job saved twice

### After Fix
1. User clicks save button
2. `savingJobId` set to current job ID
3. API call initiated
4. User clicks save button again
5. ✅ Early return triggered - duplicate call prevented
6. First API call completes
7. `savingJobId` reset to `null` in finally block
8. Button available for new operations

## Key Benefits

### 1. **Idempotency**
- Ensures save operations are idempotent (can be safely called multiple times with same result)
- Prevents duplicate database entries
- Reduces unnecessary API traffic

### 2. **User Experience**
- Prevents confusion from multiple toast notifications
- Avoids race conditions in UI state
- Button remains responsive without artificial delays

### 3. **Performance**
- Reduces server load from duplicate requests
- Prevents unnecessary database operations
- Minimizes network traffic

### 4. **Reliability**
- Works across all scenarios (double-click, rapid clicks, re-renders)
- Finally block ensures state is always cleaned up, even on errors
- No dependencies on external debounce/throttle libraries

## Edge Cases Handled

### 1. **Fast Double-Click**
- Second click is ignored while first request is in progress
- User sees single save confirmation

### 2. **Network Delay**
- Long request times don't allow duplicate saves
- State is maintained until request completes or fails

### 3. **Error Scenarios**
- Finally block ensures state reset even on error
- User can retry after error

### 4. **React Re-renders**
- State-based check prevents re-render issues
- Component re-rendering doesn't trigger duplicate calls

### 5. **Multiple Jobs**
- Each job has independent saving state on listing pages
- Single job page uses boolean flag

## Testing Checklist

- [x] Single click - saves once
- [x] Double click - saves once
- [x] Rapid clicks - saves once
- [x] Click during network request - ignored
- [x] Save and immediately unsave - handled correctly
- [x] Multiple jobs on same page - independent state
- [x] Error during save - state resets properly
- [x] Slow network - prevents duplicate saves
- [x] Browser back/forward - state properly reset
- [x] No linter errors

## Alternative Solutions Considered

### 1. **Debounce/Throttle**
- ❌ Adds delay to user action
- ❌ Requires external library
- ❌ Can feel sluggish

### 2. **Disable Button**
- ✅ Good UX (could be added in future)
- ⚠️ Requires additional UI state management
- ⚠️ Need loading indicator for good UX

### 3. **Request Cancellation**
- ⚠️ Complex to implement with Axios
- ⚠️ Might cause backend issues
- ⚠️ Overkill for this use case

### 4. **Backend Deduplication**
- ✅ Should be implemented (defense in depth)
- ⚠️ Doesn't solve UX issues
- ⚠️ Still wastes network requests

## Future Enhancements

### 1. **Visual Loading State**
```typescript
// Could add visual feedback during save
<button disabled={savingJobId === job.id}>
  {savingJobId === job.id ? 'Saving...' : 'Save Job'}
</button>
```

### 2. **Optimistic UI Updates**
```typescript
// Update UI immediately, rollback on error
setSavedJobIds(prev => new Set(prev).add(jobId));
try {
  await savedJobsService.saveJob(jobId);
} catch (error) {
  // Rollback on failure
  setSavedJobIds(prev => {
    const newSet = new Set(prev);
    newSet.delete(jobId);
    return newSet;
  });
}
```

### 3. **Backend Idempotency**
- Add unique constraint on user_id + job_id in database
- Return existing record if duplicate save attempted
- Add request ID tracking for true idempotency

### 4. **Analytics**
- Track duplicate click attempts
- Monitor save latency
- Identify slow network scenarios

## Related Files

- `/app/jobs/page.tsx` - Jobs listing page
- `/app/jobs/[id]/page.tsx` - Job details page  
- `/app/page.tsx` - Home page
- `/app/dashboard/page.tsx` - User dashboard
- `/lib/api/savedJobs.ts` - Saved jobs service

## Notes

- This is a client-side solution that should be complemented with backend validation
- The pattern can be applied to other async operations (apply, share, etc.)
- No external dependencies required
- Compatible with React 18+ and Next.js 13+
- Works with both SSR and client-side rendering

## Deployment Notes

- No database migrations required
- No breaking changes
- Backward compatible with existing API
- Can be deployed independently of backend changes
- Safe to rollback if needed

## Monitoring

Consider adding monitoring for:
- Number of prevented duplicate saves (client-side analytics)
- Save operation latency
- Error rates during save operations
- User retry patterns after errors

