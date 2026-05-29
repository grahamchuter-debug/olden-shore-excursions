type PageHeroProps = {
  image: string;
  imageAlt: string;
  children: React.ReactNode;
  centered?: boolean;
  compact?: boolean;
  overlay?: "default" | "light";
  className?: string;
};

export function PageHero({
  image,
  imageAlt,
  children,
  centered = false,
  compact = false,
  overlay = "default",
  className = "",
}: PageHeroProps) {
  const overlayClass =
    overlay === "light" ? "page-hero-overlay-light" : "page-hero-overlay";
  const paddingClass = compact
    ? "px-4 py-10 sm:px-6 sm:py-14 md:py-16"
    : "px-4 py-16 sm:px-6 sm:py-20 md:py-24";

  return (
    <section
      role="img"
      aria-label={imageAlt}
      className={`page-hero relative ${className}`}
      style={{ backgroundImage: `url('${image}')` }}
    >
      <div className={overlayClass}>
        <div
          className={`hero-content mx-auto max-w-6xl ${paddingClass} ${
            centered ? "text-center" : ""
          }`}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
