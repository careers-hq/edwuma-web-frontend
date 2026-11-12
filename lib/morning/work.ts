export const STAGES = [
  { years: 0, label: 'Just starting' },
  { years: 3, label: 'A few years in' },
  { years: 10, label: 'Well along' },
] as const;

export const KINDS = [
  { value: 'administration', label: 'Administration' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'construction', label: 'Construction' },
  { value: 'education', label: 'Education' },
  { value: 'energy', label: 'Energy' },
  { value: 'finance', label: 'Finance' },
  { value: 'government', label: 'Government' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'human-resources', label: 'Human resources' },
  { value: 'international-development', label: 'International development' },
  { value: 'legal', label: 'Legal' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'media', label: 'Media' },
  { value: 'mining', label: 'Mining' },
  { value: 'non-profit', label: 'Non-profit' },
  { value: 'retail', label: 'Sales and retail' },
  { value: 'technology', label: 'Technology' },
  { value: 'telecommunications', label: 'Telecommunications' },
  { value: 'transportation', label: 'Transport' },
] as const;

export function stageLabel(years: number | null | undefined): string {
  const match = STAGES.find((stage) => stage.years === years);
  if (match) return match.label;
  if (years == null) return '';
  return years === 1 ? '1 year' : `${years} years`;
}

export function kindLabelList(value: string | null | undefined): string {
  if (!value) return '';

  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => KINDS.find((kind) => kind.value === part)?.label ?? part)
    .join(', ');
}
