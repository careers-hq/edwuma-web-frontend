'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/utils';
import { ProtectedRoute, useAuth } from '@/lib/auth';

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
  location: string;
}

interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  savedAt: string;
}

const mockApplications: JobApplication[] = [
  {
    id: '1',
    jobTitle: 'Senior Software Engineer',
    company: 'TechCorp Ghana',
    appliedAt: '2024-01-15',
    status: 'reviewed',
    location: 'Accra, Ghana'
  },
  {
    id: '2',
    jobTitle: 'Marketing Manager',
    company: 'Growth Solutions',
    appliedAt: '2024-01-12',
    status: 'interview',
    location: 'Washington DC'
  },
  {
    id: '3',
    jobTitle: 'Data Analyst',
    company: 'Analytics Pro',
    appliedAt: '2024-01-10',
    status: 'pending',
    location: 'California, CA'
  }
];

const mockSavedJobs: SavedJob[] = [
  {
    id: '4',
    title: 'UX Designer',
    company: 'Design Studio',
    location: 'Remote',
    type: 'Part-Time',
    savedAt: '2024-01-14'
  },
  {
    id: '5',
    title: 'Project Manager',
    company: 'Construction Co',
    location: 'Accra, Ghana',
    type: 'Full-Time',
    savedAt: '2024-01-13'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'default';
    case 'reviewed': return 'secondary';
    case 'interview': return 'success';
    case 'rejected': return 'destructive';
    case 'accepted': return 'success';
    default: return 'default';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'Pending Review';
    case 'reviewed': return 'Under Review';
    case 'interview': return 'Interview Scheduled';
    case 'rejected': return 'Not Selected';
    case 'accepted': return 'Accepted';
    default: return status;
  }
};

function DashboardContent() {
  const { logout, getUserDisplayName } = useAuth();
  const [applications] = useState<JobApplication[]>(mockApplications);
  const [savedJobs] = useState<SavedJob[]>(mockSavedJobs);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'saved' | 'profile'>('overview');

  const stats = {
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'pending').length,
    interviewScheduled: applications.filter(app => app.status === 'interview').length,
    savedJobs: savedJobs.length
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#244034] font-['Gordita'] mb-2">
            Welcome back, {getUserDisplayName()}!
          </h1>
          <p className="text-[rgba(0,0,0,0.7)]">
            Here&apos;s what&apos;s happening with your job search
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                      activeTab === 'overview'
                        ? 'bg-[#244034] text-white'
                        : 'text-[rgba(0,0,0,0.7)] hover:bg-gray-100'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                      activeTab === 'applications'
                        ? 'bg-[#244034] text-white'
                        : 'text-[rgba(0,0,0,0.7)] hover:bg-gray-100'
                    }`}
                  >
                    Applications ({stats.totalApplications})
                  </button>
                  <button
                    onClick={() => setActiveTab('saved')}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                      activeTab === 'saved'
                        ? 'bg-[#244034] text-white'
                        : 'text-[rgba(0,0,0,0.7)] hover:bg-gray-100'
                    }`}
                  >
                    Saved Jobs ({stats.savedJobs})
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-[#244034] text-white'
                        : 'text-[rgba(0,0,0,0.7)] hover:bg-gray-100'
                    }`}
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-4 py-3 rounded-md transition-colors text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-[#244034] mb-2">
                        {stats.totalApplications}
                      </div>
                      <div className="text-sm text-[rgba(0,0,0,0.7)]">Total Applications</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-[#d2f34c] mb-2">
                        {stats.pendingApplications}
                      </div>
                      <div className="text-sm text-[rgba(0,0,0,0.7)]">Pending Review</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-[#00bf58] mb-2">
                        {stats.interviewScheduled}
                      </div>
                      <div className="text-sm text-[rgba(0,0,0,0.7)]">Interviews</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-[#244034] mb-2">
                        {stats.savedJobs}
                      </div>
                      <div className="text-sm text-[rgba(0,0,0,0.7)]">Saved Jobs</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Applications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-[#244034]">Recent Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {applications.slice(0, 3).map((application) => (
                        <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#244034]">{application.jobTitle}</h3>
                            <p className="text-sm text-[rgba(0,0,0,0.7)]">{application.company}</p>
                            <p className="text-xs text-[rgba(0,0,0,0.5)]">
                              Applied {formatRelativeTime(application.appliedAt)}
                            </p>
                          </div>
                          <Badge variant={getStatusColor(application.status) as 'default' | 'secondary' | 'success' | 'warning' | 'destructive'}>
                            {getStatusText(application.status)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Link href="/dashboard?tab=applications">
                        <Button variant="outline" className="w-full">
                          View All Applications
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-[#244034]">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link href="/jobs">
                        <Button variant="primary" className="w-full h-16">
                          <div className="text-center">
                            <div className="text-lg font-semibold">Search Jobs</div>
                            <div className="text-sm opacity-90">Find your next opportunity</div>
                          </div>
                        </Button>
                      </Link>
                      <Link href="/dashboard?tab=profile">
                        <Button variant="outline" className="w-full h-16">
                          <div className="text-center">
                            <div className="text-lg font-semibold">Update Profile</div>
                            <div className="text-sm opacity-90">Keep your info current</div>
                          </div>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-[#244034]">Job Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#244034]">{application.jobTitle}</h3>
                            <p className="text-sm text-[rgba(0,0,0,0.7)]">{application.company}</p>
                            <p className="text-xs text-[rgba(0,0,0,0.5)]">
                              {application.location} • Applied {formatRelativeTime(application.appliedAt)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant={getStatusColor(application.status) as 'default' | 'secondary' | 'success' | 'warning' | 'destructive'}>
                              {getStatusText(application.status)}
                            </Badge>
                            <Link href={`/jobs/${application.id}`}>
                              <Button variant="outline" size="sm">
                                View Job
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-[#244034]">Saved Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {savedJobs.map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#244034]">{job.title}</h3>
                            <p className="text-sm text-[rgba(0,0,0,0.7)]">{job.company}</p>
                            <p className="text-xs text-[rgba(0,0,0,0.5)]">
                              {job.location} • {job.type} • Saved {formatRelativeTime(job.savedAt)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              Remove
                            </Button>
                            <Link href={`/jobs/${job.id}`}>
                              <Button variant="primary" size="sm">
                                Apply Now
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-[#244034]">Profile Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-[#244034] mb-2">Profile Management</h3>
                      <p className="text-[rgba(0,0,0,0.7)] mb-4">
                        Profile management features coming soon
                      </p>
                      <Button variant="outline">
                        Coming Soon
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
