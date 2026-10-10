import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from './SectionHeader';
import AnimatedBlock from './AnimatedBlock';

gsap.registerPlugin(ScrollTrigger);

interface Experience {
  company: string;
  role: string;
  industry: string;
  period: string;
  location: string;
  summary: string;
  highlight: string;
  tags: string[];
}

const experiences: Experience[] = [
  {
    company: '橡树黑卡',
    role: '金融产品经理',
    industry: '金融权益 / 支付系统',
    period: '2024.03 — 至今',
    location: '深圳',
    summary: '负责金融权益合作接入与平台支付能力建设，主导协议支付与分账产品从方案到落地。',
    highlight: '10+ 项目协议支付与空中分账架构设计',
    tags: ['API 接入', '支付中台', '售前方案'],
  },
  {
    company: '招商银行',
    role: '资深产品经理',
    industry: '零售金融',
    period: '2022.12 — 2023.07',
    location: '深圳',
    summary: '负责零售信贷业务在移动端的产品迭代，用数据洞察驱动产品策略调整，推动与外部企业的 API 直连合作。',
    highlight: '核心业务申请量下降 30%，关键转化漏损率下降 28%',
    tags: ['零售信贷', '流程优化', '数据驱动'],
  },
  {
    company: '中国平安',
    role: '资深产品经理',
    industry: '政务数字化',
    period: '2020.04 — 2022.07',
    location: '深圳',
    summary: '负责政务数字化产品的多系统统筹，推进多项目与多模块并行交付，参与售前方案设计与合同签约。',
    highlight: '协助签约 3000w+，产品方案获国家级嘉奖',
    tags: ['To G 项目', '多系统统筹', '产品规划'],
  },
  {
    company: '新浪',
    role: '高级产品经理',
    industry: '互联网金融',
    period: '2017.04 — 2020.04',
    location: '北京',
    summary: '从零搭建金融 App 产品体系，主导从上线到规模化盈利的全过程，负责资金方对接与增长策略。',
    highlight: '上线即收支平衡，单月净利润 3000w+',
    tags: ['0-1 搭建', '用户增长', '商业化'],
  },
];

function CareerCard({ experience, index }: { experience: Experience; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Cascade children inside the card: period → company → role → summary → key result → tags
      const children = el.querySelectorAll('.card-item');
      gsap.fromTo(
        children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          delay: 0.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <AnimatedBlock mode="cardCascade" delay={0.1 + index * 0.12} duration={1.0} cascadeX={50} cascadeY={40} stagger={0}>
      <div
        ref={cardRef}
        className="relative h-full rounded-xl md:rounded-2xl p-5 md:p-7 flex flex-col"
        style={{
          backgroundColor: 'rgba(15,28,48,0.55)',
          border: '1px solid rgba(0,212,170,0.08)',
        }}
      >
        {/* Teal accent markers */}
        <span className="absolute top-2 left-2 text-xs card-item" style={{ color: '#00D4AA' }}>
          ✦
        </span>
        <span className="absolute top-2 right-2 text-xs card-item" style={{ color: '#00D4AA' }}>
          ✦
        </span>

        {/* Period */}
        <div
          className="text-[10px] md:text-[11px] font-mono tracking-wider mb-4 card-item"
          style={{ color: 'rgba(232,238,242,0.35)' }}
        >
          {experience.period}
        </div>

        {/* Company */}
        <h3
          className="text-lg md:text-xl font-semibold mb-3 leading-tight card-item"
          style={{ color: '#E8EEF2', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
        >
          {experience.company}
        </h3>

        {/* Role pill */}
        <div className="mb-4 card-item">
          <span
            className="inline-block text-[11px] md:text-xs font-medium px-3 py-1 rounded-full"
            style={{
              backgroundColor: 'transparent',
              color: '#E8EEF2',
              border: '1px solid rgba(232,238,242,0.25)',
            }}
          >
            {experience.role}
          </span>
        </div>

        {/* Summary */}
        <p
          className="text-[12.5px] md:text-[13px] leading-relaxed mb-5 flex-1 card-item"
          style={{ color: 'rgba(232,238,242,0.55)' }}
        >
          {experience.summary}
        </p>

        {/* Key result */}
        <div
          className="rounded-lg p-3 md:p-3.5 mb-5 card-item"
          style={{
            backgroundColor: 'rgba(0,212,170,0.08)',
            border: '1px solid rgba(232,238,242,0.08)',
          }}
        >
          <span
            className="block text-[9px] md:text-[10px] font-mono uppercase tracking-wider mb-1.5"
            style={{ color: '#00D4AA' }}
          >
            关键成果
          </span>
          <p
            className="text-[12px] md:text-[12.5px] leading-relaxed"
            style={{ color: 'rgba(232,238,242,0.75)' }}
          >
            {experience.highlight}
          </p>
        </div>

        {/* Tags and location */}
        <div className="flex items-start justify-between gap-2 card-item">
          <div className="flex flex-wrap gap-1.5">
            {experience.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] md:text-[10.5px] px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: 'rgba(232,238,242,0.03)',
                  color: 'rgba(232,238,242,0.4)',
                  border: '1px solid rgba(232,238,242,0.05)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <span
            className="text-[10px] md:text-[10.5px] shrink-0"
            style={{ color: 'rgba(232,238,242,0.3)' }}
          >
            {experience.location}
          </span>
        </div>

        {/* Bottom line with index */}
        <div
          className="mt-5 pt-3 flex items-center justify-between card-item"
          style={{ borderTop: '1px solid rgba(232,238,242,0.03)' }}
        >
          <span
            className="text-[10px] font-mono"
            style={{ color: 'rgba(232,238,242,0.5)' }}
          >
            {experience.industry}
          </span>
          <span
            className="text-[10px] font-mono"
            style={{ color: 'rgba(232,238,242,0.2)' }}
          >
            / 0{index + 1}
          </span>
        </div>
      </div>
    </AnimatedBlock>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative py-28 md:py-36 px-4 md:px-8 lg:px-12"
    >
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ backgroundColor: 'rgba(0,212,170,0.1)' }}
      />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,170,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="max-w-page mx-auto relative z-10">
        <SectionHeader title="WORK EXPERIENCE" subtitle="个人经历" />

        {/* Career path label */}
        <AnimatedBlock mode="titleReveal" delay={0.15} duration={1.0}>
          <div
            className="flex items-center gap-3 mb-8 md:mb-10"
            style={{ color: 'rgba(232,238,242,0.5)' }}
          >
            <span className="text-[10px] font-mono tracking-wider">CAREER PATH</span>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: 'rgba(232,238,242,0.08)' }}
            />
            <span className="text-[10px] font-mono tracking-wider">11 年累计</span>
          </div>
        </AnimatedBlock>

        {/* 4 cards horizontal row — stagger cardCascade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {experiences.map((exp, i) => (
            <CareerCard key={exp.company} experience={exp} index={i} />
          ))}
        </div>

        {/* Bottom summary line */}
        <AnimatedBlock mode="slideUp" delay={0.6} duration={1.0}>
          <div
            className="mt-12 md:mt-16 flex items-center justify-between text-[11px] md:text-xs font-mono"
            style={{ color: 'rgba(232,238,242,0.25)' }}
          >
            <span>— 4 家企业</span>
            <span style={{ color: 'rgba(232,238,242,0.3)' }}>持续进化 / CONTINUED</span>
          </div>
        </AnimatedBlock>
      </div>
    </section>
  );
}
