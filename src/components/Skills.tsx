import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from './SectionHeader';
import AnimatedBlock from './AnimatedBlock';

gsap.registerPlugin(ScrollTrigger);

interface Strength {
  index: string;
  title: string;
  titleEn: string;
  description: string;
  bullets: string[];
}

const strengths: Strength[] = [
  {
    index: '01',
    title: '逻辑清晰 · 结构化思维',
    titleEn: 'STRUCTURED THINKING',
    description: '以标准化框架梳理需求、设计方案，确保产品架构完整闭合',
    bullets: ['产品目标管理', '分层拆解与方案', 'PRD标准化文档', '流程版本管理'],
  },
  {
    index: '02',
    title: '数据驱动 · 可验证决策',
    titleEn: 'DATA-DRIVEN',
    description: '从业务指标体系设计与验证，核心业务数据洞察优化',
    bullets: ['指标体系搭建', '漏斗与数据分析', 'A/B测试方案', '数据洞察决策'],
  },
  {
    index: '03',
    title: '落地能力 · 从方案到产品',
    titleEn: 'DELIVERY',
    description: '推动多系统协同与落地，从抽象需求到具体产出',
    bullets: ['0到1搭建', '多系统协同', '复杂方案设计', '推进与落地'],
  },
  {
    index: '04',
    title: '跨团队协作 · 高效沟通',
    titleEn: 'CROSS-TEAM',
    description: '与研发、设计、商务、法务多团队协同推进项目',
    bullets: ['跨团队协同', '商务对接', '复杂沟通', '项目管理'],
  },
  {
    index: '05',
    title: '金融深耕 · 业务体系化能力',
    titleEn: 'FINANCE DEEP',
    description: '金融产品体系的账户、支付、风控、运营全流程掌握',
    bullets: ['支付系统设计', '账户体系搭建', '风控模型理解', '运营机制设计'],
  },
  {
    index: '06',
    title: '政务方案 · 复杂项目管理',
    titleEn: 'GOV. PROGRAM',
    description: '从售前方案到合同落地，全流程参与政务数字化项目',
    bullets: ['复杂项目统筹', '售前方案', '合同支撑', '合规理解'],
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative py-28 md:py-36 px-4 md:px-8 lg:px-12 bg-[#0A1628]"
    >
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ backgroundColor: 'rgba(0,212,170,0.1)' }}
      />

      <div className="max-w-page mx-auto">
        <SectionHeader title="PERSONAL STRENGTHS" subtitle="个人优势" />

        {/* Cards grid: 3 cols — stagger cardCascade */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {strengths.map((s, i) => (
            <AnimatedBlock key={s.index} mode="cardCascade" delay={0.08 + i * 0.09} duration={1.0} cascadeX={40} cascadeY={50} stagger={0}>
              <div
                className="relative h-full rounded-xl md:rounded-2xl p-7 md:p-8"
                style={{
                  backgroundColor: 'rgba(15,28,48,0.55)',
                  border: '1px solid rgba(0,212,170,0.08)',
                }}
              >
                {/* Top accent */}
                <div
                  className="flex items-center justify-between mb-5"
                  style={{
                    borderBottom: '1px solid rgba(232,238,242,0.03)',
                    paddingBottom: '1rem',
                  }}
                >
                  <span
                    className="text-[10px] font-mono tracking-[0.15em]"
                    style={{ color: '#00D4AA' }}
                  >
                    {s.titleEn}
                  </span>
                  <span
                    className="text-[10px] font-mono"
                    style={{ color: 'rgba(232,238,242,0.25)' }}
                  >
                    / {s.index}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-lg md:text-xl font-semibold mb-4"
                  style={{ color: '#E8EEF2', fontWeight: 600 }}
                >
                  {s.title}
                </h3>

                {/* Description */}
                <p
                  className="text-[12.5px] md:text-[13px] leading-relaxed mb-6"
                  style={{ color: 'rgba(232,238,242,0.55)' }}
                >
                  {s.description}
                </p>

                {/* Bullets */}
                <ul className="grid grid-cols-2 gap-x-2 gap-y-2">
                  {s.bullets.map((bullet, j) => (
                    <li
                      key={j}
                      className="text-[12px] md:text-[12.5px] flex items-start gap-2"
                      style={{ color: 'rgba(232,238,242,0.55)' }}
                    >
                      <span
                        className="text-[10px] mt-1 shrink-0"
                        style={{ color: '#00D4AA' }}
                      >
                        —
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedBlock>
          ))}
        </div>
      </div>
    </section>
  );
}
