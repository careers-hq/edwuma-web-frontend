import type { Metadata } from 'next';
import ContentPage, { ContentSection } from '@/components/layout/ContentPage';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Edwuma does not charge. Today’s list is free.',
};

export default function FAQPage() {
  return (
    <ContentPage
      title="FAQ"
      description="Edwuma does not charge. Today’s list is free."
    >
      <ContentSection title="Does Edwuma charge?">
        <p>
          No. The list is free to read. Creating an account does not take a payment.
        </p>
      </ContentSection>
      <ContentSection title="What is on the list?">
        <p>
          Open roles in Ghana, Nigeria, Kenya, and South Africa. Each one is still open, someone in that country can apply, and none of them ask for a fee. One link opens the employer&apos;s application.
        </p>
      </ContentSection>
      <ContentSection title="Where does apply go?">
        <p>
          To the employer&apos;s own page. Edwuma does not receive your application.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
