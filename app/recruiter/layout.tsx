import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { RecruiterShell } from '@/components/recruiter/RecruiterShell';

export const metadata: Metadata = {
  title: 'Recruitment',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecruiterLayout({ children }: { children: ReactNode }) {
  return <RecruiterShell>{children}</RecruiterShell>;
}
