'use client';

import React from 'react';

const HeroSection: React.FC = () => {

  return (
    <section className="relative bg-primary text-white py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Headline */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold font-['Gordita'] leading-tight"
            style={{ color: '#fff' }}
          >
            Find Your Dream Job Today
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Looking for a job? Browse through our job listings and find the perfect one for you.
          </p>
          
          {/* Search Bar */}
          {/* <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="flex-1 flex items-center px-4 py-4">
                <svg 
                  className="w-5 h-5 text-gray-400 mr-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Job title, Company or Keyword"
                  className="flex-1 text-gray-900 placeholder-gray-500 focus:outline-none text-lg"
                />
              </div>
              <Button
                type="submit"
                className="bg-[#CFFD6B] text-black font-bold text-lg px-8 py-5 hover:bg-[#B8E85A] transition-colors sm:rounded-r-lg sm:rounded-l-none rounded-lg border-0 w-full sm:w-auto"
              >
                SEARCH
              </Button>
            </div>
          </form> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;