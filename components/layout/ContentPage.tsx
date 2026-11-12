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
      <Header plain />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <h1 className="mb-4 text-4xl font-extrabold tracking-[-0.045em] text-[#141414] md:text-5xl">
            {title}
          </h1>
          <p className="text-lg leading-relaxed text-black/70">
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
      <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[#244034]">{title}</h2>
      <div className="space-y-3 text-[rgba(0,0,0,0.75)] leading-relaxed">{children}</div>
    </section>
  );
}
