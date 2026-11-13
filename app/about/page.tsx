import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage, { ContentSection } from '@/components/layout/ContentPage';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Edwuma shows a few open jobs in Ghana, Nigeria, Kenya, and South Africa. No fee. One link to apply.',
};

export default function AboutPage() {
  return (
    <ContentPage
      title="About Edwuma"
      description="A short list of jobs you can apply to today in Ghana, Nigeria, Kenya, and South Africa."
    >
      <ContentSection title="What Edwuma is">
        <p>
          Edwuma shows a few open roles in Ghana, Nigeria, Kenya, and South Africa. Each role is still open, someone in that country can apply, and none of them ask for a fee.
        </p>
      </ContentSection>

      <ContentSection title="Where the jobs come from">
        <p>
          Listings are gathered from public employer sources, including JobData, Greenhouse, and ReliefWeb. Edwuma does not take job posts from employers on this site.
        </p>
        <p>
          When you apply, the link opens the employer&apos;s own application page. Edwuma does not receive your application or your CV. It does not promise a visa or an interview.
        </p>
      </ContentSection>

      <ContentSection title="What it costs">
        <p>
          Nothing. The list is free to read. Creating an account does not take a payment. Applying opens the employer&apos;s page.
        </p>
      </ContentSection>

      <ContentSection title="Who we are">
        <p>
          Edwuma is the site at edwuma.com. Questions about the site or your personal data can be sent to{' '}
          <a href="mailto:hello@edwuma.com" className="text-[#244034] underline">hello@edwuma.com</a>
          {' '}or through the <Link href="/contact" className="text-[#244034] underline">contact form</Link>.
        </p>
        <p>
          How we handle personal data is set out in the <Link href="/privacy" className="text-[#244034] underline">Privacy Policy</Link>. Cookies are listed in the <Link href="/cookies" className="text-[#244034] underline">Cookies policy</Link>. Use of the site is covered by the <Link href="/terms" className="text-[#244034] underline">Terms of Use</Link>.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
