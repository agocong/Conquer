import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#projects' },
  { label: 'Strengths', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 md:py-4"
    >
      <div className="max-w-page mx-auto flex items-center justify-between">
        {/* Left: Brand (removed) */}

        {/* Center: Nav links (desktop) */}
        <nav
          className={`hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full transition-colors duration-300 ${scrolled ? 'bg-black/20' : 'bg-transparent'}`}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/80 hover:text-white px-4 py-2 rounded-full transition-all duration-200 hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Ghost outlined contact pill */}
        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] px-4 py-2 rounded-full border text-white transition-all duration-200 hover:opacity-80"
          style={{ borderColor: '#2D6A4F' }}
        >
          Contact
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 z-50"
          aria-label="Menu"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block w-5 h-px bg-white"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-5 h-px bg-white"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block w-5 h-px bg-white"
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/95 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="text-xl font-light text-white/80 hover:text-white transition-colors tracking-wider"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-2 px-8 py-3 rounded-full text-sm font-bold tracking-wider border"
                style={{ color: '#2D6A4F', borderColor: '#2D6A4F' }}
              >
                Contact
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
