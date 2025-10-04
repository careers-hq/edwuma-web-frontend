import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { JobListing } from '@/lib/api/jobs';

interface JobCardProps {
  job: JobListing;
  onSave?: (jobId: string) => void;
  isSaved?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onSave, 
  isSaved = false
}) => {
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSave?.(job.id);
  };

  const formatCurrency = (min: number | null, max: number | null, currency: string | null) => {
    if (!min && !max) return null;
    const currencySymbol = currency?.toUpperCase() || '';
    if (min && max) {
      return `${min.toLocaleString()} - ${max.toLocaleString()} ${currencySymbol}`;
    } else if (min) {
      return `${min.toLocaleString()}+ ${currencySymbol}`;
    } else if (max) {
      return `Up to ${max.toLocaleString()} ${currencySymbol}`;
    }
    return null;
  };

  const getCompanyInitials = (companyName: string) => {
    return companyName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const stripHtmlTags = (html: string) => {
    if (typeof window === 'undefined') return html;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const truncateDescription = (description: string, maxLength: number = 120) => {
    const cleanText = stripHtmlTags(description);
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300 group cursor-pointer">
      <Link href={`/jobs/${job.id}`}>
        {/* Header Section */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start space-x-4 flex-1">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              {job.companies[0]?.logo_url ? (
                <Image
                  src={job.companies[0].logo_url}
                  alt={`${job.companies[0].name} logo`}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-xl object-cover border border-gray-200 shadow-sm"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-14 h-14 bg-gradient-to-br from-[#244034] to-[#1a2f26] rounded-xl flex items-center justify-center shadow-sm ${job.companies[0]?.logo_url ? 'hidden' : ''}`}>
                <span className="text-white font-bold text-lg">
                  {getCompanyInitials(job.companies[0]?.name || 'Company')}
                </span>
              </div>
            </div>
            
            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#244034] transition-colors line-clamp-1">
                {job.title}
              </h3>
              <div className="flex items-center gap-4 flex-wrap mb-3">
                <span className="text-base font-semibold text-gray-700">
                  {job.companies[0]?.name || 'Company'}
                </span>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-gray-600">
                    {job.locations[0]?.name || 'Location'}
                  </span>
                  {job.locations[0]?.country && (
                    <span className="text-sm text-gray-600">, {job.locations[0].country}</span>
                  )}
                </div>
              </div>
              
              {/* Salary */}
              {job.salary && (job.salary.min || job.salary.max) && (
                <p className="text-[#4ade80] font-bold text-base mb-3">
                  {formatCurrency(job.salary.min, job.salary.max, job.salary.currency)}
                </p>
              )}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label={isSaved ? 'Remove from saved' : 'Save job'}
          >
            <svg
              className={`w-5 h-5 ${isSaved ? 'text-[#4ade80] fill-current' : 'text-gray-400 hover:text-gray-600'}`}
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

        {/* Job Description */}
        {job.description && (
          <div className="mb-4">
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {truncateDescription(job.description, 150)}
            </p>
          </div>
        )}

        {/* Job Meta Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg">
            {job.experience_level.label}
          </span>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg">
            {job.job_type.label}
          </span>
          <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-lg">
            {job.work_mode.label}
          </span>
          {job.education_level && (
            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm font-semibold rounded-lg">
              {job.education_level.label}
            </span>
          )}
          {job.visa_sponsorship.length > 0 && (
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-lg">
              Visa Sponsorship
            </span>
          )}
        </div>

        {/* Categories */}
        {job.categories.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {job.categories.slice(0, 3).map((category) => (
                <span key={category.id} className="px-3 py-1 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg border">
                  {category.name}
                </span>
              ))}
              {job.categories.length > 3 && (
                <span className="px-3 py-1 bg-gray-50 text-gray-500 text-sm rounded-lg border">
                  +{job.categories.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {job.skills.length > 0 && (
          <div className="mb-4">
            <span className="text-sm text-gray-500 font-medium">Skills: </span>
            <span className="text-sm text-gray-600">
              {job.skills.slice(0, 3).map(skill => skill.name).join(', ')}
              {job.skills.length > 3 && ` +${job.skills.length - 3} more`}
            </span>
          </div>
        )}

        {/* Language Requirements */}
        {job.language_requirements && job.language_requirements.length > 0 && (
          <div className="mb-4">
            <span className="text-sm text-gray-500 font-medium">Languages: </span>
            <span className="text-sm text-gray-600">
              {job.language_requirements.slice(0, 2).map(lang => lang.language?.name || 'Language').join(', ')}
              {job.language_requirements.length > 2 && ` +${job.language_requirements.length - 2} more`}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Posted {job.timing.posted_at_formatted}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#244034] font-semibold group-hover:text-[#1a2e26] transition-colors">
              View Details →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default JobCard;