import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StopMessage from '@/components/home/StopMessage';

export default function StopPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header plain />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-gray-900">
          Emails
        </h1>
        <Suspense fallback={<p className="mt-3 text-base text-gray-700">Stopping the emails.</p>}>
          <StopMessage />
        </Suspense>
      </main>
      <Footer plain />
    </div>
  );
}
