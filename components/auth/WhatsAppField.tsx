'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CALLING_CODES, MORNING_COUNTRIES, type MorningCountrySlug } from '@/lib/morning/countries';

interface WhatsAppFieldProps {
  country: MorningCountrySlug;
  number: string;
  onCountry: (country: MorningCountrySlug) => void;
  onNumber: (number: string) => void;
  error?: string;
}

const WhatsAppField: React.FC<WhatsAppFieldProps> = ({ country, number, onCountry, onNumber, error }) => {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const dial = CALLING_CODES[country];

  useEffect(() => {
    if (!open) {
      return;
    }

    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div ref={root} className="relative">
      <label htmlFor="whatsapp-number" className="mb-2 block text-sm font-medium text-[#244034]">
        WhatsApp number
      </label>
      <div className={`flex h-10 rounded-md border bg-white ${error ? 'border-red-500' : 'border-gray-300 focus-within:border-[#244034] focus-within:ring-2 focus-within:ring-[#244034]/20'}`}>
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label="Country code"
          onClick={() => setOpen((current) => !current)}
          className="flex shrink-0 items-center gap-1.5 border-r border-gray-300 px-2.5 text-sm text-[#141414]"
        >
          <img
            src={`https://flagcdn.com/w40/${dial.iso.toLowerCase()}.png`}
            alt=""
            width={20}
            height={15}
            className="h-[15px] w-5 rounded-sm object-cover"
          />
          <span>+{dial.dial}</span>
        </button>
        <input
          id="whatsapp-number"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={number}
          onChange={(event) => onNumber(event.target.value)}
          placeholder={dial.example}
          className="min-w-0 flex-1 bg-transparent px-3 text-sm text-[rgba(0,0,0,0.7)] outline-none placeholder:text-gray-400"
        />
      </div>
      {open ? (
        <ul role="listbox" aria-label="Country code" className="absolute z-20 mt-1 w-56 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {MORNING_COUNTRIES.map((item) => {
            const itemDial = CALLING_CODES[item.slug];
            const selected = item.slug === country;

            return (
              <li key={item.slug}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onCountry(item.slug);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#141414] hover:bg-[#F4F2EE] ${selected ? 'bg-[#F4F2EE]' : ''}`}
                >
                  <img
                    src={`https://flagcdn.com/w40/${itemDial.iso.toLowerCase()}.png`}
                    alt=""
                    width={20}
                    height={15}
                    className="h-[15px] w-5 rounded-sm object-cover"
                  />
                  <span className="flex-1">{item.name}</span>
                  <span className="text-black/45">+{itemDial.dial}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
      {error ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : (
        <p className="mt-1 text-sm text-gray-500">The list is sent to this number.</p>
      )}
    </div>
  );
};

export default WhatsAppField;
