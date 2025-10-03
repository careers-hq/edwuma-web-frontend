'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AfricanJobCard from '@/components/job/AfricanJobCard';
import { Button } from '@/components/ui/Button';
import AfricanJobFilters from '@/components/job/AfricanJobFilters';
import SimpleSearchBar from '@/components/ui/EnhancedSearchBar';
import HeroSection from '@/components/home/HeroSection';

interface AfricanJob {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  region: string;
  type: string;
  experience: string;
  postedAt: string;
  category: string;
  salary?: string;
  salaryCurrency?: string;
  description?: string;
  workMode: string;
  visaSponsorship?: string;
  languageRequirements?: string[];
  companyType: string;
  specialConsiderations?: string[];
}

// Comprehensive dummy data based on African Filter Strategy
const mockAfricanJobs: AfricanJob[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'MTN Ghana',
    location: 'Accra, Ghana',
    country: 'Ghana',
    region: 'west-africa',
    type: 'Full-Time',
    experience: 'senior',
    postedAt: '2024-01-15',
    category: 'information-technology',
    salary: '₵15,000 - ₵25,000',
    salaryCurrency: 'ghs',
    description: 'Lead development of mobile financial services platform for African markets...',
    workMode: 'hybrid',
    companyType: 'african-corporate',
    specialConsiderations: ['diaspora-welcome', 'relocation-assistance']
  },
  {
    id: '2',
    title: 'Agricultural Development Manager',
    company: 'Alliance for a Green Revolution in Africa',
    location: 'Nairobi, Kenya',
    country: 'Kenya',
    region: 'east-africa',
    type: 'Full-Time',
    experience: 'mid-level',
    postedAt: '2024-01-14',
    category: 'agriculture-agribusiness',
    salary: '$45,000 - $65,000',
    salaryCurrency: 'usd',
    description: 'Manage sustainable agriculture projects across East Africa...',
    workMode: 'field-work',
    companyType: 'development-agency',
    languageRequirements: ['english', 'swahili'],
    specialConsiderations: ['relocation-assistance', 'housing-provided']
  },
  {
    id: '3',
    title: 'Financial Technology Specialist',
    company: 'Flutterwave',
    location: 'Lagos, Nigeria',
    country: 'Nigeria',
    region: 'west-africa',
    type: 'Full-Time',
    experience: 'mid-level',
    postedAt: '2024-01-13',
    category: 'microfinance-fintech',
    salary: '₦8,000,000 - ₦12,000,000',
    salaryCurrency: 'ngn',
    description: 'Develop payment solutions for African SMEs and consumers...',
    workMode: 'remote',
    companyType: 'startup',
    languageRequirements: ['english', 'yoruba'],
    specialConsiderations: ['diaspora-welcome']
  },
  {
    id: '4',
    title: 'Mining Engineer',
    company: 'AngloGold Ashanti',
    location: 'Johannesburg, South Africa',
    country: 'South Africa',
    region: 'southern-africa',
    type: 'Full-Time',
    experience: 'senior',
    postedAt: '2024-01-12',
    category: 'mining-natural-resources',
    salary: 'R800,000 - R1,200,000',
    salaryCurrency: 'zar',
    description: 'Oversee gold mining operations and ensure safety compliance...',
    workMode: 'on-site',
    companyType: 'multinational',
    specialConsiderations: ['housing-provided', 'transportation-provided']
  },
  {
    id: '5',
    title: 'Renewable Energy Consultant',
    company: 'UNDP Africa',
    location: 'Addis Ababa, Ethiopia',
    country: 'Ethiopia',
    region: 'east-africa',
    type: 'Contract',
    experience: 'senior',
    postedAt: '2024-01-11',
    category: 'renewable-energy',
    salary: '$70,000 - $95,000',
    salaryCurrency: 'usd',
    description: 'Advise on solar and wind energy projects across Africa...',
    workMode: 'travel-required',
    companyType: 'international-organization',
    languageRequirements: ['english', 'amharic'],
    specialConsiderations: ['relocation-assistance', 'diaspora-welcome']
  },
  {
    id: '6',
    title: 'Telecommunications Network Engineer',
    company: 'Vodacom Tanzania',
    location: 'Dar es Salaam, Tanzania',
    country: 'Tanzania',
    region: 'east-africa',
    type: 'Full-Time',
    experience: 'mid-level',
    postedAt: '2024-01-10',
    category: 'telecommunications',
    salary: 'TSh 4,500,000 - TSh 7,500,000',
    salaryCurrency: 'tzs',
    description: 'Maintain and upgrade mobile network infrastructure...',
    workMode: 'on-site',
    companyType: 'african-corporate',
    languageRequirements: ['english', 'swahili']
  },
  {
    id: '7',
    title: 'Development Program Coordinator',
    company: 'World Bank Africa',
    location: 'Washington DC',
    country: 'United States',
    region: 'diaspora',
    type: 'Full-Time',
    experience: 'senior',
    postedAt: '2024-01-09',
    category: 'development-ngo',
    salary: '$85,000 - $120,000',
    salaryCurrency: 'usd',
    description: 'Coordinate development programs across multiple African countries...',
    workMode: 'hybrid',
    companyType: 'international-organization',
    visaSponsorship: 'us-visa-sponsorship',
    languageRequirements: ['english', 'french'],
    specialConsiderations: ['diaspora-welcome', 'relocation-assistance']
  },
  {
    id: '8',
    title: 'Microfinance Manager',
    company: 'Kiva',
    location: 'Kigali, Rwanda',
    country: 'Rwanda',
    region: 'east-africa',
    type: 'Full-Time',
    experience: 'mid-level',
    postedAt: '2024-01-08',
    category: 'microfinance-fintech',
    salary: '$35,000 - $50,000',
    salaryCurrency: 'usd',
    description: 'Manage microfinance operations and support local entrepreneurs...',
    workMode: 'on-site',
    companyType: 'ngo-nonprofit',
    languageRequirements: ['english', 'french'],
    specialConsiderations: ['relocation-assistance']
  },
  {
    id: '9',
    title: 'Export/Import Manager',
    company: 'Dangote Group',
    location: 'Lagos, Nigeria',
    country: 'Nigeria',
    region: 'west-africa',
    type: 'Full-Time',
    experience: 'senior',
    postedAt: '2024-01-07',
    category: 'export-import-trade',
    salary: '₦6,000,000 - ₦10,000,000',
    salaryCurrency: 'ngn',
    description: 'Manage international trade operations across Africa and Europe...',
    workMode: 'travel-required',
    companyType: 'african-corporate',
    languageRequirements: ['english', 'french'],
    specialConsiderations: ['relocation-assistance']
  },
  {
    id: '10',
    title: 'Healthcare Administrator',
    company: 'Partners in Health',
    location: 'Freetown, Sierra Leone',
    country: 'Sierra Leone',
    region: 'west-africa',
    type: 'Full-Time',
    experience: 'mid-level',
    postedAt: '2024-01-06',
    category: 'healthcare',
    salary: '$40,000 - $60,000',
    salaryCurrency: 'usd',
    description: 'Manage healthcare operations in underserved communities...',
    workMode: 'on-site',
    companyType: 'ngo-nonprofit',
    languageRequirements: ['english'],
    specialConsiderations: ['relocation-assistance', 'housing-provided']
  },
  {
    id: '11',
    title: 'Construction Project Manager',
    company: 'China Railway Construction Corporation',
    location: 'Abuja, Nigeria',
    country: 'Nigeria',
    region: 'west-africa',
    type: 'Full-Time',
    experience: 'senior',
    postedAt: '2024-01-05',
    category: 'construction-infrastructure',
    salary: '₦7,500,000 - ₦12,000,000',
    salaryCurrency: 'ngn',
    description: 'Manage major infrastructure development projects...',
    workMode: 'on-site',
    companyType: 'multinational',
    languageRequirements: ['english', 'chinese'],
    specialConsiderations: ['housing-provided', 'transportation-provided']
  },
  {
    id: '12',
    title: 'Aviation Operations Manager',
    company: 'Ethiopian Airlines',
    location: 'Addis Ababa, Ethiopia',
    country: 'Ethiopia',
    region: 'east-africa',
    type: 'Full-Time',
    experience: 'senior',
    postedAt: '2024-01-04',
    category: 'aviation',
    salary: 'ETB 180,000 - ETB 280,000',
    salaryCurrency: 'etb',
    description: 'Oversee flight operations and ensure safety standards...',
    workMode: 'on-site',
    companyType: 'african-corporate',
    languageRequirements: ['english', 'amharic'],
    specialConsiderations: ['relocation-assistance']
  },
  {
    id: '13',
    title: 'Maritime Logistics Coordinator',
    company: 'Maersk Line',
    location: 'Cape Town, South Africa',
    country: 'South Africa',
    region: 'southern-africa',
    type: 'Full-Time',
    experience: 'mid-level',
    postedAt: '2024-01-03',
    category: 'maritime-shipping',
    salary: 'R650,000 - R950,000',
    salaryCurrency: 'zar',
    description: 'Coordinate shipping operations across African ports...',
    workMode: 'on-site',
    companyType: 'multinational',
    languageRequirements: ['english'],
    specialConsiderations: ['relocation-assistance']
  },
  {
    id: '14',
    title: 'Government Policy Advisor',
    company: 'Ministry of Finance - Ghana',
    location: 'Accra, Ghana',
    country: 'Ghana',
    region: 'west-africa',
    type: 'Full-Time',
    experience: 'senior',
    postedAt: '2024-01-02',
    category: 'government-public-sector',
    salary: '₵12,000 - ₵18,000',
    salaryCurrency: 'ghs',
    description: 'Advise on economic policy and development strategies...',
    workMode: 'on-site',
    companyType: 'government',
    languageRequirements: ['english'],
    specialConsiderations: ['national-service']
  },
  {
    id: '15',
    title: 'Digital Marketing Specialist',
    company: 'Jumia',
    location: 'Cairo, Egypt',
    country: 'Egypt',
    region: 'north-africa',
    type: 'Full-Time',
    experience: 'junior',
    postedAt: '2024-01-01',
    category: 'marketing-advertising',
    salary: 'E£25,000 - E£40,000',
    salaryCurrency: 'egp',
    description: 'Drive digital marketing campaigns for e-commerce platform...',
    workMode: 'hybrid',
    companyType: 'startup',
    languageRequirements: ['english', 'arabic'],
    specialConsiderations: ['youth-program']
  },
  // Additional diverse jobs for comprehensive filtering
  {
    id: '16',
    title: 'Frontend Developer',
    company: 'Andela',
    location: 'Lagos, Nigeria',
    country: 'Nigeria',
    region: 'west-africa',
    type: 'Full-Time',
    experience: 'mid-level',
    postedAt: '2024-01-20',
    category: 'information-technology',
    salary: '$30,000 - $45,000',
    salaryCurrency: 'usd',
    description: 'Build user interfaces for global tech companies...',
    workMode: 'remote',
    companyType: 'startup',
    visaSponsorship: 'us-visa-sponsorship',
    languageRequirements: ['english'],
    specialConsiderations: ['diaspora-welcome']
  },
  {
    id: '17',
    title: 'Data Scientist',
    company: 'Microsoft Africa',
    location: 'Nairobi, Kenya',
    country: 'Kenya',
    region: 'east-africa',
    type: 'Full-Time',
    experience: 'senior',
    postedAt: '2024-01-19',
    category: 'information-technology',
    salary: '$60,000 - $90,000',
    salaryCurrency: 'usd',
    description: 'Develop AI solutions for African market challenges...',
    workMode: 'hybrid',
    companyType: 'multinational',
    languageRequirements: ['english'],
    specialConsiderations: ['diaspora-welcome', 'relocation-assistance']
  },
  {
    id: '18',
    title: 'Registered Nurse',
    company: 'Medecins Sans Frontieres',
    location: 'Bamako, Mali',
    country: 'Mali',
    region: 'west-africa',
    type: 'Contract',
    experience: 'mid-level',
    postedAt: '2024-01-18',
    category: 'healthcare',
    salary: '$35,000 - $50,000',
    salaryCurrency: 'usd',
    description: 'Provide medical care in conflict-affected areas...',
    workMode: 'field-work',
    companyType: 'ngo-nonprofit',
    languageRequirements: ['english', 'french'],
    specialConsiderations: ['relocation-assistance', 'housing-provided']
  },
  {
    id: '19',
    title: 'Investment Analyst',
    company: 'Standard Bank',
    location: 'Johannesburg, South Africa',
    country: 'South Africa',
    region: 'southern-africa',
    type: 'Full-Time',
    experience: 'entry-level',
    postedAt: '2024-01-17',
    category: 'finance-accounting',
    salary: 'R450,000 - R650,000',
    salaryCurrency: 'zar',
    description: 'Analyze investment opportunities across African markets...',
    workMode: 'on-site',
    companyType: 'african-corporate',
    languageRequirements: ['english'],
    specialConsiderations: ['youth-program']
  },
  {
    id: '20',
    title: 'UX Designer',
    company: 'Paystack',
    location: 'Lagos, Nigeria',
    country: 'Nigeria',
    region: 'west-africa',
    type: 'Full-Time',
    experience: 'mid-level',
    postedAt: '2024-01-16',
    category: 'information-technology',
    salary: '₦4,500,000 - ₦7,500,000',
    salaryCurrency: 'ngn',
    description: 'Design payment experiences for African businesses...',
    workMode: 'remote',
    companyType: 'startup',
    languageRequirements: ['english'],
    specialConsiderations: ['diaspora-welcome']
  },
  {
    id: '21',
    title: 'Agronomist',
    company: 'One Acre Fund',
    location: 'Kigali, Rwanda',
    country: 'Rwanda',
    region: 'east-africa',
    type: 'Full-Time',
    experience: 'mid-level',
    postedAt: '2024-01-15',
    category: 'agriculture-agribusiness',
    salary: '$25,000 - $40,000',
    salaryCurrency: 'usd',
    description: 'Improve farming techniques for smallholder farmers...',
    workMode: 'field-work',
    companyType: 'ngo-nonprofit',
    languageRequirements: ['english', 'french'],
    specialConsiderations: ['relocation-assistance', 'housing-provided']
  },
  {
    id: '22',
    title: 'DevOps Engineer',
    company: 'Interswitch',
    location: 'Lagos, Nigeria',
    country: 'Nigeria',
    region: 'west-africa',
    type: 'Full-Time',
    experience: 'senior',
    postedAt: '2024-01-14',
    category: 'information-technology',
    salary: '₦6,000,000 - ₦10,000,000',
    salaryCurrency: 'ngn',
    description: 'Manage cloud infrastructure for financial services...',
    workMode: 'hybrid',
    companyType: 'african-corporate',
    languageRequirements: ['english'],
    specialConsiderations: ['diaspora-welcome']
  },
  {
    id: '23',
    title: 'Public Health Specialist',
    company: 'WHO Africa',
    location: 'Brazzaville, Congo',
    country: 'Congo',
    region: 'central-africa',
    type: 'Contract',
    experience: 'senior',
    postedAt: '2024-01-13',
    category: 'healthcare',
    salary: '$55,000 - $80,000',
    salaryCurrency: 'usd',
    description: 'Develop public health policies for Central Africa...',
    workMode: 'travel-required',
    companyType: 'international-organization',
    languageRequirements: ['english', 'french'],
    specialConsiderations: ['relocation-assistance', 'diaspora-welcome']
  },
  {
    id: '24',
    title: 'Sales Manager',
    company: 'Safaricom',
    location: 'Nairobi, Kenya',
    country: 'Kenya',
    region: 'east-africa',
    type: 'Full-Time',
    experience: 'mid-level',
    postedAt: '2024-01-12',
    category: 'sales-marketing',
    salary: 'KSh 2,500,000 - KSh 4,000,000',
    salaryCurrency: 'kes',
    description: 'Drive sales growth for mobile financial services...',
    workMode: 'on-site',
    companyType: 'african-corporate',
    languageRequirements: ['english', 'swahili'],
    specialConsiderations: ['relocation-assistance']
  },
  {
    id: '25',
    title: 'Backend Developer',
    company: 'Twiga Foods',
    location: 'Nairobi, Kenya',
    country: 'Kenya',
    region: 'east-africa',
    type: 'Full-Time',
    experience: 'mid-level',
    postedAt: '2024-01-11',
    category: 'information-technology',
    salary: '$25,000 - $40,000',
    salaryCurrency: 'usd',
    description: 'Build supply chain management systems...',
    workMode: 'remote',
    companyType: 'startup',
    languageRequirements: ['english'],
    specialConsiderations: ['diaspora-welcome']
  },
  {
    id: '26',
    title: 'Environmental Consultant',
    company: 'African Development Bank',
    location: 'Abidjan, Cote d\'Ivoire',
    country: 'Cote d\'Ivoire',
    region: 'west-africa',
    type: 'Contract',
    experience: 'senior',
    postedAt: '2024-01-10',
    category: 'environmental-sustainability',
    salary: '$65,000 - $95,000',
    salaryCurrency: 'usd',
    description: 'Assess environmental impact of development projects...',
    workMode: 'travel-required',
    companyType: 'international-organization',
    languageRequirements: ['english', 'french'],
    specialConsiderations: ['relocation-assistance', 'diaspora-welcome']
  },
  {
    id: '27',
    title: 'Mobile App Developer',
    company: 'Cellulant',
    location: 'Lagos, Nigeria',
    country: 'Nigeria',
    region: 'west-africa',
    type: 'Full-Time',
    experience: 'junior',
    postedAt: '2024-01-09',
    category: 'information-technology',
    salary: '₦2,500,000 - ₦4,500,000',
    salaryCurrency: 'ngn',
    description: 'Develop mobile payment applications...',
    workMode: 'hybrid',
    companyType: 'startup',
    languageRequirements: ['english'],
    specialConsiderations: ['youth-program']
  },
  {
    id: '28',
    title: 'Operations Manager',
    company: 'DHL Africa',
    location: 'Cairo, Egypt',
    country: 'Egypt',
    region: 'north-africa',
    type: 'Full-Time',
    experience: 'senior',
    postedAt: '2024-01-08',
    category: 'logistics-transportation',
    salary: 'E£40,000 - E£60,000',
    salaryCurrency: 'egp',
    description: 'Manage logistics operations across North Africa...',
    workMode: 'on-site',
    companyType: 'multinational',
    languageRequirements: ['english', 'arabic'],
    specialConsiderations: ['relocation-assistance']
  },
  {
    id: '29',
    title: 'Content Writer',
    company: 'Andela',
    location: 'Kampala, Uganda',
    country: 'Uganda',
    region: 'east-africa',
    type: 'Part-Time',
    experience: 'entry-level',
    postedAt: '2024-01-07',
    category: 'marketing-advertising',
    salary: '$800 - $1,200',
    salaryCurrency: 'usd',
    description: 'Create technical content for developer community...',
    workMode: 'remote',
    companyType: 'startup',
    languageRequirements: ['english'],
    specialConsiderations: ['youth-program']
  },
  {
    id: '30',
    title: 'Cybersecurity Analyst',
    company: 'Dimension Data',
    location: 'Johannesburg, South Africa',
    country: 'South Africa',
    region: 'southern-africa',
    type: 'Full-Time',
    experience: 'mid-level',
    postedAt: '2024-01-06',
    category: 'information-technology',
    salary: 'R550,000 - R800,000',
    salaryCurrency: 'zar',
    description: 'Protect organizations from cyber threats...',
    workMode: 'hybrid',
    companyType: 'multinational',
    languageRequirements: ['english'],
    specialConsiderations: ['relocation-assistance']
  },
  {
    id: '31',
    title: 'Education Coordinator',
    company: 'UNICEF',
    location: 'Dakar, Senegal',
    country: 'Senegal',
    region: 'west-africa',
    type: 'Contract',
    experience: 'senior',
    postedAt: '2024-01-05',
    category: 'education',
    salary: '$50,000 - $75,000',
    salaryCurrency: 'usd',
    description: 'Improve educational outcomes in West Africa...',
    workMode: 'travel-required',
    companyType: 'international-organization',
    languageRequirements: ['english', 'french'],
    specialConsiderations: ['relocation-assistance', 'diaspora-welcome']
  },
  {
    id: '32',
    title: 'Product Manager',
    company: 'M-Pesa',
    location: 'Nairobi, Kenya',
    country: 'Kenya',
    region: 'east-africa',
    type: 'Full-Time',
    experience: 'senior',
    postedAt: '2024-01-04',
    category: 'information-technology',
    salary: 'KSh 3,500,000 - KSh 6,000,000',
    salaryCurrency: 'kes',
    description: 'Lead mobile money product development...',
    workMode: 'hybrid',
    companyType: 'african-corporate',
    languageRequirements: ['english', 'swahili'],
    specialConsiderations: ['diaspora-welcome']
  },
  {
    id: '33',
    title: 'Mechanical Engineer',
    company: 'Volkswagen South Africa',
    location: 'Port Elizabeth, South Africa',
    country: 'South Africa',
    region: 'southern-africa',
    type: 'Full-Time',
    experience: 'mid-level',
    postedAt: '2024-01-03',
    category: 'manufacturing',
    salary: 'R600,000 - R900,000',
    salaryCurrency: 'zar',
    description: 'Design and improve automotive manufacturing processes...',
    workMode: 'on-site',
    companyType: 'multinational',
    languageRequirements: ['english'],
    specialConsiderations: ['relocation-assistance']
  },
  {
    id: '34',
    title: 'Research Scientist',
    company: 'International Rice Research Institute',
    location: 'Abidjan, Cote d\'Ivoire',
    country: 'Cote d\'Ivoire',
    region: 'west-africa',
    type: 'Full-Time',
    experience: 'senior',
    postedAt: '2024-01-02',
    category: 'agriculture-agribusiness',
    salary: '$45,000 - $70,000',
    salaryCurrency: 'usd',
    description: 'Develop drought-resistant rice varieties...',
    workMode: 'field-work',
    companyType: 'international-organization',
    languageRequirements: ['english', 'french'],
    specialConsiderations: ['relocation-assistance', 'housing-provided']
  },
  {
    id: '35',
    title: 'Customer Success Manager',
    company: 'Zendesk',
    location: 'Cape Town, South Africa',
    country: 'South Africa',
    region: 'southern-africa',
    type: 'Full-Time',
    experience: 'mid-level',
    postedAt: '2024-01-01',
    category: 'customer-service',
    salary: 'R400,000 - R650,000',
    salaryCurrency: 'zar',
    description: 'Support African customers using Zendesk platform...',
    workMode: 'remote',
    companyType: 'multinational',
    languageRequirements: ['english'],
    specialConsiderations: ['diaspora-welcome']
  },
  {
    id: '36',
    title: 'Civil Engineer',
    company: 'China Civil Engineering Construction Corporation',
    location: 'Addis Ababa, Ethiopia',
    country: 'Ethiopia',
    region: 'east-africa',
    type: 'Full-Time',
    experience: 'senior',
    postedAt: '2023-12-31',
    category: 'construction-infrastructure',
    salary: 'ETB 200,000 - ETB 350,000',
    salaryCurrency: 'etb',
    description: 'Design and supervise road construction projects...',
    workMode: 'field-work',
    companyType: 'multinational',
    languageRequirements: ['english', 'chinese'],
    specialConsiderations: ['housing-provided', 'transportation-provided']
  },
  {
    id: '37',
    title: 'Business Development Manager',
    company: 'Mastercard Foundation',
    location: 'Accra, Ghana',
    country: 'Ghana',
    region: 'west-africa',
    type: 'Full-Time',
    experience: 'senior',
    postedAt: '2023-12-30',
    category: 'consulting',
    salary: '$70,000 - $100,000',
    salaryCurrency: 'usd',
    description: 'Develop partnerships for financial inclusion...',
    workMode: 'travel-required',
    companyType: 'international-organization',
    languageRequirements: ['english', 'french'],
    specialConsiderations: ['relocation-assistance', 'diaspora-welcome']
  },
  {
    id: '38',
    title: 'Quality Assurance Engineer',
    company: 'Interswitch',
    location: 'Lagos, Nigeria',
    country: 'Nigeria',
    region: 'west-africa',
    type: 'Full-Time',
    experience: 'mid-level',
    postedAt: '2023-12-29',
    category: 'information-technology',
    salary: '₦3,500,000 - ₦6,000,000',
    salaryCurrency: 'ngn',
    description: 'Ensure quality of payment processing systems...',
    workMode: 'hybrid',
    companyType: 'african-corporate',
    languageRequirements: ['english'],
    specialConsiderations: ['diaspora-welcome']
  },
  {
    id: '39',
    title: 'Human Resources Manager',
    company: 'Ecobank',
    location: 'Lome, Togo',
    country: 'Togo',
    region: 'west-africa',
    type: 'Full-Time',
    experience: 'senior',
    postedAt: '2023-12-28',
    category: 'human-resources',
    salary: '$40,000 - $65,000',
    salaryCurrency: 'usd',
    description: 'Manage HR operations across West African branches...',
    workMode: 'on-site',
    companyType: 'african-corporate',
    languageRequirements: ['english', 'french'],
    specialConsiderations: ['relocation-assistance']
  },
  {
    id: '40',
    title: 'Graphic Designer',
    company: 'Andela',
    location: 'Kigali, Rwanda',
    country: 'Rwanda',
    region: 'east-africa',
    type: 'Full-Time',
    experience: 'junior',
    postedAt: '2023-12-27',
    category: 'marketing-advertising',
    salary: '$15,000 - $25,000',
    salaryCurrency: 'usd',
    description: 'Create visual designs for tech companies...',
    workMode: 'remote',
    companyType: 'startup',
    languageRequirements: ['english'],
    specialConsiderations: ['youth-program']
  },
  {
    id: '41',
    title: 'Supply Chain Analyst',
    company: 'Shoprite',
    location: 'Cape Town, South Africa',
    country: 'South Africa',
    region: 'southern-africa',
    type: 'Full-Time',
    experience: 'entry-level',
    postedAt: '2023-12-26',
    category: 'logistics-transportation',
    salary: 'R350,000 - R500,000',
    salaryCurrency: 'zar',
    description: 'Optimize supply chain operations across Africa...',
    workMode: 'on-site',
    companyType: 'african-corporate',
    languageRequirements: ['english'],
    specialConsiderations: ['youth-program']
  },
  {
    id: '42',
    title: 'Software Architect',
    company: 'Microsoft Africa',
    location: 'Lagos, Nigeria',
    country: 'Nigeria',
    region: 'west-africa',
    type: 'Full-Time',
    experience: 'senior',
    postedAt: '2023-12-25',
    category: 'information-technology',
    salary: '$80,000 - $120,000',
    salaryCurrency: 'usd',
    description: 'Design scalable software solutions for African markets...',
    workMode: 'remote',
    companyType: 'multinational',
    visaSponsorship: 'us-visa-sponsorship',
    languageRequirements: ['english'],
    specialConsiderations: ['diaspora-welcome', 'relocation-assistance']
  },
  {
    id: '43',
    title: 'Community Health Worker',
    company: 'Partners in Health',
    location: 'Lilongwe, Malawi',
    country: 'Malawi',
    region: 'southern-africa',
    type: 'Full-Time',
    experience: 'entry-level',
    postedAt: '2023-12-24',
    category: 'healthcare',
    salary: '$12,000 - $18,000',
    salaryCurrency: 'usd',
    description: 'Provide basic healthcare services in rural communities...',
    workMode: 'field-work',
    companyType: 'ngo-nonprofit',
    languageRequirements: ['english'],
    specialConsiderations: ['housing-provided']
  },
  {
    id: '44',
    title: 'Marketing Manager',
    company: 'Jumia',
    location: 'Casablanca, Morocco',
    country: 'Morocco',
    region: 'north-africa',
    type: 'Full-Time',
    experience: 'mid-level',
    postedAt: '2023-12-23',
    category: 'marketing-advertising',
    salary: 'MAD 180,000 - MAD 280,000',
    salaryCurrency: 'mad',
    description: 'Lead marketing campaigns for North African markets...',
    workMode: 'hybrid',
    companyType: 'startup',
    languageRequirements: ['english', 'arabic', 'french'],
    specialConsiderations: ['relocation-assistance']
  },
  {
    id: '45',
    title: 'Database Administrator',
    company: 'Safaricom',
    location: 'Nairobi, Kenya',
    country: 'Kenya',
    region: 'east-africa',
    type: 'Full-Time',
    experience: 'senior',
    postedAt: '2023-12-22',
    category: 'information-technology',
    salary: 'KSh 3,000,000 - KSh 5,500,000',
    salaryCurrency: 'kes',
    description: 'Manage database systems for mobile financial services...',
    workMode: 'on-site',
    companyType: 'african-corporate',
    languageRequirements: ['english', 'swahili'],
    specialConsiderations: ['relocation-assistance']
  }
];

interface AfricanJobFilters {
  search: string;
  location: string;
  region: string;
  workMode: string;
  jobType: string[];
  experience: string;
  visaSponsorship: string;
  languageRequirements: string[];
  companyType: string;
  salaryCurrency: string;
  salaryRange: {
    min: number;
    max: number;
  };
  educationLevel: string;
  specialConsiderations: string[];
  jobCategories: string[];
  datePosted: string;
}

export default function AfricanJobsPage() {
  const [jobs] = useState<AfricanJob[]>(mockAfricanJobs);
  const [filteredJobs, setFilteredJobs] = useState<AfricanJob[]>(mockAfricanJobs);
  const [filters, setFilters] = useState<AfricanJobFilters>({
    search: '',
    location: '',
    region: '',
    workMode: '',
    jobType: [],
    experience: '',
    visaSponsorship: '',
    languageRequirements: [],
    companyType: '',
    salaryCurrency: '',
    salaryRange: { min: 0, max: 1000000 },
    educationLevel: '',
    specialConsiderations: [],
    jobCategories: [],
    datePosted: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const jobsPerPage = 6;

  // Filter jobs based on current filters
  useEffect(() => {
    let filtered = jobs;

    if (filters.search) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(job => job.location === filters.location);
    }

    if (filters.region) {
      filtered = filtered.filter(job => job.region === filters.region);
    }

    if (filters.workMode) {
      filtered = filtered.filter(job => job.workMode === filters.workMode);
    }

    if (filters.jobType && filters.jobType.length > 0) {
      filtered = filtered.filter(job => filters.jobType.includes(job.type));
    }

    if (filters.experience) {
      filtered = filtered.filter(job => job.experience === filters.experience);
    }

    if (filters.visaSponsorship) {
      filtered = filtered.filter(job => job.visaSponsorship === filters.visaSponsorship);
    }

    if (filters.languageRequirements && filters.languageRequirements.length > 0) {
      filtered = filtered.filter(job => 
        job.languageRequirements && 
        filters.languageRequirements.some(lang => job.languageRequirements!.includes(lang))
      );
    }

    if (filters.companyType) {
      filtered = filtered.filter(job => job.companyType === filters.companyType);
    }

    if (filters.salaryCurrency) {
      filtered = filtered.filter(job => job.salaryCurrency === filters.salaryCurrency);
    }

    if (filters.jobCategories && filters.jobCategories.length > 0) {
      filtered = filtered.filter(job => filters.jobCategories.includes(job.category));
    }

    if (filters.specialConsiderations && filters.specialConsiderations.length > 0) {
      filtered = filtered.filter(job => 
        job.specialConsiderations && 
        filters.specialConsiderations.some(consideration => 
          job.specialConsiderations!.includes(consideration)
        )
      );
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [filters, jobs]);

  const handleFiltersChange = (newFilters: AfricanJobFilters) => {
    setFilters(newFilters);
  };


  const handleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(jobId)) {
        newSaved.delete(jobId);
      } else {
        newSaved.add(jobId);
      }
      return newSaved;
    });
  };

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#244034] font-['Gordita'] mb-4">
            African Job Opportunities
          </h1>
          <p className="text-lg text-[rgba(0,0,0,0.7)]">
            Discover {filteredJobs.length} job opportunities across Africa and the diaspora
          </p>
        </div>

        {/* Simple Search Bar - Above Filters */}
        <div className="mb-6">
          <SimpleSearchBar
            value={filters.search}
            onChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
            onSearch={(query) => setFilters(prev => ({ ...prev, search: query }))}
            placeholder="Search job title, company, or keyword"
            className="mb-4"
          />
          
          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm font-medium text-primary">
              {filteredJobs.length} African job opportunities found
            </p>
          </div>
        </div>

        {/* African Job Filters - Below Search */}
        <div className="mb-6">
          <AfricanJobFilters
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
          />
        </div>

        {/* Jobs List */}
        {currentJobs.length > 0 ? (
          <div className="space-y-4">
            {currentJobs.map((job) => (
              <AfricanJobCard
                key={job.id}
                job={job}
                showDescription={true}
                onSave={handleSaveJob}
                isSaved={savedJobs.has(job.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#244034] mb-2">No jobs found</h3>
            <p className="text-[rgba(0,0,0,0.7)] mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="outline"
              onClick={() => setFilters({
                search: '',
                location: '',
                region: '',
                workMode: '',
                jobType: [],
                experience: '',
                visaSponsorship: '',
                languageRequirements: [],
                companyType: '',
                salaryCurrency: '',
                salaryRange: { min: 0, max: 1000000 },
                educationLevel: '',
                specialConsiderations: [],
                jobCategories: [],
                datePosted: '',
              })}
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
