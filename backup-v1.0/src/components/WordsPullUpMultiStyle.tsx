import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  delay?: number;
}

export default function WordsPullUpMultiStyle({
  segments,
  className = '',
  delay = 0,
}: WordsPullUpMultiStyleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  // Build a flat list of words, each carrying its parent segment's className
  const flatWords: { word: string; className: string }[] = [];
  for (const seg of segments) {
    const words = seg.text.split(' ');
    for (const word of words) {
      flatWords.push({ word, className: seg.className ?? '' });
    }
  }

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`}>
      {flatWords.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom mr-[0.2em] last:mr-0"
        >
          <motion.span
            initial={{ y: '100%', opacity: 0 }}
            animate={inView ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: delay + i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`inline-block ${w.className}`}
          >
            {w.word}
          </motion.span>
        </span>
      ))}
    </div>
  );
}
