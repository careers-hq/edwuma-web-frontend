import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PaidMessage from '@/components/home/PaidMessage';

export default function MorningPaidPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header plain />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-gray-900">
          This week
        </h1>
        <Suspense fallback={<p className="mt-3 text-base text-gray-700">Checking the payment.</p>}>
          <PaidMessage />
        </Suspense>
      </main>
      <Footer plain />
    </div>
  );
}
