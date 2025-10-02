'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JobCard from '@/components/job/JobCard';
import { Button } from '@/components/ui/Button';
import { JobFilters as JobFiltersType } from '@/components/job/JobFilters';
import JobFilters from '@/components/job/JobFilters';
import HeroSection from '@/components/home/HeroSection';


interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  postedAt: string;
  category: string;
  salary?: string;
  description?: string;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Ghana',
    location: 'Accra, Ghana',
    type: 'Full-Time',
    experience: 'Senior',
    postedAt: '2024-01-15',
    category: 'Information Technology',
    salary: '$80,000 - $120,000',
    description: 'We are looking for a senior software engineer to join our growing team...',
  },
  {
    id: '2',
    title: 'Marketing Manager',
    company: 'Growth Solutions',
    location: 'Washington DC',
    type: 'Full-Time',
    experience: 'Intermediate',
    postedAt: '2024-01-14',
    category: 'Sales and Marketing',
    salary: '$60,000 - $80,000',
    description: 'Lead our marketing initiatives and drive growth for our company...',
  },
  {
    id: '3',
    title: 'Data Analyst',
    company: 'Analytics Pro',
    location: 'California, CA',
    type: 'Contract',
    experience: 'Entry Level',
    postedAt: '2024-01-13',
    category: 'Information Technology',
    salary: '$50,000 - $70,000',
    description: 'Analyze data and provide insights to help drive business decisions...',
  },
  {
    id: '4',
    title: 'Healthcare Administrator',
    company: 'MedCenter',
    location: 'New York',
    type: 'Full-Time',
    experience: 'Experienced',
    postedAt: '2024-01-12',
    category: 'Healthcare',
    salary: '$70,000 - $90,000',
    description: 'Manage healthcare operations and ensure quality patient care...',
  },
  {
    id: '5',
    title: 'Financial Advisor',
    company: 'Wealth Management Inc',
    location: 'Miami',
    type: 'Full-Time',
    experience: 'Senior',
    postedAt: '2024-01-11',
    category: 'Finance and Accounting',
    salary: '$90,000 - $130,000',
    description: 'Provide financial advice and investment strategies to clients...',
  },
  {
    id: '6',
    title: 'UX Designer',
    company: 'Design Studio',
    location: 'Remote',
    type: 'Part-Time',
    experience: 'Intermediate',
    postedAt: '2024-01-10',
    category: 'Creative Arts and Design',
    salary: '$60,000 - $80,000',
    description: 'Create user-centered designs for our digital products...',
  },
  {
    id: '7',
    title: 'Project Manager',
    company: 'Construction Co',
    location: 'Accra, Ghana',
    type: 'Full-Time',
    experience: 'Experienced',
    postedAt: '2024-01-09',
    category: 'Construction and Skilled Trades',
    salary: '$70,000 - $95,000',
    description: 'Manage construction projects from planning to completion...',
  },
  {
    id: '8',
    title: 'Customer Service Representative',
    company: 'Service Corp',
    location: 'Remote',
    type: 'Full-Time',
    experience: 'Entry Level',
    postedAt: '2024-01-08',
    category: 'Customer Service',
    salary: '$35,000 - $45,000',
    description: 'Provide excellent customer service and support to our clients...',
  },
];

export default function JobsPage() {
  const [jobs] = useState<Job[]>(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [filters, setFilters] = useState<JobFiltersType>({
    search: '',
    category: '',
    location: '',
    jobType: [],
    experience: '',
    workMode: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const jobsPerPage = 6;

  // Filter jobs based on current filters
  useEffect(() => {
    let filtered = jobs;

    if (filters.search) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(job => job.category === filters.category);
    }

    if (filters.location) {
      filtered = filtered.filter(job => job.location === filters.location);
    }

    if (filters.jobType && filters.jobType.length > 0) {
      filtered = filtered.filter(job => filters.jobType.includes(job.type));
    }

    if (filters.experience) {
      filtered = filtered.filter(job => job.experience === filters.experience);
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [filters, jobs]);

  const handleFiltersChange = (newFilters: JobFiltersType) => {
    setFilters(newFilters);
  };

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
                  showDescription={true}
                  onSave={handleSaveJob}
                  isSaved={savedJobs.has(job.id)}
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
