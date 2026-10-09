import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage, { ContentSection } from '@/components/layout/ContentPage';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'Terms for using Edwuma, the African job search site operated by Careers HQ Africa.',
};

const UPDATED = '9 October 2026';

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Use"
      description="These terms cover your use of Edwuma. By creating an account, or by continuing to use the site after you have been given a chance to read them, you agree to them."
      updated={UPDATED}
    >
      <ContentSection title="Who we are">
        <p>
          Edwuma is operated by Careers HQ Africa (&quot;we&quot;, &quot;us&quot;). The site is at edwuma.com. You can reach us at <a href="mailto:hello@edwuma.com" className="text-[#244034] underline">hello@edwuma.com</a>.
        </p>
        <p>
          These terms are governed by the laws of the Republic of Ghana. If a mandatory consumer or data-protection right applies to you where you live, including under the EU or UK GDPR, that right still applies.
        </p>
      </ContentSection>

      <ContentSection title="The service">
        <p>
          Edwuma is a search site for job seekers. You can browse listings, filter them, save jobs, and subscribe to a weekly email alert. Employers cannot post jobs on Edwuma.
        </p>
        <p>
          Listings are collected from third-party sources, including JobData, Greenhouse, and ReliefWeb, and from employer career pages those sources expose. We do not guarantee that a listing is complete, current, or still open. A role may have been filled or withdrawn by the time you apply.
        </p>
        <p>
          The service is free for job seekers. We may change, pause, or remove features, including filters and alerts, as the product develops.
        </p>
      </ContentSection>

      <ContentSection title="Accounts">
        <p>
          You may browse without an account. To save jobs, view your activity, or manage a job alert from the dashboard, you need an account. Registration asks for your first name, last name, email address, and a password of at least 8 characters. You must accept these terms and the <Link href="/privacy" className="text-[#244034] underline">Privacy Policy</Link>.
        </p>
        <p>
          You must give accurate information and keep your password confidential. You are responsible for activity under your account. Tell us promptly at <a href="mailto:hello@edwuma.com" className="text-[#244034] underline">hello@edwuma.com</a> if you believe someone else has used it.
        </p>
        <p>
          Edwuma is for people seeking employment. You must be at least 16 years old to create an account. We do not knowingly offer the service to children.
        </p>
      </ContentSection>

      <ContentSection title="Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>use the site to break the law, including Ghanaian law and the law where you are located;</li>
          <li>scrape, copy, or republish listings in bulk, or attempt to bypass rate limits or access controls;</li>
          <li>probe, disrupt, or overload the site, or try to access another person&apos;s account;</li>
          <li>upload malware or submit false information in an account or alert;</li>
          <li>use the site to send unsolicited messages or to misrepresent who you are.</li>
        </ul>
        <p>
          We may suspend or close an account that breaches these terms, or that we reasonably believe is being used to harm other people or the service.
        </p>
      </ContentSection>

      <ContentSection title="Applications">
        <p>
          An apply button sends you to the employer&apos;s application page, or to the page provided by the listing source. That page is not part of Edwuma. We do not receive your application, and we are not a party to any employment contract. Hiring decisions are made only by the employer.
        </p>
        <p>
          If you are signed in, we may store the fact that you clicked apply, together with the job, time, IP address, and browser type, so you can see it in your activity. That record is described in the Privacy Policy.
        </p>
      </ContentSection>

      <ContentSection title="Job alerts">
        <p>
          A job alert is a weekly email based on the job titles and countries you choose. You can update or stop it from your dashboard. You can also email us and ask us to delete it. Alert mail is a service you requested. It is not a guarantee that every matching role will be included, or that a listed role is still open.
        </p>
      </ContentSection>

      <ContentSection title="Our content and yours">
        <p>
          The Edwuma name, logo, and the design of the site belong to Careers HQ Africa or its licensors. Job descriptions, company names, and logos belong to the employers or sources that published them. You may use the site for your own job search. You may not copy the site or its collection of listings to build a competing service.
        </p>
        <p>
          Information you submit, such as your name, email, saved jobs, and alert preferences, stays yours. You give us permission to use it only to run the service, as described in the Privacy Policy.
        </p>
      </ContentSection>

      <ContentSection title="Disclaimer and liability">
        <p>
          The site is provided as it is available. Listings can be incomplete or out of date because they come from other organisations. We do not warrant that the site will be uninterrupted or error-free.
        </p>
        <p>
          To the extent the law allows, Careers HQ Africa is not liable for decisions you or an employer make after using a listing, for the content of a third-party application page, or for loss of data, income, or opportunity arising from use of the site. Nothing in these terms limits liability that cannot legally be limited, including liability for fraud, or for death or personal injury caused by negligence.
        </p>
      </ContentSection>

      <ContentSection title="Privacy">
        <p>
          We process personal data under Ghana&apos;s Data Protection Act, 2012 (Act 843), and under the GDPR where it applies. The details are in the <Link href="/privacy" className="text-[#244034] underline">Privacy Policy</Link>.
        </p>
      </ContentSection>

      <ContentSection title="Changes and contact">
        <p>
          We may update these terms as the service changes. The date at the top of this page will change when we do. If a change materially affects your account, we will take reasonable steps to let you know, for example by email or a notice on the site. If you do not agree, you can stop using Edwuma and ask us to delete your account.
        </p>
        <p>
          Questions about these terms: <a href="mailto:hello@edwuma.com" className="text-[#244034] underline">hello@edwuma.com</a>.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
