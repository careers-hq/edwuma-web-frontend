'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { jobsApiService, type JobListing } from '@/lib/api/jobs';

const JobDetailsPage: React.FC = () => {
  const params = useParams();
  const [job, setJob] = useState<JobListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const jobId = params?.id as string;

  useEffect(() => {
    const loadJob = async () => {
      if (!jobId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const response = await jobsApiService.getJob(jobId);
        
        if (response.success && response.data) {
          setJob(response.data);
        } else {
          setError('Job not found');
        }
      } catch (err) {
        console.error('Error loading job:', err);
        setError('Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

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

  const handleSaveJob = () => {
    if (!job) return;
    setIsSaved(!isSaved);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The job you are looking for does not exist.'}</p>
            <Link href="/">
              <Button variant="primary" className="bg-[#244034] hover:bg-[#1a2e26]">
                Back to Jobs
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
        {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#244034] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/" className="hover:text-[#244034] transition-colors">
              Jobs
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{job.title}</span>
        </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6 flex-1">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                {job.companies[0]?.logo_url ? (
                  <Image
                    src={job.companies[0].logo_url}
                    alt={`${job.companies[0].name} logo`}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-2xl object-cover border border-gray-200 shadow-sm"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-20 h-20 bg-gradient-to-br from-[#244034] to-[#1a2f26] rounded-2xl flex items-center justify-center shadow-sm ${job.companies[0]?.logo_url ? 'hidden' : ''}`}>
                  <span className="text-white font-bold text-xl">
                    {getCompanyInitials(job.companies[0]?.name || 'Company')}
                  </span>
                </div>
              </div>
              
              {/* Job Info */}
                  <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">{job.title}</h1>
                <div className="flex items-center gap-6 text-lg text-gray-600 mb-4">
                  <span className="font-semibold">{job.companies[0]?.name || 'Company'}</span>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    <span>{job.locations[0]?.name || 'Location'}</span>
                    {job.locations[0]?.country && (
                      <span className="text-gray-400">, {job.locations[0].country}</span>
                    )}
                  </div>
                </div>
                
                {/* Job Meta */}
                <div className="flex items-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Posted {job.timing.posted_at_formatted}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    <span>{job.job_type.label}</span>
                </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{job.work_mode.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>{job.experience_level.label}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveJob}
              className="p-3 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label={isSaved ? 'Remove from saved' : 'Save job'}
            >
              <svg
                className={`w-6 h-6 ${isSaved ? 'text-[#4ade80] fill-current' : 'text-gray-400 hover:text-gray-600'}`}
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

          {/* Salary */}
          {job.salary && (job.salary.min || job.salary.max) && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-green-800 font-bold text-xl">
                  {formatCurrency(job.salary.min, job.salary.max, job.salary.currency)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Job Description - Render HTML */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Role</h2>
              <div className="prose prose-lg prose-gray max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ __html: job.description }}
                  className="text-gray-700 leading-relaxed"
                />
              </div>
            </div>

            {/* Requirements - Render HTML */}
            {job.requirements && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
                <div className="prose prose-lg prose-gray max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                    className="text-gray-700 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Benefits - Render HTML */}
            {job.benefits && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits</h2>
                <div className="prose prose-lg prose-gray max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: job.benefits }}
                    className="text-gray-700 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Skills */}
            {job.skills.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Required Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill) => (
                    <span key={skill.id} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Apply Button */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                {job.application.url ? (
                  <Link href={job.application.url} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="primary" size="lg" className="w-full bg-[#244034] hover:bg-[#1a2e26] mb-4 py-4 text-lg font-semibold">
                      Apply for this job
                    </Button>
                  </Link>
                ) : (
                  <Button variant="primary" size="lg" className="w-full bg-[#244034] hover:bg-[#1a2e26] mb-4 py-4 text-lg font-semibold" disabled>
                    Apply for this job
                  </Button>
                )}
                
                <div className="text-center">
                  <button
                    onClick={handleSaveJob}
                    className="text-sm text-gray-600 hover:text-[#244034] transition-colors font-medium"
                  >
                    {isSaved ? '✓ Saved to your jobs' : 'Save this job'}
                  </button>
                </div>
                  </div>

              {/* Job Details */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600 font-medium">Experience Level</span>
                    <p className="font-semibold text-gray-900">{job.experience_level.label}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 font-medium">Employment Type</span>
                    <p className="font-semibold text-gray-900">{job.job_type.label}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 font-medium">Work Arrangement</span>
                    <p className="font-semibold text-gray-900">{job.work_mode.label}</p>
                  </div>
                  {job.education_level && (
                    <div>
                      <span className="text-sm text-gray-600 font-medium">Education Level</span>
                      <p className="font-semibold text-gray-900">{job.education_level.label}</p>
                  </div>
                  )}
                  {job.salary && (job.salary.min || job.salary.max) && (
                    <div>
                      <span className="text-sm text-gray-600 font-medium">Salary Range</span>
                      <p className="font-semibold text-[#4ade80] text-lg">
                        {formatCurrency(job.salary.min, job.salary.max, job.salary.currency)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Company</h3>
                <div className="flex items-center space-x-4 mb-4">
                  {job.companies[0]?.logo_url ? (
                    <Image
                      src={job.companies[0].logo_url}
                      alt={`${job.companies[0].name} logo`}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-12 h-12 bg-gradient-to-br from-[#244034] to-[#1a2f26] rounded-lg flex items-center justify-center ${job.companies[0]?.logo_url ? 'hidden' : ''}`}>
                    <span className="text-white font-bold text-sm">
                      {getCompanyInitials(job.companies[0]?.name || 'Company')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{job.companies[0]?.name || 'Company'}</h4>
                    <p className="text-sm text-gray-600">Technology Company</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Learn more about this company and their mission.
                </p>
              </div>

              {/* Categories */}
              {job.categories.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.categories.map((category) => (
                      <span key={category.id} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Language Requirements */}
              {job.language_requirements && job.language_requirements.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Language Requirements</h3>
                  <div className="space-y-3">
                    {job.language_requirements.map((lang, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">{lang.language?.name || 'Language'}</span>
                        <span className="font-semibold text-gray-900">{lang.proficiency_level || 'Required'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetailsPage;