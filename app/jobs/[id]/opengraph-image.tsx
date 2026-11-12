import { jobsApiService } from '@/lib/api/jobs';
import { jobOgImage, ogSize, siteOgImage } from '@/lib/og/card';
import { jobShareLine, jobShareTitle } from '@/lib/og/job';
import { extractJobId } from '@/lib/utils/slug';

export const alt = 'Job on Edwuma';
export const size = ogSize;
export const contentType = 'image/png';
export const revalidate = 86400;

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const jobId = extractJobId(id);

  try {
    const response = await jobsApiService.getJob(jobId);
    const job = response.data;

    if (!response.success || !job?.title) {
      return siteOgImage();
    }

    return jobOgImage(jobShareTitle(job.title, job.companies?.[0]?.name), jobShareLine(job));
  } catch (error) {
    console.error('Error generating OG image:', error);
    return siteOgImage();
  }
}
