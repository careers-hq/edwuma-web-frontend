/**
 * WebSite Structured Data Schema
 * Implements schema.org WebSite for site-wide search
 */

export function WebSiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://edwuma.com';

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Edwuma",
    "description": "Find jobs across Africa. The leading job portal for Ghana, Nigeria, Kenya, and South Africa.",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/jobs?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Edwuma",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/edwuma-logo-2023.png`
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

