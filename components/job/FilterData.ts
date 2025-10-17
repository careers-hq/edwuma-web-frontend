// Filter data with grouping and popular options for the hybrid approach

export interface FilterOption {
  value: string;
  label: string;
  group?: string;
}

// Popular options for quick access
export const POPULAR_LOCATIONS = [
  'ghana',
  'nigeria',
  'kenya',
  'south-africa'
];

export const POPULAR_CATEGORIES = [
  'information-technology',
  'healthcare',
  'finance-accounting',
  'agriculture-agribusiness'
];

// African Countries - Limited to 4 main countries
export const AFRICAN_LOCATIONS: FilterOption[] = [
  { value: 'ghana', label: 'Ghana', group: 'Popular' },
  { value: 'nigeria', label: 'Nigeria', group: 'Popular' },
  { value: 'kenya', label: 'Kenya', group: 'Popular' },
  { value: 'south-africa', label: 'South Africa', group: 'Popular' }
];

// African Job Categories with grouping
export const AFRICAN_JOB_CATEGORIES: FilterOption[] = [
  // Popular Categories
  { value: 'information-technology', label: 'Information Technology', group: 'Popular' },
  { value: 'healthcare', label: 'Healthcare', group: 'Popular' },
  { value: 'finance-accounting', label: 'Finance & Accounting', group: 'Popular' },
  { value: 'agriculture-agribusiness', label: 'Agriculture & Agribusiness', group: 'Popular' },

  // Technology & Digital
  { value: 'software-development', label: 'Software Development', group: 'Technology & Digital' },
  { value: 'data-science-analytics', label: 'Data Science & Analytics', group: 'Technology & Digital' },
  { value: 'cybersecurity', label: 'Cybersecurity', group: 'Technology & Digital' },
  { value: 'artificial-intelligence', label: 'Artificial Intelligence', group: 'Technology & Digital' },
  { value: 'blockchain-cryptocurrency', label: 'Blockchain & Cryptocurrency', group: 'Technology & Digital' },
  { value: 'e-commerce-digital-marketing', label: 'E-commerce & Digital Marketing', group: 'Technology & Digital' },
  { value: 'telecommunications', label: 'Telecommunications', group: 'Technology & Digital' },

  // Business & Finance
  { value: 'banking-financial-services', label: 'Banking & Financial Services', group: 'Business & Finance' },
  { value: 'microfinance-fintech', label: 'Microfinance & Fintech', group: 'Business & Finance' },
  { value: 'investment-private-equity', label: 'Investment & Private Equity', group: 'Business & Finance' },
  { value: 'insurance', label: 'Insurance', group: 'Business & Finance' },
  { value: 'consulting', label: 'Consulting', group: 'Business & Finance' },
  { value: 'audit-tax', label: 'Audit & Tax', group: 'Business & Finance' },
  { value: 'business-development', label: 'Business Development', group: 'Business & Finance' },
  { value: 'project-management', label: 'Project Management', group: 'Business & Finance' },

  // Healthcare & Life Sciences
  { value: 'medical-practice', label: 'Medical Practice', group: 'Healthcare & Life Sciences' },
  { value: 'public-health', label: 'Public Health', group: 'Healthcare & Life Sciences' },
  { value: 'pharmaceuticals', label: 'Pharmaceuticals', group: 'Healthcare & Life Sciences' },
  { value: 'medical-devices', label: 'Medical Devices', group: 'Healthcare & Life Sciences' },
  { value: 'healthcare-administration', label: 'Healthcare Administration', group: 'Healthcare & Life Sciences' },
  { value: 'mental-health', label: 'Mental Health', group: 'Healthcare & Life Sciences' },
  { value: 'nursing', label: 'Nursing', group: 'Healthcare & Life Sciences' },

  // Agriculture & Environment
  { value: 'sustainable-agriculture', label: 'Sustainable Agriculture', group: 'Agriculture & Environment' },
  { value: 'agribusiness', label: 'Agribusiness', group: 'Agriculture & Environment' },
  { value: 'food-processing', label: 'Food Processing', group: 'Agriculture & Environment' },
  { value: 'environmental-conservation', label: 'Environmental Conservation', group: 'Agriculture & Environment' },
  { value: 'renewable-energy', label: 'Renewable Energy', group: 'Agriculture & Environment' },
  { value: 'water-management', label: 'Water Management', group: 'Agriculture & Environment' },
  { value: 'climate-change', label: 'Climate Change', group: 'Agriculture & Environment' },

  // Education & Training
  { value: 'higher-education', label: 'Higher Education', group: 'Education & Training' },
  { value: 'vocational-training', label: 'Vocational Training', group: 'Education & Training' },
  { value: 'e-learning', label: 'E-learning', group: 'Education & Training' },
  { value: 'educational-technology', label: 'Educational Technology', group: 'Education & Training' },
  { value: 'curriculum-development', label: 'Curriculum Development', group: 'Education & Training' },
  { value: 'teacher-training', label: 'Teacher Training', group: 'Education & Training' },

  // Infrastructure & Construction
  { value: 'civil-engineering', label: 'Civil Engineering', group: 'Infrastructure & Construction' },
  { value: 'construction-management', label: 'Construction Management', group: 'Infrastructure & Construction' },
  { value: 'urban-planning', label: 'Urban Planning', group: 'Infrastructure & Construction' },
  { value: 'transportation-logistics', label: 'Transportation & Logistics', group: 'Infrastructure & Construction' },
  { value: 'real-estate', label: 'Real Estate', group: 'Infrastructure & Construction' },
  { value: 'architecture', label: 'Architecture', group: 'Infrastructure & Construction' },

  // Manufacturing & Industry
  { value: 'manufacturing', label: 'Manufacturing', group: 'Manufacturing & Industry' },
  { value: 'automotive', label: 'Automotive', group: 'Manufacturing & Industry' },
  { value: 'textiles-apparel', label: 'Textiles & Apparel', group: 'Manufacturing & Industry' },
  { value: 'mining-metals', label: 'Mining & Metals', group: 'Manufacturing & Industry' },
  { value: 'oil-gas', label: 'Oil & Gas', group: 'Manufacturing & Industry' },
  { value: 'chemicals', label: 'Chemicals', group: 'Manufacturing & Industry' },

  // Media & Communications
  { value: 'journalism', label: 'Journalism', group: 'Media & Communications' },
  { value: 'broadcasting', label: 'Broadcasting', group: 'Media & Communications' },
  { value: 'public-relations', label: 'Public Relations', group: 'Media & Communications' },
  { value: 'advertising', label: 'Advertising', group: 'Media & Communications' },
  { value: 'content-creation', label: 'Content Creation', group: 'Media & Communications' },
  { value: 'social-media', label: 'Social Media', group: 'Media & Communications' },

  // Legal & Compliance
  { value: 'corporate-law', label: 'Corporate Law', group: 'Legal & Compliance' },
  { value: 'international-law', label: 'International Law', group: 'Legal & Compliance' },
  { value: 'compliance', label: 'Compliance', group: 'Legal & Compliance' },
  { value: 'regulatory-affairs', label: 'Regulatory Affairs', group: 'Legal & Compliance' },
  { value: 'intellectual-property', label: 'Intellectual Property', group: 'Legal & Compliance' },

  // Government & Public Sector
  { value: 'public-administration', label: 'Public Administration', group: 'Government & Public Sector' },
  { value: 'policy-analysis', label: 'Policy Analysis', group: 'Government & Public Sector' },
  { value: 'international-development', label: 'International Development', group: 'Government & Public Sector' },
  { value: 'diplomacy', label: 'Diplomacy', group: 'Government & Public Sector' },
  { value: 'public-policy', label: 'Public Policy', group: 'Government & Public Sector' },

  // Non-Profit & Social Impact
  { value: 'ngo-management', label: 'NGO Management', group: 'Non-Profit & Social Impact' },
  { value: 'social-work', label: 'Social Work', group: 'Non-Profit & Social Impact' },
  { value: 'community-development', label: 'Community Development', group: 'Non-Profit & Social Impact' },
  { value: 'human-rights', label: 'Human Rights', group: 'Non-Profit & Social Impact' },
  { value: 'gender-equality', label: 'Gender Equality', group: 'Non-Profit & Social Impact' },
  { value: 'youth-development', label: 'Youth Development', group: 'Non-Profit & Social Impact' },

  // Tourism & Hospitality
  { value: 'hospitality', label: 'Hospitality', group: 'Tourism & Hospitality' },
  { value: 'tourism', label: 'Tourism', group: 'Tourism & Hospitality' },
  { value: 'event-management', label: 'Event Management', group: 'Tourism & Hospitality' },
  { value: 'restaurant-management', label: 'Restaurant Management', group: 'Tourism & Hospitality' },
  { value: 'hotel-management', label: 'Hotel Management', group: 'Tourism & Hospitality' },

  // Retail & Consumer Goods
  { value: 'retail-management', label: 'Retail Management', group: 'Retail & Consumer Goods' },
  { value: 'supply-chain', label: 'Supply Chain', group: 'Retail & Consumer Goods' },
  { value: 'procurement', label: 'Procurement', group: 'Retail & Consumer Goods' },
  { value: 'quality-assurance', label: 'Quality Assurance', group: 'Retail & Consumer Goods' },
  { value: 'customer-service', label: 'Customer Service', group: 'Retail & Consumer Goods' },

  // Research & Development
  { value: 'research-development', label: 'Research & Development', group: 'Research & Development' },
  { value: 'innovation', label: 'Innovation', group: 'Research & Development' },
  { value: 'product-development', label: 'Product Development', group: 'Research & Development' },
  { value: 'market-research', label: 'Market Research', group: 'Research & Development' },
  { value: 'biotechnology', label: 'Biotechnology', group: 'Research & Development' },

  // Sales & Marketing
  { value: 'sales', label: 'Sales', group: 'Sales & Marketing' },
  { value: 'marketing', label: 'Marketing', group: 'Sales & Marketing' },
  { value: 'brand-management', label: 'Brand Management', group: 'Sales & Marketing' },
  { value: 'business-development', label: 'Business Development', group: 'Sales & Marketing' },
  { value: 'account-management', label: 'Account Management', group: 'Sales & Marketing' },

  // Human Resources
  { value: 'human-resources', label: 'Human Resources', group: 'Human Resources' },
  { value: 'talent-acquisition', label: 'Talent Acquisition', group: 'Human Resources' },
  { value: 'organizational-development', label: 'Organizational Development', group: 'Human Resources' },
  { value: 'employee-relations', label: 'Employee Relations', group: 'Human Resources' },
  { value: 'compensation-benefits', label: 'Compensation & Benefits', group: 'Human Resources' },

  // Operations & Administration
  { value: 'operations', label: 'Operations', group: 'Operations & Administration' },
  { value: 'administrative', label: 'Administrative', group: 'Operations & Administration' },
  { value: 'facilities-management', label: 'Facilities Management', group: 'Operations & Administration' },
  { value: 'office-management', label: 'Office Management', group: 'Operations & Administration' },
  { value: 'executive-assistant', label: 'Executive Assistant', group: 'Operations & Administration' }
];

// Work Arrangements
export const WORK_ARRANGEMENTS = [
  { value: '', label: 'All Work Arrangements' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'on-site', label: 'On-site' },
  // { value: 'field-work', label: 'Field Work' },
  // { value: 'travel-required', label: 'Travel Required' },
  // { value: 'project-based', label: 'Project-based' },
  // { value: 'consultant', label: 'Consultant' },
  // { value: 'volunteer', label: 'Volunteer' },
  // { value: 'internship', label: 'Internship' },
];

// Experience Levels
export const EXPERIENCE_LEVELS = [
  { value: '', label: 'All Experience Levels' },
  { value: 'entry-level', label: 'Entry Level (0-2 years)' },
  { value: 'mid-level', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior (6-10 years)' },
  { value: 'executive', label: 'Executive (10+ years)' },
];

// Visa Sponsorship Options
export const VISA_SPONSORSHIP_OPTIONS = [
  { value: '', label: 'No Preference' },
  { value: 'available', label: 'Visa Sponsorship Available' },
  { value: 'us-visa-sponsorship', label: 'US Visa Sponsorship' },
  { value: 'uk-visa-sponsorship', label: 'UK Visa Sponsorship' },
  { value: 'canada-visa-sponsorship', label: 'Canada Visa Sponsorship' },
  { value: 'eu-visa-sponsorship', label: 'EU Visa Sponsorship' },
  { value: 'australia-visa-sponsorship', label: 'Australia Visa Sponsorship' },
  { value: 'germany-visa-sponsorship', label: 'Germany Visa Sponsorship' },
];

// Date Posted Options
export const DATE_POSTED_OPTIONS = [
  { value: '', label: 'Any Time' },
  { value: 'last_24_hours', label: 'Last 24 hours' },
  { value: 'last_week', label: 'Last week' },
  { value: 'last_month', label: 'Last month' },
  { value: 'last_3_months', label: 'Last 3 months' },
  { value: 'last_6_months', label: 'Last 6 months' },
  { value: 'last_year', label: 'Last year' },
];