import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage, { ContentSection } from '@/components/layout/ContentPage';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'Terms for using Edwuma, the African job search site.',
};

const UPDATED = '11 November 2026';

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Use"
      description="These terms cover your use of Edwuma. By creating an account, or by continuing to use the site after you have been given a chance to read them, you agree to them."
      updated={UPDATED}
    >
      <ContentSection title="Who we are">
        <p>
          Edwuma (&quot;we&quot;, &quot;us&quot;) operates the site at edwuma.com. You can reach us at <a href="mailto:hello@edwuma.com" className="text-[#244034] underline">hello@edwuma.com</a>.
        </p>
        <p>
          These terms are governed by the laws of the Republic of Ghana. If a mandatory consumer or data-protection right applies to you where you live, including under the EU or UK GDPR, that right still applies.
        </p>
      </ContentSection>

      <ContentSection title="The service">
        <p>
          Edwuma is a search site for job seekers in Ghana, Nigeria, Kenya, and South Africa. You can read today's list for your country. A paid week sends the same kind of morning, matched to your kind of work and your years, on WhatsApp and by email. Employers cannot post jobs on Edwuma.
        </p>
        <p>
          Listings are collected from third-party sources, including JobData, Greenhouse, and ReliefWeb, and from employer career pages those sources expose. We do not guarantee that a listing is complete, current, or still open. A role may have been filled or withdrawn by the time you apply.
        </p>
        <p>
          The morning list on the site is free. A week of the morning message is GHS 15 in Ghana, NGN 2,000 in Nigeria, KES 200 in Kenya, or ZAR 25 in South Africa. Payment is taken before the week starts. We may change, pause, or remove features as the product develops.
        </p>
      </ContentSection>

      <ContentSection title="Accounts">
        <p>
          You may browse without an account. The morning message uses your WhatsApp number and email. It does not ask for a password. You must be at least 16 years old. We do not knowingly offer the service to children. Tell us at <a href="mailto:hello@edwuma.com" className="text-[#244034] underline">hello@edwuma.com</a> if you believe someone else is using your number.
        </p>
      </ContentSection>

      <ContentSection title="Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>use the site to break the law, including Ghanaian law and the law where you are located;</li>
          <li>scrape, copy, or republish listings in bulk, or attempt to bypass rate limits or access controls;</li>
          <li>probe, disrupt, or overload the site, or try to access another person&apos;s account;</li>
          <li>upload malware or submit false information in a morning message;</li>
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
      </ContentSection>

      <ContentSection title="The morning message">
        <p>
          A morning message is a week of the same short list, sent on WhatsApp and by email. It uses the country, the kind of work, and the years you give. Five roles is the most in one morning. A morning with nothing that fits still arrives. Reply STOP to end WhatsApp. Use the link in the email to stop the email. Stopping one leaves the other in place for the week already paid. Stopping both ends the next charge. The same number can start again by paying another week.
        </p>
        <p>
          The message is not a guarantee that every matching role will be included, or that a listed role is still open.
        </p>
      </ContentSection>

      <ContentSection title="Our content and yours">
        <p>
          The Edwuma name, logo, and the design of the site belong to us or our licensors. Job descriptions, company names, and logos belong to the employers or sources that published them. You may use the site for your own job search. You may not copy the site or its collection of listings to build a competing service.
        </p>
        <p>
          Information you submit for a morning message, such as your first name, email, WhatsApp number, kind of work, and years, stays yours. You give us permission to use it only to run the service, as described in the Privacy Policy.
        </p>
      </ContentSection>

      <ContentSection title="Disclaimer and liability">
        <p>
          The site is provided as it is available. Listings can be incomplete or out of date because they come from other organisations. We do not warrant that the site will be uninterrupted or error-free.
        </p>
        <p>
          To the extent the law allows, we are not liable for decisions you or an employer make after using a listing, for the content of a third-party application page, or for loss of data, income, or opportunity arising from use of the site. Nothing in these terms limits liability that cannot legally be limited, including liability for fraud, or for death or personal injury caused by negligence.
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
