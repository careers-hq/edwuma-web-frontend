import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | Edwuma',
  description:
    'How Edwuma collects, uses, shares, and protects personal data, with GDPR and Ghana Data Protection Act compliance information.',
  robots: { index: true, follow: true },
}

export default function PrivacyPolicyPage() {
  const lastUpdated = new Date().toISOString().slice(0, 10)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#244034] font-['Gordita'] mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-[rgba(0,0,0,0.6)] mb-8">Last updated: {lastUpdated}</p>

        <section className="space-y-6 text-[rgba(0,0,0,0.8)] leading-relaxed">
          <p>
            This Privacy Policy explains how Edwuma ("Edwuma", "we", "us") collects, uses,
            discloses, and protects personal data when you use our website and services. It
            incorporates standards from the EU General Data Protection Regulation (GDPR) and the
            Ghana Data Protection Act, 2012 (Act 843) where applicable.
          </p>

          <h2 className="text-2xl font-semibold text-[#244034]">Who we are</h2>
          <p>
            Edwuma is the data controller for processing described in this Policy. You can reach us at
            <a className="text-[#244034] underline ml-1" href="mailto:support@edwuma.com">support@edwuma.com</a>.
          </p>

          <h2 className="text-2xl font-semibold text-[#244034]">Scope</h2>
          <p>
            This Policy covers visitors and registered users of our platform, including job seekers and
            employers. Additional notices may apply to specific features or campaigns.
          </p>

          <h2 className="text-2xl font-semibold text-[#244034]">Data we collect</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              Account data: first and last name, email address, password hash, and your choices such as
              marketing preferences.
            </li>
            <li>
              Profile and application data: resume/CV, work history, education, skills, cover letters,
              messages, and application activity.
            </li>
            <li>
              Usage and device data: IP address, device/browser information, pages viewed, referring URLs,
              and log data.
            </li>
            <li>
              Communications: support requests, feedback, and correspondence.
            </li>
            <li>
              Third-party sign-in data: basic profile details if you choose to register via a provider.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-[#244034]">How we use data and legal bases</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              Provide and operate the service, including account creation, authentication, job search, and
              applications (contract performance; Act 843 permitted processing).
            </li>
            <li>
              Maintain safety, security, fraud prevention, and diagnostics (legitimate interests; Act 843
              security safeguards).
            </li>
            <li>
              Customer support and service communications (contract; legitimate interests).
            </li>
            <li>
              Analytics and product improvement (consent where required under GDPR/ePrivacy; legitimate
              interests for limited, strictly necessary measurement).
            </li>
            <li>
              Marketing communications with your consent, with ability to opt out at any time.
            </li>
            <li>
              Legal compliance and enforcement of our Terms (legal obligations; legitimate interests).
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-[#244034]">Cookies and tracking</h2>
          <p>
            We use cookies and similar technologies. Non-essential cookies (e.g., analytics/marketing)
            are used with consent in regions where required. You can manage preferences in our Cookie
            Policy and banner when presented. See our <a className="text-[#244034] underline" href="/cookies">Cookie Policy</a> for details.
          </p>

          <h2 className="text-2xl font-semibold text-[#244034]">Sharing and disclosure</h2>
          <p>We use carefully selected service providers who process data for us, including:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Payments (e.g., Stripe) when payments are enabled</li>
            <li>Analytics and tag management (e.g., Google Analytics/Tag Manager)</li>
            <li>Error monitoring and performance (e.g., Sentry)</li>
            <li>Email/SMS delivery and communications</li>
            <li>Hosting, CDN, and infrastructure providers</li>
            <li>Job data sources and integrations</li>
          </ul>
          <p>
            Where applicable, we maintain data processing agreements and appropriate safeguards with these
            providers. We disclose information when required by law or to protect our rights, users, or the
            public.
          </p>

          <h2 className="text-2xl font-semibold text-[#244034]">International data transfers</h2>
          <p>
            When transferring personal data across borders, we use recognized mechanisms such as Standard
            Contractual Clauses or other lawful measures to protect your information.
          </p>

          <h2 className="text-2xl font-semibold text-[#244034]">Data retention</h2>
          <p>
            We keep personal data for as long as needed to provide the service and for legitimate business
            or legal purposes. Typical periods include: account data for the life of the account and a
            reasonable period after closure; application materials for a reasonable job-search lifecycle;
            logs and diagnostics for limited periods.
          </p>

          <h2 className="text-2xl font-semibold text-[#244034]">Your rights</h2>
          <p>
            Depending on your location, you may have rights under GDPR and Act 843, including the rights
            to access, rectify, erase, restrict or object to processing, data portability, and to withdraw
            consent. You may also have the right to lodge a complaint with your local supervisory authority
            or the Ghana Data Protection Commission. To exercise rights, contact
            <a className="text-[#244034] underline ml-1" href="mailto:support@edwuma.com">support@edwuma.com</a>.
          </p>

          <h2 className="text-2xl font-semibold text-[#244034]">Security</h2>
          <p>
            We use administrative, technical, and physical safeguards to protect personal data, including
            transport encryption and access controls. We evaluate improvements on an ongoing basis, such as
            using httpOnly cookies for token storage in production.
          </p>

          <h2 className="text-2xl font-semibold text-[#244034]">Children’s privacy</h2>
          <p>
            Our services are not directed to children under the age where consent requires parental
            authorization in your jurisdiction. If you believe we have collected data from a child, please
            contact us to delete it.
          </p>

          <h2 className="text-2xl font-semibold text-[#244034]">Changes to this Policy</h2>
          <p>
            We may update this Policy from time to time. Material changes will be communicated by updating
            the date above and, when appropriate, by additional notice. Continued use of the service after
            changes indicates acceptance of the updated Policy.
          </p>

          <h2 className="text-2xl font-semibold text-[#244034]">Contact</h2>
          <p>
            Questions or requests can be sent to
            <a className="text-[#244034] underline ml-1" href="mailto:support@edwuma.com">support@edwuma.com</a>.
          </p>

          <p className="text-xs text-[rgba(0,0,0,0.6)] mt-6">
            This page is provided for informational purposes and does not constitute legal advice.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
