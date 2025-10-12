'use client';

import React from 'react';

const HeroSection: React.FC = () => {

  return (
    <section className="relative bg-primary text-white py-12 lg:py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full mb-4 border border-white/20">
            <span className="text-lg">🌍</span>
            <span className="text-xs font-medium">Africa&apos;s Cross-Border Jobs Platform</span>
          </div>

          {/* Main Headline */}
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold font-['Gordita'] leading-tight mb-3"
            style={{ color: '#fff' }}
          >
            Unlock Global Opportunities
            <br />
            <span className="text-[#4ade80]">Across Africa & Beyond</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg text-white/90 mb-6 max-w-3xl mx-auto leading-relaxed">
            Connect with visa-sponsored jobs, remote positions, and cross-border career opportunities 
            designed for African talent.
          </p>

       

          {/* Compact Stats & Countries */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 max-w-4xl mx-auto">
            {/* Stat Pills */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <span className="text-xl font-bold text-[#4ade80]">4</span>
              <span className="text-xs text-white/80">Countries</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <span className="text-xl">✅</span>
              <span className="text-xs text-white/80">Visa Sponsorship</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <span className="text-xl">💼</span>
              <span className="text-xs text-white/80">Remote Jobs</span>
            </div>
            
            {/* Country Badges with Flag Images */}
            <div className="hidden md:flex items-center gap-2 text-xs">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://flagcdn.com/w20/gh.png" 
                  srcSet="https://flagcdn.com/w40/gh.png 2x"
                  width="20" 
                  alt="Ghana flag"
                  className="rounded-sm"
                />
                <span className="font-medium">Ghana</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://flagcdn.com/w20/ng.png" 
                  srcSet="https://flagcdn.com/w40/ng.png 2x"
                  width="20" 
                  alt="Nigeria flag"
                  className="rounded-sm"
                />
                <span className="font-medium">Nigeria</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://flagcdn.com/w20/ke.png" 
                  srcSet="https://flagcdn.com/w40/ke.png 2x"
                  width="20" 
                  alt="Kenya flag"
                  className="rounded-sm"
                />
                <span className="font-medium">Kenya</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://flagcdn.com/w20/za.png" 
                  srcSet="https://flagcdn.com/w40/za.png 2x"
                  width="20" 
                  alt="South Africa flag"
                  className="rounded-sm"
                />
                <span className="font-medium">South Africa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;