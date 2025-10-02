'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

interface JobFiltersProps {
  onFiltersChange: (filters: JobFilters) => void;
  initialFilters?: JobFilters;
}

export interface JobFilters {
  search: string;
  category: string;
  location: string;
  jobType: string[];
  experience: string;
  workMode: string;
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'food-beverages', label: 'Food and Beverages Jobs' },
  { value: 'information-technology', label: 'Information Technology Jobs' },
  { value: 'healthcare', label: 'Healthcare Jobs' },
  { value: 'finance-accounting', label: 'Finance and Accounting Jobs' },
  { value: 'sales-marketing', label: 'Sales and Marketing Jobs' },
  { value: 'engineering', label: 'Engineering Jobs' },
  { value: 'human-resources', label: 'Human Resources Jobs' },
  { value: 'customer-service', label: 'Customer Service Jobs' },
  { value: 'education-training', label: 'Education and Training Jobs' },
  { value: 'administrative-clerical', label: 'Administrative and Clerical Jobs' },
  { value: 'manufacturing-production', label: 'Manufacturing and Production Jobs' },
  { value: 'retail', label: 'Retail Jobs' },
  { value: 'hospitality-tourism', label: 'Hospitality and Tourism Jobs' },
  { value: 'creative-arts-design', label: 'Creative Arts and Design Jobs' },
  { value: 'legal', label: 'Legal Jobs' },
  { value: 'social-services-nonprofit', label: 'Social Services and Nonprofit Jobs' },
  { value: 'research-development', label: 'Research and Development Jobs' },
  { value: 'science-biotechnology', label: 'Science and Biotechnology Jobs' },
  { value: 'construction-skilled-trades', label: 'Construction and Skilled Trades Jobs' },
  { value: 'media-communications', label: 'Media and Communications Jobs' },
  { value: 'transportation-logistics', label: 'Transportation and Logistics Jobs' },
  { value: 'visa-sponsorship', label: 'Visa Sponsorship Jobs' },
  { value: 'uk-visa-sponsorship', label: 'UK Visa Sponsorship Jobs' },
  { value: 'government', label: 'Government Jobs' },
  { value: 'canada-visa-sponsorship', label: 'Canada Visa Sponsorship Jobs' },
];

const locations = [
  { value: '', label: 'All Locations' },
  { value: 'accra-ghana', label: 'Accra, Ghana' },
  { value: 'washington-dc', label: 'Washington DC' },
  { value: 'california-ca', label: 'California, CA' },
  { value: 'new-york', label: 'New York' },
  { value: 'miami', label: 'Miami' },
  { value: 'remote', label: 'Remote' },
];

const jobTypes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
  { value: 'temporary', label: 'Temporary' },
];

const workModes = [
  { value: '', label: 'All Work Modes' },
  { value: 'remote', label: 'Remote' },
  { value: 'on-site', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
];

const experienceLevels = [
  { value: '', label: 'All Experience Levels' },
  { value: 'entry-level', label: 'Entry Level' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'experienced', label: 'Experienced' },
  { value: 'senior', label: 'Senior' },
];

const JobFilters: React.FC<JobFiltersProps> = ({ onFiltersChange, initialFilters }) => {
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    category: '',
    location: '',
    jobType: [],
    experience: '',
    workMode: '',
    ...initialFilters,
  });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleFilterChange = (key: keyof JobFilters, value: string | string[]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleJobTypeChange = (jobTypeValue: string) => {
    const currentTypes = filters.jobType || [];
    const newTypes = currentTypes.includes(jobTypeValue)
      ? currentTypes.filter(type => type !== jobTypeValue)
      : [...currentTypes, jobTypeValue];
    
    handleFilterChange('jobType', newTypes);
  };

  const handleClearFilters = () => {
    const clearedFilters: JobFilters = {
      search: '',
      category: '',
      location: '',
      jobType: [],
      experience: '',
      workMode: '',
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'jobType') {
        return Array.isArray(value) && value.length > 0;
      }
      return value && value !== '';
    }).length;
  };

  return (
    <>

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          className="w-full flex items-center justify-between"
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        >
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Jobs
            {getActiveFiltersCount() > 0 && (
              <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </span>
          <svg 
            className={`w-4 h-4 transition-transform ${isMobileFiltersOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </div>

      {/* Mobile Filters Panel */}
      {isMobileFiltersOpen && (
        <Card className="lg:hidden mb-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#244034]">Filter</CardTitle>
            <button
              onClick={handleClearFilters}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear all
            </button>
          </CardHeader>
          <CardContent className="space-y-6 p-4">

            {/* Job Type - Checkboxes */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-[#244034]">Job type</label>
              <div className="space-y-2">
                {jobTypes.map((type) => (
                  <label key={type.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.jobType?.includes(type.value) || false}
                      onChange={() => handleJobTypeChange(type.value)}
                      className="rounded border-gray-300 text-[#244034] focus:ring-[#244034]"
                    />
                    <span className="ml-3 text-sm text-[rgba(0,0,0,0.7)]">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Work Mode - Radio buttons */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-[#244034]">On-site/remote</label>
              <div className="space-y-2">
                {workModes.map((mode) => (
                  <label key={mode.value} className="flex items-center">
                    <input
                      type="radio"
                      name="workMode"
                      value={mode.value}
                      checked={filters.workMode === mode.value}
                      onChange={(e) => handleFilterChange('workMode', e.target.value)}
                      className="border-gray-300 text-[#244034] focus:ring-[#244034]"
                    />
                    <span className="ml-3 text-sm text-[rgba(0,0,0,0.7)]">{mode.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category */}
            <Select
              label="Job function"
              placeholder="Select category"
              options={categories}
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            />

            {/* Location */}
            <Select
              label="Location"
              placeholder="Select location"
              options={locations}
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />

            {/* Experience Level */}
            <Select
              label="Experience Level"
              placeholder="Select experience level"
              options={experienceLevels}
              value={filters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
            />
          </CardContent>
        </Card>
      )}

      {/* Desktop Filters */}
      <Card className="hidden lg:block sticky top-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#244034]">Filter</CardTitle>
          <button
            onClick={handleClearFilters}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Clear all
          </button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Posted */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[#244034]">Date Post</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#244034] focus:outline-none focus:ring-2 focus:ring-[#244034] focus:ring-opacity-20">
              <option value="">Anytime</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
          </div>

          {/* Job Type - Checkboxes */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[#244034]">Job type</label>
            <div className="space-y-2">
              {jobTypes.map((type) => (
                <label key={type.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.jobType?.includes(type.value) || false}
                    onChange={() => handleJobTypeChange(type.value)}
                    className="rounded border-gray-300 text-[#244034] focus:ring-[#244034]"
                  />
                  <span className="ml-3 text-sm text-[rgba(0,0,0,0.7)]">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Work Mode - Radio buttons */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[#244034]">On-site/remote</label>
            <div className="space-y-2">
              {workModes.map((mode) => (
                <label key={mode.value} className="flex items-center">
                  <input
                    type="radio"
                    name="workMode"
                    value={mode.value}
                    checked={filters.workMode === mode.value}
                    onChange={(e) => handleFilterChange('workMode', e.target.value)}
                    className="border-gray-300 text-[#244034] focus:ring-[#244034]"
                  />
                  <span className="ml-3 text-sm text-[rgba(0,0,0,0.7)]">{mode.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category */}
          <Select
            label="Job function"
            placeholder="Select category"
            options={categories}
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default JobFilters;
