import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MorningStart from '@/components/home/MorningStart';

export const metadata: Metadata = {
  title: 'Continue',
  description: 'The morning on WhatsApp and by email. Kind of work, years, and the week.',
};

export default function MorningPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header plain />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-[40px] font-extrabold leading-[1.05] tracking-[-0.045em] text-[#141414]">
          Continue
        </h1>
        <div className="mt-8">
          <Suspense fallback={null}>
            <MorningStart />
          </Suspense>
        </div>
      </main>
      <Footer plain />
    </div>
  );
}
