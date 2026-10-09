interface AuthorAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md';
}

export default function AuthorAvatar({ name, avatarUrl, size = 'md' }: AuthorAvatarProps) {
  const dimension = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'E';

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt=""
        className={`${dimension} rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      className={`${dimension} rounded-full bg-[#244034] text-white inline-flex items-center justify-center font-semibold`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
