'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/utils';

interface JobDetail {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  postedAt: string;
  category: string;
  salary?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  companyInfo: {
    name: string;
    website: string;
    description: string;
    size: string;
    industry: string;
  };
  applicationDeadline?: string;
}

const mockJobDetail: JobDetail = {
  id: '1',
  title: 'Senior Software Engineer',
  company: 'TechCorp Ghana',
  location: 'Accra, Ghana',
  type: 'Full-Time',
  experience: 'Senior',
  postedAt: '2024-01-15',
  category: 'Information Technology',
  salary: '$80,000 - $120,000',
  description: 'We are looking for a senior software engineer to join our growing team. You will be responsible for designing, developing, and maintaining high-quality software solutions that meet our business needs. This role offers the opportunity to work with cutting-edge technologies and collaborate with a talented team of developers.',
  requirements: [
    'Bachelor\'s degree in Computer Science or related field',
    '5+ years of experience in software development',
    'Proficiency in JavaScript, TypeScript, and React',
    'Experience with Node.js and Express.js',
    'Knowledge of database systems (PostgreSQL, MongoDB)',
    'Experience with cloud platforms (AWS, Azure, or GCP)',
    'Strong problem-solving and communication skills',
    'Experience with Agile development methodologies'
  ],
  responsibilities: [
    'Design and develop scalable web applications',
    'Collaborate with cross-functional teams to define and implement new features',
    'Write clean, maintainable, and efficient code',
    'Participate in code reviews and technical discussions',
    'Mentor junior developers and share knowledge',
    'Troubleshoot and debug applications',
    'Stay up-to-date with emerging technologies and best practices'
  ],
  benefits: [
    'Competitive salary and performance bonuses',
    'Health, dental, and vision insurance',
    'Flexible working hours and remote work options',
    'Professional development opportunities',
    '401(k) retirement plan with company matching',
    'Paid time off and sick leave',
    'Team building events and activities',
    'Modern office environment with latest equipment'
  ],
  companyInfo: {
    name: 'TechCorp Ghana',
    website: 'https://techcorp-ghana.com',
    description: 'TechCorp Ghana is a leading technology company specializing in innovative software solutions for businesses across Africa. We are committed to delivering high-quality products and services while fostering a culture of innovation and growth.',
    size: '50-200 employees',
    industry: 'Information Technology'
  },
  applicationDeadline: '2024-02-15'
};

export default function JobDetailPage() {
  const [job] = useState<JobDetail>(mockJobDetail);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    // TODO: Implement actual save functionality
  };

  const handleApply = () => {
    // TODO: Implement application form logic
    console.log('Apply button clicked');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-[rgba(0,0,0,0.7)]">
            <li><Link href="/" className="hover:text-[#244034] transition-colors">Home</Link></li>
            <li><span>/</span></li>
            <li><Link href="/jobs" className="hover:text-[#244034] transition-colors">Jobs</Link></li>
            <li><span>/</span></li>
            <li><span className="text-[#244034]">{job.title}</span></li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[#244034] mb-2">
                      {job.title}
                    </h1>
                    <div className="flex items-center space-x-4 mb-4">
                      <p className="text-lg text-[rgba(0,0,0,0.7)]">{job.company}</p>
                      <Badge variant="secondary">{job.type}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[rgba(0,0,0,0.7)]">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                        </svg>
                        {job.experience} Level
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 18 0z" />
                        </svg>
                        Posted {formatRelativeTime(job.postedAt)}
                      </div>
                    </div>
                    {job.salary && (
                      <div className="mt-4">
                        <span className="text-lg font-semibold text-[#00bf58]">{job.salary}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      onClick={handleSaveJob}
                      className={isSaved ? 'bg-[#d2f34c] text-[#244034]' : ''}
                    >
                      {isSaved ? 'Saved' : 'Save Job'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#244034]">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[rgba(0,0,0,0.7)] leading-relaxed mb-6">
                  {job.description}
                </p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#244034]">Key Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#244034] mr-3 mt-1">•</span>
                      <span className="text-[rgba(0,0,0,0.7)]">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#244034]">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#244034] mr-3 mt-1">•</span>
                      <span className="text-[rgba(0,0,0,0.7)]">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#244034]">Benefits & Perks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#00bf58] mr-3 mt-1">✓</span>
                      <span className="text-[rgba(0,0,0,0.7)]">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#244034]">About {job.company}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[rgba(0,0,0,0.7)] mb-4">{job.companyInfo.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-[#244034]">Company Size:</span>
                    <span className="ml-2 text-[rgba(0,0,0,0.7)]">{job.companyInfo.size}</span>
                  </div>
                  <div>
                    <span className="font-medium text-[#244034]">Industry:</span>
                    <span className="ml-2 text-[rgba(0,0,0,0.7)]">{job.companyInfo.industry}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href={job.companyInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#244034] hover:text-[#1a2f26] transition-colors"
                  >
                    Visit Company Website →
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Apply Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-[#244034] mb-4">Ready to Apply?</h3>
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full mb-4"
                      onClick={handleApply}
                    >
                      Apply Now
                    </Button>
                    <p className="text-sm text-[rgba(0,0,0,0.7)] mb-4">
                      This job has received {Math.floor(Math.random() * 50) + 10} applications
                    </p>
                    {job.applicationDeadline && (
                      <p className="text-sm text-[rgba(0,0,0,0.7)]">
                        Application deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Job Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-[#244034]">Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[rgba(0,0,0,0.7)]">Job Type:</span>
                    <span className="font-medium text-[#244034]">{job.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[rgba(0,0,0,0.7)]">Experience:</span>
                    <span className="font-medium text-[#244034]">{job.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[rgba(0,0,0,0.7)]">Category:</span>
                    <span className="font-medium text-[#244034]">{job.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[rgba(0,0,0,0.7)]">Location:</span>
                    <span className="font-medium text-[#244034]">{job.location}</span>
                  </div>
                  {job.salary && (
                    <div className="flex justify-between">
                      <span className="text-[rgba(0,0,0,0.7)]">Salary:</span>
                      <span className="font-medium text-[#00bf58]">{job.salary}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Share Job */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-[#244034]">Share This Job</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                      Twitter
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                      LinkedIn
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
