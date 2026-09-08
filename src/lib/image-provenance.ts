/**
 * Image provenance / attribution registry for Olden Shore Excursions.
 * Prefer local /public assets with documented Wikimedia Commons licences.
 */

export type ImageLicence =
  | "CC BY 2.0"
  | "CC BY 2.5"
  | "CC BY 3.0"
  | "CC BY-SA 3.0"
  | "CC BY-SA 4.0";

export type ImageProvenance = {
  key: string;
  urlOrPath: string;
  status: "KEEP" | "REPLACE" | "WRONG_LOCATION" | "DUPLICATE" | "PROVENANCE_UNKNOWN" | "BROKEN";
  creator: string;
  licence: ImageLicence;
  sourcePage: string;
  attribution: string;
  notes: string;
};

export const oldenImageProvenance: readonly ImageProvenance[] = [
  {
    key: "briksdalGlacier",
    urlOrPath: "/images/briksdal/briksdalsbreen-glacier-yair-haklai.jpg",
    status: "KEEP",
    creator: "Yair Haklai",
    licence: "CC BY-SA 3.0",
    sourcePage:
      "https://commons.wikimedia.org/wiki/File:Briksdalsbreen_Glacier_-Norway.jpg",
    attribution: "Photo: Yair Haklai / Wikimedia Commons (CC BY-SA 3.0)",
    notes: "Hero and gallery glacier terminus.",
  },
  {
    key: "briksdalWaterfall",
    urlOrPath: "/images/briksdal/briksdal-waterfall-lake-simo87vr.jpg",
    status: "KEEP",
    creator: "Simo87vr",
    licence: "CC BY 3.0",
    sourcePage:
      "https://commons.wikimedia.org/wiki/File:Briksdal_Glacier_Norway_(213014897).jpeg",
    attribution: "Photo: Simo87vr / Wikimedia Commons (CC BY 3.0)",
    notes: "Glacier lake / waterfall viewpoint.",
  },
  {
    key: "oldedalen",
    urlOrPath: "/images/briksdal/oldedalen-valley-sindre.jpg",
    status: "KEEP",
    creator: "Sindre",
    licence: "CC BY 2.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Oldedalen.jpg",
    attribution: "Photo: Sindre / Wikimedia Commons (CC BY 2.0)",
    notes: "Oldedalen valley overview.",
  },
  {
    key: "oldenLake",
    urlOrPath: "/images/briksdal/oldevatnet-northern-simo-rasanen.jpg",
    status: "KEEP",
    creator: "Simo Räsänen (Ximonic)",
    licence: "CC BY-SA 3.0",
    sourcePage:
      "https://commons.wikimedia.org/wiki/File:Oldevatnet_(northern_part)_in_Oldedalen,_2011_August.jpg",
    attribution: "Photo: Simo Räsänen / Wikimedia Commons (CC BY-SA 3.0)",
    notes: "True Olden Lake / Oldevatnet shoreline.",
  },
  {
    key: "kleivafossen",
    urlOrPath: "/images/briksdal/kleivafossen-briksdalen-simo-rasanen.jpg",
    status: "KEEP",
    creator: "Simo Räsänen (Ximonic)",
    licence: "CC BY-SA 4.0",
    sourcePage:
      "https://commons.wikimedia.org/wiki/File:Kleivafossen_in_Briksdalen,_Stryn,_Vestland,_Norway,_2025_June.jpg",
    attribution: "Photo: Simo Räsänen / Wikimedia Commons (CC BY-SA 4.0)",
    notes: "Waterfall landscape on Briksdal walking approach; not an exact stop claim.",
  },
  {
    key: "briksdalTrail",
    urlOrPath: "/images/briksdal/briksdal-trail-bridge-leif.jpg",
    status: "KEEP",
    creator: "Leif",
    licence: "CC BY 2.0",
    sourcePage:
      'https://commons.wikimedia.org/wiki/File:Awesome_"monkey_bridge"_near_briksdalsbreen_glacier.jpg',
    attribution: "Photo: Leif / Wikimedia Commons (CC BY 2.0)",
    notes: "Communicates genuine walking element.",
  },
  {
    key: "littleRedChurch",
    urlOrPath: "/images/briksdal/olden-old-church-wolfmann.jpg",
    status: "KEEP",
    creator: "Wolfmann",
    licence: "CC BY-SA 4.0",
    sourcePage:
      "https://commons.wikimedia.org/wiki/File:Olden_Old_Church_Sogn_og_Fjordane_exterior01_2015-04-28..JPG",
    attribution: "Photo: Wolfmann / Wikimedia Commons (CC BY-SA 4.0)",
    notes: "Supplier-confirmed Little Red Church / Olden gamle kyrkje route feature.",
  },
  {
    key: "harbour",
    urlOrPath: "/images/briksdal/olden-harbour-kris-van-achter.jpg",
    status: "KEEP",
    creator: "Kris Van Achter",
    licence: "CC BY-SA 3.0",
    sourcePage:
      "https://commons.wikimedia.org/wiki/File:Olden_-_Norway_-_panoramio.jpg",
    attribution: "Photo: Kris Van Achter / Wikimedia Commons (CC BY-SA 3.0)",
    notes: "Olden cruise harbour context.",
  },
  {
    key: "loenSkylift",
    urlOrPath:
      "https://upload.wikimedia.org/wikipedia/commons/4/40/Seilbahn_Hoven_Loen.jpg",
    status: "KEEP",
    creator: "See Wikimedia file page",
    licence: "CC BY-SA 3.0",
    sourcePage:
      "https://commons.wikimedia.org/wiki/File:Seilbahn_Hoven_Loen.jpg",
    attribution: "Wikimedia Commons (see file page)",
    notes: "Loen Skylift product imagery; not Briksdal gallery.",
  },
  {
    key: "mountHoven",
    urlOrPath: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Hoven_Loen.jpg",
    status: "KEEP",
    creator: "See Wikimedia file page",
    licence: "CC BY-SA 3.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Hoven_Loen.jpg",
    attribution: "Wikimedia Commons (see file page)",
    notes: "Mount Hoven product imagery.",
  },
  {
    key: "village",
    urlOrPath: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Olden_Norway.jpg",
    status: "KEEP",
    creator: "See Wikimedia file page",
    licence: "CC BY-SA 3.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Olden_Norway.jpg",
    attribution: "Wikimedia Commons (see file page)",
    notes: "Village walking-tour imagery.",
  },
] as const;

export function attributionForKey(key: string | undefined): string | null {
  if (!key) return null;
  const row = oldenImageProvenance.find((item) => item.key === key);
  return row?.attribution ?? null;
}
