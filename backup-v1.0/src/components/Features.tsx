import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import WordsPullUpMultiStyle from './WordsPullUpMultiStyle';

const customEase = [0.22, 1, 0.36, 1] as const;

interface FeatureCardData {
  title: string;
  number: string;
  iconUrl?: string;
  items: string[];
  video?: boolean;
  videoUrl?: string;
  bottomText?: string;
}

const FEATURES: FeatureCardData[] = [
  {
    title: 'Project Storyboard.',
    number: '01',
    iconUrl:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
    items: [
      'Multi-track storyboard editor',
      'Real-time collaboration',
      'Frame-accurate preview',
      'Auto-saved version history',
    ],
  },
  {
    title: 'Smart Critiques.',
    number: '02',
    iconUrl:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
    items: [
      'AI-powered color and frame analysis',
      'Contextual creative notes',
      'Tool integrations for editorial pipelines',
    ],
  },
  {
    title: 'Immersion Capsule.',
    number: '03',
    iconUrl:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
    items: [
      'Notification silencing for deep work',
      'Ambient soundscapes tuned to the task',
      'Schedule syncing with your editor timeline',
    ],
  },
  {
    title: 'Creative Canvas',
    number: '04',
    video: true,
    videoUrl:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4',
    bottomText: 'Your creative canvas.',
    items: [],
  },
];

function LazyVideo({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '200px' });

  useEffect(() => {
    if (inView && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [inView, shouldLoad]);

  useEffect(() => {
    if (!shouldLoad) return;
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      video.play().catch(() => {});
      setLoaded(true);
    };

    if (video.readyState >= 3) {
      handleCanPlay();
    } else {
      video.addEventListener('canplay', handleCanPlay, { once: true });
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className={className}>
      {shouldLoad && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          src={src}
        />
      )}
    </div>
  );
}

function FeatureCard({ data, index }: { data: FeatureCardData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  if (data.video) {
    return (
      <motion.div
        ref={ref}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.8, delay: index * 0.15, ease: customEase }}
        className="relative overflow-hidden rounded-2xl md:rounded-[2rem] lg:col-span-1 row-span-1
                   h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px]"
        style={{ backgroundColor: '#212121' }}
      >
        <LazyVideo src={data.videoUrl!} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <p
            className="text-base sm:text-lg md:text-xl font-normal"
            style={{ color: '#2D6A4F' }}
        >
          {data.bottomText}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: customEase }}
      className="rounded-2xl md:rounded-[2rem] p-6 sm:p-8 md:p-10 flex flex-col gap-6
                 h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px]"
      style={{ backgroundColor: '#212121' }}
    >
      {/* Icon - lazy load */}
      <img
        src={data.iconUrl}
        alt=""
        loading="lazy"
        decoding="async"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover"
      />

      {/* Title + number */}
      <div className="flex items-start justify-between gap-2">
        <h3
          className="text-lg sm:text-xl md:text-2xl font-normal leading-tight"
          style={{ color: '#2D6A4F' }}
        >
          {data.title}
        </h3>
        <span className="text-[10px] sm:text-xs text-gray-500 font-mono shrink-0">
          {data.number}
        </span>
      </div>

      {/* Checklist */}
      <ul className="flex flex-col gap-2.5 flex-1">
        {data.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-400">
            <Check
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 shrink-0"
              style={{ color: '#2D6A4F' }}
              strokeWidth={1.5}
            />
            <span className="leading-snug">{item}</span>
          </li>
        ))}
      </ul>

      {/* Learn more */}
      <a
        href="#"
        className="group inline-flex items-center gap-2 text-xs sm:text-sm text-primary/80 hover:text-primary transition-colors"
      >
        <span>Learn more</span>
        <ArrowRight
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:rotate-0"
          style={{ transform: 'rotate(-45deg)' }}
          strokeWidth={1.5}
        />
      </a>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section className="relative min-h-screen bg-black px-4 md:px-6 py-16 md:py-24">
      {/* Subtle noise overlay */}
      <div className="bg-noise absolute inset-0 opacity-[0.15] pointer-events-none" />

      <div className="relative max-w-page mx-auto flex flex-col gap-12 md:gap-16">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto flex flex-col gap-4">
          <WordsPullUpMultiStyle
            segments={[
              { text: 'Studio-grade workflows for visionary creators.' },
              { text: 'Built for pure vision. Powered by art.', className: 'text-gray-500' },
            ]}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal"
          />
        </div>

        {/* Card grid: 1 col → 2 col (md) → 4 col (lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-1">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.number} data={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
