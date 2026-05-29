import Link from "next/link";

import { siteConfig } from "@/lib/site-config";
import { siteNavLinks } from "@/lib/site-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6 sm:py-2.5">
        <Link
          href="/"
          className="text-sm font-bold tracking-tight sm:text-lg"
        >
          {siteConfig.name}
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-5 lg:flex"
        >
          {siteNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/85 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href={siteConfig.shoreExcursionsPath}
          className="btn-primary px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm"
        >
          Book a Tour
        </Link>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="border-t border-white/10 lg:hidden"
      >
        <ul className="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-4 py-1.5 sm:gap-2 sm:px-6 sm:py-2">
          {siteNavLinks.map((link) => (
            <li key={link.href} className="shrink-0">
              <Link
                href={link.href}
                className="block rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white/85 transition hover:text-white sm:px-3 sm:py-1 sm:text-xs"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
