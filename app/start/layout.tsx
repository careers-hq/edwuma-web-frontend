import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start',
};

export default function StartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
