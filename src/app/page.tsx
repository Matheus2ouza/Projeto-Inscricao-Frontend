import { getPublicEvents } from '@/features/events/api/publicEvents/getPublicEvents';
import PublicNavbar from '@/shared/components/layout/public-navbar';
import SobreSection from './_components/AboutSection';
import EventosSection from './_components/EventsSection';
import Footer from './_components/Footer';
import HeroSection from './_components/HeroSection';

export default async function HomePage() {
  const events = await getPublicEvents();

  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <HeroSection />
      <EventosSection events={events} />
      <SobreSection />
      <Footer />
    </div>
  );
}
