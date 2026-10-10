import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from './SectionHeader';
import AnimatedBlock from './AnimatedBlock';
import MagicRings from './MagicRings';
import { ArrowUpRight, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative pt-24 pb-10 px-4 md:px-8 lg:px-12 bg-black overflow-hidden"
    >
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
      />

      {/* MagicRings background — green ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{ width: '100%', height: '100%', opacity: 0.35 }}
      >
        <MagicRings
          color="#1B4332"
          colorTwo="#2D6A4F"
          ringCount={5}
          speed={0.6}
          attenuation={8}
          lineThickness={1.5}
          baseRadius={0.3}
          radiusStep={0.12}
          scaleRate={0.08}
          opacity={0.6}
          blur={4}
          noiseAmount={0.05}
          rotation={15}
          fadeIn={0.6}
          fadeOut={0.6}
          followMouse={true}
          mouseInfluence={0.15}
          hoverScale={1.1}
          parallax={0.03}
          clickBurst={false}
        />
      </div>

      <div className="max-w-page mx-auto relative z-10">
        <SectionHeader title="GET IN TOUCH" subtitle="联系方式" />

        {/* Contact content — reveal wipe */}
        <AnimatedBlock mode="parallaxReveal" delay={0.1} duration={1.6} parallaxDistance={40}>
          <div className="mt-12 md:mt-16 mb-16 md:mb-20 text-center max-w-4xl mx-auto">
            <h2
              className="text-2xl md:text-4xl lg:text-5xl font-normal leading-tight mb-8"
              style={{ color: '#ffffff', fontFamily: "'Inter', sans-serif" }}
            >
              合作、交流，或者单纯聊聊产品与业务方向
            </h2>
            <p
              className="text-[13px] md:text-base leading-relaxed max-w-2xl mx-auto mb-12"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              如果你正在寻找一位能够以结构化思维、数据驱动和高效执行的产品经理，欢迎直接联系我
            </p>

            {/* Email button — green ghost outlined */}
            <a
              href="mailto:qian.cong@example.com"
              className="inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm uppercase tracking-[0.1em] text-white transition-all duration-300 hover:opacity-80"
              style={{ borderColor: '#2D6A4F' }}
            >
              <Mail className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
              <span className="text-[14px] md:text-base normal-case tracking-normal">qian.cong@example.com</span>
              <ArrowUpRight
                className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </a>
          </div>
        </AnimatedBlock>

        {/* Two info cards — stagger cardCascade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-16">
          <AnimatedBlock mode="cardCascade" delay={0.2} duration={1.0} cascadeX={40} cascadeY={40} stagger={0}>
            <div
              className="rounded-2xl p-7 md:p-10"
              style={{
                backgroundColor: 'rgba(18,18,22,0.55)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <span
                className="text-[10px] md:text-[11px] font-mono uppercase tracking-wider mb-4 block"
                style={{ color: '#2D6A4F' }}
              >
                — EMAIL
              </span>
              <h3
                className="text-xl md:text-2xl font-semibold mb-3"
                style={{ color: '#ffffff', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              >
                qian.cong@example.com
              </h3>
              <p
                className="text-[13px] md:text-[14px]"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                工作日内回复
              </p>
            </div>
          </AnimatedBlock>

          <AnimatedBlock mode="cardCascade" delay={0.3} duration={1.0} cascadeX={40} cascadeY={40} stagger={0}>
            <div
              className="rounded-2xl p-7 md:p-10"
              style={{
                backgroundColor: 'rgba(18,18,22,0.55)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <span
                className="text-[10px] md:text-[11px] font-mono uppercase tracking-wider mb-4 block"
                style={{ color: '#2D6A4F' }}
              >
                — LOCATION
              </span>
              <h3
                className="text-xl md:text-2xl font-semibold mb-3"
                style={{ color: '#ffffff', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              >
                深圳 / 北京
              </h3>
              <p
                className="text-[13px] md:text-[14px]"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                可远程协作
              </p>
            </div>
          </AnimatedBlock>
        </div>

        {/* Footer — enhanced slideUp with larger offset */}
        <AnimatedBlock mode="slideUp" delay={0.1} duration={1.2}>
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 pb-6"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div
              className="text-[11px] md:text-[12px]"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              &copy; 2025 丛乾 &middot; 保留所有权利
            </div>
            <div
              className="text-[11px] md:text-[12px] font-mono"
              style={{ color: 'rgba(255,255,255,0.25)' }}
            >
              <span style={{ color: '#ffffff' }}>—</span> 产品经理
            </div>
          </div>
        </AnimatedBlock>
      </div>
    </section>
  );
}
