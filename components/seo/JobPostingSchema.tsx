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
    "validThrough": getValidThroughDate(job.timing.posted_at, job.timing.expires_at),
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
        "streetAddress": location.city || "Not specified",
        "addressLocality": location.city,
        "addressRegion": location.state || location.country,
        "addressCountry": location.country
      }
    } : undefined,
    "baseSalary": (job.salary.min || job.salary.max) ? getBaseSalarySchema(job.salary.min, job.salary.max, job.salary.currency) : undefined,
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
      "credentialCategory": mapEducationToCredentialCategory(job.education_level.value)
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

// Map education level to valid schema.org credentialCategory values
function mapEducationToCredentialCategory(educationLevel: string): string {
  const mapping: Record<string, string> = {
    'high_school': 'HighSchool',
    'secondary': 'HighSchool',
    'diploma': 'HighSchool',
    'associate': 'AssociateDegree',
    'associate_degree': 'AssociateDegree',
    'bachelor': 'BachelorDegree',
    'bachelors': 'BachelorDegree',
    'bachelor_degree': 'BachelorDegree',
    'masters': 'PostgraduateDegree',
    'master': 'PostgraduateDegree',
    'masters_degree': 'PostgraduateDegree',
    'doctorate': 'Doctorate',
    'phd': 'Doctorate',
    'doctoral': 'Doctorate',
    'certificate': 'ProfessionalCertificate',
    'certification': 'ProfessionalCertificate',
    'professional_certificate': 'ProfessionalCertificate',
  };
  
  const normalizedLevel = educationLevel.toLowerCase().replace(/\s+/g, '_');
  return mapping[normalizedLevel] || 'BachelorDegree';
}

// Generate default validThrough date (90 days from posted_at)
function getValidThroughDate(postedAt: string, expiresAt: string | null): string {
  if (expiresAt) {
    return expiresAt;
  }
  
  // Default to 90 days from posting date
  const posted = new Date(postedAt);
  posted.setDate(posted.getDate() + 90);
  return posted.toISOString();
}

// Generate baseSalary schema based on available salary data
function getBaseSalarySchema(min: number | null, max: number | null, currency: string | null) {
  const currencyCode = currency || "USD";
  
  if (min && max) {
    // Both min and max available - use range
    return {
      "@type": "MonetaryAmount",
      "currency": currencyCode,
      "value": {
        "@type": "QuantitativeValue",
        "minValue": min,
        "maxValue": max,
        "unitText": "MONTH"
      }
    };
  } else if (min) {
    // Only min available
    return {
      "@type": "MonetaryAmount",
      "currency": currencyCode,
      "value": {
        "@type": "QuantitativeValue",
        "value": min,
        "unitText": "MONTH"
      }
    };
  } else if (max) {
    // Only max available
    return {
      "@type": "MonetaryAmount",
      "currency": currencyCode,
      "value": {
        "@type": "QuantitativeValue",
        "value": max,
        "unitText": "MONTH"
      }
    };
  }
  
  return undefined;
}

