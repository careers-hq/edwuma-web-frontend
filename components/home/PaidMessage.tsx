'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { morningMessageService } from '@/lib/api/morningMessages';

export default function PaidMessage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') ?? searchParams.get('trxref');
  const [message, setMessage] = useState('Checking the payment.');

  useEffect(() => {
    if (!reference) {
      setMessage('The payment reference is missing.');
      return;
    }

    let cancelled = false;

    morningMessageService
      .confirm(reference)
      .then((response) => {
        if (!cancelled) {
          setMessage(
            response.data.paid_until
              ? 'This week is paid. The first morning arrives tomorrow.'
              : 'Payment is not confirmed yet.',
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMessage('The payment could not be confirmed.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [reference]);

  return <p className="mt-3 text-base text-gray-700">{message}</p>;
}
