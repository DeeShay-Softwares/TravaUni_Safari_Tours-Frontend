import TripsSection from './TripsSection';
import { ToursSection } from './ToursSection';
import { BookingSection } from './BookingSection';
import { HeroPage } from './HeroPage';
import { TestimonialSection } from './TestimonialSection';
import { GallerySection } from './GallerySection';
import Footer from './Footer';
import { Layout } from '@/components/Layout';

export function HomePage() {
  return (
    <Layout>
      <HeroPage />
      <ToursSection />
      <BookingSection />
      <TripsSection />
      <TestimonialSection />
      <GallerySection />
      <Footer />
    </Layout>
  );
}