# Saved Jobs and Activities Implementation

## Overview
Complete implementation of saved jobs and user activity tracking features for both backend (Laravel API) and frontend (Next.js).

## Backend Implementation ✅

### 1. Database Migrations

#### SavedJobs Table (`saved_jobs`)
- **Primary Key**: UUID
- **Fields**:
  - `id` (UUID, primary)
  - `user_id` (UUID, foreign key to users)
  - `job_listing_id` (UUID, foreign key to job_listings)
  - `saved_at` (timestamp)
  - `created_at`, `updated_at`
- **Constraints**:
  - Unique constraint on (`user_id`, `job_listing_id`) - prevents duplicate saves
- **Indexes**: user_id, job_listing_id, saved_at

#### UserActivities Table (`user_activities`)
- **Primary Key**: UUID
- **Fields**:
  - `id` (UUID, primary)
  - `user_id` (UUID, foreign key to users)
  - `job_listing_id` (UUID, nullable, foreign key to job_listings)
  - `activity_type` (string: 'view', 'save', 'apply_click', 'search', 'profile_update')
  - `metadata` (JSON, nullable - for additional context)
  - `ip_address` (string, nullable)
  - `user_agent` (string, nullable)
  - `created_at` (timestamp)
- **Indexes**: user_id, job_listing_id, activity_type, created_at, composite (user_id, activity_type)

### 2. Models

#### SavedJob Model
- **Location**: `app/Models/SavedJob.php`
- **Traits**: `HasFactory`, `HasUuids`, `Auditable`
- **Relationships**:
  - `user()` - BelongsTo User
  - `jobListing()` - BelongsTo JobListing
- **Scopes**:
  - `forUser($userId)` - Filter by user
  - `recent($days)` - Filter by recent saves

#### UserActivity Model
- **Location**: `app/Models/UserActivity.php`
- **Traits**: `HasFactory`, `HasUuids`
- **Constants**: Activity type constants (TYPE_VIEW, TYPE_SAVE, etc.)
- **Relationships**:
  - `user()` - BelongsTo User
  - `jobListing()` - BelongsTo JobListing
- **Scopes**:
  - `forUser($userId)` - Filter by user
  - `ofType($type)` - Filter by activity type
  - `recent($days)` - Filter by recent activities
  - `forJob($jobId)` - Filter by job

### 3. Controllers

#### SavedJobController
- **Location**: `app/Http/Controllers/Api/SavedJobController.php`
- **Methods**:
  - `index()` - Get all saved jobs (paginated)
  - `store()` - Save a job (also tracks activity)
  - `destroy($id)` - Remove saved job
  - `check($jobListingId)` - Check if job is saved
  - `count()` - Get count of saved jobs

#### UserActivityController
- **Location**: `app/Http/Controllers/Api/UserActivityController.php`
- **Methods**:
  - `index()` - Get activity feed (paginated, filterable by type)
  - `store()` - Track new activity
  - `statistics($days)` - Get activity statistics
  - `summary($limit)` - Get recent activity summary

### 4. API Routes
**Base**: `/api/v1` (protected by `auth:sanctum`)

#### Saved Jobs
- `GET /saved-jobs` - List saved jobs
- `POST /saved-jobs` - Save a job
- `DELETE /saved-jobs/{id}` - Remove saved job
- `GET /saved-jobs/check/{jobListingId}` - Check if saved
- `GET /saved-jobs/count` - Get saved jobs count

#### Activities
- `GET /activities` - Get activity feed
- `POST /activities` - Track activity
- `GET /activities/statistics` - Get statistics
- `GET /activities/summary` - Get activity summary

---

## Frontend Implementation ✅

### 1. API Services

#### SavedJobsService
- **Location**: `lib/api/savedJobs.ts`
- **Methods**:
  - `getSavedJobs(page, perPage)` - Fetch saved jobs
  - `saveJob(jobListingId)` - Save a job
  - `unsaveJob(savedJobId)` - Remove saved job
  - `checkIfSaved(jobListingId)` - Check if job is saved
  - `getCount()` - Get saved jobs count

#### UserActivitiesService
- **Location**: `lib/api/activities.ts`
- **Methods**:
  - `getActivities(page, perPage, type?)` - Get activity feed
  - `trackActivity(type, jobId?, metadata?)` - Track activity (fails silently)
  - `getStatistics(days)` - Get activity stats
  - `getSummary(limit)` - Get recent activity summary

### 2. Types & Interfaces

```typescript
// Saved Jobs
interface SavedJob {
  id: string;
  saved_at: string;
  job: JobListing;
}

// Activities
interface UserActivity {
  id: string;
  user_id: string;
  job_listing_id?: string;
  activity_type: 'view' | 'save' | 'apply_click' | 'search' | 'profile_update';
  metadata?: Record<string, any>;
  created_at: string;
  job_listing?: JobListing;
}

interface ActivityStatistics {
  jobs_viewed: number;
  apply_clicks: number;
  searches_performed: number;
  profile_updates: number;
}

interface ActivitySummary {
  id: string;
  type: 'view' | 'save' | 'apply_click';
  job_title: string;
  job_slug: string;
  company: string;
  location: string;
  timestamp: string;
  created_at: string;
}
```

### 3. Activity Tracking Implementation

#### Job Detail Page
- **Automatic tracking** when job is viewed (authenticated users only)
- **Apply click tracking** with metadata (job title, company, URL)
- **Track location**: Job detail page (`app/jobs/[id]/page.tsx`)

```typescript
// View tracking
useEffect(() => {
  if (isAuthenticated && job) {
    userActivitiesService.trackActivity('view', jobId);
  }
}, [jobId, isAuthenticated]);

// Apply click tracking
const handleApplyClick = () => {
  if (isAuthenticated) {
    userActivitiesService.trackActivity('apply_click', job.id, {
      job_title: job.title,
      company: job.companies[0]?.name,
      application_url: job.application.url,
    });
  }
  handleJobApplication(job.application.url, isAuthenticated);
};
```

### 4. Dashboard Integration

#### Activity Stats (Empty State Ready)
The dashboard is now configured to show:
- **Jobs Viewed** - Distinct job views count
- **Apply Clicks** - Total apply button clicks
- **Saved Jobs** - Number of saved jobs
- **Profile Views** - Employer profile views (future feature)

#### Activity Feed (Empty State with CTA)
- Shows recent user activities (views, saves, apply clicks)
- Visual icons for different activity types
- Empty state encourages users to browse jobs
- Displays job title, company, location, timestamp

#### Saved Jobs Section (Empty State with CTA)
- Lists all saved jobs
- "Remove" and "View Job" actions
- Empty state with "Browse Jobs" button

---

## Key Features

### ✅ Automatic Activity Tracking
- Jobs are automatically tracked when viewed (authenticated users)
- Apply clicks are tracked with metadata
- All tracking fails silently (doesn't interrupt user experience)

### ✅ UUID Primary Keys
- All tables use UUID for primary keys
- Consistent with existing database schema
- Foreign key relationships properly configured

### ✅ Performance Optimization
- Database indexes on frequently queried columns
- Composite indexes for common query patterns
- Eager loading of relationships in API responses
- Pagination support for large datasets

### ✅ Security & Data Integrity
- All endpoints protected by authentication
- Unique constraints prevent duplicate saves
- Cascade deletes maintain referential integrity
- Input validation on all endpoints

### ✅ Empty States
- Dashboard shows helpful CTAs when no data
- Encourages user engagement
- Clear path to action

---

## Next Steps (TODO)

1. **Implement Saved Jobs Functionality** - Add save/unsave buttons to job cards
2. **Update Dashboard** - Fetch and display real activity data from API
3. **Add Profile Views Tracking** - When employers view jobseeker profiles
4. **Search Activity Tracking** - Track search queries and filters used
5. **Activity Notifications** - Notify users of important activities
6. **Analytics Dashboard** - Visual charts for activity trends
7. **Export Functionality** - Allow users to export their activity data

---

## Testing Checklist

### Backend
- [ ] Migrations run successfully
- [ ] Can save a job via API
- [ ] Can remove a saved job via API
- [ ] Can check if job is saved
- [ ] Can track view activity
- [ ] Can track apply click activity
- [ ] Can retrieve activity statistics
- [ ] Can retrieve activity summary
- [ ] Duplicate saves are prevented
- [ ] Authentication is enforced

### Frontend  
- [ ] Activity tracked when viewing job (authenticated)
- [ ] Activity tracked when clicking apply (authenticated)
- [ ] Dashboard shows empty states correctly
- [ ] Activity icons display correctly
- [ ] Saved jobs section renders properly
- [ ] No errors in console when tracking activities
- [ ] Tracking fails silently on errors

---

## Database Status
- ✅ Migrations created
- ✅ Migrations run successfully
- ✅ Tables created with UUID primary keys
- ✅ Foreign keys configured correctly
- ✅ Indexes created for performance
- ✅ Seeders run successfully

