import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import CookieSettingsButton from '@/components/cookies/CookieSettingsButton';

interface FooterProps {
  className?: string;
  plain?: boolean;
}

const COLUMNS = [
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Contact', href: '/contact' },
      { name: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'For you',
    links: [
      { name: "Today's jobs", href: '/#jobs' },
      { name: 'The morning', href: '/morning' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Terms of Use', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookies', href: '/cookies' },
    ],
  },
];

const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn('border-t border-black/10 bg-white', className)}>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="text-[28px] font-extrabold leading-none tracking-[-0.05em] text-[#244034]">
            edwuma
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-black/60">
            A short list of jobs you can apply to today.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-semibold text-[#244034]">{column.title}</h2>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-[#141414] hover:text-[#244034]">
                    {link.name}
                  </Link>
                </li>
              ))}
              {column.title === 'Legal' && (
                <li>
                  <CookieSettingsButton />
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-black/10">
        <p className="mx-auto max-w-6xl px-4 py-6 text-sm text-black/50 sm:px-6">
          © {currentYear} Edwuma
        </p>
      </div>
    </footer>
  );
};

export default Footer;
