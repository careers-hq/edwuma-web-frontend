'use client';

import React, { Suspense } from 'react';
import { ProtectedRoute } from '@/lib/auth';
import { WorkspaceShell, type WorkspaceNavGroup } from '@/components/workspace/WorkspaceShell';

const NAV: WorkspaceNavGroup[] = [
  {
    label: 'Talent',
    items: [{ href: '/recruiter', label: 'Recruitment', icon: 'briefcase', exact: true }],
  },
];

export function RecruiterShell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="recruiter">
      <Suspense fallback={<div className="min-h-screen bg-[#F4F2EE]" />}>
        <WorkspaceShell groups={NAV} markHref="/recruiter" searchBase="/recruiter" searchPlaceholder="Search roles">
          {children}
        </WorkspaceShell>
      </Suspense>
    </ProtectedRoute>
  );
}
