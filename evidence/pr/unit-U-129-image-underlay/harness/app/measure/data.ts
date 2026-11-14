import type { PhotoView } from '@/lib/photoViews';
import prod from './prod-photos.json';

export type { ExperienceCard } from '@/lib/experienceCards';

// The vertical-card experiences from production's seed: the same source files (served from
// public/measure/, so the optimiser reads them from disk and no remote host is needed), real alt
// text and real blur placeholders.
const vertical = prod.filter((entry) => entry.cardSizes?.includes('384px'));

export const experiences = vertical.map((entry) => ({
  title: entry.title,
  photos: entry.photos.map(
    (photo): PhotoView => ({
      src: `/measure/${photo.src.split('/').pop() ?? ''}`,
      width: 2400,
      height: 1600,
      alt: photo.alt,
      blurDataUrl: photo.blurDataUrl,
    }),
  ),
}));
