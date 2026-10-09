import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ContentPageProps {
  title: string;
  description: string;
  updated?: string;
  children: React.ReactNode;
}

export default function ContentPage({ title, description, updated, children }: ContentPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#244034] font-['Gordita'] mb-4">
            {title}
          </h1>
          <p className="text-lg text-[rgba(0,0,0,0.7)] leading-relaxed">
            {description}
          </p>
          {updated && (
            <p className="mt-4 text-sm text-[rgba(0,0,0,0.5)]">Last updated: {updated}</p>
          )}
        </header>
        <div className="space-y-10">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

export function ContentSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-[#244034]">{title}</h2>
      <div className="space-y-3 text-[rgba(0,0,0,0.75)] leading-relaxed">{children}</div>
    </section>
  );
}
