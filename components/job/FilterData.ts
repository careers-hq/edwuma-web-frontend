// Filter data with grouping and popular options for the hybrid approach

export interface FilterOption {
  value: string;
  label: string;
  group?: string;
}

// Popular options for quick access
export const POPULAR_LOCATIONS = [
  'accra-ghana',
  'lagos-nigeria', 
  'nairobi-kenya',
  'johannesburg-south-africa'
];

export const POPULAR_CATEGORIES = [
  'information-technology',
  'healthcare',
  'finance-accounting',
  'agriculture-agribusiness'
];

// African Locations with grouping
export const AFRICAN_LOCATIONS: FilterOption[] = [
  // Popular Locations
  { value: 'accra-ghana', label: 'Accra, Ghana', group: 'Popular' },
  { value: 'lagos-nigeria', label: 'Lagos, Nigeria', group: 'Popular' },
  { value: 'nairobi-kenya', label: 'Nairobi, Kenya', group: 'Popular' },
  { value: 'johannesburg-south-africa', label: 'Johannesburg, South Africa', group: 'Popular' },

  // West Africa
  { value: 'abuja-nigeria', label: 'Abuja, Nigeria', group: 'West Africa' },
  { value: 'abidjan-ivory-coast', label: 'Abidjan, Ivory Coast', group: 'West Africa' },
  { value: 'dakar-senegal', label: 'Dakar, Senegal', group: 'West Africa' },
  { value: 'freetown-sierra-leone', label: 'Freetown, Sierra Leone', group: 'West Africa' },
  { value: 'ouagadougou-burkina-faso', label: 'Ouagadougou, Burkina Faso', group: 'West Africa' },
  { value: 'bamako-mali', label: 'Bamako, Mali', group: 'West Africa' },
  { value: 'conakry-guinea', label: 'Conakry, Guinea', group: 'West Africa' },
  { value: 'monrovia-liberia', label: 'Monrovia, Liberia', group: 'West Africa' },

  // East Africa
  { value: 'kampala-uganda', label: 'Kampala, Uganda', group: 'East Africa' },
  { value: 'dar-es-salaam-tanzania', label: 'Dar es Salaam, Tanzania', group: 'East Africa' },
  { value: 'addis-ababa-ethiopia', label: 'Addis Ababa, Ethiopia', group: 'East Africa' },
  { value: 'kigali-rwanda', label: 'Kigali, Rwanda', group: 'East Africa' },
  { value: 'mombasa-kenya', label: 'Mombasa, Kenya', group: 'East Africa' },
  { value: 'arusha-tanzania', label: 'Arusha, Tanzania', group: 'East Africa' },
  { value: 'entebbe-uganda', label: 'Entebbe, Uganda', group: 'East Africa' },
  { value: 'mekelle-ethiopia', label: 'Mekelle, Ethiopia', group: 'East Africa' },

  // Southern Africa
  { value: 'cape-town-south-africa', label: 'Cape Town, South Africa', group: 'Southern Africa' },
  { value: 'harare-zimbabwe', label: 'Harare, Zimbabwe', group: 'Southern Africa' },
  { value: 'lusaka-zambia', label: 'Lusaka, Zambia', group: 'Southern Africa' },
  { value: 'gaborone-botswana', label: 'Gaborone, Botswana', group: 'Southern Africa' },
  { value: 'maputo-mozambique', label: 'Maputo, Mozambique', group: 'Southern Africa' },
  { value: 'windhoek-namibia', label: 'Windhoek, Namibia', group: 'Southern Africa' },
  { value: 'maseru-lesotho', label: 'Maseru, Lesotho', group: 'Southern Africa' },
  { value: 'mbabane-eswatini', label: 'Mbabane, Eswatini', group: 'Southern Africa' },

  // North Africa
  { value: 'cairo-egypt', label: 'Cairo, Egypt', group: 'North Africa' },
  { value: 'casablanca-morocco', label: 'Casablanca, Morocco', group: 'North Africa' },
  { value: 'tunis-tunisia', label: 'Tunis, Tunisia', group: 'North Africa' },
  { value: 'algiers-algeria', label: 'Algiers, Algeria', group: 'North Africa' },
  { value: 'tripoli-libya', label: 'Tripoli, Libya', group: 'North Africa' },
  { value: 'khartoum-sudan', label: 'Khartoum, Sudan', group: 'North Africa' },
  { value: 'alexandria-egypt', label: 'Alexandria, Egypt', group: 'North Africa' },
  { value: 'rabat-morocco', label: 'Rabat, Morocco', group: 'North Africa' },

  // Central Africa
  { value: 'kinshasa-drc', label: 'Kinshasa, DRC', group: 'Central Africa' },
  { value: 'douala-cameroon', label: 'Douala, Cameroon', group: 'Central Africa' },
  { value: 'yaounde-cameroon', label: 'Yaoundé, Cameroon', group: 'Central Africa' },
  { value: 'bangui-central-african-republic', label: 'Bangui, Central African Republic', group: 'Central Africa' },
  { value: 'brazzaville-congo', label: 'Brazzaville, Congo', group: 'Central Africa' },
  { value: 'libreville-gabon', label: 'Libreville, Gabon', group: 'Central Africa' },
  { value: 'malabo-equatorial-guinea', label: 'Malabo, Equatorial Guinea', group: 'Central Africa' },

  // Diaspora
  { value: 'washington-dc', label: 'Washington DC', group: 'Diaspora' },
  { value: 'california-ca', label: 'California, CA', group: 'Diaspora' },
  { value: 'new-york', label: 'New York', group: 'Diaspora' },
  { value: 'miami', label: 'Miami', group: 'Diaspora' },
  { value: 'toronto-canada', label: 'Toronto, Canada', group: 'Diaspora' },
  { value: 'vancouver-canada', label: 'Vancouver, Canada', group: 'Diaspora' },
  { value: 'london-uk', label: 'London, UK', group: 'Diaspora' },
  { value: 'manchester-uk', label: 'Manchester, UK', group: 'Diaspora' },
  { value: 'paris-france', label: 'Paris, France', group: 'Diaspora' },
  { value: 'berlin-germany', label: 'Berlin, Germany', group: 'Diaspora' },
  { value: 'amsterdam-netherlands', label: 'Amsterdam, Netherlands', group: 'Diaspora' },
  { value: 'dubai-uae', label: 'Dubai, UAE', group: 'Diaspora' },
  { value: 'doha-qatar', label: 'Doha, Qatar', group: 'Diaspora' },
  { value: 'singapore', label: 'Singapore', group: 'Diaspora' },
  { value: 'hong-kong', label: 'Hong Kong', group: 'Diaspora' },
  { value: 'sydney-australia', label: 'Sydney, Australia', group: 'Diaspora' },
  { value: 'melbourne-australia', label: 'Melbourne, Australia', group: 'Diaspora' },
];

// African Job Categories with grouping
export const AFRICAN_JOB_CATEGORIES: FilterOption[] = [
  // Popular Categories
  { value: 'information-technology', label: 'Information Technology Jobs', group: 'Popular' },
  { value: 'healthcare', label: 'Healthcare Jobs', group: 'Popular' },
  { value: 'finance-accounting', label: 'Finance and Accounting Jobs', group: 'Popular' },
  { value: 'agriculture-agribusiness', label: 'Agriculture & Agribusiness Jobs', group: 'Popular' },

  // Technology & IT
  { value: 'telecommunications', label: 'Telecommunications Jobs', group: 'Technology & IT' },
  { value: 'microfinance-fintech', label: 'Microfinance & Fintech Jobs', group: 'Technology & IT' },
  { value: 'research-development', label: 'Research & Development Jobs', group: 'Technology & IT' },
  { value: 'science-biotechnology', label: 'Science & Biotechnology Jobs', group: 'Technology & IT' },

  // Healthcare & Medical
  { value: 'pharmaceuticals', label: 'Pharmaceuticals Jobs', group: 'Healthcare & Medical' },
  { value: 'social-services', label: 'Social Services Jobs', group: 'Healthcare & Medical' },

  // Finance & Business
  { value: 'banking-microfinance', label: 'Banking & Microfinance Jobs', group: 'Finance & Business' },
  { value: 'insurance', label: 'Insurance Jobs', group: 'Finance & Business' },
  { value: 'consulting', label: 'Consulting Jobs', group: 'Finance & Business' },
  { value: 'legal-services', label: 'Legal Services Jobs', group: 'Finance & Business' },

  // Agriculture & Development
  { value: 'development-ngo', label: 'Development & NGO Jobs', group: 'Agriculture & Development' },
  { value: 'export-import-trade', label: 'Export/Import & Trade Jobs', group: 'Agriculture & Development' },
  { value: 'logistics-supply-chain', label: 'Logistics & Supply Chain Jobs', group: 'Agriculture & Development' },

  // Infrastructure & Construction
  { value: 'mining-natural-resources', label: 'Mining & Natural Resources Jobs', group: 'Infrastructure & Construction' },
  { value: 'renewable-energy', label: 'Renewable Energy Jobs', group: 'Infrastructure & Construction' },
  { value: 'construction-infrastructure', label: 'Construction & Infrastructure Jobs', group: 'Infrastructure & Construction' },
  { value: 'aviation', label: 'Aviation Jobs', group: 'Infrastructure & Construction' },
  { value: 'maritime-shipping', label: 'Maritime & Shipping Jobs', group: 'Infrastructure & Construction' },
  { value: 'transportation', label: 'Transportation Jobs', group: 'Infrastructure & Construction' },

  // Government & Public Sector
  { value: 'government-public-sector', label: 'Government & Public Sector Jobs', group: 'Government & Public Sector' },
  { value: 'international-organizations', label: 'International Organizations Jobs', group: 'Government & Public Sector' },
  { value: 'african-union-ecowas', label: 'African Union & ECOWAS Jobs', group: 'Government & Public Sector' },

  // Manufacturing & Production
  { value: 'manufacturing', label: 'Manufacturing Jobs', group: 'Manufacturing & Production' },
  { value: 'textiles-garments', label: 'Textiles & Garments Jobs', group: 'Manufacturing & Production' },
  { value: 'food-processing', label: 'Food Processing Jobs', group: 'Manufacturing & Production' },

  // Services & Retail
  { value: 'retail-commerce', label: 'Retail & Commerce Jobs', group: 'Services & Retail' },
  { value: 'real-estate-property', label: 'Real Estate & Property Jobs', group: 'Services & Retail' },
  { value: 'hospitality-tourism', label: 'Hospitality & Tourism Jobs', group: 'Services & Retail' },

  // Media & Communications
  { value: 'media-broadcasting', label: 'Media & Broadcasting Jobs', group: 'Media & Communications' },
  { value: 'marketing-advertising', label: 'Marketing & Advertising Jobs', group: 'Media & Communications' },
  { value: 'creative-arts-design', label: 'Creative Arts & Design Jobs', group: 'Media & Communications' },

  // Support Services
  { value: 'human-resources', label: 'Human Resources Jobs', group: 'Support Services' },
  { value: 'customer-service', label: 'Customer Service Jobs', group: 'Support Services' },
  { value: 'administrative', label: 'Administrative Jobs', group: 'Support Services' },
  { value: 'security', label: 'Security Jobs', group: 'Support Services' },
];

// Other filter options (keeping existing structure)
export const WORK_ARRANGEMENTS = [
  { value: '', label: 'All Work Arrangements' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'on-site', label: 'On-site' },
  { value: 'field-work', label: 'Field Work' },
  { value: 'travel-required', label: 'Travel Required' },
  { value: 'project-based', label: 'Project-based' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'internship', label: 'Internship' },
];

export const EXPERIENCE_LEVELS = [
  { value: '', label: 'All Experience Levels' },
  { value: 'entry-level', label: 'Entry Level (0-2 years)' },
  { value: 'junior', label: 'Junior (2-4 years)' },
  { value: 'mid-level', label: 'Mid-Level (4-6 years)' },
  { value: 'senior', label: 'Senior (6-10 years)' },
  { value: 'lead', label: 'Lead (10+ years)' },
  { value: 'executive', label: 'Executive Level' },
  { value: 'fresh-graduate', label: 'Fresh Graduate' },
  { value: 'career-changer', label: 'Career Changer' },
  { value: 'returning-professional', label: 'Returning Professional' },
  { value: 'diaspora-return', label: 'Diaspora Return' },
];

export const VISA_SPONSORSHIP_OPTIONS = [
  { value: '', label: 'No Preference' },
  { value: 'uk-visa-sponsorship', label: 'UK Visa Sponsorship' },
  { value: 'canada-visa-sponsorship', label: 'Canada Visa Sponsorship' },
  { value: 'us-visa-sponsorship', label: 'US Visa Sponsorship' },
  { value: 'australia-visa-sponsorship', label: 'Australia Visa Sponsorship' },
  { value: 'germany-visa-sponsorship', label: 'Germany Visa Sponsorship' },
  { value: 'netherlands-visa-sponsorship', label: 'Netherlands Visa Sponsorship' },
  { value: 'dubai-uae-visa-sponsorship', label: 'Dubai/UAE Visa Sponsorship' },
  { value: 'singapore-visa-sponsorship', label: 'Singapore Visa Sponsorship' },
  { value: 'south-africa-work-permit', label: 'South Africa Work Permit' },
  { value: 'kenya-work-permit', label: 'Kenya Work Permit' },
  { value: 'ghana-work-permit', label: 'Ghana Work Permit' },
  { value: 'nigeria-work-permit', label: 'Nigeria Work Permit' },
  { value: 'intra-africa-mobility', label: 'Intra-Africa Mobility' },
];

export const COMPANY_TYPES = [
  { value: '', label: 'All Company Types' },
  { value: 'multinational', label: 'Multinational Corporation' },
  { value: 'african-corporate', label: 'African Corporate' },
  { value: 'startup', label: 'Startup' },
  { value: 'ngo-nonprofit', label: 'NGO/Nonprofit' },
  { value: 'government', label: 'Government' },
  { value: 'international-organization', label: 'International Organization' },
  { value: 'development-agency', label: 'Development Agency' },
  { value: 'financial-institution', label: 'Financial Institution' },
  { value: 'educational-institution', label: 'Educational Institution' },
  { value: 'healthcare-facility', label: 'Healthcare Facility' },
  { value: 'manufacturing', label: 'Manufacturing Company' },
  { value: 'trading-company', label: 'Trading Company' },
  { value: 'consulting-firm', label: 'Consulting Firm' },
  { value: 'media-company', label: 'Media Company' },
];

export const LANGUAGE_REQUIREMENTS = [
  { value: '', label: 'No Preference' },
  { value: 'english', label: 'English' },
  { value: 'french', label: 'French' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'swahili', label: 'Swahili' },
  { value: 'hausa', label: 'Hausa' },
  { value: 'yoruba', label: 'Yoruba' },
  { value: 'amharic', label: 'Amharic' },
  { value: 'multiple-languages', label: 'Multiple Languages' },
];

export const SALARY_CURRENCIES = [
  { value: '', label: 'All Currencies' },
  { value: 'usd', label: 'USD ($)' },
  { value: 'eur', label: 'EUR (€)' },
  { value: 'gbp', label: 'GBP (£)' },
  { value: 'cad', label: 'CAD (C$)' },
  { value: 'aud', label: 'AUD (A$)' },
  { value: 'zar', label: 'ZAR (R)' },
  { value: 'ngn', label: 'NGN (₦)' },
  { value: 'kes', label: 'KES (KSh)' },
  { value: 'ghs', label: 'GHS (₵)' },
  { value: 'egp', label: 'EGP (E£)' },
  { value: 'mad', label: 'MAD (د.م.)' },
  { value: 'tnd', label: 'TND (د.ت)' },
  { value: 'xof', label: 'XOF (CFA)' },
  { value: 'xaf', label: 'XAF (FCFA)' },
];

export const EDUCATION_LEVELS = [
  { value: '', label: 'All Education Levels' },
  { value: 'primary-school', label: 'Primary School' },
  { value: 'secondary-school', label: 'Secondary School' },
  { value: 'vocational-training', label: 'Vocational Training' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'bachelor-degree', label: 'Bachelor\'s Degree' },
  { value: 'master-degree', label: 'Master\'s Degree' },
  { value: 'phd', label: 'PhD' },
  { value: 'professional-certification', label: 'Professional Certification' },
  { value: 'international-qualification', label: 'International Qualification' },
  { value: 'african-university', label: 'African University' },
  { value: 'western-university', label: 'Western University' },
];

export const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'volunteer', label: 'Volunteer' },
];

export const SPECIAL_CONSIDERATIONS = [
  { value: 'diaspora-welcome', label: 'Diaspora Welcome' },
  { value: 'local-hire-preferred', label: 'Local Hire Preferred' },
  { value: 'expatriate-position', label: 'Expatriate Position' },
  { value: 'national-service', label: 'National Service' },
  { value: 'youth-program', label: 'Youth Program' },
  { value: 'women-encouraged', label: 'Women Encouraged' },
  { value: 'disability-friendly', label: 'Disability Friendly' },
  { value: 'relocation-assistance', label: 'Relocation Assistance' },
  { value: 'housing-provided', label: 'Housing Provided' },
  { value: 'transportation-provided', label: 'Transportation Provided' },
];

export const DATE_POSTED_OPTIONS = [
  { value: '', label: 'Anytime' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
  { value: '3months', label: 'Last 3 months' },
];
