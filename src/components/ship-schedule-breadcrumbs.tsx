import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type ShipScheduleBreadcrumbsProps = {
  items: readonly BreadcrumbItem[];
};

export function ShipScheduleBreadcrumbs({
  items,
}: ShipScheduleBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-slate-200 bg-surface-muted">
      <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-1 px-4 py-3 text-sm text-slate-600 sm:px-6">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden="true" className="text-slate-400">
                  →
                </span>
              ) : null}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "font-medium text-slate-900" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="content-link font-medium">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
