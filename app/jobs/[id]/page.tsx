import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JobRead from '@/components/home/JobRead';
import { JobPostingSchema } from '@/components/seo';
import { jobsApiService, type JobListing } from '@/lib/api/jobs';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ country?: string }>;
};

function postingReady(job: JobListing): boolean {
  return Boolean(
    job.job_type?.value &&
    job.job_type.label &&
    job.work_mode?.value &&
    job.timing?.posted_at &&
    job.salary &&
    Array.isArray(job.skills) &&
    Array.isArray(job.categories) &&
    Array.isArray(job.companies) &&
    Array.isArray(job.locations),
  );
}

export default async function JobPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { country } = await searchParams;

  let job: JobListing | null = null;

  try {
    const response = await jobsApiService.getJob(id);
    if (response.success && response.data && postingReady(response.data)) {
      job = response.data;
    }
  } catch (error) {
    console.error('Job schema failed:', error);
  }

  return (
    <div className="min-h-screen bg-white">
      {job ? <JobPostingSchema job={job} /> : null}
      <Header plain />
      <main>
        <JobRead id={id} country={country} />
      </main>
      <Footer plain />
    </div>
  );
}
