import type { Metadata } from "next";
import Link from "next/link";
import ContentPage, { ContentSection } from "@/components/layout/ContentPage";
import CookieSettingsButton from "@/components/cookies/CookieSettingsButton";

export const metadata: Metadata = {
  title: "Cookies",
  description:
    "The cookies and browser storage Edwuma uses, and how to accept or refuse analytics.",
};

const UPDATED = "12 November 2026";

export default function CookiesPage() {
  return (
    <ContentPage
      title="Cookies"
      description="This page lists the cookies and similar storage Edwuma uses, and how to accept or refuse the ones that are optional."
      updated={UPDATED}
    >
      <ContentSection title="Your choice">
        <p>
          A banner asks before we set analytics cookies. Essential storage stays on because the site needs it to keep you signed in and to remember this choice. I accept allows analytics. I refuse leaves analytics off. You can open the choice again at any time.
        </p>
        <p>
          <CookieSettingsButton className="text-[#244034] underline" />
        </p>
      </ContentSection>

      <ContentSection title="Essential">
        <p>
          These are stored in your browser so the service you asked for can work. They are not used for advertising. Refusing them in your browser means you will need to sign in again, and a country suggestion may have to be looked up once more.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-[#244034]">Sign-in.</strong> <code>edwuma_access_token</code> and <code>edwuma_user_data</code> in local storage keep you signed in until you log out.
          </li>
          <li>
            <strong className="text-[#244034]">Country hint.</strong> <code>user-location-v2</code> in local storage remembers a suggested country for about a day. It is a coarse country from your timezone or IP, not GPS.
          </li>
          <li>
            <strong className="text-[#244034]">This choice.</strong> <code>edwuma_cookie_consent</code> in local storage records whether analytics is allowed, until you change it or clear site data.
          </li>
          <li>
            <strong className="text-[#244034]">This tab.</strong> Session storage holds the page to return to after sign-in, an apply click that was waiting on login, and the jobs list scroll position. It is cleared when the tab closes.
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="Analytics">
        <p>
          Analytics runs only after you accept it. We use it to see which pages are used and to record errors. Refusing it does not stop you searching jobs, reading a listing, or signing in.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-[#244034]">Google Analytics.</strong> Google sets cookies such as <code>_ga</code> to recognise a browser across visits. Google may process that data in the United States.
          </li>
          <li>
            <strong className="text-[#244034]">PostHog.</strong> PostHog stores an identifier in a cookie or local storage, and receives pages viewed, a rough location, and device and browser details. Events go through Edwuma and then to PostHog in the United States. PostHog also records errors when analytics is on.
          </li>
        </ul>
        <p>
          These providers keep their own copies for the period set in their tools. If you refuse after previously accepting, we stop sending new analytics and clear the Google Analytics cookies we can remove from this browser.
        </p>
      </ContentSection>

      <ContentSection title="Advertising">
        <p>
          Edwuma does not use advertising cookies, and does not sell personal data. There is no advertising category in the banner because there is nothing to turn on.
        </p>
      </ContentSection>

      <ContentSection title="How to change this in the browser">
        <p>
          You can also block or delete cookies and site data in your browser settings. Blocking essential storage will sign you out. Blocking analytics storage does not stop the rest of the site.
        </p>
      </ContentSection>

      <ContentSection title="More">
        <p>
          How we use personal data is in the <Link href="/privacy" className="text-[#244034] underline">Privacy Policy</Link>. Questions: <a href="mailto:hello@edwuma.com" className="text-[#244034] underline">hello@edwuma.com</a>.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
