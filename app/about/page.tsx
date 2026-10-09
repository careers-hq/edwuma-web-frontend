import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage, { ContentSection } from '@/components/layout/ContentPage';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Edwuma is a job search site for Africa, operated by Careers HQ Africa. Search roles in Ghana, Nigeria, Kenya, and South Africa, save jobs, and get a weekly alert.',
};

export default function AboutPage() {
  return (
    <ContentPage
      title="About Edwuma"
      description="Edwuma helps people in Africa find work. Search open roles, save the ones you want, and get a weekly email when new jobs match what you are looking for."
    >
      <ContentSection title="What Edwuma is">
        <p>
          Edwuma is a job search site operated by Careers HQ Africa. It is built for job seekers, with a focus on roles in Ghana, Nigeria, Kenya, and South Africa, including remote and on-site work.
        </p>
        <p>
          Searching is free. You can browse without an account. An account lets you save jobs, see your recent activity, and subscribe to a weekly job alert.
        </p>
      </ContentSection>

      <ContentSection title="Where the jobs come from">
        <p>
          Edwuma does not take job posts from employers on this site. Listings are gathered from public and employer career sources, including JobData, Greenhouse, and ReliefWeb, and shown in one place so you can search and filter them.
        </p>
        <p>
          When you apply, Edwuma opens the employer&apos;s own application page. We do not receive your application, CV, or cover letter. The employer you apply to is responsible for that process.
        </p>
      </ContentSection>

      <ContentSection title="What you can do">
        <ul className="list-disc pl-5 space-y-2">
          <li>Search by keyword, country, work mode, and date posted.</li>
          <li>Open a listing to read the role, location, and how to apply.</li>
          <li>Create a free account with your name, email, and a password.</li>
          <li>Save jobs and review them later from your dashboard.</li>
          <li>Set one weekly email alert for job titles and countries you choose.</li>
        </ul>
      </ContentSection>

      <ContentSection title="Who we are">
        <p>
          Edwuma is a product of Careers HQ Africa. Questions about the site, your account, or your personal data can be sent to{' '}
          <a href="mailto:hello@edwuma.com" className="text-[#244034] underline">hello@edwuma.com</a>
          {' '}or through the <Link href="/contact" className="text-[#244034] underline">contact form</Link>.
        </p>
        <p>
          For how to use the site, see the <Link href="/help" className="text-[#244034] underline">Help Center</Link> and <Link href="/faq" className="text-[#244034] underline">FAQ</Link>.
          How we handle personal data is set out in the <Link href="/privacy" className="text-[#244034] underline">Privacy Policy</Link>, and use of the site is covered by the <Link href="/terms" className="text-[#244034] underline">Terms of Use</Link>.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
