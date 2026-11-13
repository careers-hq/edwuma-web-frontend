import type { Metadata } from 'next';
import ContentPage, { ContentSection } from '@/components/layout/ContentPage';

export const metadata: Metadata = {
  title: 'Help',
  description: 'How to read today’s list on Edwuma, and what happens when you apply.',
};

export default function HelpPage() {
  return (
    <ContentPage
      title="Help"
      description="Today’s list, applying, and what Edwuma charges."
    >
      <ContentSection title="Today's list">
        <p>
          Choose the country where you live. The page shows open roles someone there can apply to. None of them ask for a fee. One link opens the employer&apos;s application.
        </p>
      </ContentSection>
      <ContentSection title="Applying">
        <p>
          The link leaves Edwuma and opens the employer&apos;s page. Edwuma does not receive your application or your CV.
        </p>
      </ContentSection>
      <ContentSection title="What it costs">
        <p>
          Nothing. The list is free to read. Creating an account does not take a payment.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
