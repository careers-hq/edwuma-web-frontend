import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Insights & Tips',
  description: 'Career advice, hiring trends, and job search guides for roles across Ghana, Nigeria, Kenya, and South Africa.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
