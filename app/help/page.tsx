import type { Metadata } from 'next';
import ContentPage, { ContentSection } from '@/components/layout/ContentPage';

export const metadata: Metadata = {
  title: 'Help',
  description: 'How the Edwuma morning message works, what a week costs, and how to stop it.',
};

export default function HelpPage() {
  return (
    <ContentPage
      title="Help"
      description="The morning list, the paid week, and how to stop either channel."
    >
      <ContentSection title="Today's list">
        <p>
          Choose the country where you live. The page shows up to five open roles someone there can apply to, with no fee. One link opens the employer&apos;s application.
        </p>
      </ContentSection>
      <ContentSection title="A week of mornings">
        <p>
          The form under the list asks for the kind of work, the years you have worked, your email, and your WhatsApp number. A first name is optional. The week is GHS 15 in Ghana, NGN 2,000 in Nigeria, KES 200 in Kenya, or ZAR 25 in South Africa. The first morning arrives after the payment succeeds.
        </p>
        <p>
          WhatsApp and email carry the same roles. Five is the most. A morning with nothing that fits still arrives.
        </p>
      </ContentSection>
      <ContentSection title="Stopping">
        <p>
          Reply STOP on WhatsApp to end those messages. Use the link in the email to stop the email. Stopping one leaves the other in place for the week already paid. Stopping both ends the next charge. The same number can start again by paying another week.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
