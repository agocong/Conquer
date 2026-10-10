import { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const customEase = 'power4.out';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      video.play().catch(() => {});
      setVideoLoaded(true);
    };

    if (video.readyState >= 3) {
      handleCanPlay();
    } else {
      video.addEventListener('canplay', handleCanPlay, { once: true });
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Opening Timeline ── */
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out', duration: 1.4 },
      });

      // 1. Mask panels slide apart (accelerated)
      tl.to(overlayRef.current?.querySelectorAll('.mask-panel') || [], {
        yPercent: (i) => (i === 0 ? -100 : 100),
        duration: 0.8,
        ease: 'power3.inOut',
        stagger: 0.03,
      });

      // 2. Video Ken Burns scale-in
      tl.fromTo(
        videoRef.current,
        { scale: 1.15 },
        { scale: 1, duration: 1.8, ease: 'power2.out' },
        '-=0.4'
      );

      // 3. Title "Conquer" — compress then reset
      const titleChars = titleRef.current?.querySelectorAll('.hero-char');
      if (titleChars && titleChars.length > 0) {
        // First, set initial compressed state
        gsap.set(titleChars, {
          scaleY: 1.4,
          y: -40,
          opacity: 0,
        });

        // Then animate to normal with slight overshoot
        tl.to(
          titleChars,
          {
            scaleY: 1,
            y: 0,
            opacity: 1,
            duration: 1.3,
            ease: 'power3.inOut',
            stagger: 0.05,
          },
          '-=0.6'
        );
      }

      // 4. Subtitle — clip-path reveal
      tl.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
        { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.0 },
        '-=0.4'
      );

      // 5. Description — slide up + opacity
      tl.fromTo(
        descRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0 },
        '-=0.6'
      );

      // 6. CTA — scale in + slide up
      tl.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9 },
        '-=0.5'
      );

      /* ── Video parallax on scroll ── */
      if (videoWrapRef.current) {
        gsap.to(videoWrapRef.current, {
          y: 80,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const titleText = 'Conquer';

  return (
    <section ref={sectionRef} className="h-screen p-4 md:p-6 bg-black overflow-hidden">
      {/* Opening mask overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ perspective: '1200px' }}
      >
        <div className="mask-panel absolute inset-x-0 top-0 h-[52%] bg-black" />
        <div className="mask-panel absolute inset-x-0 bottom-0 h-[52%] bg-black" />
      </div>

      <div className="relative h-full w-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-black">
        {/* Background video with parallax wrapper */}
        <div ref={videoWrapRef} className="absolute inset-0 w-full h-[120%] -top-[10%]">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            src="/video_1080.mp4"
          />
        </div>

        {/* Noise overlay */}
        <div className="noise-overlay opacity-[0.7] mix-blend-overlay" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80 pointer-events-none" />

        {/* Bottom-aligned hero content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-6 md:px-10 lg:px-12 pb-10 md:pb-14">
          <div className="grid grid-cols-12 gap-4 sm:gap-6 items-end">
            {/* Left 8 cols: giant headline */}
            <div className="col-span-12 md:col-span-8">
              <div ref={titleRef} className="overflow-hidden" style={{ perspective: '600px' }}>
                <span
                  className="text-[10vw] sm:text-[8vw] md:text-[6vw] lg:text-[5vw] font-normal leading-[0.95] tracking-[-0.03em] block"
                  style={{ color: '#ffffff' }}
                >
                  {titleText.split('').map((char, i) => (
                    <span
                      key={i}
                      className="hero-char inline-block"
                      style={{
                        display: 'inline-block',
                        willChange: 'transform, opacity',
                      }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </span>
              </div>

              <div
                ref={subtitleRef}
                className="block mt-5 text-[14px] md:text-base font-light leading-relaxed tracking-[0.02em]"
                style={{ color: 'rgba(255,255,255,0.6)', opacity: 0 }}
              >
                Conquer complexity. Archive every insight.
              </div>
            </div>

            {/* Right 4 cols: description + CTA */}
            <div className="col-span-12 md:col-span-4 flex flex-col gap-6 md:gap-8">
              <div
                ref={descRef}
                className="text-xs sm:text-sm md:text-base leading-[1.5]"
                style={{ color: 'rgba(45, 106, 79, 0.75)', opacity: 0 }}
              >
                Welcome to my personal knowledge site, filled with product analysis, AI practice and structured thinking records.
              </div>

              <div ref={ctaRef} style={{ opacity: 0 }}>
                <a
                  href="#about"
                  className="inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm uppercase tracking-[0.1em] text-white transition-all duration-300 hover:opacity-80"
                  style={{ borderColor: '#2D6A4F' }}
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
