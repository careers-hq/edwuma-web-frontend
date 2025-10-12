import { Metadata } from 'next';
import { jobsApiService } from '@/lib/api/jobs';
import { extractJobId } from '@/lib/utils/slug';

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const jobId = extractJobId(id);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://edwuma.com';

  try {
    const response = await jobsApiService.getJob(jobId);
    
    if (!response.success || !response.data) {
      return {
        title: 'Job Not Found',
        description: 'The job you are looking for does not exist.',
      };
    }

    const job = response.data;
    const company = job.companies[0];
    const location = job.locations[0];
    const category = job.categories[0];

    // Generate SEO-friendly title
    const title = `${job.title} at ${company?.name || 'Top Company'} in ${location?.city || location?.country || 'Africa'}`;
    
    // Generate description - strip HTML tags
    const stripHtml = (html: string) => {
      return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
    };
    
    const description = job.description 
      ? `${stripHtml(job.description).substring(0, 155)}...` 
      : `Apply for ${job.title} position at ${company?.name}. ${job.job_type.label} role in ${location?.city || location?.country}.`;

    // Generate keywords
    const keywords = [
      job.title,
      location?.city,
      location?.country,
      company?.name,
      job.job_type.label,
      job.experience_level.label,
      category?.name,
      `${job.title} jobs ${location?.country}`,
      `${category?.name} jobs ${location?.city}`,
      job.work_mode.value === 'remote' ? 'remote jobs' : '',
      ...job.skills.map(skill => skill.name),
    ].filter(Boolean).join(', ');

    // Use dynamic OG image instead of company logo
    const ogImageUrl = `${baseUrl}/jobs/${id}/opengraph-image`;

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${baseUrl}/jobs/${job.slug}`,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${job.title} at ${company?.name}`,
            type: 'image/png',
          }
        ],
        siteName: 'Edwuma',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl],
        creator: '@edwuma',
        site: '@edwuma',
      },
      alternates: {
        canonical: `${baseUrl}/jobs/${job.slug}`,
      },
      robots: {
        index: job.status.value === 'active',
        follow: true,
      },
    };
  } catch (error) {
    console.error('Error generating job metadata:', error);
    return {
      title: 'Job Details | Edwuma',
      description: 'View job details and apply for positions across Africa.',
    };
  }
}

export default function JobLayout({ children }: Props) {
  return <>{children}</>;
}

