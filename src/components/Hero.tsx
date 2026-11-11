import { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import OptionWheel, { OptionWheelHandle } from './OptionWheel';
import GooeyNav from './GooeyNav';
import GradientWaves from './GradientWaves';

type Phase = 'intro' | 'video' | 'menu';

const ALL_WORDS = ['Ideation', 'Insights', 'Reflection', 'Design', 'Growth'];

const NAV_ITEMS = [
  { label: 'Home', href: '#top' },
  { label: 'Blog', href: '#' },
  { label: 'About', href: '#about' },
];

/* All marquee card image URLs — preloaded on mount so they're cached by the
 * time the menu phase appears (video playback takes ~4s at 1.5x speed) */
/* public 资源需带部署子路径前缀（GitHub Pages 挂在 /Conquer/ 下） */
const B = import.meta.env.BASE_URL;

const MARQUEE_IMAGES = [
  `${B}intel/career-file.webp`,
  `${B}intel/basketball.webp`,
  `${B}intel/travel.webp`,
  `${B}intel/game.webp`,
  `${B}intel/baby-care.webp`,
  ...[...Array(5)].map((_, i) => `https://picsum.photos/seed/blog${i}/400/240`),
];

/* 「可公开的情报」5 张卡片：本地 WebP 图 + 标题（弹窗预览共用） */
const INTEL_CARDS = [
  { src: `${B}intel/career-file.webp`, title: '职业档案' },
  { src: `${B}intel/basketball.webp`, title: '篮球' },
  { src: `${B}intel/travel.webp`, title: '旅游' },
  { src: `${B}intel/game.webp`, title: '游戏' },
  { src: `${B}intel/baby-care.webp`, title: '照顾婴儿' },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const introCharRef = useRef<HTMLDivElement>(null);
  const menuCharRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>('intro');
  /* Lightbox preview for 「可公开的情报」 cards */
  const [intelPreview, setIntelPreview] = useState<{ src: string; title: string } | null>(null);
  const phaseRef = useRef<Phase>('intro');
  const endedLockRef = useRef(false);
  const slowDownRef = useRef(false);
  const crossfadeRef = useRef(false);
  const wheelRef = useRef<OptionWheelHandle>(null);

  /* Keep phaseRef in sync for use in non-reactive callbacks */
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  /* ── Lightbox: close on ESC ── */
  useEffect(() => {
    if (!intelPreview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIntelPreview(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [intelPreview]);

  /* Intel card sources / titles — see INTEL_CARDS */
  const intelSrc = (i: number) => INTEL_CARDS[i].src;
  const intelTitle = (i: number) => INTEL_CARDS[i].title;

  /* ── Preload marquee images during the video phase ──
   * Menu appears ~4s after Explore Now is clicked (video at 1.5x speed).
   * Preloading on mount would compete with the first screen (and 5 picsum
   * external images would steal bandwidth from it), so wait for the video
   * phase — still ~4s of cover time before the menu renders. */
  useEffect(() => {
    if (phase !== 'video') return;
    MARQUEE_IMAGES.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [phase]);

  /* ── Auto-jump: every 2s, randomly jump the wheel to one of the 5 words ── */
  const lastJumpRef = useRef(0);
  useEffect(() => {
    if (phase !== 'intro') return;
    const interval = setInterval(() => {
      let next = Math.floor(Math.random() * ALL_WORDS.length);
      while (next === lastJumpRef.current) {
        next = Math.floor(Math.random() * ALL_WORDS.length);
      }
      lastJumpRef.current = next;
      wheelRef.current?.jumpTo(next);
    }, 2000);
    return () => clearInterval(interval);
  }, [phase]);

  /* ── Intro entrance (page load) ── */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(introCharRef.current, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.4 });
    tl.fromTo('.intro-greeting', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.8');
    tl.fromTo('.intro-subtitle', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');
    tl.fromTo('.intro-button', { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.7 }, '-=0.4');
    tl.fromTo('.hero-logo', { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.8');
    return () => { tl.kill(); };
  }, []);

  /* ── Phase 1 → 2: Explore Now clicked ──
   * "静态图突然动起来" effect:
   * 1. Start video playback BEHIND the static image (video at opacity 0)
   * 2. Fade out UI elements
   * 3. Quick crossfade: video fades in over static image
   *    Since video is already playing, it looks like the photo "comes alive" */
  const handleExplore = useCallback(() => {
    if (phaseRef.current !== 'intro') return;

    const v = videoRef.current;
    /* Start video immediately — it plays behind the static image */
    if (v) {
      v.pause();
      v.currentTime = 0;
      v.playbackRate = 1.5;
      v.muted = true;
      const p = v.play();
      if (p) p.catch(() => {});
    }

    /* Reset slow-down flags for this playthrough */
    slowDownRef.current = false;
    crossfadeRef.current = false;
    endedLockRef.current = false;

    const tl = gsap.timeline();

    /* 1) Fade out intro UI elements — fast, leaves the character behind */
    tl.to('.intro-element-ui', {
      opacity: 0,
      y: -15,
      duration: 0.25,
      ease: 'power2.in',
      stagger: 0.02,
    });

    /* 2) Quick crossfade: video fades in over the static image.
     *    Video is already playing, so as opacity rises the image "starts moving".
     *    Subtle scale 1.02→1.0 gives a "settling into motion" feel. */
    tl.fromTo(videoWrapRef.current, {
      opacity: 0,
      scale: 1.02,
    }, {
      opacity: 1,
      scale: 1,
      duration: 0.45,
      ease: 'power2.out',
    }, '-=0.05');

    /* 3) Fade out intro character — starts 0.1s AFTER video begins fading in,
     *    so for a brief moment both are visible, enhancing the "coming alive" illusion */
    tl.to(introCharRef.current, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.inOut',
    }, '<0.1');

    /* 4) Switch phase, try to unmute */
    tl.add(() => {
      setPhase('video');
      requestAnimationFrame(() => {
        const vv = videoRef.current;
        if (vv) {
          vv.muted = false;
          /* If unmute fails (autoplay policy), keep muted */
          if (vv.muted) {
            vv.muted = true;
          }
        }
      });
    });
  }, []);

  /* ── Phase 2 → 3: Video near end → "freeze" into menu ──
   * "视频停下来变成静态图" effect:
   * 1. At duration - 2.0s: gradually slow playbackRate from 1.5 → 0.15 (1.5s tween)
   *    The video appears to decelerate, like inertia running out
   * 2. At duration - 0.5s: crossfade menu character in + video out
   *    By now the video is barely moving (~0.2x), creating a "freeze" moment
   * 3. Menu character fades in with slight scale-up, like "settling to a stop" */
  const handleVideoTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;

    /* Stage 1: Start gradual slow-down at duration - 2.0s */
    if (!slowDownRef.current && v.currentTime >= v.duration - 2.0) {
      slowDownRef.current = true;

      /* Tween playbackRate from current (1.5) down to 0.15 over 1.5s */
      const proxy = { rate: v.playbackRate };
      gsap.to(proxy, {
        rate: 0.15,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (videoRef.current) {
            videoRef.current.playbackRate = proxy.rate;
          }
        },
      });
    }

    /* Stage 2: Start crossfade at duration - 1.0s — gives 0.5s overlap
     * where the video is still playing (barely) while menu content appears */
    if (!crossfadeRef.current && v.currentTime >= v.duration - 1.0) {
      crossfadeRef.current = true;
      endedLockRef.current = true;
      setPhase('menu');

      requestAnimationFrame(() => {
        const tl = gsap.timeline();

        /* All elements start simultaneously — character, marquee, browse */

        /* Menu character fades in (0.8s) */
        tl.fromTo(menuCharRef.current, {
          opacity: 0,
          scale: 0.98,
        }, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
        }, 0);

        /* Video fades out — starts 0.3s after character, finishes before end */
        tl.to(videoWrapRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
        }, 0.3);

        /* Marquee sections appear simultaneously with character */
        tl.fromTo('.marquee-section', {
          opacity: 0,
          y: 40,
        }, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        }, 0);

        /* Browse buttons follow quickly */
        tl.fromTo('.menu-browse', {
          opacity: 0,
          x: -10,
        }, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
        }, 0.3);
      });
    }
  }, []);

  const handleVideoEnded = useCallback(() => {
    /* Video may have already been faded out by the crossfade timeline.
     * Just ensure it's fully hidden and playback rate is restored. */
    const v = videoRef.current;
    if (v) v.playbackRate = 1.5;
    if (videoWrapRef.current) {
      gsap.to(videoWrapRef.current, { opacity: 0, duration: 0.2 });
    }
  }, []);

  /* ── Reset to intro page (Home / logo click) ── */
  const handleResetToIntro = useCallback(() => {
    const v = videoRef.current;
    if (v) { v.pause(); v.currentTime = 0; v.playbackRate = 1.5; }
    endedLockRef.current = false;
    slowDownRef.current = false;
    crossfadeRef.current = false;

    const tl = gsap.timeline();

    /* Fade out video and menu character simultaneously */
    tl.to(videoWrapRef.current, { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, 0);
    tl.to(menuCharRef.current, { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, 0);
    tl.to('.marquee-section', { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0);
    tl.to('.menu-browse', { opacity: 0, duration: 0.2, ease: 'power2.in' }, 0);

    /* Switch phase + fade intro character back in */
    tl.add(() => {
      setPhase('intro');
      requestAnimationFrame(() => {
        const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        introTl.fromTo(introCharRef.current, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.2 });
        introTl.fromTo('.intro-greeting', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');
        introTl.fromTo('.intro-subtitle', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');
        introTl.fromTo('.intro-button', { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, '-=0.3');
        introTl.fromTo('.hero-logo', { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.6');
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-screen w-full bg-black overflow-hidden relative"
    >
      {/* ── Always-on GradientWaves background ── */}
      <div className="absolute inset-0 z-0">
        <GradientWaves
          horizonColor="#5227FF"
          waveColor="#FF9FFC"
          crestColor="#FFFFFF"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1.0}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1.0}
          opacity={1.0}
          mouseInteraction={true}
          parallaxStrength={0.5}
          grain={true}
          grainIntensity={0.05}
        />
      </div>

      {/* ── Intro character (hoodie, hands in pockets) ──
        * Always mounted. Opacity controlled by GSAP.
        * screen blend: black bg → transparent over GradientWaves */}
      <div
        ref={introCharRef}
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ mixBlendMode: 'screen', opacity: 0 }}
      >
        <img
          src={`${B}character-intro.jpg`}
          alt=""
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
          draggable={false}
        />
      </div>

      {/* ── Video layer ──
        * Always mounted. Opacity controlled by GSAP.
        * screen blend so black bg is transparent over waves */}
      <div
        ref={videoWrapRef}
        className="absolute inset-0 z-[2]"
        style={{ opacity: 0, mixBlendMode: 'screen' }}
      >
        <video
          ref={videoRef}
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
          src={`${B}hero-intro-video.mp4`}
          onTimeUpdate={handleVideoTimeUpdate}
          onEnded={handleVideoEnded}
        />
      </div>

      {/* ── Menu character (white clothes, pointing left) ──
        * Always mounted. Opacity controlled by GSAP.
        * screen blend, z-[3] (above video so it takes over) */}
      <div
        ref={menuCharRef}
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{ mixBlendMode: 'screen', opacity: 0 }}
      >
        <img
          src={`${B}character-menu.jpg`}
          alt=""
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
          draggable={false}
        />
      </div>

      {/* ── Top bar: Logo (left) + Nav (right) ── */}
      <div className="hero-logo absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-10 py-5">
        <img
          src={`${B}logo-conquer.webp`}
          alt="Conquer"
          className="h-16 md:h-24 w-auto object-contain cursor-pointer"
          draggable={false}
          onClick={handleResetToIntro}
        />
        <GooeyNav
          items={NAV_ITEMS}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={100}
          initialActiveIndex={0}
          animationTime={600}
          timeVariance={300}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          onItemClick={(index, item) => {
            if (item.label === 'Home') handleResetToIntro();
          }}
        />
      </div>

      {/* ── Phase 1: Intro content ── */}
      {phase === 'intro' && (
        <>
          <div className="intro-element-ui intro-greeting absolute z-10 left-0 top-0 h-full flex flex-col justify-center pl-[6%] sm:pl-[8%] md:pl-[10%] max-w-[55%]">
            <h1 className="text-[5.5vw] sm:text-[4.8vw] md:text-[4.2vw] lg:text-[3.8vw] font-extrabold leading-[1.06] tracking-[-0.03em] text-white">
              Hi, you're at
            </h1>
            <h1 className="text-[8vw] sm:text-[7vw] md:text-[6.2vw] lg:text-[5.6vw] font-extrabold leading-[1.02] tracking-[-0.04em] mt-3 conquer-gradient-text">
              Conquer
            </h1>

            <div className="flex items-center gap-3 mt-6 mb-5" style={{ color: '#6B7280' }}>
              <span className="text-2xl font-light">—</span>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
            </div>

            <p className="intro-subtitle text-[2vw] sm:text-[1.7vw] md:text-[1.5vw] lg:text-[1.35vw] font-normal leading-[1.5] tracking-[0.01em]" style={{ color: '#9CA3AF' }}>
              A Product Manager's<br />Personal Blog for Reflections
            </p>

            <button
              onClick={handleExplore}
              className="intro-button mt-10 inline-flex items-center gap-3 rounded-full px-10 py-4 text-[1.8vw] sm:text-[1.5vw] md:text-[1.3vw] lg:text-[1.15vw] font-semibold tracking-[-0.01em] text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,212,170,0.5)] gap-4 group"
              style={{ backgroundColor: '#00D4AA', width: 'fit-content' }}
            >
              <span>Explore Now</span>
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
            </button>
          </div>

          <div className="intro-element-ui absolute z-10 right-[4%] sm:right-[5%] md:right-[6%] top-0 h-full w-[24%]">
            <OptionWheel
              ref={wheelRef}
              items={ALL_WORDS}
              defaultSelected={0}
              textColor="rgba(255,255,255,0.35)"
              activeColor="#ffffff"
              side="left"
              fontSize={2.4}
              spacing={1.5}
              curve={1}
              tilt={10}
              blur={2.5}
              fade={0.3}
              minOpacity={0.04}
              smoothing={350}
              inset={30}
              loop
              draggable
            />
          </div>
        </>
      )}

      {/* ── Phase 3: Menu (marquee banners) ── */}
      {phase === 'menu' && (
        <div className="absolute z-10 left-0 top-0 h-full w-full flex flex-col justify-center pl-[6%] sm:pl-[8%] md:pl-[10%] pr-[30%] sm:pr-[28%] md:pr-[26%] gap-12 md:gap-16">

          {/* Row 1: 可公开的情报 */}
          <div className="menu-number-wrap marquee-section">
            <div className="marquee-label">
              <span className="menu-number text-[1.4vw] sm:text-[1.1vw] md:text-[0.9vw] font-light tracking-[0.04em] text-[#FF9FFC]/50">
                01
              </span>
              <span className="menu-text text-[2.2vw] sm:text-[1.8vw] md:text-[1.5vw] font-semibold tracking-[-0.02em] text-white/90">
                可公开的情报
              </span>
              <span className="menu-desc text-[0.9vw] sm:text-[0.75vw] md:text-[0.65vw] text-white/35 tracking-[0.1em]">
                Public Intelligence
              </span>
            </div>
            <p className="text-[0.85vw] sm:text-[0.7vw] md:text-[0.6vw] text-white/30 leading-relaxed mb-1">
              产品洞察 · 增长实验 · 用户研究 · 市场分析
            </p>
            <div className="marquee-track">
              <div className="marquee-track-inner">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="marquee-card marquee-card-lg cursor-pointer"
                    onClick={() => setIntelPreview({ src: intelSrc(i), title: intelTitle(i) })}
                  >
                    <img src={intelSrc(i)} alt={intelTitle(i)} loading="lazy" />
                    <div className="marquee-card-overlay">
                      <span className="marquee-card-title">{intelTitle(i)}</span>
                    </div>
                  </div>
                ))}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={`dup-${i}`}
                    className="marquee-card marquee-card-lg cursor-pointer"
                    onClick={() => setIntelPreview({ src: intelSrc(i), title: intelTitle(i) })}
                  >
                    <img src={intelSrc(i)} alt={intelTitle(i)} loading="lazy" />
                    <div className="marquee-card-overlay">
                      <span className="marquee-card-title">{intelTitle(i)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="browse-more-btn menu-browse">
              Browse More
              <span className="browse-more-arrow">→</span>
            </button>
          </div>

          {/* Row 2: 我的 Blog */}
          <div className="menu-number-wrap marquee-section">
            <div className="marquee-label">
              <span className="menu-number text-[1.4vw] sm:text-[1.1vw] md:text-[0.9vw] font-light tracking-[0.04em] text-[#FF9FFC]/50">
                02
              </span>
              <span className="menu-text text-[2.2vw] sm:text-[1.8vw] md:text-[1.5vw] font-semibold tracking-[-0.02em] text-white/90">
                我的 Blog
              </span>
              <span className="menu-desc text-[0.9vw] sm:text-[0.75vw] md:text-[0.65vw] text-white/35 tracking-[0.1em]">
                My Blog
              </span>
            </div>
            <p className="text-[0.85vw] sm:text-[0.7vw] md:text-[0.6vw] text-white/30 leading-relaxed mb-1">
              随笔 · 复盘 · 技术笔记 · 行业观察
            </p>
            <div className="marquee-track marquee-track-reverse">
              <div className="marquee-track-inner">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="marquee-card">
                    <img src={`https://picsum.photos/seed/blog${i}/400/240`} alt="" loading="lazy" />
                    <div className="marquee-card-overlay">
                      <span className="marquee-card-title">文章 #{i + 1}</span>
                    </div>
                  </div>
                ))}
                {[...Array(5)].map((_, i) => (
                  <div key={`dup-${i}`} className="marquee-card">
                    <img src={`https://picsum.photos/seed/blog${i}/400/240`} alt="" loading="lazy" />
                    <div className="marquee-card-overlay">
                      <span className="marquee-card-title">文章 #{i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="browse-more-btn menu-browse">
              Browse More
              <span className="browse-more-arrow">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)' }}
      />

      {/* ── Intel card lightbox ── */}
      {intelPreview && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-6"
          onClick={() => setIntelPreview(null)}
          role="dialog"
          aria-modal="true"
          aria-label={intelPreview.title}
        >
          <button
            type="button"
            onClick={() => setIntelPreview(null)}
            aria-label="关闭"
            className="absolute top-4 right-6 text-3xl leading-none text-white/60 hover:text-white transition-colors"
          >
            ×
          </button>
          <figure
            className="flex max-w-[94vw] flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={intelPreview.src}
              alt={intelPreview.title}
              className="max-h-[78vh] max-w-full rounded-lg object-contain shadow-[0_0_80px_rgba(0,0,0,0.8)]"
            />
            <figcaption className="text-sm tracking-[0.12em] text-white/70">
              {intelPreview.title}
            </figcaption>
          </figure>
        </div>,
        document.body
      )}
    </section>
  );
}
