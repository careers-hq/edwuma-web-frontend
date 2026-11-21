import { permanentRedirect } from 'next/navigation';
import { jobsApiService } from '@/lib/api/jobs';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ country?: string }>;
};

export default async function ReadPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { country } = await searchParams;

  let slug = id;

  try {
    const response = await jobsApiService.getJob(id);
    if (response.success && response.data?.slug) {
      slug = response.data.slug;
    }
  } catch (error) {
    console.error('Read redirect failed:', error);
  }

  const query = country ? `?country=${encodeURIComponent(country)}` : '';
  permanentRedirect(`/jobs/${slug}${query}`);
}
