'use client';

import React, { useEffect, useState } from 'react';
import MorningPreview from '@/components/home/MorningPreview';
import {
  morningMessageService,
  type MorningMessageKind,
  type MorningMessagePrice,
} from '@/lib/api/morningMessages';

const fieldClass =
  'h-10 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900';

function priceLabel(price: MorningMessagePrice | undefined): string {
  if (!price) {
    return '';
  }

  const amount = new Intl.NumberFormat('en').format(price.amount);
  return `${price.currency} ${amount} a week, on WhatsApp and by email.`;
}

const MorningMessageForm: React.FC<{ country: string }> = ({ country }) => {
  const [ready, setReady] = useState(false);
  const [kinds, setKinds] = useState<MorningMessageKind[]>([]);
  const [price, setPrice] = useState<MorningMessagePrice | undefined>();
  const [kind, setKind] = useState('');
  const [years, setYears] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    morningMessageService
      .options()
      .then((response) => {
        if (cancelled) {
          return;
        }

        setReady(response.data.ready);
        setKinds(response.data.kinds ?? []);
        setPrice(response.data.prices?.find((item) => item.slug === country));
      })
      .catch(() => {
        if (!cancelled) {
          setReady(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [country]);

  if (!ready) {
    return null;
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSaved(null);
    setIsSaving(true);

    try {
      const response = await morningMessageService.save({
        country,
        phone,
        email,
        first_name: firstName.trim() || undefined,
        kind_of_work: kind,
        years: Number(years),
      });

      if (response.data.checkout_url) {
        window.location.assign(response.data.checkout_url);
        return;
      }

      setSaved('Saved. The next morning uses this.');
    } catch (caught) {
      const message = caught && typeof caught === 'object' && 'message' in caught
        ? String(caught.message)
        : 'The week could not be started.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (saved) {
    return <p className="text-sm text-gray-900">{saved}</p>;
  }

  const yearsNumber = Number(years);
  const morningReady = kind !== '' && years !== '' && Number.isInteger(yearsNumber) && yearsNumber >= 0 && yearsNumber <= 40;

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="sr-only" htmlFor="kind-of-work">Kind of work</label>
      <select
        id="kind-of-work"
        name="kind_of_work"
        required
        value={kind}
        onChange={(event) => setKind(event.target.value)}
        className={fieldClass}
      >
        <option value="">Kind of work</option>
        {kinds.map((item) => (
          <option key={item.value} value={item.value}>{item.label}</option>
        ))}
      </select>
      <label className="sr-only" htmlFor="years">Years of experience</label>
      <input
        id="years"
        name="years"
        type="number"
        inputMode="numeric"
        min={0}
        max={40}
        required
        placeholder="Years you have worked"
        value={years}
        onChange={(event) => setYears(event.target.value)}
        className={fieldClass}
      />
      {morningReady ? (
        <div className="py-3">
          <MorningPreview country={country} kind={kind} years={yearsNumber} />
        </div>
      ) : null}
      {morningReady ? (
        <>
          <p className="text-sm leading-relaxed text-gray-700">
            {`${priceLabel(price)} An empty morning still counts. Reply STOP to end WhatsApp. The email has its own stop link.`}
          </p>
          <label className="sr-only" htmlFor="first-name">First name</label>
          <input
            id="first-name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            maxLength={40}
            placeholder="First name, if you want it on the message"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className={fieldClass}
          />
          <label className="sr-only" htmlFor="morning-email">Email</label>
          <input
            id="morning-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
          />
          <label className="sr-only" htmlFor="whatsapp-number">WhatsApp number</label>
          <input
            id="whatsapp-number"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="WhatsApp number"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={fieldClass}
          />
          <button
            type="submit"
            disabled={isSaving}
            className="h-10 w-full rounded-md bg-[#244034] px-4 text-sm font-medium text-white disabled:opacity-50 sm:w-auto"
          >
            Pay for this week
          </button>
        </>
      ) : null}
      {error ? <p className="text-sm text-gray-700">{error}</p> : null}
    </form>
  );
};

export default MorningMessageForm;
