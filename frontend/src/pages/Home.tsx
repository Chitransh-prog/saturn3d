import Hero from '@/sections/Hero';
import LogoTicker from '@/sections/LogoTicker';
import HowItWorks from '@/sections/HowItWorks';
import Gallery from '@/sections/Gallery';
import Categories from '@/sections/Categories';
import IndustryCategories from '@/sections/Sectors';
import Testimonials from '@/sections/Testimonials';
import FAQSection from '@/sections/FAQSection';
import CTA from '@/sections/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <LogoTicker />
      <Gallery />
      <Categories limit={3} />
      <IndustryCategories />
      <HowItWorks />
      <Testimonials />
      <FAQSection />
      <CTA />
    </>
  );
}
