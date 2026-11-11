import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JobRead from '@/components/home/JobRead';
import { jobsApiService } from '@/lib/api/jobs';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await jobsApiService.getJob(id);
    const title = response.data?.title;

    if (response.success && title) {
      return {
        title,
        description: 'The role, then one link to apply.',
      };
    }
  } catch {
    // The page shows the failure itself.
  }

  return {
    title: 'Role',
    description: 'The role, then one link to apply.',
  };
}

export default async function ReadPage({
  params,
  searchParams,
}: Props & { searchParams: Promise<{ country?: string }> }) {
  const { id } = await params;
  const { country } = await searchParams;

  return (
    <div className="min-h-screen bg-white">
      <Header plain />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <JobRead id={id} country={country} />
      </main>
      <Footer plain />
    </div>
  );
}
