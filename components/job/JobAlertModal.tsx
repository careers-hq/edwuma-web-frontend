'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { jobAlertsService } from '@/lib/api';
import type {
  CreateJobAlertRequest,
  JobAlertSubscription as JobAlertSubscriptionType,
  UpdateJobAlertRequest,
} from '@/lib/api';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';

interface JobAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'update';
  initialData?: Partial<JobAlertSubscriptionType>;
  onSuccess?: (subscription: JobAlertSubscriptionType) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  job_titles?: string;
  countries?: string;
  api?: string;
}

const COUNTRY_OPTIONS = ['Ghana', 'Kenya', 'Nigeria', 'South Africa'] as const;

const POPULAR_JOB_TITLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Product Manager',
  'Data Analyst',
  'DevOps Engineer',
  'UX Designer',
  'Project Manager',
  'Marketing Manager',
  'Sales Executive',
];

const MAX_SELECTION = 10;

const JobAlertModal: React.FC<JobAlertModalProps> = ({
  isOpen,
  onClose,
  mode = 'create',
  initialData,
  onSuccess,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>([]);
  const [jobTitleInput, setJobTitleInput] = useState('');
  const [jobTitleSelect, setJobTitleSelect] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setErrors({});

    if (initialData) {
      setName(initialData.name ?? '');
      setEmail(initialData.email ?? '');
      setSelectedJobTitles(initialData.job_titles ?? []);
      setSelectedCountries(initialData.countries ?? []);
      setJobTitleInput('');
      setJobTitleSelect('');
    } else {
      setSelectedJobTitles([]);
      setSelectedCountries([]);
      setJobTitleInput('');
      setJobTitleSelect('');
      if (!isAuthenticated) {
        setName('');
        setEmail('');
      }
    }
  }, [isOpen, initialData, isAuthenticated]);

  useEffect(() => {
    if (!isOpen || !isAuthenticated || !user) {
      return;
    }

    const profileFirst = user.profile?.first_name ?? user.first_name ?? '';
    const profileLast = user.profile?.last_name ?? user.last_name ?? '';
    const derivedName = [profileFirst, profileLast].filter(Boolean).join(' ').trim();

    if (!initialData?.name) {
      setName(derivedName || user.email || '');
    }
    if (!initialData?.email) {
      setEmail(user.email ?? '');
    }
  }, [isOpen, isAuthenticated, user, initialData]);

  const availableJobTitleOptions = useMemo(() => {
    return POPULAR_JOB_TITLES.filter(
      (title) => !selectedJobTitles.includes(title),
    );
  }, [selectedJobTitles]);

  const closeModal = () => {
    if (isSubmitting) return;
    onClose();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setSelectedCountries([]);
    setSelectedJobTitles([]);
    setJobTitleInput('');
    setJobTitleSelect('');
    setErrors({});
  };

  const addJobTitle = (title: string) => {
    const value = title.trim();
    if (!value) {
      return;
    }

    if (selectedJobTitles.includes(value)) {
      toast.error('Job title already selected.');
      return;
    }

    if (selectedJobTitles.length >= MAX_SELECTION) {
      toast.error(`You can select up to ${MAX_SELECTION} job titles.`);
      return;
    }

    setSelectedJobTitles((prev) => [...prev, value]);
    setJobTitleInput('');
    setJobTitleSelect('');
  };

  const removeJobTitle = (title: string) => {
    setSelectedJobTitles((prev) => prev.filter((item) => item !== title));
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((item) => item !== country)
        : [...prev, country],
    );
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (selectedJobTitles.length === 0) {
      newErrors.job_titles = 'Select at least one job title.';
    }

    if (selectedCountries.length === 0) {
      newErrors.countries = 'Select at least one country.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const createPayload: CreateJobAlertRequest = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      job_titles: selectedJobTitles.map((title) => title.trim()),
      countries: selectedCountries,
    };

    const updatePayload: UpdateJobAlertRequest = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      job_titles: selectedJobTitles.map((title) => title.trim()),
      countries: selectedCountries,
    };

    try {
      const response =
        mode === 'update'
          ? await jobAlertsService.updateMine(updatePayload)
          : await jobAlertsService.create(createPayload);

      if (response.success) {
        toast.success(
          response.message ?? (mode === 'update' ? 'Job alert updated successfully!' : 'Job alert created successfully!')
        );
        if (response.data?.subscription && onSuccess) {
          onSuccess(response.data.subscription);
        }
        if (mode === 'create') {
          resetForm();
        }
        onClose();
      } else {
        toast.error(response.message ?? 'Unable to process job alert.');
      }
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'errors' in error &&
        error.errors
      ) {
        const apiErrors = error.errors as Record<string, string[]>;
        const newErrors: FormErrors = {};
        Object.entries(apiErrors).forEach(([field, messages]) => {
          if (messages.length > 0) {
            newErrors[field as keyof FormErrors] = messages[0];
          }
        });
        setErrors(newErrors);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const submitLabel = mode === 'update' ? 'Update Job Alert' : 'Create Job Alert';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white text-[#244034] shadow-2xl">
        <div className="flex items-start justify-between bg-[#244034] px-6 py-4 text-white">
          <div className="pr-8">
            <h2 className="text-xl font-semibold">
              Receive weekly emails for new remote jobs
            </h2>
            <p className="mt-1 text-sm text-white/80">
              Subscribe to personalized job alerts and get opportunities every
              Friday at 12:00 GMT.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
            onClick={closeModal}
            aria-label="Close job alert modal"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#244034]/70">
                Your Name
              </label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Name"
                disabled={isSubmitting || (isAuthenticated && !!user)}
              />
              {errors.name && (
                <p className="mt-2 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#244034]/70">
                Email
              </label>
              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                type="email"
                disabled={isSubmitting || (isAuthenticated && !!user)}
              />
              {errors.email && (
                <p className="mt-2 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-3 rounded-xl bg-[#f0f7f4] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#244034]">
              Filters (optional)
            </p>

            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Job Titles
                  </label>
                  <span className="text-xs text-[#244034]/70">
                    {selectedJobTitles.length}/{MAX_SELECTION} selected
                  </span>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <select
                      className="w-full rounded-md border border-[#cbd5d1] bg-white px-3 py-2 text-sm text-[#244034] outline-none transition focus:border-[#244034] focus:ring-2 focus:ring-[#d2f34c]/60"
                      value={jobTitleSelect}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value) {
                          addJobTitle(value);
                        }
                      }}
                      disabled={isSubmitting || availableJobTitleOptions.length === 0}
                    >
                      <option value="">Select popular job titles</option>
                      {availableJobTitleOptions.map((title) => (
                        <option key={title} value={title}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <Input
                        value={jobTitleInput}
                        onChange={(event) => setJobTitleInput(event.target.value)}
                        placeholder="Type a custom job title"
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            addJobTitle(jobTitleInput);
                          }
                        }}
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => addJobTitle(jobTitleInput)}
                        disabled={isSubmitting || !jobTitleInput.trim()}
                        className="whitespace-nowrap"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {selectedJobTitles.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedJobTitles.map((title) => (
                      <span
                        key={title}
                        className="flex items-center gap-2 rounded-full bg-[#d2f34c] px-3 py-1 text-xs text-[#244034] font-medium"
                      >
                        {title}
                        <button
                          type="button"
                          onClick={() => removeJobTitle(title)}
                          className="text-[#244034]/70 transition hover:text-[#244034]"
                          aria-label={`Remove ${title}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {errors.job_titles && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.job_titles}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Countries
                </label>
                <div className="flex flex-wrap gap-2">
                  {COUNTRY_OPTIONS.map((country) => {
                    const isSelected = selectedCountries.includes(country);
                    return (
                      <button
                        type="button"
                        key={country}
                        onClick={() => toggleCountry(country)}
                        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                          isSelected
                            ? 'border-transparent bg-[#244034] text-white shadow'
                            : 'border-[#244034]/30 bg-white text-[#244034] hover:border-[#244034]'
                        }`}
                        disabled={isSubmitting}
                      >
                        {country}
                        {isSelected && (
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.countries && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.countries}
                  </p>
                )}
              </div>
            </div>
          </div>

          {errors.api && (
            <div className="rounded-md border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errors.api}
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl bg-[#f0f7f4] px-4 py-3">
            <div className="flex items-center gap-3">
              {/* <div className="flex -space-x-2">
                <img
                  src="https://i.pravatar.cc/40?img=30"
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-white"
                />
                <img
                  src="https://i.pravatar.cc/40?img=31"
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-white"
                />
                <img
                  src="https://i.pravatar.cc/40?img=32"
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-white"
                />
                <img
                  src="https://i.pravatar.cc/40?img=33"
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-white"
                />
              </div> */}
              <div>
                <p className="text-sm font-medium">
                  Join thousands of job seekers
                </p>
                <p className="text-xs text-[#244034]/70">
                  Get curated alerts every Friday at 12:00 GMT.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="px-6"
              >
                {isSubmitting ? 'Saving...' : submitLabel}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobAlertModal;

