import { ExperienceCardItem } from '@/components/ExperienceCard/ExperienceCardItem';
import type { ExperienceCard } from './data';
import { experiences } from './data';

export default function MeasureHome() {
  return (
    <main
      style={{
        display: 'grid',
        gap: 24,
        padding: 16,
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 384px), 384px))',
      }}
    >
      {experiences.map((experience, index) => {
        const card: ExperienceCard = {
          id: String(index),
          title: experience.title,
          meta: 'Brooklyn · 2 hours',
          href: `/measure/exp/${String(index)}`,
          image: experience.photos[0] ?? null,
          kind: 'bookable',
          price: '$85',
        };
        return (
          <ExperienceCardItem
            key={card.id}
            card={card}
            layout="vertical"
            headingLevel={2}
            preloadPhoto={index === 0}
          />
        );
      })}
    </main>
  );
}
