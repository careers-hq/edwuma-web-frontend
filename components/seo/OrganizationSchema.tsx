/**
 * Organization/LocalBusiness Structured Data Schema
 * Implements schema.org Organization for company pages
 */

import { Company } from '@/lib/api/jobs';

interface OrganizationSchemaProps {
  company: Company;
  jobCount?: number;
}

export function OrganizationSchema({ company, jobCount }: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": company.name,
    "description": company.description || `${company.name} is hiring on Edwuma`,
    "url": company.links?.website || undefined,
    "logo": company.logo_url ? {
      "@type": "ImageObject",
      "url": company.logo_url
    } : undefined,
    "numberOfEmployees": company.size ? {
      "@type": "QuantitativeValue",
      "value": company.size.label
    } : undefined,
    "foundingDate": company.founded_year ? `${company.founded_year}-01-01` : undefined,
    "location": company.headquarters ? {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": company.headquarters
      }
    } : undefined,
    "sameAs": [
      company.links?.website,
      company.links?.linkedin,
      company.links?.twitter,
      company.links?.github,
    ].filter(Boolean),
    "potentialAction": jobCount ? {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://edwuma.com/companies/${company.id}?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    } : undefined
  };

  // Remove undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  );
}

