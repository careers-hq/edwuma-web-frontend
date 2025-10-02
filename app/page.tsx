'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import JobFilters from '@/components/job/JobFilters';
import JobCard from '@/components/job/JobCard';
import { JobFilters as JobFiltersType } from '@/components/job/JobFilters';

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
    description: 'Create user-centered designs for our digital products...',
  },
];

export default function Home() {
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
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  const handleFiltersChange = (newFilters: JobFiltersType) => {
    setFilters(newFilters);
    
    let filtered = jobs;

    if (newFilters.search) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        job.description?.toLowerCase().includes(newFilters.search.toLowerCase())
      );
    }

    if (newFilters.category) {
      filtered = filtered.filter(job => job.category === newFilters.category);
    }

    if (newFilters.location) {
      filtered = filtered.filter(job => job.location === newFilters.location);
    }

    if (newFilters.jobType && newFilters.jobType.length > 0) {
      filtered = filtered.filter(job => newFilters.jobType.includes(job.type));
    }

    if (newFilters.experience) {
      filtered = filtered.filter(job => job.experience === newFilters.experience);
    }

    setFilteredJobs(filtered);
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        
        {/* Job Listings Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#244034] font-['Gordita'] mb-4">
                Latest Job Opportunities
              </h2>
              <p className="text-lg text-[rgba(0,0,0,0.7)] max-w-2xl mx-auto">
                Discover the latest job openings from top companies across various industries
              </p>
            </div>

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
                {/* Results Count */}
                <div className="mb-6">
                  <p className="text-sm text-[rgba(0,0,0,0.7)]">
                    Showing {filteredJobs.length} jobs
                  </p>
                </div>

                {/* Jobs Grid */}
                {filteredJobs.length > 0 ? (
                  <div className="space-y-6">
                    {filteredJobs.map((job) => (
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
                      Try adjusting your search criteria or filters
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}