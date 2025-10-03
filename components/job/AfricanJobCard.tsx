import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface AfricanJobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    country: string;
    region: string;
    type: string;
    experience: string;
    postedAt: string;
    category: string;
    salary?: string;
    salaryCurrency?: string;
    description?: string;
    workMode: string;
    visaSponsorship?: string;
    languageRequirements?: string[];
    companyType: string;
    specialConsiderations?: string[];
  };
  showDescription?: boolean;
  onSave?: (jobId: string) => void;
  isSaved?: boolean;
}

const AfricanJobCard: React.FC<AfricanJobCardProps> = ({ 
  job, 
  showDescription = false, 
  onSave, 
  isSaved = false 
}) => {
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSave?.(job.id);
  };

  const getRegionFlag = (region: string) => {
    const flags: { [key: string]: string } = {
      'west-africa': '🌍',
      'east-africa': '🌍',
      'southern-africa': '🌍',
      'north-africa': '🌍',
      'central-africa': '🌍',
      'diaspora': '🌎',
    };
    return flags[region] || '🌍';
  };

  const getCompanyTypeColor = (companyType: string) => {
    const colors: { [key: string]: string } = {
      'multinational': 'bg-blue-100 text-blue-800',
      'african-corporate': 'bg-green-100 text-green-800',
      'startup': 'bg-purple-100 text-purple-800',
      'ngo-nonprofit': 'bg-orange-100 text-orange-800',
      'government': 'bg-red-100 text-red-800',
      'international-organization': 'bg-indigo-100 text-indigo-800',
      'development-agency': 'bg-teal-100 text-teal-800',
    };
    return colors[companyType] || 'bg-gray-100 text-gray-800';
  };

  const getWorkModeColor = (workMode: string) => {
    const colors: { [key: string]: string } = {
      'remote': 'bg-green-100 text-green-800',
      'hybrid': 'bg-yellow-100 text-yellow-800',
      'on-site': 'bg-blue-100 text-blue-800',
      'field-work': 'bg-orange-100 text-orange-800',
      'travel-required': 'bg-purple-100 text-purple-800',
    };
    return colors[workMode] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Top Row: Job Title, Company, Location */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1">
            {/* Company Logo */}
            <div className="w-10 h-10 bg-[#244034] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {job.company.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-[#244034] mb-1">
                {job.title}
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-sm text-[rgba(0,0,0,0.7)]">
                  {job.company}
                </p>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                  {job.type}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCompanyTypeColor(job.companyType)}`}>
                  {job.companyType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getWorkModeColor(job.workMode)}`}>
                  {job.workMode.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                {job.visaSponsorship && (
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                    Visa Sponsorship
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">{getRegionFlag(job.region)}</span>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{job.location}</span>
          </div>
        </div>

        {/* Middle Row: Salary and Special Considerations */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {job.salary && (
              <span className="text-sm font-medium text-[#244034]">
                {job.salary} {job.salaryCurrency?.toUpperCase()}
              </span>
            )}
            <span className="text-sm text-gray-500">
              {job.experience.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
          {job.specialConsiderations && job.specialConsiderations.length > 0 && (
            <div className="flex gap-1">
              {job.specialConsiderations.slice(0, 2).map((consideration, index) => (
                <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                  {consideration.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              ))}
              {job.specialConsiderations.length > 2 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  +{job.specialConsiderations.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Language Requirements */}
        {job.languageRequirements && job.languageRequirements.length > 0 && (
          <div className="mb-3">
            <span className="text-xs text-gray-500">Languages: </span>
            <span className="text-xs text-[#244034] font-medium">
              {job.languageRequirements.map(lang => 
                lang.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
              ).join(', ')}
            </span>
          </div>
        )}

        {/* Description and Action Buttons Row */}
        <div className="flex items-start justify-between">
          {/* Description */}
          {showDescription && job.description && (
            <div className="flex-1 mr-6">
              <p className="text-sm text-[rgba(0,0,0,0.7)] leading-relaxed line-clamp-2">
                {job.description}
              </p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Link href={`/jobs/${job.id}`}>
              <Button variant="ghost" className="text-sm py-2 px-4">
                View Details
              </Button>
            </Link>
            <Link href={`/jobs/${job.id}/apply`}>
              <Button variant="primary" className="text-sm py-2 px-4 bg-[#244034] hover:bg-[#1a2f26]">
                Apply Now
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="p-2 hover:bg-gray-100 transition-colors"
              aria-label={isSaved ? 'Remove from saved' : 'Save job'}
            >
              <svg
                className={`w-4 h-4 ${isSaved ? 'text-[#d2f34c] fill-current' : 'text-gray-700'}`}
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
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3">
            {/* Company Logo */}
            <div className="w-10 h-10 bg-[#244034] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {job.company.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-[#244034] mb-1">
                {job.title}
              </h3>
              <p className="text-sm text-[rgba(0,0,0,0.7)] mb-2">
                {job.company}
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={isSaved ? 'Remove from saved' : 'Save job'}
          >
            <svg
              className={`w-4 h-4 ${isSaved ? 'text-[#d2f34c] fill-current' : 'text-gray-400'}`}
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
        </div>

        {/* Job Tags and Location */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
              {job.type}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getWorkModeColor(job.workMode)}`}>
              {job.workMode.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            {job.visaSponsorship && (
              <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                Visa
              </span>
            )}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <span className="mr-1">{getRegionFlag(job.region)}</span>
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{job.location}</span>
          </div>
        </div>

        {/* Salary and Experience */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {job.salary && (
              <span className="text-xs font-medium text-[#244034]">
                {job.salary} {job.salaryCurrency?.toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {job.experience.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        {/* Company Type */}
        <div className="mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCompanyTypeColor(job.companyType)}`}>
            {job.companyType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        {/* Description */}
        {showDescription && job.description && (
          <div className="mb-3">
            <p className="text-xs text-[rgba(0,0,0,0.7)] leading-relaxed line-clamp-2">
              {job.description}
            </p>
          </div>
        )}

        {/* Language Requirements */}
        {job.languageRequirements && job.languageRequirements.length > 0 && (
          <div className="mb-3">
            <span className="text-xs text-gray-500">Languages: </span>
            <span className="text-xs text-[#244034] font-medium">
              {job.languageRequirements.slice(0, 2).map(lang => 
                lang.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
              ).join(', ')}
              {job.languageRequirements.length > 2 && ` +${job.languageRequirements.length - 2} more`}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href={`/jobs/${job.id}`} className="flex-1">
            <Button variant="ghost" className="w-full text-xs py-2">
              View Details
            </Button>
          </Link>
          <Link href={`/jobs/${job.id}/apply`} className="flex-1">
            <Button variant="primary" className="w-full text-xs py-2 bg-[#244034] hover:bg-[#1a2f26]">
              Apply Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AfricanJobCard;
