'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProtectedRoute, useAuth } from '@/lib/auth';
import { savedJobsService, userActivitiesService } from '@/lib/api';
import type { SavedJob, ActivityStatistics, ActivitySummary } from '@/lib/api';
import { getJobSlug } from '@/lib/utils/slug';

// Types are now imported from the API module

function DashboardContent() {
  const { logout, getUserDisplayName } = useAuth();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivitySummary[]>([]);
  const [stats, setStats] = useState<ActivityStatistics & { savedJobs: number; profileViews: number }>({
    jobs_viewed: 0,
    apply_clicks: 0,
    searches_performed: 0,
    profile_updates: 0,
    savedJobs: 0,
    profileViews: 0,
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'saved' | 'profile'>('overview');
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const [isLoadingSavedJobs, setIsLoadingSavedJobs] = useState(true);

  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        const [statisticsResponse, savedJobsCountResponse] = await Promise.all([
          userActivitiesService.getStatistics(30),
          savedJobsService.getCount(),
        ]);

        if (statisticsResponse.success && savedJobsCountResponse.success) {
          setStats({
            ...statisticsResponse.data,
            savedJobs: savedJobsCountResponse.data.count,
            profileViews: 0, // Future feature
          });
        }
      } catch (error: unknown) {
        console.error('Error fetching statistics:', error);
        // If unauthorized, the ProtectedRoute will handle redirect
        if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
          console.log('Authentication required - will be redirected by ProtectedRoute');
        }
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch recent activity
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setIsLoadingActivity(true);
        const response = await userActivitiesService.getSummary(10);
        
        if (response.success) {
          setRecentActivity(response.data);
        }
      } catch (error: unknown) {
        console.error('Error fetching activity:', error);
        // If unauthorized, the ProtectedRoute will handle redirect
        if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
          console.log('Authentication required - will be redirected by ProtectedRoute');
        }
      } finally {
        setIsLoadingActivity(false);
      }
    };

    fetchActivity();
  }, []);

  // Fetch saved jobs
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setIsLoadingSavedJobs(true);
        const response = await savedJobsService.getSavedJobs(1, 20);
        
        if (response.success) {
          setSavedJobs(response.data.data);
        }
      } catch (error: unknown) {
        console.error('Error fetching saved jobs:', error);
        // If unauthorized, the ProtectedRoute will handle redirect
        if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
          console.log('Authentication required - will be redirected by ProtectedRoute');
        }
      } finally {
        setIsLoadingSavedJobs(false);
      }
    };

    if (activeTab === 'saved') {
      fetchSavedJobs();
    }
  }, [activeTab]);

  // Handle remove saved job
  const handleRemoveSavedJob = async (savedJobId: string) => {
    try {
      const response = await savedJobsService.unsaveJob(savedJobId);
      
      if (response.success) {
        // Remove from local state
        setSavedJobs(prev => prev.filter(job => job.id !== savedJobId));
        // Update stats
        setStats(prev => ({ ...prev, savedJobs: prev.savedJobs - 1 }));
      }
    } catch (error) {
      console.error('Error removing saved job:', error);
    }
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
                    onClick={() => setActiveTab('activity')}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                      activeTab === 'activity'
                        ? 'bg-[#244034] text-white'
                        : 'text-[rgba(0,0,0,0.7)] hover:bg-gray-100'
                    }`}
                  >
                    Activity
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
                      <div className="flex justify-center mb-3">
                        <svg className="w-8 h-8 text-[#244034]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      {isLoadingStats ? (
                        <div className="animate-pulse">
                          <div className="h-10 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                        </div>
                      ) : (
                        <>
                          <div className="text-3xl font-bold text-[#244034] mb-2">
                            {stats.jobs_viewed}
                          </div>
                          <div className="text-sm text-[rgba(0,0,0,0.7)]">Jobs Viewed</div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-3">
                        <svg className="w-8 h-8 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      {isLoadingStats ? (
                        <div className="animate-pulse">
                          <div className="h-10 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                        </div>
                      ) : (
                        <>
                          <div className="text-3xl font-bold text-[#4ade80] mb-2">
                            {stats.apply_clicks}
                          </div>
                          <div className="text-sm text-[rgba(0,0,0,0.7)]">Apply Clicks</div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-3">
                        <svg className="w-8 h-8 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      {isLoadingStats ? (
                        <div className="animate-pulse">
                          <div className="h-10 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                        </div>
                      ) : (
                        <>
                          <div className="text-3xl font-bold text-[#f59e0b] mb-2">
                            {stats.savedJobs}
                          </div>
                          <div className="text-sm text-[rgba(0,0,0,0.7)]">Saved Jobs</div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-3">
                        <svg className="w-8 h-8 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      {isLoadingStats ? (
                        <div className="animate-pulse">
                          <div className="h-10 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                        </div>
                      ) : (
                        <>
                          <div className="text-3xl font-bold text-[#8b5cf6] mb-2">
                            {stats.profileViews}
                          </div>
                          <div className="text-sm text-[rgba(0,0,0,0.7)]">Profile Views</div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-[#244034]">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingActivity ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                            <div className="w-5 h-5 bg-gray-200 rounded"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : recentActivity.length > 0 ? (
                      <div className="space-y-4">
                        {recentActivity.slice(0, 5).map((activity) => (
                          <Link
                            key={activity.id}
                            href={`/jobs/${activity.job_slug}`}
                            className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-shrink-0 mt-1">
                              {activity.type === 'view' && (
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                              {activity.type === 'save' && (
                                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              )}
                              {activity.type === 'apply_click' && (
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#244034]">
                                {activity.type === 'view' && 'Viewed'}
                                {activity.type === 'save' && 'Saved'}
                                {activity.type === 'apply_click' && 'Clicked Apply for'}
                              </p>
                              <h4 className="font-semibold text-gray-900 mt-1">{activity.job_title}</h4>
                              <p className="text-sm text-[rgba(0,0,0,0.7)]">{activity.company}</p>
                              <p className="text-xs text-[rgba(0,0,0,0.5)] mt-1">
                                {activity.location && `${activity.location} • `}{activity.timestamp}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-[#244034] mb-2">No Activity Yet</h3>
                        <p className="text-[rgba(0,0,0,0.7)] mb-4">
                          Start exploring jobs to see your activity here
                        </p>
                        <Link href="/">
                          <Button variant="primary">Browse Jobs</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-[#244034]">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link href="/">
                        <Button variant="primary" className="w-full h-16">
                          <div className="text-center">
                            <div className="text-lg font-semibold">Browse Jobs</div>
                            <div className="text-sm opacity-90">Explore opportunities across Africa</div>
                          </div>
                        </Button>
                      </Link>
                      <Link href="/dashboard?tab=saved">
                        <Button variant="outline" className="w-full h-16">
                          <div className="text-center">
                            <div className="text-lg font-semibold">Saved Jobs</div>
                            <div className="text-sm opacity-90">View your saved opportunities</div>
                          </div>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-[#244034]">Your Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentActivity.length > 0 ? (
                      <div className="space-y-4">
                        {recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex-shrink-0 mt-1">
                              {activity.type === 'view' && (
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                              {activity.type === 'save' && (
                                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              )}
                              {activity.type === 'apply_click' && (
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#244034]">
                                {activity.type === 'view' && 'Viewed'}
                                {activity.type === 'save' && 'Saved'}
                                {activity.type === 'apply_click' && 'Clicked Apply for'}
                              </p>
                              <h4 className="font-semibold text-gray-900 mt-1">{activity.job_title}</h4>
                              <p className="text-sm text-[rgba(0,0,0,0.7)]">{activity.company}</p>
                              <p className="text-xs text-[rgba(0,0,0,0.5)] mt-1">
                                {activity.location} • {activity.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-[#244034] mb-2">No Activity Yet</h3>
                        <p className="text-[rgba(0,0,0,0.7)] mb-4">
                          Your job search activity will appear here. Start exploring jobs to track your progress!
                        </p>
                        <Link href="/">
                          <Button variant="primary">Browse Jobs</Button>
                        </Link>
                      </div>
                    )}
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
                    {isLoadingSavedJobs ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-20 bg-gray-200 rounded"></div>
                              <div className="h-8 w-20 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : savedJobs.length > 0 ? (
                      <div className="space-y-4">
                        {savedJobs.map((savedJob) => (
                          <div key={savedJob.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex-1">
                              <h3 className="font-semibold text-[#244034]">{savedJob.job.title}</h3>
                              <p className="text-sm text-[rgba(0,0,0,0.7)]">
                                {savedJob.job.companies[0]?.name || 'Company'}
                              </p>
                              <p className="text-xs text-[rgba(0,0,0,0.5)]">
                                {savedJob.job.locations[0]?.name || 'Location'} • {savedJob.job.job_type.label}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRemoveSavedJob(savedJob.id)}
                              >
                                Remove
                              </Button>
                              <Link href={`/jobs/${getJobSlug(savedJob.job)}`}>
                                <Button variant="primary" size="sm">
                                  View Job
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-[#244034] mb-2">No Saved Jobs</h3>
                        <p className="text-[rgba(0,0,0,0.7)] mb-4">
                          Jobs you save will appear here for easy access
                        </p>
                        <Link href="/">
                          <Button variant="primary">Browse Jobs</Button>
                        </Link>
                      </div>
                    )}
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
