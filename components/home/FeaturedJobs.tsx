'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatRelativeTime } from '@/lib/utils';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  postedAt: string;
  category: string;
}

interface FeaturedJobsProps {
  jobs?: Job[];
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
  },
];

const FeaturedJobs: React.FC<FeaturedJobsProps> = ({ jobs = mockJobs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Information Technology', label: 'Information Technology' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Finance and Accounting', label: 'Finance and Accounting' },
    { value: 'Sales and Marketing', label: 'Sales and Marketing' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Creative Arts and Design', label: 'Creative Arts and Design' },
  ];

  const locations = [
    { value: '', label: 'All Locations' },
    { value: 'Accra, Ghana', label: 'Accra, Ghana' },
    { value: 'Washington DC', label: 'Washington DC' },
    { value: 'California, CA', label: 'California, CA' },
    { value: 'New York', label: 'New York' },
    { value: 'Miami', label: 'Miami' },
    { value: 'Remote', label: 'Remote' },
  ];

  const handleFilter = React.useCallback(() => {
    let filtered = jobs;

    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    if (selectedLocation) {
      filtered = filtered.filter(job => job.location === selectedLocation);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, selectedCategory, selectedLocation]);

  React.useEffect(() => {
    handleFilter();
  }, [handleFilter]);

  return (
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

        {/* Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Input
              placeholder="Search jobs, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <Select
              placeholder="Select category"
              options={categories}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
            <Select
              placeholder="Select location"
              options={locations}
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#244034] mb-2 line-clamp-2">
                      {job.title}
                    </h3>
                    <p className="text-sm text-[rgba(0,0,0,0.7)] mb-2">
                      {job.company}
                    </p>
                  </div>
                  <Badge variant="secondary" size="sm">
                    {job.type}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-[rgba(0,0,0,0.7)]">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-[rgba(0,0,0,0.7)]">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    {job.experience} Level
                  </div>
                  <div className="flex items-center text-sm text-[rgba(0,0,0,0.5)]">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 18 0z" />
                    </svg>
                    Posted {formatRelativeTime(job.postedAt)}
                  </div>
                </div>

                <div className="mb-4">
                  <Badge variant="default" size="sm">
                    {job.category}
                  </Badge>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Link href={`/jobs/${job.id}`} className="w-full">
                  <Button variant="success" className="w-full">
                    Apply Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Jobs CTA */}
        <div className="text-center">
          <Link href="/jobs">
            <Button variant="primary" size="lg" className="px-8">
              View All Jobs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
