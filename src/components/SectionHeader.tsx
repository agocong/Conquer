import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitIntoSpans } from '../utils/splitText';

gsap.registerPlugin(ScrollTrigger);

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  /** Optional delay before animation begins (default 0) */
  delay?: number;
}

export default function SectionHeader({ title, subtitle, delay = 0 }: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const titleEl = el.querySelector('.section-title');
      if (titleEl) {
        const spans = splitIntoSpans(titleEl as HTMLElement);
        gsap.fromTo(
          spans,
          { y: '120%', opacity: 0, rotateX: -30 },
          {
            y: '0%',
            opacity: 1,
            rotateX: 0,
            duration: 0.9,
            stagger: 0.035,
            delay,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }

      const sub = el.querySelector('.section-sub');
      if (sub) {
        gsap.fromTo(
          sub,
          { y: 20, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
          {
            y: 0,
            opacity: 1,
            clipPath: 'inset(0 0 0% 0)',
            duration: 0.9,
            delay: 0.3 + delay,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={ref} className="mb-12 md:mb-16" style={{ opacity: 0 }}>
      <div className="flex items-baseline gap-2 mb-3">
        <h1
          className="section-title text-3xl md:text-[40px] font-bold tracking-tight leading-none"
          style={{
            color: '#E8EEF2',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
          }}
        >
          {title}
        </h1>
        <span className="text-xl md:text-2xl font-bold" style={{ color: '#00D4AA' }}>
          —
        </span>
      </div>
      <p
        className="section-sub text-xs md:text-sm"
        style={{ color: 'rgba(232,238,242,0.45)' }}
      >
        {subtitle}
      </p>
    </div>
  );
}
