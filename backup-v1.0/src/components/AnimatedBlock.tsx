import { useRef, useEffect, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type AnimationMode =
  | 'slideUp'          // default: large y offset + opacity
  | 'reveal'           // clip-path wipe from bottom
  | 'scaleIn'          // scale from 0.92 + opacity
  | 'charReveal'       // split text per char with stagger
  | 'titleReveal'      // entire line clip-paths from right + slight x offset
  | 'cardCascade'      // children stagger from bottom-right with scale 0.95
  | 'parallaxReveal';  // scroll-progress based parallax + clipPath reveal

interface AnimatedBlockProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
  mode?: AnimationMode;
  stagger?: number; // for child elements
  /** For parallaxReveal, max y-offset in px (default 30) */
  parallaxDistance?: number;
  /** For cardCascade, initial x offset for each child (default 40) */
  cascadeX?: number;
  /** For cardCascade, initial y offset for each child (default 60) */
  cascadeY?: number;
}

/**
 * GSAP ScrollTrigger-powered animated block.
 * Supports multiple animation modes for rich section transitions.
 *
 * Modes:
 * - slideUp / reveal / scaleIn / charReveal (existing)
 * - titleReveal: whole line clips from right
 * - cardCascade: children stagger from bottom-right
 * - parallaxReveal: scroll-progress parallax + clipPath
 */
export default function AnimatedBlock({
  children,
  delay = 0,
  className = '',
  duration = 1.2,
  mode = 'slideUp',
  stagger = 0.08,
  parallaxDistance = 30,
  cascadeX = 40,
  cascadeY = 60,
}: AnimatedBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      switch (mode) {
        /* ── Existing modes ── */

        case 'reveal': {
          gsap.fromTo(
            el,
            {
              clipPath: 'inset(0 0 100% 0)',
              opacity: 0,
            },
            {
              clipPath: 'inset(0 0 0% 0)',
              opacity: 1,
              duration,
              delay,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true,
              },
            }
          );
          break;
        }

        case 'scaleIn': {
          gsap.fromTo(
            el,
            { scale: 0.92, opacity: 0, y: 30 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              duration,
              delay,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true,
              },
            }
          );
          break;
        }

        case 'charReveal': {
          const textEls = el.querySelectorAll('.char-reveal');
          textEls.forEach((textEl) => {
            const text = textEl.textContent || '';
            textEl.innerHTML = '';
            text.split('').forEach((char) => {
              const span = document.createElement('span');
              span.style.display = 'inline-block';
              span.style.willChange = 'transform, opacity';
              span.textContent = char === ' ' ? '\u00A0' : char;
              textEl.appendChild(span);
            });
          });

          const allChars = el.querySelectorAll('.char-reveal span');
          gsap.fromTo(
            allChars,
            { y: '105%', opacity: 0, rotateX: -30 },
            {
              y: '0%',
              opacity: 1,
              rotateX: 0,
              duration: 0.9,
              stagger,
              delay,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true,
              },
            }
          );
          break;
        }

        case 'slideUp':
        default: {
          const children = el.children;
          if (children.length > 1) {
            gsap.fromTo(
              children,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration,
                stagger,
                delay,
                ease: 'power4.out',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 88%',
                  once: true,
                },
              }
            );
          } else {
            gsap.fromTo(
              el,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration,
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
          break;
        }

        /* ── New dramatic modes ── */

        case 'titleReveal': {
          // Entire text block clip-paths from right side with slight x offset
          gsap.fromTo(
            el,
            {
              clipPath: 'inset(0 0 0 100%)',
              x: 60,
              opacity: 0,
            },
            {
              clipPath: 'inset(0 0 0 0%)',
              x: 0,
              opacity: 1,
              duration,
              delay,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true,
              },
            }
          );
          break;
        }

        case 'cardCascade': {
          // Animate the container itself (opacity is 0 from JSX, need to reveal it)
          gsap.fromTo(
            el,
            {
              x: cascadeX,
              y: cascadeY,
              scale: 0.95,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
              duration,
              delay,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true,
              },
            }
          );
          break;
        }

        case 'parallaxReveal': {
          // Scroll-progress based subtle parallax + clipPath reveal
          gsap.fromTo(
            el,
            {
              clipPath: 'inset(0 0 100% 0)',
              y: parallaxDistance,
              opacity: 0,
            },
            {
              clipPath: 'inset(0 0 0% 0)',
              y: 0,
              opacity: 1,
              duration,
              delay,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true,
              },
            }
          );
          break;
        }
      }
    }, el);

    return () => ctx.revert();
  }, [delay, duration, mode, stagger, parallaxDistance, cascadeX, cascadeY]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
