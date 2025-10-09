/**
 * JobPosting Structured Data Schema
 * Implements schema.org JobPosting for rich search results
 */

import { JobListing } from '@/lib/api/jobs';

interface JobPostingSchemaProps {
  job: JobListing;
}

export function JobPostingSchema({ job }: JobPostingSchemaProps) {
  const company = job.companies[0];
  const location = job.locations[0];
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": job.timing.posted_at,
    "validThrough": job.timing.expires_at || undefined,
    "employmentType": job.job_type.value.toUpperCase(),
    "hiringOrganization": company ? {
      "@type": "Organization",
      "name": company.name,
      "sameAs": company.links?.website || undefined,
      "logo": company.logo_url ? {
        "@type": "ImageObject",
        "url": company.logo_url
      } : undefined
    } : undefined,
    "jobLocation": location ? {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": location.city,
        "addressRegion": location.state || undefined,
        "addressCountry": location.country
      }
    } : undefined,
    "baseSalary": job.salary.min && job.salary.max ? {
      "@type": "MonetaryAmount",
      "currency": job.salary.currency || "USD",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": job.salary.min,
        "maxValue": job.salary.max,
        "unitText": "MONTH"
      }
    } : undefined,
    "workHours": job.job_type.label,
    "jobLocationType": job.work_mode.value === 'remote' ? 'TELECOMMUTE' : undefined,
    "applicantLocationRequirements": location ? {
      "@type": "Country",
      "name": location.country
    } : undefined,
    "experienceRequirements": job.experience_level ? {
      "@type": "OccupationalExperienceRequirements",
      "monthsOfExperience": getExperienceMonths(job.experience_level.value)
    } : undefined,
    "educationRequirements": job.education_level ? {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": job.education_level.label
    } : undefined,
    "skills": job.skills.map(skill => skill.name).join(', '),
    "industry": job.categories.map(cat => cat.name).join(', '),
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

// Helper function to convert experience level to months
function getExperienceMonths(level: string): number {
  const experienceMap: Record<string, number> = {
    'entry_level': 0,
    'junior': 12,
    'mid_level': 36,
    'senior': 60,
    'lead': 84,
    'executive': 120,
  };
  
  return experienceMap[level] || 0;
}

