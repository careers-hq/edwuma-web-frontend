import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MorningCountry from '@/components/home/MorningCountry';

export const metadata: Metadata = {
  title: 'Country',
};

export default function MorningCountryPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header plain />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-[40px] font-extrabold leading-[1.05] tracking-[-0.045em] text-[#141414]">
          Country
        </h1>
        <Suspense fallback={null}>
          <MorningCountry />
        </Suspense>
      </main>
      <Footer plain />
    </div>
  );
}
