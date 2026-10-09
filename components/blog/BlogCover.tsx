import Link from 'next/link';

interface BlogCoverProps {
  title: string;
  category: string;
  imageUrl?: string | null;
  className?: string;
}

export default function BlogCover({ title, category, imageUrl, className = '' }: BlogCoverProps) {
  if (imageUrl) {
    return (
      // Remote covers are authored in the API and are not limited to the Next image allowlist.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt=""
        className={`w-full object-cover bg-[#244034] ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-end bg-[#244034] ${className}`}
      role="img"
      aria-label={title}
    >
      <span className="m-6 inline-flex rounded-full bg-[#d2f34c] px-3 py-1 text-sm font-medium text-[#244034]">
        {category}
      </span>
    </div>
  );
}
