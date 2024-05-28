import Nav from "./(marketing)/components/nav";
import Hero from "./(marketing)/components/hero";
import PrimaryFeatures from "./(marketing)/components/primary-features";
import SecondaryFeatures from "./(marketing)/components/secondary-features";
import CallToAction from "./(marketing)/components/call-to-action";
import Pricing from "./(marketing)/components/pricing";
import Faqs from "./(marketing)/components/faqs";
import Footer from "./(marketing)/components/footer";

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        <div id="hero">
          <Hero />
        </div>
        <div id="primaryFeatures">
          <PrimaryFeatures />
        </div>
        <div id="secondaryFeatures">
          <SecondaryFeatures />
        </div>
        <div id="callToAction">
          <CallToAction />
        </div>
        <div id="pricing">
          <Pricing />
        </div>
        <div id="faqs">
          <Faqs />
        </div>
      </main>
      <Footer />
    </>
  );
}
