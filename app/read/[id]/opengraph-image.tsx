import { jobsApiService } from '@/lib/api/jobs';
import { jobOgImage, ogSize, siteOgImage, withOgCache } from '@/lib/og/card';
import { jobShareLine, jobShareTitle } from '@/lib/og/job';

export const alt = 'Job on Edwuma';
export const size = ogSize;
export const contentType = 'image/png';
export const revalidate = 300;
export const dynamic = 'force-dynamic';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const response = await jobsApiService.getJob(id);
    const job = response.data;

    if (!response.success || !job?.title) {
      return withOgCache(siteOgImage(), false);
    }

    return withOgCache(
      jobOgImage(jobShareTitle(job.title, job.companies?.[0]?.name), jobShareLine(job)),
      true,
    );
  } catch (error) {
    console.error('Error generating read OG image:', error);
    return withOgCache(siteOgImage(), false);
  }
}
