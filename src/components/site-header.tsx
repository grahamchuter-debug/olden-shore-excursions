"use client";

import Link from "next/link";
import { useState } from "react";

import { siteConfig } from "@/lib/site-config";
import { siteNavLinks } from "@/lib/site-nav";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <Link
          href="/"
          className="min-w-0 truncate pr-2 text-base font-semibold tracking-tight sm:text-lg"
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

        <div className="flex items-center gap-2">
          <Link
            href={siteConfig.shoreExcursionsPath}
            className="btn-primary hidden text-xs sm:inline-flex sm:text-sm"
          >
            Explore excursions
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-white/20 text-sm lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile navigation"
        className={`${open ? "block" : "hidden"} border-t border-white/10 lg:hidden`}
      >
        <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
          {siteNavLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex min-h-11 items-center text-sm font-medium text-white/90"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={siteConfig.shoreExcursionsPath}
              className="btn-primary mt-2 w-full justify-center text-sm"
              onClick={() => setOpen(false)}
            >
              Explore excursions
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
