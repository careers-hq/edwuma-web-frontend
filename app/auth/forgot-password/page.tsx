'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Turnstile } from '@/components/ui/Turnstile';
import type { ForgotPasswordRequest } from '@/lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<ForgotPasswordRequest>({
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!turnstileToken && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      newErrors.turnstile = 'Please complete the security verification';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    
    try {
      // TODO: Implement actual forgot password API call
      const requestData: ForgotPasswordRequest = {
        ...formData,
        'cf-turnstile-response': turnstileToken,
      };
      
      console.log('Forgot password request:', requestData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
    } catch (error: unknown) {
      console.error('Forgot password error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset link. Please try again.';
      
      if (errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('email')) {
        setErrors({ email: 'No account found with this email address.' });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/images/logo/logo_03.png"
                alt="Edwuma Logo"
                width={150}
                height={50}
                className="mx-auto"
              />
            </Link>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#00bf58] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#244034] mb-4">Check Your Email</h2>
                <p className="text-[rgba(0,0,0,0.7)] mb-6">
                  We&apos;ve sent a password reset link to <strong>{formData.email}</strong>
                </p>
                <p className="text-sm text-[rgba(0,0,0,0.7)] mb-6">
                  Click the link in the email to reset your password. If you don&apos;t see it, check your spam folder.
                </p>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => router.push('/auth/login')}
                  >
                    Back to Login
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({ email: '' });
                      setTurnstileToken('');
                    }}
                  >
                    Resend Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/assets/images/logo/logo_03.png"
              alt="Edwuma Logo"
              width={150}
              height={50}
              className="mx-auto"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-[#244034]">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-[rgba(0,0,0,0.7)]">
            No worries! Enter your email and we&apos;ll send you reset instructions.
          </p>
        </div>

        {/* Forgot Password Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold text-[#244034]">
              Reset Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {errors.general}
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="Enter your email"
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
              />

              {/* Cloudflare Turnstile */}
              <Turnstile
                onSuccess={(token) => {
                  setTurnstileToken(token);
                  setErrors(prev => ({ ...prev, turnstile: '' }));
                }}
                onError={() => setTurnstileToken('')}
                onExpire={() => setTurnstileToken('')}
              />
              {errors.turnstile && (
                <p className="text-sm text-red-600 -mt-4">{errors.turnstile}</p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Send Reset Link
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-[#244034] hover:text-[#1a2f26] transition-colors"
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

