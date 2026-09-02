import {
  getOldenMonthSummaries,
  shipScheduleHubPath,
  shipScheduleMonthPath,
} from "@/lib/olden-schedules";

const staticRoutes = [
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
  {
    path: shipScheduleHubPath,
    priority: 0.85,
    changeFrequency: "weekly" as const,
  },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/about", priority: 0.5, changeFrequency: "yearly" as const },
] as const;

export function getSiteRoutes() {
  const monthRoutes = getOldenMonthSummaries().map((month) => ({
    path: shipScheduleMonthPath(month.slug),
    priority: 0.7,
    changeFrequency: "weekly" as const,
  }));
  return [...staticRoutes, ...monthRoutes];
}

export const siteRoutes = staticRoutes;
