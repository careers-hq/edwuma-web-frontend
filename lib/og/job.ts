interface ShareLocation {
  city?: string | null;
  name?: string | null;
  country?: string | null;
}

interface ShareJob {
  companies?: { name?: string | null }[] | null;
  locations?: ShareLocation[] | null;
  work_mode?: { value?: string | null } | null;
}

function placeOf(location?: ShareLocation | null): string | null {
  if (!location) {
    return null;
  }

  const city = location.city?.trim() || null;
  const country = location.country?.trim() || null;
  const name = location.name?.trim() || null;

  if (city && country && city.toLowerCase() !== country.toLowerCase()) {
    return `${city}, ${country}`;
  }

  return country || city || name;
}

export function jobShareTitle(title: string, company?: string | null): string {
  const name = company?.trim();
  if (!name) {
    return title;
  }

  const suffix = ` at ${name}`;
  if (title.toLowerCase().endsWith(suffix.toLowerCase())) {
    return title.slice(0, -suffix.length).trim() || title;
  }

  return title;
}

export function jobShareLine(job: ShareJob): string {
  const company = job.companies?.[0]?.name?.trim() || null;
  const place = placeOf(job.locations?.[0]);
  const remote = job.work_mode?.value === 'remote' ? 'Remote' : null;

  return [company, place, remote].filter(Boolean).join(' · ');
}
