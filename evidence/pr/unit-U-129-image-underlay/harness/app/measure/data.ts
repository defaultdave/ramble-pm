import type { PhotoView } from '@/lib/photoViews';
import prod from './prod-photos.json';

export type { ExperienceCard } from '@/lib/experienceCards';

// The vertical-card experiences from production's seed: their Blob photo URLs, real alt text and blur.
// Source size is not in the page, so width and height are only the stored 4:3 shape.
const vertical = prod.filter((entry) => entry.cardSizes?.includes('384px'));

export const experiences = vertical.map((entry) => ({
  title: entry.title,
  photos: entry.photos.map(
    (photo): PhotoView => ({
      src: photo.src,
      width: 1600,
      height: 1200,
      alt: photo.alt,
      blurDataUrl: photo.blurDataUrl,
    }),
  ),
}));
