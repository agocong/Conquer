import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedBlock from './AnimatedBlock';

gsap.registerPlugin(ScrollTrigger);

function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const counters = el.querySelectorAll('.stat-counter');
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            counter.textContent = target >= 50 ? Math.round(obj.val).toString() + '+' : Math.round(obj.val).toString();
          },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { value: 11, label: '年产品经验', suffix: false },
        { value: 4, label: '家核心企业', suffix: false },
        { value: 3, label: '大业务领域', suffix: false },
        { value: 50, label: '项目与产品', suffix: true },
      ].map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl p-5 md:p-6 text-center"
          style={{
            backgroundColor: 'rgba(0,212,170,0.08)',
            border: '1px solid rgba(0,212,170,0.1)',
          }}
        >
          <div
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{
              color: '#E8EEF2',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
            }}
          >
            <span className="stat-counter" data-target={stat.value}>0</span>
          </div>
          <div
            className="text-[11px] md:text-[12px] font-medium uppercase tracking-wider"
            style={{ color: 'rgba(232,238,242,0.5)' }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="relative py-28 md:py-36 px-4 md:px-8 lg:px-12 bg-[#0A1628]"
    >
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ backgroundColor: 'rgba(0,212,170,0.1)' }}
      />

      <div className="max-w-page mx-auto">
        {/* Section header — titleReveal (strong right-to-left clip) */}
        <div className="mb-12 md:mb-16">
          <AnimatedBlock mode="titleReveal" delay={0} duration={1.2}>
            <div className="flex items-baseline gap-2 mb-3">
              <h1
                className="text-3xl md:text-[40px] font-bold tracking-tight leading-none"
                style={{
                  color: '#E8EEF2',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 800,
                }}
              >
                ABOUT ME
              </h1>
              <span className="text-xl md:text-2xl font-bold" style={{ color: '#00D4AA' }}>
                —
              </span>
            </div>
            <p
              className="text-xs md:text-sm"
              style={{ color: 'rgba(232,238,242,0.45)', letterSpacing: '0.02em' }}
            >
              关于我
            </p>
          </AnimatedBlock>
        </div>

        {/* Main content card — reveal wipe */}
        <AnimatedBlock mode="reveal" delay={0.1} duration={1.4}>
          <div
            className="rounded-2xl p-8 md:p-12 h-full"
            style={{
              backgroundColor: 'rgba(15,28,48,0.55)',
              border: '1px solid rgba(0,212,170,0.08)',
            }}
          >
            {/* Intro */}
            <div className="mb-10">
              <span
                className="inline-block text-[10px] md:text-[11px] font-mono uppercase tracking-[0.15em] mb-5"
                style={{ color: 'rgba(232,238,242,0.7)' }}
              >
                — 产品简介
              </span>
              <h2
                className="text-2xl md:text-4xl font-semibold leading-tight mb-6"
                style={{
                  color: '#E8EEF2',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                }}
              >
                11 年产品经验，擅长以结构化思维解决复杂业务问题
              </h2>
              <p
                className="text-[14px] md:text-base leading-relaxed"
                style={{ color: 'rgba(232,238,242,0.6)' }}
              >
                我是一名资深产品经理，做事高度结构化、重落地、重版本管理，习惯用标准化框架梳理需求与交付。看待问题习惯分层拆解，主动调研技术参数、政策规则、成本收益，不凭主观感觉下判断。
              </p>
              <p
                className="text-[14px] md:text-base leading-relaxed mt-4"
                style={{ color: 'rgba(232,238,242,0.5)' }}
              >
                我的工作横跨金融科技、用户增长与政务数字化三大领域，熟悉支付系统设计、API 协议、渠道合作管理与规模化盈利模型。无论是金融 App 从 0 到 1 的产品搭建，还是政务系统从方案到合同的复杂交付，我都追求严谨闭环、数据准确、剔除冗余。
              </p>
            </div>

            {/* Two info columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-10">
              <div>
                <h4
                  className="text-[11px] font-mono uppercase tracking-[0.15em] mb-4"
                  style={{ color: 'rgba(232,238,242,0.7)' }}
                >
                  核心领域
                </h4>
                <ul className="space-y-2.5">
                  {[
                    '金融科技 · 支付与账户体系',
                    '用户增长 · 获客与转化',
                    '政务数字化 · 复杂方案',
                    '产品管理 · 版本与迭代',
                  ].map((item) => (
                    <li
                      key={item}
                      className="text-[13px] md:text-[14px] flex items-start gap-2.5"
                      style={{ color: 'rgba(232,238,242,0.65)' }}
                    >
                      <span
                        className="text-sm mt-0.5 shrink-0"
                        style={{ color: '#00D4AA' }}
                      >
                        —
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4
                  className="text-[11px] font-mono uppercase tracking-[0.15em] mb-4"
                  style={{ color: 'rgba(232,238,242,0.7)' }}
                >
                  方法体系
                </h4>
                <ul className="space-y-2.5">
                  {[
                    '产品 Roadmap · 目标与里程碑',
                    '数据驱动决策 · 指标与验证',
                    '流程标准化 · PRD 与版本管理',
                    '多系统协同 · 接口与契约',
                  ].map((item) => (
                    <li
                      key={item}
                      className="text-[13px] md:text-[14px] flex items-start gap-2.5"
                      style={{ color: 'rgba(232,238,242,0.65)' }}
                    >
                      <span
                        className="text-sm mt-0.5 shrink-0"
                        style={{ color: '#00D4AA' }}
                      >
                        —
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Stats row — counter animation */}
            <StatsCounter />
          </div>
        </AnimatedBlock>
      </div>
    </section>
  );
}
