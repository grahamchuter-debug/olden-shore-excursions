import Link from "next/link";

type TourCardProps = {
  href: string;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  badge?: string;
};

export function TourCard({
  href,
  image,
  imageAlt,
  title,
  description,
  badge,
}: TourCardProps) {
  return (
    <article className="tour-card group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_24px_-4px_rgba(10,31,51,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--norway-blue)]/30 hover:shadow-[0_12px_32px_-8px_rgba(74,158,196,0.25)]">
      <div className="relative h-52 w-full shrink-0 overflow-hidden bg-slate-100 sm:h-56">
        <img
          src={image}
          alt={imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[rgba(10,31,51,0.35)] via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40"
          aria-hidden="true"
        />
        {badge ? (
          <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-[var(--norway-blue)]/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm backdrop-blur-sm">
            {badge}
          </span>
        ) : null}
        <div
          className="accent-bar-blue absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
          aria-hidden="true"
        />
        <div
          className="accent-bar-blue absolute bottom-0 left-0 h-1 w-full opacity-40"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-1 flex-col border-t border-slate-100 p-5 md:p-6">
        <h3 className="mb-2 text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-[var(--norway-blue)]">
          {title}
        </h3>

        <p className="mb-5 flex-1 text-sm leading-6 text-slate-600">
          {description}
        </p>

        <Link
          href={href}
          className="btn-primary-on-light w-fit transition-transform group-hover:scale-[1.02]"
        >
          View Tour
        </Link>
      </div>
    </article>
  );
}
