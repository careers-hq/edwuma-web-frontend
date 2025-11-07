'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import AfricanJobFilters, { AfricanJobFilters as AfricanJobFiltersType } from '@/components/job/AfricanJobFilters';
import SimpleSearchBar from '@/components/ui/EnhancedSearchBar';
import JobCard from '@/components/job/JobCard';
import { jobsApiService, type JobListing, type JobSearchFilters } from '@/lib/api/jobs';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import HeroSection from '@/components/home/HeroSection';
import { useAuth } from '@/lib/auth';
import { savedJobsService } from '@/lib/api/savedJobs';
import { userActivitiesService } from '@/lib/api/activities';
import toast from 'react-hot-toast';

// Use the JobListing interface from the API service instead of the mock interface

// Removed mock data - now using real API data

const DEFAULT_FILTERS: AfricanJobFiltersType = {
  search: '',
  location: '',
  workMode: '',
  experience: '',
  visaSponsorship: '',
  datePosted: ''
};

const parseFiltersFromSearch = (searchString: string): AfricanJobFiltersType => {
  const params = new URLSearchParams(searchString);
  return {
    search: params.get('search') || '',
    location: params.get('location') || '',
    workMode: params.get('workMode') || '',
    experience: params.get('experience') || '',
    visaSponsorship: params.get('visaSponsorship') || '',
    datePosted: params.get('datePosted') || ''
  };
};

const parsePageFromSearch = (searchString: string): number => {
  const params = new URLSearchParams(searchString);
  const pageParam = params.get('page');
  const parsed = pageParam ? parseInt(pageParam, 10) : 1;
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
};

const areFiltersEqual = (a: AfricanJobFiltersType, b: AfricanJobFiltersType) =>
  a.search === b.search &&
  a.location === b.location &&
  a.workMode === b.workMode &&
  a.experience === b.experience &&
  a.visaSponsorship === b.visaSponsorship &&
  a.datePosted === b.datePosted;

function AfricaJobsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const jobListingsRef = useRef<HTMLDivElement>(null);
  const hasRestoredScrollRef = useRef(false);

  const searchParamsString = React.useMemo(() => searchParams.toString(), [searchParams]);
  const filtersFromUrl = React.useMemo(() => parseFiltersFromSearch(searchParamsString), [searchParamsString]);
  const initialPageFromUrl = React.useMemo(() => parsePageFromSearch(searchParamsString), [searchParamsString]);
  
  // Client-side only state to prevent hydration issues
  const [isClient, setIsClient] = useState(false);
  
  // Geolocation hook to detect user's country
  const { countryCode, error: geoError } = useGeolocation();
  
  // Removed unused jobs state
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(() => new Set());
  const [savedJobsMap, setSavedJobsMap] = useState<Map<string, string>>(() => new Map());
  const [savingJobId, setSavingJobId] = useState<string | null>(null);
  
  // Initialize filters from URL search params
  const [filters, setFilters] = useState<AfricanJobFiltersType>(filtersFromUrl);
  // Removed showFilters state since filters are now always visible at the top
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: initialPageFromUrl,
    last_page: 1,
    per_page: 20,
    total: 0,
    from: null as number | null,
    to: null as number | null
  });

  const syncURLWithState = React.useCallback((nextFilters: AfricanJobFiltersType, page: number) => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams();

    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    if (page > 1) {
      params.set('page', page.toString());
    }

    const newURL = params.toString() ? `/?${params.toString()}` : '/';
    router.replace(newURL, { scroll: false });
  }, [router]);

  const loadJobs = React.useCallback(async (resetPagination = false) => {
    // Only run on client side to avoid hydration issues
    if (typeof window === 'undefined') return;
    
    try {
      setIsLoading(true);
      setError(null);

      // Reset pagination to page 1 when filters change (unless explicitly told not to)
      const currentPage = resetPagination ? 1 : pagination.current_page;

      // Map frontend filters to API filters
      const apiFilters: JobSearchFilters = {
        search: filters.search || undefined,
        country: filters.location || undefined, // Changed from location to country
        work_mode: filters.workMode || undefined,
        experience_level: filters.experience || undefined,
        // Removed category_ids since API doesn't have categories assigned to jobs
        ...(filters.visaSponsorship === 'available' && { has_visa_sponsorship: true }),
        ...(filters.datePosted && { date_posted: filters.datePosted }),
        page: currentPage,
        per_page: pagination.per_page,
        sort_by: 'posted_at',
        sort_direction: 'desc'
      };

      // Debug logging
      console.log('Loading jobs with filters:', {
        frontendFilters: filters,
        apiFilters: apiFilters,
        currentPage,
        resetPagination
      });
      
      // Test specific filter combinations
      if (filters.workMode === 'remote' && filters.experience === 'senior') {
        console.log('Testing remote + senior filter combination');
      }
      
      // Debug logging for filter values
      console.log('Filter values:', {
        frontend: {
          search: filters.search,
          workMode: filters.workMode,
          experience: filters.experience,
          location: filters.location,
          visaSponsorship: filters.visaSponsorship,
          datePosted: filters.datePosted
        },
        api: apiFilters
      });

      const response = await jobsApiService.searchJobs(apiFilters);
      
      console.log('API Response:', {
        success: response.success,
        jobsCount: response.data?.jobs?.length || 0,
        pagination: response.data?.pagination,
        message: response.message
      });
      
      if (response.success) {
        setFilteredJobs(response.data.jobs);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to load jobs');
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.current_page, pagination.per_page]);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    setFilters(prev => (areFiltersEqual(prev, filtersFromUrl) ? prev : filtersFromUrl));

    setPagination(prev => {
      const nextPage = initialPageFromUrl;
      if (prev.current_page === nextPage) {
        return prev;
      }

      return { ...prev, current_page: nextPage };
    });
  }, [filtersFromUrl, initialPageFromUrl, isClient]);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Fetch saved jobs when authenticated
  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!isAuthenticated) {
        setSavedJobIds(() => new Set());
        setSavedJobsMap(() => new Map());
        return;
      }

      try {
        const response = await savedJobsService.getSavedJobs(1, 100);
        
        if (response.success && response.data) {
          const savedIds = new Set<string>();
          const savedMap = new Map<string, string>();

          response.data.data.forEach(savedJob => {
            if (savedJob.job?.id) {
              savedIds.add(savedJob.job.id);
              savedMap.set(savedJob.job.id, savedJob.id);
            }
          });

          setSavedJobIds(() => savedIds);
          setSavedJobsMap(() => savedMap);
        }
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      }
    };

    fetchSavedJobs();
  }, [isAuthenticated]);

  // Don't auto-filter by country - let users discover all jobs
  // The detected country is shown as a suggestion in the filters component

  // Load jobs when filters change (only on client)
  useEffect(() => {
    if (isClient) {
      // Debounce search to prevent excessive API calls
      const timeoutId = setTimeout(() => {
        loadJobs();
      }, filters.search ? 500 : 0); // 500ms delay for search, immediate for other filters

      return () => clearTimeout(timeoutId);
    }
  }, [isClient, filters, loadJobs]);

  useEffect(() => {
    if (!isClient || isLoading || hasRestoredScrollRef.current) {
      return;
    }

    const savedScrollPosition = sessionStorage.getItem('jobsListScrollPosition');
    if (savedScrollPosition) {
      hasRestoredScrollRef.current = true;
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
        sessionStorage.removeItem('jobsListScrollPosition');
      }, 100);
    }
  }, [isClient, isLoading, filteredJobs.length]);

  const handleSaveJob = async (jobId: string) => {
    // Prevent duplicate calls
    if (savingJobId === jobId) {
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to save jobs');
      try {
        const loginUrl = new URL('/auth/login', window.location.origin);
        loginUrl.searchParams.set('returnTo', window.location.pathname + window.location.search + window.location.hash);
        window.location.href = loginUrl.toString();
      } catch {
        window.location.href = '/auth/login';
      }
      return;
    }

    const isSaved = savedJobIds.has(jobId);
    const job = filteredJobs.find(j => j.id === jobId);
    const savedJobRecordId = savedJobsMap.get(jobId);

    try {
      setSavingJobId(jobId);
      
      if (isSaved) {
        // Unsave the job
        const response = await savedJobsService.unsaveJob(savedJobRecordId || jobId);
        
        if (response.success) {
          setSavedJobIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(jobId);
            return newSet;
          });
          setSavedJobsMap(prev => {
            const next = new Map(prev);
            next.delete(jobId);
            return next;
          });
          toast.success('Job removed from saved');
        } else {
          toast.error('Failed to unsave job');
        }
      } else {
        // Save the job
        const response = await savedJobsService.saveJob(jobId);
        
        if (response.success) {
          setSavedJobIds(prev => {
            const next = new Set(prev);
            next.add(jobId);
            return next;
          });
          const savedRecordId = response.data?.id;
          if (savedRecordId) {
            setSavedJobsMap(prev => {
              const next = new Map(prev);
              next.set(jobId, savedRecordId);
              return next;
            });
          }
          toast.success('Job saved successfully');
          
          // Track save activity with metadata
          if (job) {
            userActivitiesService.trackActivity('save', jobId, {
              job_title: job.title,
              company: job.companies[0]?.name,
              location: job.locations[0]?.name,
            });
          }
        } else {
          toast.error(response.message || 'Failed to save job');
        }
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('An error occurred');
    } finally {
      setSavingJobId(null);
    }
  };

  const handleFiltersChange = (newFilters: AfricanJobFiltersType) => {
    const nextPage = 1;
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, current_page: nextPage }));
    syncURLWithState(newFilters, nextPage);
    // Reset pagination when filters change
    
    // Scroll to job listings when filters change
    setTimeout(() => {
      if (jobListingsRef.current) {
        jobListingsRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  const clearFilters = () => {
    const clearedFilters = { ...DEFAULT_FILTERS };
    setFilters(clearedFilters);
    setPagination(prev => ({ ...prev, current_page: 1 }));
    syncURLWithState(clearedFilters, 1);
    // Reset pagination when clearing filters
    
    // Scroll to job listings when clearing filters
    setTimeout(() => {
      if (jobListingsRef.current) {
        jobListingsRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.location) count++;
    if (filters.workMode) count++;
    if (filters.experience) count++;
    if (filters.visaSponsorship) count++;
    if (filters.datePosted) count++;
    return count;
  };

  const [shouldScrollToJobs, setShouldScrollToJobs] = useState(false);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, current_page: newPage }));
    syncURLWithState(filters, newPage);
    setShouldScrollToJobs(true);
  };

  // Scroll to job listings when jobs are loaded after pagination change
  useEffect(() => {
    if (shouldScrollToJobs && !isLoading && filteredJobs.length > 0) {
      setTimeout(() => {
        if (jobListingsRef.current) {
          jobListingsRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
        setShouldScrollToJobs(false);
      }, 100);
    }
  }, [shouldScrollToJobs, isLoading, filteredJobs.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
     <HeroSection />

        {/* Search & Filters Section */}
        
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Geolocation Warning */}
          {geoError && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-yellow-800">Unable to auto-detect your location. You can still search jobs by manually selecting a country.</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            {isClient ? (
              <SimpleSearchBar
                placeholder="Search for jobs, companies, locations, or skills..."
                value={filters.search}
                onChange={(value) => setFilters((prev: AfricanJobFiltersType) => ({ ...prev, search: value }))}
                onSearch={(value) => setFilters((prev: AfricanJobFiltersType) => ({ ...prev, search: value }))}
                className="w-full bg-white"
              />
            ) : (
              <div className="w-full bg-white border border-gray-300 rounded-lg h-12 flex items-center px-4">
                <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                <div className="ml-3 w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
              </div>
            )}
          </div>
            {isClient ? (
              <AfricanJobFilters
                onFiltersChange={handleFiltersChange}
                initialFilters={filters}
                autoDetectedCountry={countryCode || undefined}
              />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            )}
        </section>

        {/* Results Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Header */}
                <div className="mb-6">
              <p className="text-gray-600">
                {!isClient ? 'Loading...' : isLoading ? 'Searching...' : `Found ${pagination.total.toLocaleString()} jobs`}
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-2 text-sm text-[#244034] font-medium">
                    ({getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} applied)
                  </span>
                )}
                {filters.location && countryCode === filters.location && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    🌍 Your location
                  </span>
                )}
                  </p>
                </div>

            {/* Jobs List */}
            {!isClient ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
                  <div className="bg-white rounded-lg shadow-sm border border-red-200 p-12 text-center">
                    <div className="text-red-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Jobs</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Button onClick={() => loadJobs()} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                      Try Again
                    </Button>
                  </div>
                ) : isLoading ? (
                  <div className="space-y-6">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredJobs.length > 0 ? (
                  <div className="space-y-6" ref={jobListingsRef}>
                    {filteredJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onSave={handleSaveJob}
                        isSaved={savedJobIds.has(job.id)}
                      />
                    ))}
                
                {/* Pagination */}
                {pagination.last_page > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      disabled={pagination.current_page === 1}
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <Button
                      variant="outline"
                      disabled={pagination.current_page === pagination.last_page}
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
                  </div>
                ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-[#244034] mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters to find more opportunities
                    </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear All Filters
                </Button>
                  </div>
                )}
              </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-[#244034] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-['Gordita'] mb-4">
              Ready to Start Your African Career Journey?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have found their dream jobs across Africa. 
              Create your profile today and get matched with the perfect opportunity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#4ade80] text-[#244034] hover:bg-[#22c55e]">
                Create Profile
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#244034]">
                Browse All Jobs
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function AfricaJobs() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <HeroSection />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    }>
      <AfricaJobsContent />
    </Suspense>
  );
}