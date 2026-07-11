'use server';

import { publiEventsService } from '@/features/events/services/publicEvents/publicEvents';
import {
  EventsSection,
  Footer,
  HeroSection,
  SobreSection,
} from '@/features/home/components/public';
import PublicNavbar from '@/shared/components/layout/public-navbar';

export default async function HomePage() {
  const events = await publiEventsService();

  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <HeroSection />
      <EventsSection events={events} />
      <SobreSection />
      <Footer />
    </div>
  );
}
