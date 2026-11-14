import { ExperiencePage } from '@/components/ExperiencePage';
import { sunsetKayak } from '@/components/ExperiencePage/ExperiencePage.fixtures';
import { galleryView } from '@/lib/pages/experience';
import { experiences } from '../../data';

export function generateStaticParams() {
  return experiences.map((_, index) => ({ i: String(index) }));
}

export default async function MeasureExperience({
  params,
}: {
  params: Promise<{ i: string }>;
}) {
  const { i } = await params;
  const experience = experiences[Number(i)];
  if (!experience) {
    return null;
  }
  return (
    <ExperiencePage
      view={{
        ...sunsetKayak,
        title: experience.title,
        gallery: galleryView(experience.photos),
      }}
      dates={null}
    />
  );
}
