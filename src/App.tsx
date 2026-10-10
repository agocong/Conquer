import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#000000', color: '#E8EEF2' }}>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </div>
  );
}
