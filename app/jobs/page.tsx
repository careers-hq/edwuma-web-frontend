'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JobCard from '@/components/job/JobCard';
import { Button } from '@/components/ui/Button';
import { JobFilters as JobFiltersType } from '@/components/job/JobFilters';
import JobFilters from '@/components/job/JobFilters';
import HeroSection from '@/components/home/HeroSection';
import type { JobListing } from '@/lib/api/jobs';
import { useAuth } from '@/lib/auth';
import { savedJobsService } from '@/lib/api/savedJobs';
import { userActivitiesService } from '@/lib/api/activities';
import toast from 'react-hot-toast';

const mockJobs: JobListing[] = [
  {
    id: '1',
    external_id: null,
    title: 'Senior Software Engineer',
    slug: 'senior-software-engineer-techcorp-ghana',
    description: 'We are looking for a senior software engineer to join our growing team...',
    requirements: '5+ years of experience in software development',
    benefits: 'Health insurance, flexible hours, remote work',
    salary: { min: 80000, max: 120000, currency: 'USD' },
    work_mode: { value: 'hybrid', label: 'Hybrid' },
    job_type: { value: 'full-time', label: 'Full-Time' },
    experience_level: { value: 'senior', label: 'Senior' },
    education_level: { value: 'bachelor', label: 'Bachelor\'s Degree' },
    application: { url: null, deadline: null, deadline_formatted: null },
    timing: { 
      posted_at: '2024-01-15T00:00:00Z', 
      posted_at_formatted: '2024-01-15',
      expires_at: null,
      expires_at_formatted: null
    },
    status: { value: 'active', label: 'Active' },
    source: { value: 'direct', label: 'Direct', url: null },
    data_quality_score: 95,
    companies: [{ 
      id: '1', 
      name: 'TechCorp Ghana', 
      description: 'Leading tech company', 
      logo_url: undefined,
      size: { value: '50-200', label: '50-200 employees' },
      industry: 'Technology',
      founded_year: 2015,
      headquarters: 'Accra, Ghana',
      type: 'Private',
      links: { website: 'https://techcorp.gh' },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }],
    locations: [{ 
      id: '1', 
      name: 'Accra, Ghana', 
      city: 'Accra', 
      state: null, 
      country: 'Ghana', 
      region: 'West Africa',
      latitude: 5.6037,
      longitude: -0.1870,
      is_diaspora: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }],
    categories: [{ 
      id: '1', 
      name: 'Information Technology', 
      description: 'IT and software development jobs',
      parent_id: null,
      level: 1,
      is_african_specific: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }],
    skills: [],
    language_requirements: [],
    visa_sponsorship: [],
    special_considerations: [],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    external_id: null,
    title: 'Marketing Manager',
    slug: 'marketing-manager-growth-solutions',
    description: 'Lead our marketing initiatives and drive growth for our company...',
    requirements: '3+ years of marketing experience',
    benefits: 'Health insurance, performance bonuses',
    salary: { min: 60000, max: 80000, currency: 'USD' },
    work_mode: { value: 'remote', label: 'Remote' },
    job_type: { value: 'full-time', label: 'Full-Time' },
    experience_level: { value: 'intermediate', label: 'Intermediate' },
    education_level: { value: 'bachelor', label: 'Bachelor\'s Degree' },
    application: { url: null, deadline: null, deadline_formatted: null },
    timing: { 
      posted_at: '2024-01-14T00:00:00Z', 
      posted_at_formatted: '2024-01-14',
      expires_at: null,
      expires_at_formatted: null
    },
    status: { value: 'active', label: 'Active' },
    source: { value: 'direct', label: 'Direct', url: null },
    data_quality_score: 90,
    companies: [{ 
      id: '2', 
      name: 'Growth Solutions', 
      description: 'Marketing agency', 
      logo_url: undefined,
      size: { value: '10-50', label: '10-50 employees' },
      industry: 'Marketing',
      founded_year: 2020,
      headquarters: 'Washington DC',
      type: 'Private',
      links: { website: 'https://growthsolutions.com' },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }],
    locations: [{ 
      id: '2', 
      name: 'Washington DC', 
      city: 'Washington', 
      state: 'DC', 
      country: 'United States', 
      region: 'North America',
      latitude: 38.9072,
      longitude: -77.0369,
      is_diaspora: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }],
    categories: [{ 
      id: '2', 
      name: 'Sales and Marketing', 
      description: 'Sales and marketing jobs',
      parent_id: null,
      level: 1,
      is_african_specific: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }],
    skills: [],
    language_requirements: [],
    visa_sponsorship: [],
    special_considerations: [],
    created_at: '2024-01-14T00:00:00Z',
    updated_at: '2024-01-14T00:00:00Z'
  },
  {
    id: '3',
    external_id: null,
    title: 'Data Analyst',
    slug: 'data-analyst-analytics-pro',
    description: 'Analyze data and provide insights to help drive business decisions...',
    requirements: '2+ years of data analysis experience',
    benefits: 'Health insurance, learning budget',
    salary: { min: 50000, max: 70000, currency: 'USD' },
    work_mode: { value: 'hybrid', label: 'Hybrid' },
    job_type: { value: 'contract', label: 'Contract' },
    experience_level: { value: 'entry', label: 'Entry Level' },
    education_level: { value: 'bachelor', label: 'Bachelor\'s Degree' },
    application: { url: null, deadline: null, deadline_formatted: null },
    timing: { 
      posted_at: '2024-01-13T00:00:00Z', 
      posted_at_formatted: '2024-01-13',
      expires_at: null,
      expires_at_formatted: null
    },
    status: { value: 'active', label: 'Active' },
    source: { value: 'direct', label: 'Direct', url: null },
    data_quality_score: 85,
    companies: [{ 
      id: '3', 
      name: 'Analytics Pro', 
      description: 'Data analytics company', 
      logo_url: undefined,
      size: { value: '20-100', label: '20-100 employees' },
      industry: 'Technology',
      founded_year: 2018,
      headquarters: 'California, CA',
      type: 'Private',
      links: { website: 'https://analyticspro.com' },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }],
    locations: [{ 
      id: '3', 
      name: 'California, CA', 
      city: 'San Francisco', 
      state: 'CA', 
      country: 'United States', 
      region: 'North America',
      latitude: 37.7749,
      longitude: -122.4194,
      is_diaspora: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }],
    categories: [{ 
      id: '1', 
      name: 'Information Technology', 
      description: 'IT and software development jobs',
      parent_id: null,
      level: 1,
      is_african_specific: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }],
    skills: [],
    language_requirements: [],
    visa_sponsorship: [],
    special_considerations: [],
    created_at: '2024-01-13T00:00:00Z',
    updated_at: '2024-01-13T00:00:00Z'
  }
];

export default function JobsPage() {
  const { isAuthenticated } = useAuth();
  const [jobs] = useState<JobListing[]>(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>(mockJobs);
  const [filters, setFilters] = useState<JobFiltersType>({
    search: '',
    category: '',
    location: '',
    jobType: [],
    experience: '',
    workMode: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const jobsPerPage = 6;

  // Fetch saved jobs when authenticated
  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!isAuthenticated) {
        setSavedJobIds(new Set());
        return;
      }

      try {
        const response = await savedJobsService.getSavedJobs(1, 100); // Fetch up to 100 saved jobs
        
        if (response.success && response.data) {
          const savedIds = new Set(response.data.data.map(savedJob => savedJob.job.id));
          setSavedJobIds(savedIds);
        }
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      }
    };

    fetchSavedJobs();
  }, [isAuthenticated]);

  // Filter jobs based on current filters
  useEffect(() => {
    let filtered = jobs;

    if (filters.search) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.companies[0]?.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(job => job.categories[0]?.name === filters.category);
    }

    if (filters.location) {
      filtered = filtered.filter(job => job.locations[0]?.name === filters.location);
    }

    if (filters.jobType && filters.jobType.length > 0) {
      filtered = filtered.filter(job => filters.jobType.includes(job.job_type.value));
    }

    if (filters.experience) {
      filtered = filtered.filter(job => job.experience_level.value === filters.experience);
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [filters, jobs]);

  const handleFiltersChange = (newFilters: JobFiltersType) => {
    setFilters(newFilters);
  };

  const handleSaveJob = async (jobId: string) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to save jobs');
      try {
        const loginUrl = new URL('/auth/login', window.location.origin);
        // Return to the same listing URL after login
        loginUrl.searchParams.set('returnTo', window.location.pathname + window.location.search + window.location.hash);
        window.location.href = loginUrl.toString();
      } catch {
        window.location.href = '/auth/login';
      }
      return;
    }

    const isSaved = savedJobIds.has(jobId);
    const job = jobs.find(j => j.id === jobId);

    try {
      if (isSaved) {
        // Unsave the job
        const response = await savedJobsService.unsaveJob(jobId);
        
        if (response.success) {
          setSavedJobIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(jobId);
            return newSet;
          });
          toast.success('Job removed from saved');
        } else {
          toast.error('Failed to unsave job');
        }
      } else {
        // Save the job
        const response = await savedJobsService.saveJob(jobId);
        
        if (response.success) {
          setSavedJobIds(prev => new Set(prev).add(jobId));
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
    }
  };

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        {/* <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#244034] font-['Gordita'] mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-lg text-[rgba(0,0,0,0.7)]">
            Discover {filteredJobs.length} job opportunities from top companies
          </p>
        </div> */}


        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <JobFilters
              onFiltersChange={handleFiltersChange}
              initialFilters={filters}
            />
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            {/* Search Bar and Results Header */}
            <div className="mb-6">

              {/* Full Width Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search job title or keyword"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:border-[#244034] focus:outline-none focus:ring-2 focus:ring-[#244034] focus:ring-opacity-20"
                  />
                </div>
                <Button
                  variant="primary"
                  className="px-8 py-3 text-base font-semibold bg-[#244034] hover:bg-[#1a2f26] rounded-lg"
                  onClick={() => setFilters(prev => ({ ...prev }))}
                >
                  Search
                </Button>
              </div>

               {/* Results Count */}
               <div className="mb-4 mt-4">
                <p className="text-sm font-medium text-primary">
                  {filteredJobs.length} Jobs results
                </p>
              </div>
            </div>

          {/* Jobs List */}
          {currentJobs.length > 0 ? (
            <div className="space-y-4">
              {currentJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSave={handleSaveJob}
                  isSaved={savedJobIds.has(job.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#244034] mb-2">No jobs found</h3>
              <p className="text-[rgba(0,0,0,0.7)] mb-4">
                Try adjusting your search criteria
              </p>
              <Button
                variant="outline"
                onClick={() => setFilters({
                  search: '',
                  category: '',
                  location: '',
                  jobType: [],
                  experience: '',
                  workMode: '',
                })}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
