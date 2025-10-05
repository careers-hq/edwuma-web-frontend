'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import AfricanJobFilters, { AfricanJobFilters as AfricanJobFiltersType } from '@/components/job/AfricanJobFilters';
import SimpleSearchBar from '@/components/ui/EnhancedSearchBar';
import JobCard from '@/components/job/JobCard';
import { jobsApiService, type JobListing, type JobSearchFilters } from '@/lib/api/jobs';
import { useGeolocation } from '@/lib/hooks/useGeolocation';

// Use the JobListing interface from the API service instead of the mock interface

// Removed mock data - now using real API data

export default function AfricaJobs() {
  // Client-side only state to prevent hydration issues
  const [isClient, setIsClient] = useState(false);
  
  // Geolocation hook to detect user's country
  const { countryCode } = useGeolocation();
  
  // Removed unused jobs state
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>([]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  // Removed unused searchTerm state
  const [filters, setFilters] = useState<AfricanJobFiltersType>({
    search: '',
    location: '',
    workMode: '',
    experience: '',
    visaSponsorship: '',
    datePosted: ''
  });
  // Removed showFilters state since filters are now always visible at the top
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
    from: null as number | null,
    to: null as number | null
  });

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

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-set location filter based on user's detected country
  useEffect(() => {
    if (countryCode && !filters.location) {
      console.log('🌍 Auto-setting location filter to:', countryCode);
      setFilters(prev => ({
        ...prev,
        location: countryCode
      }));
    } else if (countryCode) {
      console.log('🌍 Detected country:', countryCode, 'but location filter already set to:', filters.location);
    }
  }, [countryCode, filters.location]);

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

  const handleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(jobId)) {
        newSaved.delete(jobId);
      } else {
        newSaved.add(jobId);
      }
      return newSaved;
    });
  };

  const handleFiltersChange = (newFilters: AfricanJobFiltersType) => {
    setFilters(newFilters);
    // Reset pagination when filters change
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      workMode: '',
      experience: '',
      visaSponsorship: '',
      datePosted: ''
    });
    // Reset pagination when clearing filters
    setPagination(prev => ({ ...prev, current_page: 1 }));
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#244034] via-[#2d4a3e] to-[#365a4a] text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-[#4ade80] rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Live Jobs from Across Africa</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold font-['Gordita'] mb-6 leading-tight">
                Your Gateway to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] to-[#6ee7b7]">
                  African Careers
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 mb-4 max-w-4xl mx-auto leading-relaxed">
                Join thousands of professionals who&apos;ve found their dream careers across Africa&apos;s fastest-growing companies
              </p>
              
              <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
                From Lagos to Nairobi, Cape Town to Cairo - discover opportunities that shape the future of Africa
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#4ade80] mb-2">
                    {!isClient || isLoading ? '...' : `${pagination.total}+`}
                  </div>
                  <div className="text-gray-300 font-medium">Active Jobs</div>
                  <div className="text-xs text-gray-400 mt-1">Updated daily</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#4ade80] mb-2">54</div>
                  <div className="text-gray-300 font-medium">African Countries</div>
                  <div className="text-xs text-gray-400 mt-1">Pan-African reach</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#4ade80] mb-2">500+</div>
                  <div className="text-gray-300 font-medium">Partner Companies</div>
                  <div className="text-xs text-gray-400 mt-1">From startups to MNCs</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#4ade80] mb-2">10K+</div>
                  <div className="text-gray-300 font-medium">Successful Hires</div>
                  <div className="text-xs text-gray-400 mt-1">Last 12 months</div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-gray-300">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#4ade80]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Verified Employers</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#4ade80]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">No Spam, Ever</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#4ade80]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Free to Use</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filters Section */}
        
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="flex items-center justify-between mb-6">
        <SimpleSearchBar
                      placeholder="Search for jobs, companies, locations, or skills..."
                      value={filters.search}
                      onChange={(value) => setFilters((prev: AfricanJobFiltersType) => ({ ...prev, search: value }))}
                      onSearch={(value) => setFilters((prev: AfricanJobFiltersType) => ({ ...prev, search: value }))}
                      className="w-full bg-white"
                    />
                    </div>
        <AfricanJobFilters
                  onFiltersChange={handleFiltersChange}
                  initialFilters={filters}
                />
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
                    🌍 Auto-detected
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
                  <div className="space-y-6">
                    {filteredJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onSave={handleSaveJob}
                        isSaved={savedJobs.has(job.id)}
                      />
                    ))}
                
                {/* Pagination */}
                {pagination.last_page > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      disabled={pagination.current_page === 1}
                      onClick={() => {
                        setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }));
                      }}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <Button
                      variant="outline"
                      disabled={pagination.current_page === pagination.last_page}
                      onClick={() => {
                        setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }));
                      }}
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