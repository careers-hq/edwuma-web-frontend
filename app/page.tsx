import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MorningList from '@/components/home/MorningList';

const description =
  'A short list of open jobs in Ghana, Nigeria, Kenya, and South Africa. No fee. One link to apply.';

export const metadata: Metadata = {
  title: {
    absolute: 'Jobs you can apply to today | Edwuma',
  },
  description,
  openGraph: {
    title: 'Jobs you can apply to today | Edwuma',
    description,
    url: '/',
  },
  twitter: {
    title: 'Jobs you can apply to today | Edwuma',
    description,
  },
  alternates: {
    canonical: '/',
  },
};

function ListFallback() {
  return (
    <div className="mt-8 space-y-6" aria-hidden="true">
      {[0, 1, 2].map((row) => (
        <div key={row} className="border-b border-gray-200 py-6">
          <div className="h-5 w-2/3 rounded bg-gray-100" />
          <div className="mt-3 h-4 w-1/3 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header plain />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="!text-[28px] font-semibold !leading-tight tracking-tight !text-gray-900 sm:!text-[32px]">
          Jobs you can apply to today.
        </h1>
        <Suspense fallback={<ListFallback />}>
          <MorningList />
        </Suspense>
      </main>
      <Footer plain />
    </div>
  );
}
