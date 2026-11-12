import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MorningList from '@/components/home/MorningList';

function ListFallback() {
  return (
    <div className="bg-[#244034]" aria-hidden="true">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:min-h-[720px]">
        <div className="h-[460px] max-w-[560px] rounded-[28px] bg-white" />
      </div>
    </div>
  );
}

export default function HomeShell({ country = null }: { country?: string | null }) {
  return (
    <div className="min-h-screen bg-[#F4F2EE]">
      <Header plain />
      <main>
        <Suspense fallback={<ListFallback />}>
          <MorningList initialCountry={country} />
        </Suspense>
      </main>
      <Footer plain />
    </div>
  );
}
