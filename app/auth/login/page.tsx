'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Turnstile } from '@/components/ui/Turnstile';
import { useAuth } from '@/lib/auth';
import type { LoginRequest } from '@/lib/api';
import { processPostLoginRedirect } from '@/lib/utils/jobApplication';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
    remember_me: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check for password reset success
  useEffect(() => {
    if (searchParams.get('reset') === 'success') {
      setShowSuccessMessage(true);
      // Hide message after 10 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const redirect = processPostLoginRedirect();
      const rawReturnTo = searchParams.get('returnTo');
      const safeReturnTo = rawReturnTo && rawReturnTo.startsWith('/') && !rawReturnTo.startsWith('//') ? rawReturnTo : null;

      if (redirect.shouldRedirectToJob && redirect.jobUrl) {
        // Open the job application URL in a new tab
        window.open(redirect.jobUrl, '_blank', 'noopener,noreferrer');
        // Then redirect to dashboard
        router.push(redirect.dashboardUrl);
      } else if (safeReturnTo) {
        router.push(safeReturnTo);
      } else {
        router.push(redirect.dashboardUrl);
      }
    }
  }, [isAuthenticated, authLoading, router, searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
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

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // Add turnstile token to form data
      const loginData: LoginRequest = {
        ...formData,
        'cf-turnstile-response': turnstileToken,
      };
      
      await login(loginData);
      // Check if there's a job URL to redirect to after login
      const redirect = processPostLoginRedirect();
      const rawReturnTo = searchParams.get('returnTo');
      const safeReturnTo = rawReturnTo && rawReturnTo.startsWith('/') && !rawReturnTo.startsWith('//') ? rawReturnTo : null;

      if (redirect.shouldRedirectToJob && redirect.jobUrl) {
        // Open the job application URL in a new tab
        window.open(redirect.jobUrl, '_blank', 'noopener,noreferrer');
        // Then redirect to dashboard
        router.push(redirect.dashboardUrl);
      } else if (safeReturnTo) {
        router.push(safeReturnTo);
      } else {
        // Normal redirect to dashboard
        router.push(redirect.dashboardUrl);
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      
      // Handle different types of errors
      if (errorMessage.toLowerCase().includes('credential') || errorMessage.toLowerCase().includes('password') || errorMessage.toLowerCase().includes('unauthorized')) {
        setErrors({ general: 'Invalid email or password. Please try again.' });
      } else if (errorMessage.toLowerCase().includes('deactivated') || errorMessage.toLowerCase().includes('inactive')) {
        setErrors({ general: 'Your account has been deactivated. Please contact support.' });
      } else if (errorMessage.toLowerCase().includes('timeout')) {
        setErrors({ general: 'Request timed out. Please check your connection and try again.' });
      } else if (errorMessage.toLowerCase().includes('network')) {
        setErrors({ general: 'Network error. Please check your internet connection and try again.' });
      } else {
        // Display the actual error message from the API
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-[rgba(0,0,0,0.7)]">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="font-medium text-[#244034] hover:text-[#1a2f26] transition-colors underline"
            >
              Create account here
            </Link>
          </p>
        </div>

        {/* Password Reset Success Message */}
        {showSuccessMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md text-sm flex items-start">
            <svg className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">Password Reset Successful!</p>
              <p className="mt-1">Your password has been successfully reset. You can now log in with your new password.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowSuccessMessage(false)}
              className="ml-auto flex-shrink-0 text-green-600 hover:text-green-800"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold text-[#244034]">
              Login
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

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  placeholder="Enter your password"
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  style={{ top: 'calc(50% + 12px)' }} // Adjust for label height
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember_me"
                    type="checkbox"
                    checked={formData.remember_me}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#244034] focus:ring-[#244034] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-[rgba(0,0,0,0.7)]">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/auth/forgot-password"
                    className="font-medium text-[#244034] hover:text-[#1a2f26] transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

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
                loading={isSubmitting || authLoading}
                disabled={isSubmitting || authLoading}
              >
                Sign In
              </Button>
            </form>

            {/* Social Login */}
            {/* <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[rgba(0,0,0,0.7)]">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full hover:bg-gray-50">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="w-full hover:bg-gray-50">
                  <svg className="w-5 h-5 mr-2" fill="#0A66C2" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76 0-.97.78-1.76 1.75-1.76s1.75.79 1.75 1.76c0 .97-.78 1.76-1.75 1.76zm15.25 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.85-1.54 3.05 0 3.61 2.01 3.61 4.62v5.56z"/>
                  </svg>
                  LinkedIn
                </Button>
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
