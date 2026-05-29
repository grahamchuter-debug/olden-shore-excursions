export const siteRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  {
    path: "/excursions",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/excursions/briksdal-glacier-olden-lake",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/excursions/private-briksdal-glacier-olden-lake",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/excursions/loen-skylift-mount-hoven",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/excursions/olden-walking-tour",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/excursions/lakes-glaciers-waterfalls",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/olden-port-guide",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/one-day-in-olden",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/is-olden-worth-visiting",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/best-time-to-visit-olden",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
] as const;
