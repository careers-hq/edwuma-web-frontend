import Link from 'next/link';

const POINTS = [
  {
    title: 'Discover hidden jobs',
    body: 'Employer pages, kept when the role is still open, someone where you live can apply, and nobody asks for a fee.',
    icon: 'search',
  },
  {
    title: 'Head start against the competition',
    body: 'The morning arrives on WhatsApp and by email, so you can apply before the day starts.',
    icon: 'bolt',
  },
  {
    title: 'More interviews, faster',
    body: 'You apply where the years fit, instead of sending the same CV to every post.',
    icon: 'reply',
  },
  {
    title: 'The jobs past these five',
    body: 'This page shows five. The morning is the rest that fit you.',
    icon: 'list',
  },
] as const;

function formatCount(value: number): string {
  return new Intl.NumberFormat('en').format(value);
}

function countLine(name: string, open: number, shown: number): string {
  const more = Math.max(0, open - shown);

  if (more === 1) {
    return `+1 more job open in ${name}`;
  }

  if (more > 1) {
    return `+${formatCount(more)} more jobs open in ${name}`;
  }

  if (open === 1) {
    return `1 job open in ${name}`;
  }

  if (open > 1) {
    return `${formatCount(open)} jobs open in ${name}`;
  }

  return `Nothing else open in ${name} today`;
}

function PointIcon({ name }: { name: (typeof POINTS)[number]['icon'] }) {
  const common = 'h-5 w-5';

  if (name === 'search') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="11" cy="11" r="6" />
        <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === 'bolt') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13 2L4 14h7l-1 8 10-14h-7l0-6z" />
      </svg>
    );
  }

  if (name === 'reply') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M5 6.5h14v8H8.5L5 17.5v-11z" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M8 7h12M8 12h12M8 17h12" strokeLinecap="round" />
      <path d="M4 7h.01M4 12h.01M4 17h.01" strokeLinecap="round" />
    </svg>
  );
}

const MorningPitch: React.FC<{
  country: string;
  name: string;
  open: number;
  shown: number;
}> = ({ country, name, open, shown }) => {
  return (
    <section className="mt-10 border-t border-gray-200 pt-10">
      <p className="text-center text-xl font-semibold tracking-tight text-gray-900">
        {countLine(name, open, shown)}
      </p>
      <div className="mt-6 rounded-xl border border-gray-200 px-4 py-6 sm:px-6">
        <h2 className="text-lg font-semibold text-gray-900">Get this each morning</h2>
        <ul className="mt-5 space-y-5">
          {POINTS.map((point) => (
            <li key={point.title} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-800">
                <PointIcon name={point.icon} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-gray-900">{point.title}</span>
                <span className="mt-0.5 block text-sm leading-6 text-gray-600">{point.body}</span>
              </span>
            </li>
          ))}
        </ul>
        <Link
          href={`/morning?country=${country}`}
          className="mt-6 flex h-11 w-full items-center justify-center rounded-md bg-[#244034] text-sm font-medium text-white"
        >
          Continue
        </Link>
      </div>
    </section>
  );
};

export default MorningPitch;
