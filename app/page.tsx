import { getSettings } from '@/lib/db/settings';
import { HeroEnvelope } from '@/components/HeroEnvelope';
import { SignatureSection } from '@/components/SignatureSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { OrderSection } from '@/components/OrderSection';
import { ProcessSection } from '@/components/ProcessSection';
import { IngredientsSection } from '@/components/IngredientsSection';
import { Footer } from '@/components/Footer';

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <>
      <HeroEnvelope />
      <SignatureSection />
      <FeaturesSection />
      <OrderSection acceptingOrders={settings.acceptingOrders} />
      <ProcessSection />
      <IngredientsSection />
      <Footer />
    </>
  );
}
