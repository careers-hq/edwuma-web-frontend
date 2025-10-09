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
  autoDetectedCountry?: string; // Add prop to know which country was auto-detected
}

export interface AfricanJobFilters {
  search: string;
  location: string;
  workMode: string;
  experience: string;
  visaSponsorship: string;
  datePosted: string;
}


const AfricanJobFilters: React.FC<AfricanJobFiltersProps> = ({ onFiltersChange, initialFilters, autoDetectedCountry }) => {
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
  const [showLocationSuggestion, setShowLocationSuggestion] = useState(true);

  // Show location suggestion instead of auto-filtering
  const shouldShowSuggestion = autoDetectedCountry && !filters.location && showLocationSuggestion;

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


  const handleApplySuggestion = () => {
    handleFilterChange('location', autoDetectedCountry || '');
    setShowLocationSuggestion(false);
  };

  const handleDismissSuggestion = () => {
    setShowLocationSuggestion(false);
  };

  const getCountryName = (code: string) => {
    const country = AFRICAN_LOCATIONS.find(loc => loc.value === code);
    return country?.label || code;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {/* Location Suggestion Banner */}
        {shouldShowSuggestion && (
          <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <span className="text-2xl">🌍</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Looking for jobs in {getCountryName(autoDetectedCountry || '')}?
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  We detected you&apos;re browsing from {getCountryName(autoDetectedCountry || '')}. Filter jobs by this location?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleApplySuggestion}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Yes, filter
              </button>
              <button
                onClick={handleDismissSuggestion}
                className="px-3 py-1.5 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                No, show all
              </button>
            </div>
          </div>
        )}

        {/* Essential Filters Row - Always Visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {/* Country Filter - Searchable Dropdown */}
          <div className="relative">
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
            {filters.location && autoDetectedCountry === filters.location && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-green-500 text-white text-xs rounded-full">
                🌍
              </span>
            )}
          </div>


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
            
            {/* Anywhere in the World - Coming Soon */}
            <button
              disabled
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed relative group"
            >
              🌎 Anywhere in the World
              <span className="ml-1.5 px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded text-[10px] font-semibold">
                COMING SOON
              </span>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Global remote jobs coming soon!
              </span>
            </button>

            {/* Visa Sponsorship - Coming Soon */}
            <button
              disabled
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed relative group"
            >
              🌍 Visa Sponsorship
              <span className="ml-1.5 px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded text-[10px] font-semibold">
                COMING SOON
              </span>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Visa sponsorship filter coming soon!
              </span>
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
