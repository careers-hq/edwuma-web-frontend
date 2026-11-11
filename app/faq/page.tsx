import type { Metadata } from 'next';
import ContentPage, { ContentSection } from '@/components/layout/ContentPage';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'What the Edwuma morning message costs, what it sends, and how to stop it.',
};

export default function FAQPage() {
  return (
    <ContentPage
      title="FAQ"
      description="The morning message is a paid week. Today's list on the site stays free."
    >
      <ContentSection title="What does a week cost?">
        <p>
          GHS 15 in Ghana, NGN 2,000 in Nigeria, KES 200 in Kenya, or ZAR 25 in South Africa. The charge covers WhatsApp and email for that week.
        </p>
      </ContentSection>
      <ContentSection title="What arrives?">
        <p>
          The same short list on both channels. It uses your country, the kind of work you chose, and the years you have worked. Five roles is the most. If nothing fits, the morning says so.
        </p>
      </ContentSection>
      <ContentSection title="How do I stop it?">
        <p>
          Reply STOP to end WhatsApp. The email has its own stop link. Stopping one leaves the other for the week you already paid. Stopping both ends the next charge.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
