'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  category: string;
  readTime: string;
  image: string;
  tags: string[];
}

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: '10 Tips for Landing Your Dream Job in 2024',
    excerpt: 'Discover the essential strategies that will help you stand out in today\'s competitive job market and land your dream position.',
    content: 'Full article content here...',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://via.placeholder.com/40'
    },
    publishedAt: '2024-01-15',
    category: 'Career Advice',
    readTime: '5 min read',
    image: 'https://via.placeholder.com/400x200',
    tags: ['career', 'job search', 'tips']
  },
  {
    id: '2',
    title: 'Remote Work: The Future of Employment',
    excerpt: 'Explore how remote work is reshaping the employment landscape and what it means for job seekers and employers.',
    content: 'Full article content here...',
    author: {
      name: 'Michael Chen',
      avatar: 'https://via.placeholder.com/40'
    },
    publishedAt: '2024-01-12',
    category: 'Industry Trends',
    readTime: '7 min read',
    image: 'https://via.placeholder.com/400x200',
    tags: ['remote work', 'future', 'employment']
  },
  {
    id: '3',
    title: 'Building a Strong Professional Network',
    excerpt: 'Learn how to create and maintain meaningful professional relationships that can advance your career.',
    content: 'Full article content here...',
    author: {
      name: 'Emily Rodriguez',
      avatar: 'https://via.placeholder.com/40'
    },
    publishedAt: '2024-01-10',
    category: 'Networking',
    readTime: '6 min read',
    image: 'https://via.placeholder.com/400x200',
    tags: ['networking', 'career', 'professional']
  },
  {
    id: '4',
    title: 'The Art of Writing a Compelling Resume',
    excerpt: 'Master the skills needed to create a resume that gets noticed by recruiters and hiring managers.',
    content: 'Full article content here...',
    author: {
      name: 'David Thompson',
      avatar: 'https://via.placeholder.com/40'
    },
    publishedAt: '2024-01-08',
    category: 'Resume Tips',
    readTime: '8 min read',
    image: 'https://via.placeholder.com/400x200',
    tags: ['resume', 'job application', 'career']
  },
  {
    id: '5',
    title: 'Interview Preparation: Your Complete Guide',
    excerpt: 'Get ready for your next interview with our comprehensive guide covering everything from research to follow-up.',
    content: 'Full article content here...',
    author: {
      name: 'Lisa Wang',
      avatar: 'https://via.placeholder.com/40'
    },
    publishedAt: '2024-01-05',
    category: 'Interview Tips',
    readTime: '10 min read',
    image: 'https://via.placeholder.com/400x200',
    tags: ['interview', 'preparation', 'career']
  },
  {
    id: '6',
    title: 'Salary Negotiation: Getting What You Deserve',
    excerpt: 'Learn the strategies and techniques for negotiating a salary that reflects your true worth.',
    content: 'Full article content here...',
    author: {
      name: 'James Wilson',
      avatar: 'https://via.placeholder.com/40'
    },
    publishedAt: '2024-01-03',
    category: 'Career Advice',
    readTime: '9 min read',
    image: 'https://via.placeholder.com/400x200',
    tags: ['salary', 'negotiation', 'career']
  }
];

const categories = [
  'All Categories',
  'Career Advice',
  'Industry Trends',
  'Networking',
  'Resume Tips',
  'Interview Tips',
  'Job Search',
  'Professional Development'
];

export default function BlogPage() {
  const [posts] = useState<BlogPost[]>(mockBlogPosts);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    let filtered = posts;

    if (query) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    let filtered = posts;

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (category !== 'All Categories') {
      filtered = filtered.filter(post => post.category === category);
    }

    setFilteredPosts(filtered);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#244034] font-['Gordita'] mb-4">
            Career Insights & Tips
          </h1>
          <p className="text-lg text-[rgba(0,0,0,0.7)] max-w-2xl mx-auto">
            Stay updated with the latest career advice, industry trends, and job search strategies
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search articles..."
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

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#244034] mb-6">Featured Article</h2>
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <Image
                    src={filteredPosts[0].image}
                    alt={filteredPosts[0].title}
                    width={400}
                    height={200}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="secondary">{filteredPosts[0].category}</Badge>
                    <span className="text-sm text-[rgba(0,0,0,0.7)]">{filteredPosts[0].readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#244034] mb-3">
                    {filteredPosts[0].title}
                  </h3>
                  <p className="text-[rgba(0,0,0,0.7)] mb-4 leading-relaxed">
                    {filteredPosts[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={filteredPosts[0].author.avatar}
                        alt={filteredPosts[0].author.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#244034]">{filteredPosts[0].author.name}</p>
                        <p className="text-xs text-[rgba(0,0,0,0.7)]">
                          {formatRelativeTime(filteredPosts[0].publishedAt)}
                        </p>
                      </div>
                    </div>
                    <Link href={`/blog/${filteredPosts[0].id}`}>
                      <Button variant="primary">Read More</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#244034] mb-6">Latest Articles</h2>
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.slice(1).map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="secondary" size="sm">{post.category}</Badge>
                      <span className="text-xs text-[rgba(0,0,0,0.7)]">{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#244034] mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[rgba(0,0,0,0.7)] mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-xs text-[rgba(0,0,0,0.7)]">{post.author.name}</span>
                      </div>
                      <span className="text-xs text-[rgba(0,0,0,0.7)]">
                        {formatRelativeTime(post.publishedAt)}
                      </span>
                    </div>
                    <div className="mt-4">
                      <Link href={`/blog/${post.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Read More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#244034] mb-2">No articles found</h3>
              <p className="text-[rgba(0,0,0,0.7)] mb-4">
                Try adjusting your search criteria or browse all categories
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Categories');
                  setFilteredPosts(posts);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Newsletter Subscription */}
        <Card className="bg-[#244034] text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Get the latest career tips and job market insights delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="flex-1"
                type="email"
              />
              <Button variant="secondary" className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
