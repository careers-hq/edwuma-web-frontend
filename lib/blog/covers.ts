const COVERS: Record<string, string> = {
  'land-a-role-across-africa': '/images/blog/land-a-role-across-africa.jpg',
  'search-on-edwuma-without-opening-every-listing': '/images/blog/search-on-edwuma-without-opening-every-listing.jpg',
  'hiring-signals-2026': '/images/blog/hiring-signals-2026.jpg',
  'weekly-job-alert-worth-opening': '/images/blog/weekly-job-alert-worth-opening.jpg',
  'resume-that-gets-read': '/images/blog/resume-that-gets-read.jpg',
  'when-apply-opens-another-website': '/images/blog/when-apply-opens-another-website.jpg',
  'interview-questions-worth-preparing': '/images/blog/interview-questions-worth-preparing.jpg',
  'save-a-shortlist-before-you-apply': '/images/blog/save-a-shortlist-before-you-apply.jpg',
  'how-to-read-a-job-listing': '/images/blog/how-to-read-a-job-listing.jpg',
  'salary-conversations-that-stay-specific': '/images/blog/salary-conversations-that-stay-specific.jpg',
  'remote-work-across-african-hours': '/images/blog/remote-work-across-african-hours.jpg',
  'show-the-work-for-a-technology-role': '/images/blog/show-the-work-for-a-technology-role.jpg',
  'operations-and-finance-show-judgment': '/images/blog/operations-and-finance-show-judgment.jpg',
  'a-cover-note-that-names-the-job': '/images/blog/a-cover-note-that-names-the-job.jpg',
  'one-page-cv-early-career': '/images/blog/one-page-cv-early-career.jpg',
  'portfolio-links-recruiters-open': '/images/blog/portfolio-links-recruiters-open.jpg',
  'questions-worth-asking-at-the-end': '/images/blog/questions-worth-asking-at-the-end.jpg',
  'panel-interviews-and-take-home-tasks': '/images/blog/panel-interviews-and-take-home-tasks.jpg',
  'how-to-follow-up-after-you-apply': '/images/blog/how-to-follow-up-after-you-apply.jpg',
  'notice-periods-and-start-dates': '/images/blog/notice-periods-and-start-dates.jpg',
  'changing-fields-without-erasing-your-history': '/images/blog/changing-fields-without-erasing-your-history.jpg',
  'the-first-month-in-a-new-role': '/images/blog/the-first-month-in-a-new-role.jpg',
  'introductions-when-you-know-no-one': '/images/blog/introductions-when-you-know-no-one.jpg',
  'right-to-work-and-location-answers': '/images/blog/right-to-work-and-location-answers.jpg',
  'what-changes-between-four-job-markets': '/images/blog/what-changes-between-four-job-markets.jpg',
};

export const EDWUMA_TEAM_ICON = '/images/edwuma-team-icon.svg';

export const BLOG_COVER_WIDTH = 1280;
export const BLOG_COVER_HEIGHT = 720;

export function blogCoverImage(
  slug: string,
  imageUrl: string | null | undefined,
  alt: string,
  baseUrl: string,
) {
  const src = blogCoverSrc(slug, imageUrl);
  if (!src) {
    return null;
  }

  const local = src.startsWith('/');

  return {
    url: local ? `${baseUrl}${src}` : src,
    alt,
    ...(local
      ? { width: BLOG_COVER_WIDTH, height: BLOG_COVER_HEIGHT, type: 'image/jpeg' as const }
      : {}),
  };
}

export function blogCoverSrc(slug: string, imageUrl?: string | null): string | null {
  if (imageUrl) {
    return imageUrl;
  }

  return COVERS[slug] ?? null;
}

export function authorAvatarSrc(name: string, avatarUrl?: string | null): string | null {
  if (name.trim().toLowerCase() === 'edwuma team') {
    return EDWUMA_TEAM_ICON;
  }

  return avatarUrl || null;
}
