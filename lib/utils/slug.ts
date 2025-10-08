/**
 * Utility functions for handling job slugs and IDs
 */

/**
 * Get the job slug from a JobListing object
 * Falls back to generating a slug if not provided by backend
 */
export const getJobSlug = (job: { slug?: string; title: string; id: string }): string => {
  // Use backend-generated slug if available
  if (job.slug) {
    return job.slug;
  }
  
  // Fallback to client-side generation (for backward compatibility)
  return generateJobSlug(job.title, job.id);
};

/**
 * Generate a URL-friendly slug from job title and ID (fallback method)
 */
export const generateJobSlug = (title: string, id: string): string => {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  
  // Truncate slug to keep URLs reasonable length and add short ID for uniqueness
  const truncatedSlug = slug.length > 50 ? slug.substring(0, 50) : slug;
  return `${truncatedSlug}-${id.slice(-6)}`; // Add last 6 chars of ID for uniqueness
};

/**
 * Extract job ID from slug or return as-is if it's already a UUID
 */
export const extractJobId = (slugOrId: string): string => {
  // Check if it's a UUID format (36 characters with hyphens)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(slugOrId)) {
    return slugOrId;
  }
  
  // If it's a slug, we need to search by slug in the API
  // The backend should handle slug-based lookups
  return slugOrId;
};

/**
 * Check if a string is a UUID
 */
export const isUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};
