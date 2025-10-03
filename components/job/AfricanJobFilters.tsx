'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import SearchableDropdown from '@/components/ui/SearchableDropdown';
import ModalSelector from '@/components/ui/ModalSelector';
import { 
  AFRICAN_LOCATIONS, 
  AFRICAN_JOB_CATEGORIES, 
  POPULAR_LOCATIONS, 
  POPULAR_CATEGORIES,
  WORK_ARRANGEMENTS,
  EXPERIENCE_LEVELS,
  VISA_SPONSORSHIP_OPTIONS,
  COMPANY_TYPES,
  LANGUAGE_REQUIREMENTS,
  SALARY_CURRENCIES,
  EDUCATION_LEVELS,
  JOB_TYPES,
  SPECIAL_CONSIDERATIONS,
  DATE_POSTED_OPTIONS
} from './FilterData';

interface AfricanJobFiltersProps {
  onFiltersChange: (filters: AfricanJobFilters) => void;
  initialFilters?: AfricanJobFilters;
}

export interface AfricanJobFilters {
  search: string;
  location: string;
  region: string;
  workMode: string;
  jobType: string[];
  experience: string;
  visaSponsorship: string;
  languageRequirements: string[];
  companyType: string;
  salaryCurrency: string;
  salaryRange: {
    min: number;
    max: number;
  };
  educationLevel: string;
  specialConsiderations: string[];
  jobCategories: string[];
  datePosted: string;
}

// Add regions for advanced filtering
const regions = [
  { value: '', label: 'All Regions' },
  { value: 'west-africa', label: 'West Africa' },
  { value: 'east-africa', label: 'East Africa' },
  { value: 'southern-africa', label: 'Southern Africa' },
  { value: 'north-africa', label: 'North Africa' },
  { value: 'central-africa', label: 'Central Africa' },
  { value: 'diaspora', label: 'Diaspora' },
];

const AfricanJobFilters: React.FC<AfricanJobFiltersProps> = ({ onFiltersChange, initialFilters }) => {
  const [filters, setFilters] = useState<AfricanJobFilters>({
    search: '',
    location: '',
    region: '',
    workMode: '',
    jobType: [],
    experience: '',
    visaSponsorship: '',
    languageRequirements: [],
    companyType: '',
    salaryCurrency: '',
    salaryRange: { min: 0, max: 1000000 },
    educationLevel: '',
    specialConsiderations: [],
    jobCategories: [],
    datePosted: '',
    ...initialFilters,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleFilterChange = (key: keyof AfricanJobFilters, value: string | string[] | { min: number; max: number }) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayChange = (key: 'jobType' | 'languageRequirements' | 'specialConsiderations' | 'jobCategories', value: string) => {
    const currentArray = filters[key] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFilterChange(key, newArray);
  };

  const handleClearFilters = () => {
    const clearedFilters: AfricanJobFilters = {
      search: '',
      location: '',
      region: '',
      workMode: '',
      jobType: [],
      experience: '',
      visaSponsorship: '',
      languageRequirements: [],
      companyType: '',
      salaryCurrency: '',
      salaryRange: { min: 0, max: 1000000 },
      educationLevel: '',
      specialConsiderations: [],
      jobCategories: [],
      datePosted: '',
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'jobType' || key === 'languageRequirements' || key === 'specialConsiderations' || key === 'jobCategories') {
        return Array.isArray(value) && value.length > 0;
      }
      if (key === 'salaryRange') {
        return value.min > 0 || value.max < 1000000;
      }
      return value && value !== '';
    }).length;
  };

  const FilterSection = ({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) => (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-semibold text-[#244034]">{title}</h4>
      {children}
    </div>
  );

  const CheckboxGroup = ({ options, selectedValues, onChange, className = '' }: {
    options: { value: string; label: string }[];
    selectedValues: string[];
    onChange: (value: string) => void;
    className?: string;
  }) => (
    <div className={`space-y-2 ${className}`}>
      {options.map((option) => (
        <label key={option.value} className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selectedValues.includes(option.value)}
            onChange={() => onChange(option.value)}
            className="rounded border-gray-300 text-[#244034] focus:ring-[#244034] focus:ring-2"
          />
          <span className="ml-2 text-sm text-[rgba(0,0,0,0.7)]">{option.label}</span>
        </label>
      ))}
    </div>
  );

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {/* Essential Filters Row - Always Visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {/* Location Filter - Searchable Dropdown */}
          <SearchableDropdown
            label="Location"
            options={AFRICAN_LOCATIONS}
            value={filters.location}
            onChange={(value) => handleFilterChange('location', value)}
            placeholder="Select location"
            popularOptions={POPULAR_LOCATIONS}
            showSearch={true}
            showGroups={true}
            onViewAll={() => setIsLocationModalOpen(true)}
            className=""
          />

          {/* Job Category Filter - Searchable Dropdown */}
          <SearchableDropdown
            label="Category"
            options={AFRICAN_JOB_CATEGORIES}
            value={filters.jobCategories[0] || ''}
            onChange={(value) => handleFilterChange('jobCategories', value ? [value] : [])}
            placeholder="Select category"
            popularOptions={POPULAR_CATEGORIES}
            showSearch={true}
            showGroups={true}
            onViewAll={() => setIsCategoryModalOpen(true)}
            className=""
          />

          {/* Work Mode Filter */}
          <SearchableDropdown
            label="Work Mode"
            options={WORK_ARRANGEMENTS}
            value={filters.workMode}
            onChange={(value) => handleFilterChange('workMode', value)}
            placeholder="Select work mode"
            showSearch={false}
            showGroups={false}
            className=""
          />

          {/* More Filters Button - Enhanced */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#244034]">Advanced</label>
            <Button
              variant={isExpanded ? "primary" : "outline"}
              onClick={() => setIsExpanded(!isExpanded)}
              className={`w-full px-4 py-2.5 text-sm font-medium rounded-md flex items-center justify-between transition-all duration-200 ${
                isExpanded 
                  ? 'bg-[#244034] text-white border-[#244034] shadow-md' 
                  : 'border-2 border-[#244034] text-[#244034] hover:bg-[#244034] hover:text-white hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>{isExpanded ? 'Hide Filters' : 'More Filters'}</span>
              </div>
              <div className="flex items-center gap-1">
                {getActiveFiltersCount() > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isExpanded 
                      ? 'bg-white text-[#244034]' 
                      : 'bg-[#244034] text-white'
                  }`}>
                    {getActiveFiltersCount()}
                  </span>
                )}
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </Button>
          </div>
        </div>

        {/* Quick Filter Pills - Enhanced */}
        <div className="space-y-3">
          {/* Primary Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-gray-500 self-center mr-2">Quick filters:</span>
            
            {/* Visa Sponsorship */}
            <button
              onClick={() => handleFilterChange('visaSponsorship', filters.visaSponsorship ? '' : 'us-visa-sponsorship')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                filters.visaSponsorship 
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700'
              }`}
            >
              🌍 Visa Sponsorship
            </button>

            {/* Remote Work */}
            <button
              onClick={() => handleFilterChange('workMode', filters.workMode === 'remote' ? '' : 'remote')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                filters.workMode === 'remote' 
                  ? 'bg-green-500 text-white border-green-500 shadow-sm' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
              }`}
            >
              💻 Remote Work
            </button>

            {/* Entry Level */}
            <button
              onClick={() => handleFilterChange('experience', filters.experience === 'entry-level' ? '' : 'entry-level')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                filters.experience === 'entry-level' 
                  ? 'bg-blue-500 text-white border-blue-500 shadow-sm' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              🚀 Entry Level
            </button>

            {/* Senior Level */}
            <button
              onClick={() => handleFilterChange('experience', filters.experience === 'senior' ? '' : 'senior')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                filters.experience === 'senior' 
                  ? 'bg-purple-500 text-white border-purple-500 shadow-sm' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700'
              }`}
            >
              👔 Senior Level
            </button>

            {/* African Companies */}
            <button
              onClick={() => handleFilterChange('companyType', filters.companyType === 'african-corporate' ? '' : 'african-corporate')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                filters.companyType === 'african-corporate' 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700'
              }`}
            >
              🏢 African Companies
            </button>

            {/* NGO/Development */}
            <button
              onClick={() => handleFilterChange('companyType', filters.companyType === 'ngo-nonprofit' ? '' : 'ngo-nonprofit')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                filters.companyType === 'ngo-nonprofit' 
                  ? 'bg-teal-500 text-white border-teal-500 shadow-sm' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700'
              }`}
            >
              🤝 NGO/Development
            </button>
          </div>

          {/* Filter Presets */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-gray-500 self-center mr-2">Popular searches:</span>
            
            {/* Tech Jobs */}
            <button
              onClick={() => {
                handleFilterChange('jobCategories', ['information-technology']);
                handleFilterChange('workMode', 'remote');
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-600 border border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all duration-200"
            >
              💻 Tech Jobs
            </button>

            {/* Finance Jobs */}
            <button
              onClick={() => {
                handleFilterChange('jobCategories', ['microfinance-fintech', 'finance-accounting']);
                handleFilterChange('companyType', '');
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-600 border border-gray-300 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200"
            >
              💰 Finance Jobs
            </button>

            {/* Agriculture Jobs */}
            <button
              onClick={() => {
                handleFilterChange('jobCategories', ['agriculture-agribusiness']);
                handleFilterChange('workMode', 'field-work');
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-600 border border-gray-300 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700 transition-all duration-200"
            >
              🌾 Agriculture
            </button>

            {/* Healthcare Jobs */}
            <button
              onClick={() => {
                handleFilterChange('jobCategories', ['healthcare']);
                handleFilterChange('companyType', '');
                handleFilterChange('workMode', '');
                handleFilterChange('experience', '');
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-600 border border-gray-300 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200"
            >
              🏥 Healthcare
            </button>

            {/* Diaspora Return */}
            <button
              onClick={() => {
                handleFilterChange('specialConsiderations', ['diaspora-welcome']);
                handleFilterChange('experience', '');
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-600 border border-gray-300 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-700 transition-all duration-200"
            >
              🏠 Diaspora Return
            </button>

            {/* Clear All Button */}
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-500 text-white border border-red-500 hover:bg-red-600 transition-all duration-200 shadow-sm"
              >
                ✕ Clear All ({getActiveFiltersCount()})
              </button>
            )}
          </div>
        </div>

        {/* Expanded Filters Section */}
        {isExpanded && (
          <div className="border-t-2 border-[#244034] bg-gradient-to-r from-[#244034]/5 to-transparent pt-6 space-y-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#244034] rounded-full"></div>
                <h4 className="text-sm font-semibold text-[#244034]">Advanced Filters</h4>
                <span className="text-xs text-gray-500">({getActiveFiltersCount()} active)</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-xs hover:bg-[#244034]/10"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                </svg>
                Collapse
              </Button>
            </div>

            {/* Advanced Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Region Filter */}
              <FilterSection title="Region">
                <select
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-[#244034] focus:outline-none focus:ring-1 focus:ring-[#244034]"
                >
                  {regions.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </FilterSection>

              {/* Visa Sponsorship Filter */}
              <FilterSection title="Visa Sponsorship">
                <select
                  value={filters.visaSponsorship}
                  onChange={(e) => handleFilterChange('visaSponsorship', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-[#244034] focus:outline-none focus:ring-1 focus:ring-[#244034]"
                >
                  {VISA_SPONSORSHIP_OPTIONS.slice(0, 8).map((visa) => (
                    <option key={visa.value} value={visa.value}>
                      {visa.label}
                    </option>
                  ))}
                </select>
              </FilterSection>

              {/* Company Type Filter */}
              <FilterSection title="Company Type">
                <select
                  value={filters.companyType}
                  onChange={(e) => handleFilterChange('companyType', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-[#244034] focus:outline-none focus:ring-1 focus:ring-[#244034]"
                >
                  {COMPANY_TYPES.slice(0, 8).map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </FilterSection>

              {/* Experience Level Filter */}
              <FilterSection title="Experience Level">
                <select
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-[#244034] focus:outline-none focus:ring-1 focus:ring-[#244034]"
                >
                  {EXPERIENCE_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </FilterSection>

              {/* Salary Currency Filter */}
              <FilterSection title="Salary Currency">
                <select
                  value={filters.salaryCurrency}
                  onChange={(e) => handleFilterChange('salaryCurrency', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-[#244034] focus:outline-none focus:ring-1 focus:ring-[#244034]"
                >
                  {SALARY_CURRENCIES.slice(0, 8).map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </FilterSection>

              {/* Date Posted Filter */}
              <FilterSection title="Date Posted">
                <select
                  value={filters.datePosted}
                  onChange={(e) => handleFilterChange('datePosted', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-[#244034] focus:outline-none focus:ring-1 focus:ring-[#244034]"
                >
                  {DATE_POSTED_OPTIONS.map((date) => (
                    <option key={date.value} value={date.value}>
                      {date.label}
                    </option>
                  ))}
                </select>
              </FilterSection>
            </div>

            {/* Job Types */}
            <FilterSection title="Job Types">
              <CheckboxGroup
                options={JOB_TYPES}
                selectedValues={filters.jobType}
                onChange={(value) => handleArrayChange('jobType', value)}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
              />
            </FilterSection>

            {/* Language Requirements */}
            <FilterSection title="Language Requirements">
              <CheckboxGroup
                options={LANGUAGE_REQUIREMENTS.slice(1)} // Skip "No Preference"
                selectedValues={filters.languageRequirements}
                onChange={(value) => handleArrayChange('languageRequirements', value)}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
              />
            </FilterSection>

            {/* Special Considerations */}
            <FilterSection title="Special Considerations">
              <CheckboxGroup
                options={SPECIAL_CONSIDERATIONS}
                selectedValues={filters.specialConsiderations}
                onChange={(value) => handleArrayChange('specialConsiderations', value)}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2"
              />
            </FilterSection>
          </div>
        )}

        {/* Modal Selectors */}
        <ModalSelector
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          title="Select Locations"
          options={AFRICAN_LOCATIONS}
          selectedValues={[filters.location].filter(Boolean)}
          onSelectionChange={(values) => handleFilterChange('location', values[0] || '')}
          multiSelect={false}
          showGroups={true}
          popularOptions={POPULAR_LOCATIONS}
        />

        <ModalSelector
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          title="Select Job Categories"
          options={AFRICAN_JOB_CATEGORIES}
          selectedValues={filters.jobCategories}
          onSelectionChange={(values) => handleFilterChange('jobCategories', values)}
          multiSelect={true}
          showGroups={true}
          popularOptions={POPULAR_CATEGORIES}
        />
      </CardContent>
    </Card>
  );
};

export default AfricanJobFilters;
