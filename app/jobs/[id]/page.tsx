'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import ShareButton from '@/components/ui/ShareButton';
import { jobsApiService, type JobListing } from '@/lib/api/jobs';
import { getJobSlug, extractJobId } from '@/lib/utils/slug';
import { JobPostingSchema, BreadcrumbSchema } from '@/components/seo';
import { useAuth } from '@/lib/auth';
import { handleJobApplication } from '@/lib/utils/jobApplication';
import { userActivitiesService } from '@/lib/api/activities';
import { savedJobsService } from '@/lib/api/savedJobs';
import toast from 'react-hot-toast';

// Extended company type with links for the job detail page
type CompanyWithLinks = {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  industry?: string;
  links?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
};

const JobDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [job, setJob] = useState<JobListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [similarJobs, setSimilarJobs] = useState<JobListing[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);
  const similarJobsLoadedRef = useRef(false);

  const jobSlugOrId = params?.id as string;
  const jobId = extractJobId(jobSlugOrId);

  // Handle back navigation with scroll position preserved
  const handleBackToJobs = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use browser back to preserve state and scroll position
    if (typeof window !== 'undefined' && window.history.length > 1) {
      // The scroll position is already stored in sessionStorage by JobCard
      router.back();
    } else {
      // Fallback to jobs page if no history
      router.push('/jobs');
    }
  };

  // Check if job is saved
  const checkSavedStatus = useCallback(async (jobListingId: string) => {
    if (!isAuthenticated) {
      setIsSaved(false);
      return;
    }

    try {
      const response = await savedJobsService.checkIfSaved(jobListingId);
      
      if (response.success && response.data) {
        setIsSaved(response.data.is_saved);
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  }, [isAuthenticated]);

  const loadSimilarJobs = useCallback(async () => {
    if (!job) return;
    
    try {
      setIsLoadingSimilar(true);
      // Get similar jobs based on company, categories, or skills
      const filters = {
        per_page: 3,
        ...(job.companies[0]?.name && { company: job.companies[0].name }),
        ...(job.categories.length > 0 && { category_ids: [job.categories[0].id] }),
        ...(job.skills.length > 0 && { skill_ids: [job.skills[0].id] }),
      };
      
      const response = await jobsApiService.searchJobs(filters);
      if (response.success && response.data) {
        // Filter out the current job
        const filtered = response.data.jobs.filter((similarJob: JobListing) => similarJob.id !== job.id);
        setSimilarJobs(filtered.slice(0, 3));
      }
    } catch (err) {
      console.error('Error loading similar jobs:', err);
    } finally {
      setIsLoadingSimilar(false);
    }
  }, [job]);

  useEffect(() => {
    const loadJob = async () => {
      if (!jobId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        setJob(null); // Clear previous job
        setSimilarJobs([]); // Clear previous similar jobs
        similarJobsLoadedRef.current = false; // Reset similar jobs flag
        const response = await jobsApiService.getJob(jobId);
        
        if (response.success && response.data) {
          setJob(response.data);
          
          // Track job view activity (only if authenticated)
          // Use the actual job ID (UUID) from the response, not the slug
          if (isAuthenticated && response.data.id) {
            userActivitiesService.trackActivity('view', response.data.id);
            
            // Check if job is saved
            await checkSavedStatus(response.data.id);
          }
        } else {
          setError('Job not found');
        }
      } catch (err) {
        console.error('Error loading job:', err);
        setError('Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };

    loadJob();
  }, [jobId, isAuthenticated, checkSavedStatus]);

  // Separate useEffect for loading similar jobs when job changes
  useEffect(() => {
    if (job && !similarJobsLoadedRef.current) {
      similarJobsLoadedRef.current = true;
      loadSimilarJobs();
    }
  }, [job, loadSimilarJobs]);

  const formatCurrency = (min: number | null, max: number | null, currency: string | null) => {
    if (!min && !max) return null;
    const currencySymbol = currency?.toUpperCase() || '';
    if (min && max) {
      return `${min.toLocaleString()} - ${max.toLocaleString()} ${currencySymbol}`;
    } else if (min) {
      return `${min.toLocaleString()}+ ${currencySymbol}`;
    } else if (max) {
      return `Up to ${max.toLocaleString()} ${currencySymbol}`;
    }
    return null;
  };

  const getCompanyInitials = (companyName: string) => {
    return companyName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };


  const handleSaveJob = async () => {
    if (!job) return;

    // Prevent duplicate calls
    if (isSaving) {
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to save jobs');
      try {
        const loginUrl = new URL('/auth/login', window.location.origin);
        // Return to the same job details URL after login
        loginUrl.searchParams.set('returnTo', window.location.pathname + window.location.search + window.location.hash);
        window.location.href = loginUrl.toString();
      } catch {
        window.location.href = '/auth/login';
      }
      return;
    }

    try {
      setIsSaving(true);
      
      if (isSaved) {
        // Unsave the job
        const response = await savedJobsService.unsaveJob(job.id);
        
        if (response.success) {
          setIsSaved(false);
          toast.success('Job removed from saved');
        } else {
          toast.error('Failed to unsave job');
        }
      } else {
        // Save the job
        const response = await savedJobsService.saveJob(job.id);
        
        if (response.success) {
          setIsSaved(true);
          toast.success('Job saved successfully');
          
          // Track save activity with metadata
          userActivitiesService.trackActivity('save', job.id, {
            job_title: job.title,
            company: job.companies[0]?.name,
            location: job.locations[0]?.name,
          });
        } else {
          toast.error(response.message || 'Failed to save job');
        }
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!job?.application.url) return;
    
    // Track apply click activity (only if authenticated)
    if (isAuthenticated && job.id) {
      userActivitiesService.trackActivity('apply_click', job.id, {
        job_title: job.title,
        company: job.companies[0]?.name,
        application_url: job.application.url,
      });
    }
    
    handleJobApplication(job.application.url, isAuthenticated);
  };

  // Clear saved scroll position when viewing a new job
  useEffect(() => {
    // Clear the scroll position from sessionStorage when a job detail page loads
    // This prevents unwanted scrolling when navigating between job details
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('jobsListScrollPosition');
    }
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The job you are looking for does not exist.'}</p>
            <Link href="/">
              <Button variant="primary" className="bg-[#244034] hover:bg-[#1a2e26]">
                Back to Jobs
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://edwuma.com';
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Jobs', url: `${baseUrl}/jobs` },
    { name: job.title, url: `${baseUrl}/jobs/${job.slug}` },
  ];

  const shareData = {
    title: `${job.title} at ${job.companies[0]?.name}`,
    text: `Check out this job opportunity: ${job.title} at ${job.companies[0]?.name} in ${job.locations[0]?.city || job.locations[0]?.country}`,
    url: `${baseUrl}/jobs/${job.slug}`,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Structured Data */}
      <JobPostingSchema job={job} />
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <Header />
      
        {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 overflow-hidden">
            <Link href="/" className="hover:text-[#244034] transition-colors flex-shrink-0">
              Home
            </Link>
            <span className="flex-shrink-0">/</span>
            <button
              onClick={handleBackToJobs}
              className="hover:text-[#244034] transition-colors flex-shrink-0 underline"
            >
              Jobs
            </button>
            <span className="flex-shrink-0">/</span>
            <span className="text-gray-900 font-medium truncate">{job.title}</span>
        </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 mb-8">
                <div className="flex items-start justify-between gap-4">
            <div className="flex items-start space-x-4 sm:space-x-6 flex-1 min-w-0">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                {job.companies[0]?.logo_url ? (
                  <Image
                    src={job.companies[0].logo_url}
                    alt={`${job.companies[0].name} logo`}
                    width={80}
                    height={80}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-gray-200 shadow-sm"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#244034] to-[#1a2f26] rounded-2xl flex items-center justify-center shadow-sm ${job.companies[0]?.logo_url ? 'hidden' : ''}`}>
                  <span className="text-white font-bold text-lg sm:text-xl">
                    {getCompanyInitials(job.companies[0]?.name || 'Company')}
                  </span>
                </div>
              </div>
              
              {/* Job Info */}
                  <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 leading-tight break-words" style={{ fontSize: '1rem', lineHeight: '1.5rem' }}>{job.title}</h1>
                <div className="flex items-center gap-2 sm:gap-6 text-sm text-gray-600 mb-4 flex-wrap">
                  <span className="font-semibold truncate">{job.companies[0]?.name || 'Company'}</span>
                  <span className="text-gray-400 flex-shrink-0">•</span>
                  <div className="flex items-center gap-2 min-w-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    <span className="truncate">{job.locations[0]?.name || 'Location'}</span>
                    {job.locations[0]?.country && (
                      <span className="text-gray-400 truncate">, {job.locations[0].country}</span>
                    )}
                  </div>
                </div>
                
                {/* Job Meta */}
                <div className="flex items-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-600 flex-wrap">
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="truncate">Posted {job.timing.posted_at_formatted}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    <span className="truncate">{job.job_type.label}</span>
                </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="truncate">{job.work_mode.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="truncate">{job.experience_level.label}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveJob}
              className="p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label={isSaved ? 'Remove from saved' : 'Save job'}
            >
              <svg
                className={`w-5 h-5 sm:w-6 sm:h-6 ${isSaved ? 'text-[#4ade80] fill-current' : 'text-gray-400 hover:text-gray-600'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            {/* Share Button */}
            <ShareButton shareData={shareData} variant="menu" size="lg" />
          </div>

          {/* Apply Now Button */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {job.application.url ? (
              <Button 
                variant="primary" 
                size="lg" 
                className="sm:col-span-2 bg-[#244034] hover:bg-[#1a2e26] py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleApplyClick}
              >
                Apply Now
              </Button>
            ) : (
              <Button variant="primary" size="lg" className="sm:col-span-2 bg-gray-400 cursor-not-allowed py-4 text-lg font-semibold" disabled>
                Apply Now
              </Button>
            )}
            
            <ShareButton shareData={shareData} variant="button" size="lg" showLabel className="py-4 text-base" />
          </div>

          {/* Salary */}
          {job.salary && (job.salary.min || job.salary.max) && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-green-800 font-bold text-xl">
                  {formatCurrency(job.salary.min, job.salary.max, job.salary.currency)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Company Info Card - Mobile Only (shows as second card) */}
        <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Company</h3>
          <div className="flex items-center space-x-4 mb-4">
            {job.companies[0]?.logo_url ? (
              <Image
                src={job.companies[0].logo_url}
                alt={`${job.companies[0].name} logo`}
                width={48}
                height={48}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-12 h-12 bg-gradient-to-br from-[#244034] to-[#1a2f26] rounded-lg flex items-center justify-center ${job.companies[0]?.logo_url ? 'hidden' : ''}`}>
              <span className="text-white font-bold text-sm">
                {getCompanyInitials(job.companies[0]?.name || 'Company')}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-lg">{job.companies[0]?.name || 'Company'}</h4>
              {/* <p className="text-sm text-gray-600">{job.companies[0]?.industry || ''}</p> */}
            </div>
          </div>
          
          {/* Company Links */}
          {(() => {
            const company = job.companies[0] as CompanyWithLinks;
            return (company?.links?.website || company?.links?.linkedin) && (
              <div className="flex gap-3 mb-4">
                {company?.links?.website && (
                  <a
                    href={company.links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Website
                  </a>
                )}
                {company?.links?.linkedin && (
                  <a
                    href={company.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            );
          })()}
          
          <p className="text-sm text-gray-600">
            {job.companies[0]?.description || 'Learn more about this company and their mission.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Job Description - Render HTML */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Role</h2>
              <div className="prose prose-lg prose-gray max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ __html: job.description }}
                  className="text-gray-700 leading-relaxed"
                />
              </div>
              
              {/* Apply Button - Moved here from sidebar */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                {job.application.url ? (
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full bg-[#244034] hover:bg-[#1a2e26] py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={handleApplyClick}
                  >
                    Apply for this job
                  </Button>
                ) : (
                  <Button variant="primary" size="lg" className="w-full bg-gray-400 cursor-not-allowed py-4 text-lg font-semibold" disabled>
                    Apply for this job
                  </Button>
                )}
                
                {/* Save Job Button */}
                <div className="flex items-center justify-center mt-4">
                  <button
                    onClick={handleSaveJob}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isSaved 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    <svg 
                      className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {isSaved ? 'Saved to your jobs' : 'Save this job'}
                  </button>
                </div>
              </div>
            </div>

            {/* Requirements - Render HTML */}
            {job.requirements && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
                <div className="prose prose-lg prose-gray max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                    className="text-gray-700 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Benefits - Render HTML */}
            {job.benefits && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits</h2>
                <div className="prose prose-lg prose-gray max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: job.benefits }}
                    className="text-gray-700 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Skills */}
            {job.skills.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Required Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill) => (
                    <span key={skill.id} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Jobs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Jobs</h2>
              {isLoadingSimilar ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : similarJobs.length > 0 ? (
                <div className="space-y-4">
                  {similarJobs.map((similarJob) => (
                    <Link
                      key={similarJob.id}
                      href={`/jobs/${getJobSlug(similarJob)}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-[#244034] hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Company Logo */}
                        <div className="flex-shrink-0">
                          {similarJob.companies[0]?.logo_url ? (
                            <Image
                              src={similarJob.companies[0].logo_url}
                              alt={`${similarJob.companies[0].name} logo`}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`w-12 h-12 bg-gradient-to-br from-[#244034] to-[#1a2f26] rounded-lg flex items-center justify-center ${similarJob.companies[0]?.logo_url ? 'hidden' : ''}`}>
                            <span className="text-white font-bold text-xs">
                              {getCompanyInitials(similarJob.companies[0]?.name || 'Company')}
                            </span>
                          </div>
                        </div>
                        
                        {/* Job Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
                            {similarJob.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {similarJob.companies[0]?.name || 'Company'}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {similarJob.locations[0]?.name || 'Location'}
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {similarJob.timing.posted_at_formatted}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  <p className="text-gray-500">No similar jobs found at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Company Info - Desktop Only (hidden on mobile) */}
              <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Company</h3>
                <div className="flex items-center space-x-4 mb-4">
                  {job.companies[0]?.logo_url ? (
                    <Image
                      src={job.companies[0].logo_url}
                      alt={`${job.companies[0].name} logo`}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-12 h-12 bg-gradient-to-br from-[#244034] to-[#1a2f26] rounded-lg flex items-center justify-center ${job.companies[0]?.logo_url ? 'hidden' : ''}`}>
                    <span className="text-white font-bold text-sm">
                      {getCompanyInitials(job.companies[0]?.name || 'Company')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">{job.companies[0]?.name || 'Company'}</h4>
                    <p className="text-sm text-gray-600">{job.companies[0]?.industry || ''}</p>
                  </div>
                </div>
                
                {/* Company Links */}
                {(() => {
                  const company = job.companies[0] as CompanyWithLinks;
                  return (company?.links?.website || company?.links?.linkedin) && (
                    <div className="flex gap-3 mb-4">
                      {company?.links?.website && (
                        <a
                          href={company.links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Website
                        </a>
                      )}
                      {company?.links?.linkedin && (
                        <a
                          href={company.links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          LinkedIn
                        </a>
                      )}
                </div>
                  );
                })()}
                
                <p className="text-sm text-gray-600">
                  {job.companies[0]?.description || 'Learn more about this company and their mission.'}
                </p>
                  </div>


              {/* Job Details */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600 font-medium">Experience Level</span>
                    <p className="font-semibold text-gray-900 capitalize">{job.experience_level.value}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 font-medium">Employment Type</span>
                    <p className="font-semibold text-gray-900 capitalize">{job.job_type.value}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 font-medium">Work Arrangement</span>
                    <p className="font-semibold text-gray-900 capitalize">{job.work_mode.value}</p>
                  </div>
                  {job.education_level && (
                    <div>
                      <span className="text-sm text-gray-600 font-medium">Education Level</span>
                      <p className="font-semibold text-gray-900 capitalize">{job.education_level.value}</p>
                  </div>
                  )}
                  {job.salary && (job.salary.min || job.salary.max) && (
                    <div>
                      <span className="text-sm text-gray-600 font-medium">Salary Range</span>
                      <p className="font-semibold text-[#4ade80] text-lg">
                        {formatCurrency(job.salary.min, job.salary.max, job.salary.currency)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Categories */}
              {job.categories.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.categories.map((category) => (
                      <span key={category.id} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Language Requirements */}
              {job.language_requirements && job.language_requirements.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Language Requirements</h3>
                  <div className="space-y-3">
                    {job.language_requirements.map((lang, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">{lang.language?.name || 'Language'}</span>
                        <span className="font-semibold text-gray-900">{lang.proficiency_level || 'Required'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetailsPage;