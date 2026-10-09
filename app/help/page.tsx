import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage, { ContentSection } from '@/components/layout/ContentPage';

export const metadata: Metadata = {
  title: 'Help Center',
  description:
    'How to search jobs on Edwuma, create an account, save roles, set a weekly job alert, and ask for help with your data.',
};

export default function HelpPage() {
  return (
    <ContentPage
      title="Help Center"
      description="Short answers for the things you can do on Edwuma today: search, apply, save jobs, and manage a weekly alert."
    >
      <ContentSection title="Search for jobs">
        <p>
          Open the <Link href="/" className="text-[#244034] underline">homepage</Link> and use the search box. You can narrow results by country (Ghana, Nigeria, Kenya, or South Africa), work mode, and how recently the job was posted.
        </p>
        <p>
          You do not need an account to search or open a job. The country filter may start from your browser timezone so nearby roles appear first. You can change it at any time.
        </p>
      </ContentSection>

      <ContentSection title="Open a job and apply">
        <p>
          Select a job to see the title, company, location, and description. Apply opens the employer&apos;s own application page in a new tab. Edwuma does not collect your CV or submit the application for you.
        </p>
        <p>
          If you are signed in, we record that you clicked apply so it can show in your dashboard activity. The employer&apos;s site has its own terms and privacy policy.
        </p>
      </ContentSection>

      <ContentSection title="Create an account">
        <p>
          Choose <Link href="/auth/register" className="text-[#244034] underline">Sign Up</Link> and enter your first name, last name, email, and a password of at least 8 characters. You need to accept the <Link href="/terms" className="text-[#244034] underline">Terms of Use</Link> and <Link href="/privacy" className="text-[#244034] underline">Privacy Policy</Link>.
        </p>
        <p>
          Sign in later from <Link href="/auth/login" className="text-[#244034] underline">Login</Link>. If you forget your password, use <Link href="/auth/forgot-password" className="text-[#244034] underline">Forgot password</Link> and we will email you a reset link.
        </p>
      </ContentSection>

      <ContentSection title="Save a job">
        <p>
          Sign in, then use the save control on a job. Saved jobs are listed in your <Link href="/dashboard" className="text-[#244034] underline">dashboard</Link> under Saved. You can remove a saved job from that list.
        </p>
      </ContentSection>

      <ContentSection title="Set a weekly job alert">
        <p>
          From your dashboard, open Job Alerts. Add your name, email, up to 10 job titles, and the countries you care about. Edwuma sends one email each week with matching roles. You can update or turn off the alert from the same screen, or email us and ask us to delete it.
        </p>
      </ContentSection>

      <ContentSection title="Use your dashboard">
        <p>
          The dashboard shows a short summary of jobs you viewed, apply clicks, searches, and saved jobs. The Activity tab lists recent actions. Profile editing is not available yet. To correct your name or email, or to close your account, email <a href="mailto:hello@edwuma.com" className="text-[#244034] underline">hello@edwuma.com</a>.
        </p>
      </ContentSection>

      <ContentSection title="Your data">
        <p>
          You can ask for a copy of the personal data we hold, ask us to correct it, or ask us to delete it. Write to <a href="mailto:hello@edwuma.com" className="text-[#244034] underline">hello@edwuma.com</a> from the email on your account. What we collect and why is explained in the <Link href="/privacy" className="text-[#244034] underline">Privacy Policy</Link>.
        </p>
        <p>
          If you are in Ghana, you may also complain to the Data Protection Commission. If the GDPR applies to you, you may complain to the supervisory authority in your country.
        </p>
      </ContentSection>

      <ContentSection title="Still stuck">
        <p>
          Check the <Link href="/faq" className="text-[#244034] underline">FAQ</Link>, or send a message through the <Link href="/contact" className="text-[#244034] underline">contact form</Link>. You can also email <a href="mailto:hello@edwuma.com" className="text-[#244034] underline">hello@edwuma.com</a>.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
