import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage, { ContentSection } from '@/components/layout/ContentPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Careers HQ Africa collects and uses personal data on Edwuma, under Ghana’s Data Protection Act, 2012 (Act 843) and the GDPR.',
};

const UPDATED = '9 October 2026';

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      description="This policy explains what personal data Edwuma collects, why we use it, who we share it with, and the rights you have over it."
      updated={UPDATED}
    >
      <ContentSection title="Who is responsible">
        <p>
          Careers HQ Africa is the data controller for personal data processed through Edwuma. We are based in Ghana and operate the site at edwuma.com.
        </p>
        <p>
          Privacy requests go to <a href="mailto:hello@edwuma.com" className="text-[#244034] underline">hello@edwuma.com</a>. You can also use the <Link href="/contact" className="text-[#244034] underline">contact form</Link>.
        </p>
      </ContentSection>

      <ContentSection title="Which laws apply">
        <p>
          We process personal data in line with Ghana&apos;s Data Protection Act, 2012 (Act 843). That Act requires us to be accountable for the data we hold, to collect it lawfully and for a specified purpose, to keep further use compatible with that purpose, to keep data accurate, to be open about what we do, to protect it, and to let you participate in decisions about your data.
        </p>
        <p>
          If you are in the European Economic Area or the United Kingdom, the EU GDPR or the UK GDPR also applies. Those laws sit alongside Act 843. They do not replace the rights you have in Ghana, and Act 843 does not remove GDPR rights where the GDPR applies to you.
        </p>
      </ContentSection>

      <ContentSection title="Data we collect">
        <p>We collect only what the current product uses.</p>
        <p><strong className="text-[#244034]">Account.</strong> If you register, we store your first name, last name, email address, and a hashed password. You must confirm that you accept these terms and this policy. Optional profile fields exist in our systems, including phone number, address, city, gender, and date of birth, but the public registration form does not ask for them today. We do not ask you to upload a CV.</p>
        <p><strong className="text-[#244034]">Sign-in.</strong> A session token and a copy of your account details are stored in your browser so you stay signed in. Password reset emails contain a link tied to your email address.</p>
        <p><strong className="text-[#244034]">Saved jobs and alerts.</strong> If you save a job, we store that link to your account. A job alert stores your name, email, the job titles and countries you pick, and the weekly send schedule. An alert can be tied to your account.</p>
        <p><strong className="text-[#244034]">Activity.</strong> When you are signed in, we record views, saves, apply clicks, searches, and profile updates. A record can include the job, the time, your IP address, your browser type, and a short note of what you did. This is what the dashboard activity view is built from.</p>
        <p><strong className="text-[#244034]">Location hint.</strong> To pre-select a country filter, we read your browser timezone. If that is not enough, the site may ask our server, or a location service such as ipinfo, ipapi, or ip-api, for a coarse country from your IP address. We cache that country in your browser for about a day. We do not ask for GPS permission.</p>
        <p><strong className="text-[#244034]">Messages.</strong> Email sent to hello@edwuma.com is stored so we can reply. The contact form asks for your name, email, subject, and message for the same purpose.</p>
        <p><strong className="text-[#244034]">Security check.</strong> Registration, sign-in, password reset, and the contact form can use Cloudflare Turnstile. Cloudflare processes technical data, which may include your IP address, to tell us the request is from a person rather than a script.</p>
        <p><strong className="text-[#244034]">Usage analytics.</strong> We use Google Analytics and PostHog to understand how the site is used and to record errors. These tools receive technical data such as pages viewed, a rough location, device and browser details, and an identifier stored in a cookie or similar storage. PostHog is configured to send data through Edwuma and then to PostHog in the United States.</p>
      </ContentSection>

      <ContentSection title="Why we use it">
        <p>Under the GDPR, we rely on the following reasons. The same uses meet the lawfulness and purpose principles in Act 843.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-[#244034]">Contract.</strong> Creating your account, keeping you signed in, saving jobs, sending a password reset, and sending the weekly alert you asked for.</li>
          <li><strong className="text-[#244034]">Legitimate interests.</strong> Keeping the site secure, preventing abuse, understanding which pages are used, fixing errors, and showing a relevant country filter. You can object to processing based on legitimate interests.</li>
          <li><strong className="text-[#244034]">Consent.</strong> Where a use is optional and we ask you first. You can withdraw consent at any time. Withdrawal does not affect use that was already lawful.</li>
          <li><strong className="text-[#244034]">Legal obligation.</strong> Where Ghanaian law, or another law that applies to us, requires us to keep or disclose a record.</li>
        </ul>
        <p>
          We do not sell personal data. We do not use your data to make hiring decisions, and we do not run solely automated decisions that produce legal effects about you. Search filters and alerts follow the criteria you set.
        </p>
      </ContentSection>

      <ContentSection title="Applications to employers">
        <p>
          Edwuma does not receive your job application. Apply opens the employer&apos;s page, or the page supplied by the listing source. From that point the employer, and any site they use, is a separate controller. Read their privacy notice before you send a CV or other documents.
        </p>
        <p>
          Job listings themselves come from sources such as JobData, Greenhouse, and ReliefWeb. Those sources provide role information. They do not receive your Edwuma account unless you choose to go to their site.
        </p>
      </ContentSection>

      <ContentSection title="Who we share data with">
        <p>We use service providers who process data on our instructions:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>hosting and infrastructure for the website and API;</li>
          <li>email delivery for password resets and weekly job alerts;</li>
          <li>Cloudflare, for the Turnstile security check;</li>
          <li>Google, for Google Analytics;</li>
          <li>PostHog, for product analytics and error reports;</li>
          <li>IP location providers, only when the timezone is not enough to suggest a country.</li>
        </ul>
        <p>
          We may also disclose data if the law requires it, or if it is needed to protect you, another person, or the security of the service. We do not give employers a list of people who viewed a job.
        </p>
      </ContentSection>

      <ContentSection title="Transfers outside Ghana">
        <p>
          Act 843 limits the transfer of personal data outside Ghana. Some of our providers store or access data in other countries, including the United States. We transfer data where a condition in Act 843 is met: the transfer is necessary to perform the service you asked for, you have been informed, or the recipient provides a comparable level of protection.
        </p>
        <p>
          Where the GDPR applies, a transfer outside the EEA or the UK needs a lawful mechanism, such as the provider&apos;s data-processing terms. Email us if you want the mechanism that applies to a named provider.
        </p>
      </ContentSection>

      <ContentSection title="How long we keep it">
        <p>
          Account data, saved jobs, and activity records are kept while your account is open. Job alert details are kept until you turn the alert off or ask us to delete them. Contact messages are kept long enough to handle your request and any follow-up.
        </p>
        <p>
          After you ask us to delete your account, we delete or anonymise your personal data unless we have to keep a limited record to meet a legal duty, resolve a dispute, or prevent abuse. Analytics providers keep their own copies for the period set in their tools. The country hint in your browser expires after about 24 hours, or sooner if you clear site data.
        </p>
      </ContentSection>

      <ContentSection title="Security">
        <p>
          Passwords are stored as hashes, not as plain text. Access to production systems is limited to people who need it to operate Edwuma. No online service can promise perfect security. If a breach creates a risk to your rights, we will tell you and, where Act 843 or the GDPR requires it, the relevant authority.
        </p>
      </ContentSection>

      <ContentSection title="Your rights">
        <p>You can ask us to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>confirm whether we hold personal data about you, and for a copy of it;</li>
          <li>correct data that is inaccurate or incomplete;</li>
          <li>delete data where the law allows, including when you close your account;</li>
          <li>restrict or object to processing based on legitimate interests;</li>
          <li>receive data you provided, in a portable format, where the GDPR gives you that right;</li>
          <li>withdraw consent, where processing was based on consent;</li>
          <li>stop a weekly job alert.</li>
        </ul>
        <p>
          There is no delete button in the dashboard yet. Email <a href="mailto:hello@edwuma.com" className="text-[#244034] underline">hello@edwuma.com</a> from the address on your account and tell us what you want. We may need to confirm it is you. We aim to respond within 30 days, which is the period the GDPR sets, and sooner where Act 843 requires it.
        </p>
        <p>
          You can complain to the Data Protection Commission of Ghana. If the GDPR applies to you, you can also complain to the supervisory authority in your country. You may complain to us first so we can try to put things right, but you do not have to.
        </p>
      </ContentSection>

      <ContentSection title="Cookies and similar storage">
        <p>
          Edwuma uses cookies and browser storage for three purposes: to keep you signed in, to remember a country suggestion, and to measure how the site is used through Google Analytics and PostHog. Session storage is used briefly to return you to a job after you sign in, and to record an apply click that was waiting on login.
        </p>
        <p>
          The sign-in storage is needed to provide the account you created. Analytics cookies help us see which parts of the site work. You can block or delete cookies in your browser. If you block the sign-in storage, you will need to log in again, and some account features will not work. Blocking analytics cookies does not stop you from searching jobs.
        </p>
        <p>
          We do not currently show a separate cookie banner. If you are in the EEA or the UK and want to object to analytics, email us or use your browser controls, and we will treat that as an objection.
        </p>
      </ContentSection>

      <ContentSection title="Children">
        <p>
          Edwuma is not directed at children. We do not knowingly collect personal data from anyone under 16. If you believe a child has given us personal data, email <a href="mailto:hello@edwuma.com" className="text-[#244034] underline">hello@edwuma.com</a> and we will delete it.
        </p>
      </ContentSection>

      <ContentSection title="Changes">
        <p>
          We will update this policy when our practices change, and we will change the date at the top. If a change materially affects how we use your account data, we will tell you by email or by a notice on the site.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
