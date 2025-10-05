'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import SearchableDropdown from '@/components/ui/SearchableDropdown';
import ModalSelector from '@/components/ui/ModalSelector';
import { 
  AFRICAN_LOCATIONS, 
  POPULAR_LOCATIONS, 
  WORK_ARRANGEMENTS,
  DATE_POSTED_OPTIONS
} from './FilterData';

interface AfricanJobFiltersProps {
  onFiltersChange: (filters: AfricanJobFilters) => void;
  initialFilters?: AfricanJobFilters;
}

export interface AfricanJobFilters {
  search: string;
  location: string;
  workMode: string;
  experience: string;
  visaSponsorship: string;
  datePosted: string;
}


const AfricanJobFilters: React.FC<AfricanJobFiltersProps> = ({ onFiltersChange, initialFilters }) => {
  const [filters, setFilters] = useState<AfricanJobFilters>({
    search: '',
    location: '',
    workMode: '',
    experience: '',
    visaSponsorship: '',
    datePosted: '',
    ...initialFilters,
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleFilterChange = (key: keyof AfricanJobFilters, value: string | string[] | { min: number; max: number }) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };


  const handleClearFilters = () => {
    const clearedFilters: AfricanJobFilters = {
      search: '',
      location: '',
      workMode: '',
      experience: '',
      visaSponsorship: '',
      datePosted: '',
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([, value]) => {
      return value && value !== '';
    }).length;
  };


  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {/* Essential Filters Row - Always Visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {/* Country Filter - Searchable Dropdown */}
          <SearchableDropdown
            label="Country"
            options={AFRICAN_LOCATIONS}
            value={filters.location}
            onChange={(value) => handleFilterChange('location', value)}
            placeholder="Select country"
            popularOptions={POPULAR_LOCATIONS}
            showSearch={true}
            showGroups={true}
            onViewAll={() => setIsLocationModalOpen(true)}
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

          {/* Date Posted Filter */}
          <SearchableDropdown
            label="Date Posted"
            options={DATE_POSTED_OPTIONS}
            value={filters.datePosted}
            onChange={(value) => handleFilterChange('datePosted', value)}
            placeholder="Select date range"
            showSearch={false}
            showGroups={false}
            className=""
          />
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


          </div>

          {/* Filter Presets */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-gray-500 self-center mr-2">Popular searches:</span>
            
            {/* Remote Jobs */}
            <button
              onClick={() => {
                handleFilterChange('workMode', 'remote');
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-600 border border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all duration-200"
            >
              💻 Remote Jobs
            </button>

            {/* Senior Jobs */}
            <button
              onClick={() => {
                handleFilterChange('experience', 'senior');
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-600 border border-gray-300 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200"
            >
              👔 Senior Jobs
            </button>

            {/* Visa Sponsorship */}
            <button
              onClick={() => {
                handleFilterChange('visaSponsorship', 'available');
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-600 border border-gray-300 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700 transition-all duration-200"
            >
              🛂 Visa Sponsorship
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


        {/* Modal Selectors */}
        <ModalSelector
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          title="Select Countries"
          options={AFRICAN_LOCATIONS}
          selectedValues={[filters.location].filter(Boolean)}
          onSelectionChange={(values) => handleFilterChange('location', values[0] || '')}
          multiSelect={false}
          showGroups={true}
          popularOptions={POPULAR_LOCATIONS}
        />

      </CardContent>
    </Card>
  );
};

export default AfricanJobFilters;
