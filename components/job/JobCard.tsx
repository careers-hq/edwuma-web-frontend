import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface JobCardProps {
  job: {
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
  };
  showDescription?: boolean;
  onSave?: (jobId: string) => void;
  isSaved?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ 
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
              <div className="flex items-center gap-3">
                <p className="text-sm text-[rgba(0,0,0,0.7)]">
                  {job.company}
                </p>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                  {job.type}
                </span>
                {job.type === 'Full-Time' && (
                  <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">
                    Urgently hiring
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{job.location}</span>
          </div>
        </div>

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
          <div className="flex items-center gap-2">
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
              {job.type}
            </span>
            {job.type === 'Full-Time' && (
              <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">
                Urgently hiring
              </span>
            )}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{job.location}</span>
          </div>
        </div>

        {/* Description */}
        {showDescription && job.description && (
          <div className="mb-3">
            <p className="text-xs text-[rgba(0,0,0,0.7)] leading-relaxed line-clamp-2">
              {job.description}
            </p>
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

export default JobCard;
