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
          <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0">
                <span className="text-3xl">🌍</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-900 mb-1">
                  Looking for jobs in {getCountryName(autoDetectedCountry || '')}?
                </p>
                <p className="text-sm text-gray-600">
                  We detected you&apos;re browsing from {getCountryName(autoDetectedCountry || '')}. Filter jobs by this location?
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={handleApplySuggestion}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm active:scale-95"
              >
                Yes, filter
              </button>
              <button
                onClick={handleDismissSuggestion}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-sm font-medium rounded-lg transition-colors active:scale-95"
              >
                No, show all
              </button>
            </div>
          </div>
        )}

        {/* Essential Filters Row - Always Visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
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
          <div>
            <span className="text-xs font-medium text-gray-500 block mb-2">Quick filters:</span>
            <div className="flex flex-wrap gap-2">
            
              {/* Anywhere in the World - Coming Soon */}
              <button
                disabled
                className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 border bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
              >
                <span>🌎</span>
                <span className="xs:inline">Anywhere in the World</span>
                {/* <span className="xs:hidden">Global</span> */}
                <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded text-[10px] font-semibold whitespace-nowrap">
                  COMING SOON
                </span>
              </button>

              {/* Visa Sponsorship - Coming Soon */}
              <button
                disabled
                className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 border bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
              >
                <span>🌍</span>
                <span className="xs:inline">Visa Sponsorship</span>
                {/* <span className="xs:hidden">Visa</span> */}
                <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded text-[10px] font-semibold whitespace-nowrap">
                  COMING SOON
                </span>
              </button>

              {/* Remote Work */}
              <button
                onClick={() => handleFilterChange('workMode', filters.workMode === 'remote' ? '' : 'remote')}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 border active:scale-95 ${
                  filters.workMode === 'remote' 
                    ? 'bg-green-500 text-white border-green-500 shadow-sm' 
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                }`}
              >
                <span>💻</span>
                <span>Remote Work</span>
              </button>

              {/* Entry Level */}
              <button
                onClick={() => handleFilterChange('experience', filters.experience === 'entry-level' ? '' : 'entry-level')}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 border active:scale-95 ${
                  filters.experience === 'entry-level' 
                    ? 'bg-blue-500 text-white border-blue-500 shadow-sm' 
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                }`}
              >
                <span>🚀</span>
                <span>Entry Level</span>
              </button>

              {/* Senior Level */}
              <button
                onClick={() => handleFilterChange('experience', filters.experience === 'senior' ? '' : 'senior')}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 border active:scale-95 ${
                  filters.experience === 'senior' 
                    ? 'bg-purple-500 text-white border-purple-500 shadow-sm' 
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700'
                }`}
              >
                <span>👔</span>
                <span>Senior Level</span>
              </button>

              {/* Clear All Button */}
              {getActiveFiltersCount() > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium bg-red-500 text-white border border-red-500 hover:bg-red-600 transition-all duration-200 shadow-sm active:scale-95"
                >
                  <span>✕</span>
                  <span>Clear All ({getActiveFiltersCount()})</span>
                </button>
              )}
            </div>
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
