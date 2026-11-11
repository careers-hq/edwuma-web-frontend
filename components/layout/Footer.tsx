import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
  plain?: boolean;
}

const Footer: React.FC<FooterProps> = ({ className, plain = false }) => {
  const currentYear = new Date().getFullYear();

  if (plain) {
    return (
      <footer className={cn('border-t border-gray-200 bg-white', className)}>
        <div className="mx-auto flex max-w-2xl flex-wrap gap-x-4 gap-y-2 px-4 py-6 text-sm text-gray-500 sm:px-6">
          <p className="w-full">A short list of jobs you can apply to today.</p>
          <Link href="/about">About</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </footer>
    );
  }

  const footerSections = {
    company: {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    support: {
      title: 'Support',
      links: [
        { name: 'Terms of Use', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
      ],
    },
  };

  return (
    <footer className={cn('bg-[#244034] text-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-white font-['Gordita']">
                edwuma
              </span>
            </div>
            <p className="text-sm text-white/80 mb-6 leading-relaxed">
              A short list of jobs you can apply to today.
            </p>
            {/* Newsletter Subscription */}
            {/* <div className="space-y-3">
              <h4 className="text-sm font-medium text-white">Stay Updated</h4>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  id="newsletter-email"
                  name="newsletter-email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#d2f34c] focus:border-transparent"
                  aria-label="Email address for newsletter subscription"
                  required
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#d2f34c] text-[#244034] text-sm font-medium rounded-r-md hover:bg-[#c4e03f] transition-colors"
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </button>
              </form>
            </div> */}
          </div>

          {/* Footer Sections */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/80 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="text-sm text-white/80">
            © {currentYear} Edwuma. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
