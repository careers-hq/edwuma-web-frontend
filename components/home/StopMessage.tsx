'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { morningMessageService } from '@/lib/api/morningMessages';

export default function StopMessage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState('Stopping the emails.');

  useEffect(() => {
    if (!token) {
      setMessage('This stop link is missing its token.');
      return;
    }

    let cancelled = false;

    morningMessageService
      .unsubscribe(token)
      .then(() => {
        if (!cancelled) {
          setMessage('These emails have stopped. WhatsApp continues until you reply STOP, for the week already paid.');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMessage('This stop link could not be used.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return <p className="mt-3 text-base text-gray-700">{message}</p>;
}
