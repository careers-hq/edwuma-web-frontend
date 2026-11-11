'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { jobsApiService } from '@/lib/api/jobs';
import { Turnstile, type TurnstileHandle } from '@/components/ui/Turnstile';

const REASONS = [
  { value: 'no_longer_open', label: 'No longer open' },
  { value: 'wrong_link_or_company', label: 'Wrong company or link' },
  { value: 'asks_for_payment', label: 'Asks for a fee' },
  { value: 'not_open_here', label: 'Not open in this country' },
  { value: 'something_else', label: 'Something else' },
] as const;

type Reason = (typeof REASONS)[number]['value'];

const ReportProblem: React.FC<{ jobId: string }> = ({ jobId }) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [reason, setReason] = useState<Reason | null>(null);
  const [note, setNote] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const noteRequired = reason === 'something_else';
  const canSend = reason !== null && (!noteRequired || note.trim().length > 0) && (!siteKey || turnstileToken.length > 0);

  const close = () => {
    if (isSending) {
      return;
    }

    setOpen(false);
  };

  const submit = async () => {
    if (!reason || !canSend) {
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      await jobsApiService.reportProblem(jobId, reason, note.trim() || null, turnstileToken || undefined);
      setSent(true);
      setOpen(false);
    } catch {
      setError('Could not send the report.');
      turnstileRef.current?.reset();
      setTurnstileToken('');
    } finally {
      setIsSending(false);
    }
  };

  if (sent) {
    return <p className="mt-12 text-sm text-gray-500">Sent.</p>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-12 text-sm text-gray-500 underline underline-offset-4"
      >
        Report a problem
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={close}>
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg outline-none"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id={titleId} className="!text-lg font-semibold !leading-6 !text-gray-900">
                Report a problem with this job
              </h2>
              <button type="button" onClick={close} aria-label="Close" className="text-xl leading-none text-gray-500">
                ×
              </button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {REASONS.map((item) => {
                const selected = reason === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setReason(item.value)}
                    className={
                      selected
                        ? 'rounded-full border border-[#244034] bg-[#244034] px-3 py-1.5 text-sm text-white'
                        : 'rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-900'
                    }
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="Anything else we should know?"
              className="mt-5 w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#244034]"
            />
            {siteKey ? (
              <div className="mt-4">
                <Turnstile
                  ref={turnstileRef}
                  onSuccess={setTurnstileToken}
                  onError={() => setTurnstileToken('')}
                  onExpire={() => setTurnstileToken('')}
                />
              </div>
            ) : null}
            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={close}
                className="inline-flex h-10 items-center rounded-md bg-gray-100 px-4 text-sm font-medium text-gray-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={!canSend || isSending}
                className="inline-flex h-10 items-center rounded-md bg-[#244034] px-4 text-sm font-medium text-white disabled:opacity-50"
              >
                {isSending ? 'Sending' : 'Send report'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ReportProblem;
