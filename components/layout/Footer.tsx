import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    services: {
      title: 'Services',
      links: [
        { name: 'Browse Jobs', href: '/jobs' },
        { name: 'Post Jobs', href: '/employers' },
        { name: 'Company Profiles', href: '/companies' },
      ],
    },
    company: {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    support: {
      title: 'Support',
      links: [
        { name: 'Terms of Use', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Help Center', href: '/help' },
      ],
    },
  };

  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/goglobalopportunities', icon: 'facebook' },
    // { name: 'Twitter', href: '#', icon: 'twitter' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/careers-hq/', icon: 'linkedin' },
    // { name: 'Instagram', href: '#', icon: 'instagram' },
    { name: 'Tiktok', href: 'https://www.tiktok.com/@careers.hq?_t=ZN-8xaFmm1iWYg&_r=1', icon: 'tiktok' },
    { name: 'Whatsapp', href: 'https://whatsapp.com/channel/0029Vagbd6665yD8dkqgGh1w', icon: 'whatsapp' },
  ];

  return (
    <footer className={cn('bg-[#244034] text-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-white font-['Gordita']">
                edwuma
              </span>
            </div>
            <p className="text-sm text-white/80 mb-6 leading-relaxed">
              Simplify your job search with personalized matches and seamless applications.
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
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-white/80">
              © {currentYear} <Link href="https://careershqafrica.com" target="_blank" className="text-white/80 hover:text-white transition-colors underline" rel="noopener noreferrer">Careers HQ Africa</Link>. All rights reserved.
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-4 md:mt-0">
              {Array.isArray(socialLinks) && socialLinks.length > 0 ? (
                socialLinks.map((social) => (
                  social && social.name && social.href && social.icon ? (
                    <a
                      key={social.name}
                      href={social.href}
                      className="text-white/60 hover:text-white transition-colors"
                      aria-label={social.name}
                      rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
                      target={social.href.startsWith('http') ? "_blank" : undefined}
                    >
                      <span className="sr-only">{social.name}</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        {social.icon === 'facebook' && (
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        )}
                        {/* {social.icon === 'twitter' && (
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        )} */}
                        {social.icon === 'linkedin' && (
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        )}
                        {social.icon === 'instagram' && (
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243s.122-.928.49-1.243c.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243s-.122.928-.49 1.243c-.369.315-.807.49-1.297.49z"/>
                        )}
                        {social.icon === 'tiktok' && (
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        )}
                        {social.icon === 'whatsapp' && (
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.472-.148-.67.149-.198.297-.767.967-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.787-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.134.297-.347.446-.52.149-.173.198-.297.297-.495.099-.198.05-.371-.025-.52-.074-.148-.669-1.611-.917-2.212-.242-.582-.487-.502-.67-.511-.173-.009-.371-.011-.569-.011-.198 0-.52.074-.79.372-.271.297-1.035 1.012-1.035 2.479 0 1.468 1.061 2.882 1.208 3.082.148.198 2.09 3.197 5.077 4.363.711.306 1.264.489 1.697.625.713.228 1.362.196 1.874.119.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.273-.198-.57-.347m-5.421 7.273h-.001a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982 1-3.648-.235-.374A9.86 9.86 0 012.131 12.01C2.13 6.478 6.606 2 12.17 2c2.641 0 5.126 1.032 6.988 2.898a9.785 9.785 0 012.889 6.982c-.003 5.533-4.479 10.01-10.006 10.01m8.413-18.418A11.815 11.815 0 0012.17 0C5.453 0 0 5.453 0 12.01c0 2.115.553 4.184 1.601 5.982L.022 24l6.145-1.613A11.886 11.886 0 0012.17 24c6.617 0 12-5.383 12-11.99 0-3.192-1.245-6.197-3.513-8.363"/>
                        )}
                      </svg>
                    </a>
                  ) : null
                ))
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
