/**
 * Image provenance registry for Olden Shore Excursions.
 * NEW IMAGE SOURCING IS NOT AUTHORISED without verified rights.
 */

export type ImageProvenance = {
  key: string;
  urlOrPath: string;
  status:
    | "KEEP"
    | "REPLACE"
    | "WRONG_LOCATION"
    | "DUPLICATE"
    | "PROVENANCE_UNKNOWN"
    | "BROKEN";
  notes: string;
};

export const oldenImageProvenance: readonly ImageProvenance[] = [
  {
    key: "hero",
    urlOrPath:
      "https://upload.wikimedia.org/wikipedia/commons/c/ca/Briksdalsbreen_Glacier_-Norway.jpg",
    status: "KEEP",
    notes:
      "Wikimedia Commons. Briksdal Glacier. Rights later-hardening. Limited local village photography so glacier imagery leads the site honestly.",
  },
  {
    key: "briksdalWaterfall",
    urlOrPath:
      "https://upload.wikimedia.org/wikipedia/commons/c/c7/Briksdal_Glacier_Norway_%28213014897%29.jpeg",
    status: "KEEP",
    notes: "Wikimedia Commons. Briksdal waterfall/glacial lake. Rights later-hardening.",
  },
  {
    key: "oldedalen",
    urlOrPath: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Oldedalen.jpg",
    status: "KEEP",
    notes: "Wikimedia Commons. Oldedalen valley. Rights later-hardening.",
  },
  {
    key: "loenSkylift",
    urlOrPath:
      "https://upload.wikimedia.org/wikipedia/commons/4/40/Seilbahn_Hoven_Loen.jpg",
    status: "KEEP",
    notes:
      "Wikimedia Commons. Loen Skylift. Rights later-hardening. Does not prove current operation.",
  },
  {
    key: "mountHoven",
    urlOrPath: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Hoven_Loen.jpg",
    status: "KEEP",
    notes: "Wikimedia Commons. Mount Hoven. Rights later-hardening.",
  },
  {
    key: "village",
    urlOrPath: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Olden_Norway.jpg",
    status: "KEEP",
    notes: "Wikimedia Commons. Olden village. Rights later-hardening.",
  },
  {
    key: "harbour",
    urlOrPath:
      "https://upload.wikimedia.org/wikipedia/commons/2/28/Olden_-_Norway_-_panoramio.jpg",
    status: "KEEP",
    notes: "Wikimedia Commons / Panoramio-era Olden harbour. Rights later-hardening.",
  },
  {
    key: "walkingTourGalleryGlacier",
    urlOrPath:
      "https://upload.wikimedia.org/wikipedia/commons/c/ca/Briksdalsbreen_Glacier_-Norway.jpg",
    status: "WRONG_LOCATION",
    notes:
      "Previously used in the village walking-tour gallery. Removed from that gallery. Keep as glacier product imagery only.",
  },
  {
    key: "sisterPortCards",
    urlOrPath: "src/lib/site-images.ts flam/bergen/stavanger/alesund/geiranger cards",
    status: "KEEP",
    notes:
      "Unused related-port assets in explore-norwegian-ports.tsx. Not labelled as Olden local. Component is not on the homepage.",
  },
] as const;
