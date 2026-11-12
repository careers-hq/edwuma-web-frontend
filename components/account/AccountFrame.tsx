import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AccountFrame({ image, alt, children }: { image: string; alt: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f3ef] text-[#16382c]">
      <Header />
      <main className="mx-auto w-full max-w-xl px-4 py-10">
        <img src={image} alt={alt} className="mb-8 h-48 w-full rounded-2xl object-cover" />
        {children}
      </main>
      <Footer />
    </div>
  );
}
