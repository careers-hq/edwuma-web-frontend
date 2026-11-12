/**
 * WebSite Structured Data Schema
 * Implements schema.org WebSite for the morning list.
 */

export function WebSiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://edwuma.com';

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Edwuma",
    "description": "A short list of open jobs in Ghana, Nigeria, Kenya, and South Africa. No fee. One link to apply.",
    "url": baseUrl,
    "publisher": {
      "@type": "Organization",
      "name": "Edwuma",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/opengraph-image`
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

