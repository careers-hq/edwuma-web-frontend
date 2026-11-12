import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JobRead from '@/components/home/JobRead';
import { jobsApiService } from '@/lib/api/jobs';
import { jobShareLine } from '@/lib/og/job';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://edwuma.com';
  const image = `${baseUrl}/read/${id}/opengraph-image`;

  try {
    const response = await jobsApiService.getJob(id);
    const job = response.data;

    if (response.success && job?.title) {
      const description = jobShareLine(job) || 'The role, then one link to apply.';

      return {
        title: job.title,
        description,
        openGraph: {
          title: job.title,
          description,
          type: 'website',
          url: `${baseUrl}/read/${id}`,
          siteName: 'Edwuma',
          images: [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: job.title,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: job.title,
          description,
          images: [image],
        },
      };
    }
  } catch {
    // The page shows the failure itself.
  }

  return {
    title: 'Role',
    description: 'The role, then one link to apply.',
    openGraph: {
      images: [{ url: image, width: 1200, height: 630, alt: 'Edwuma' }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [image],
    },
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
      <main>
        <JobRead id={id} country={country} />
      </main>
      <Footer plain />
    </div>
  );
}
