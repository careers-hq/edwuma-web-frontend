'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I create an account on Edwuma?',
    answer: 'Creating an account is simple! Click the "Register" button in the top right corner, fill in your details, and verify your email address. You can also sign up using your Google or LinkedIn account for faster registration.',
    category: 'Account'
  },
  {
    id: '2',
    question: 'How can I search for jobs?',
    answer: 'Use our advanced search filters to find jobs by location, job type, experience level, and category. You can also use keywords to search for specific positions or companies. Save your searches to get notified when new matching jobs are posted.',
    category: 'Job Search'
  },
  {
    id: '3',
    question: 'How do I apply for a job?',
    answer: 'Once you find a job you\'re interested in, click the "Apply Now" button. You\'ll be redirected to the application page where you can upload your resume, write a cover letter, and submit your application. Some jobs may redirect you to the company\'s website.',
    category: 'Applications'
  },
  {
    id: '4',
    question: 'Can I save jobs for later?',
    answer: 'Yes! You can save jobs by clicking the heart icon on any job listing. Saved jobs will appear in your dashboard under "Saved Jobs" where you can review and apply to them later.',
    category: 'Job Management'
  },
  {
    id: '5',
    question: 'How do I set up job alerts?',
    answer: 'Go to your dashboard and click on "Job Alerts". Set up alerts based on your preferred criteria like location, job type, and keywords. You\'ll receive email notifications when new jobs matching your criteria are posted.',
    category: 'Job Alerts'
  },
  {
    id: '6',
    question: 'Is it free to use Edwuma?',
    answer: 'Yes, Edwuma is completely free for job seekers! You can search for jobs, apply to positions, save jobs, and set up job alerts at no cost. We also offer premium features for employers.',
    category: 'Pricing'
  },
  {
    id: '7',
    question: 'How do I update my profile?',
    answer: 'Go to your dashboard and click on "Profile". You can update your personal information, work experience, education, skills, and upload a new resume. Keeping your profile updated helps employers find you.',
    category: 'Profile'
  },
  {
    id: '8',
    question: 'Can I apply for jobs without an account?',
    answer: 'While you can browse jobs without an account, you\'ll need to create a free account to apply for positions, save jobs, and access personalized features like job recommendations.',
    category: 'Account'
  },
  {
    id: '9',
    question: 'How do I delete my account?',
    answer: 'To delete your account, go to your dashboard settings and click on "Delete Account". This action is permanent and will remove all your data from our platform. Make sure to download any important information before deleting.',
    category: 'Account'
  },
  {
    id: '10',
    question: 'What types of jobs are available?',
    answer: 'Edwuma features jobs across various industries including Technology, Healthcare, Finance, Marketing, Engineering, and more. We have full-time, part-time, contract, and remote positions from entry-level to senior roles.',
    category: 'Job Search'
  },
  {
    id: '11',
    question: 'How do I contact support?',
    answer: 'You can reach our support team through the contact form on our website, email us at support@edwuma.com, or use the live chat feature. We typically respond within 24 hours.',
    category: 'Support'
  },
  {
    id: '12',
    question: 'Is my personal information secure?',
    answer: 'Yes, we take your privacy seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your consent. Read our Privacy Policy for more details.',
    category: 'Privacy'
  }
];

const categories = [
  'All Categories',
  'Account',
  'Job Search',
  'Applications',
  'Job Management',
  'Job Alerts',
  'Pricing',
  'Profile',
  'Support',
  'Privacy'
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || 
      faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#244034] font-['Gordita'] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-[rgba(0,0,0,0.7)] max-w-2xl mx-auto">
            Find answers to common questions about using Edwuma to search for jobs and advance your career
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:border-[#244034] focus:outline-none focus:ring-2 focus:ring-[#244034] focus:ring-opacity-20"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <Card key={faq.id} className="overflow-hidden">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  aria-expanded={openItems.has(faq.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#244034] pr-4">
                      {faq.question}
                    </h3>
                    <svg
                      className={`w-5 h-5 text-[#244034] transition-transform ${
                        openItems.has(faq.id) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-xs bg-[#d2f34c] text-[#244034] px-2 py-1 rounded-full">
                      {faq.category}
                    </span>
                  </div>
                </button>
                
                {openItems.has(faq.id) && (
                  <CardContent className="px-6 pb-6">
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-[rgba(0,0,0,0.7)] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#244034] mb-2">No FAQs found</h3>
              <p className="text-[rgba(0,0,0,0.7)] mb-4">
                Try adjusting your search criteria or browse all categories
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Categories');
                }}
                className="text-[#244034] hover:text-[#1a2f26] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <Card className="mt-12 bg-[#f8fafc]">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-[#244034] mb-4">Still have questions?</h3>
            <p className="text-[rgba(0,0,0,0.7)] mb-6 max-w-2xl mx-auto">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#244034] hover:bg-[#1a2f26] transition-colors"
              >
                Contact Support
              </a>
              <a
                href="mailto:support@edwuma.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-[#244034] text-base font-medium rounded-md text-[#244034] bg-white hover:bg-[#f8fafc] transition-colors"
              >
                Email Us
              </a>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
