import { CallToAction } from './components/CallToAction';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Programs } from './components/Programs';
import { Testimonials } from './components/Testimonials';

export const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Programs />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
};
