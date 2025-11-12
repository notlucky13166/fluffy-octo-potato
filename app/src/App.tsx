import { CallToAction } from './components/CallToAction';
import { AuthSection } from './components/AuthSection';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Programs } from './components/Programs';

export const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Programs />
        <AuthSection />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
};
