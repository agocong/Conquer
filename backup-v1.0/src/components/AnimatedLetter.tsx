import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedLetterProps {
  char: string;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  startOffset: number;
  endOffset: number;
  containerRef: React.RefObject<HTMLElement | null>;
}

export default function AnimatedLetter({
  char,
  index,
  total,
  scrollYProgress,
  startOffset,
  endOffset,
  containerRef,
}: AnimatedLetterProps) {
  const charProgress = index / total;
  const range: [number, number] = [
    Math.max(0, charProgress - 0.1),
    Math.min(1, charProgress + 0.05),
  ];

  // We need to remap global scroll progress to the container's local range
  const opacity = useTransform(scrollYProgress, [startOffset, endOffset], [0.2, 1]);
  // Apply per-character stagger via range mapping: only animate when scroll is in this char's range
  const localOpacity = useTransform(
    opacity,
    // opacity returns 0.2..1; we re-map it so that characters light up at different scroll points
    [0.2, 0.2 + (range[0] * 0.6), 0.2 + (range[1] * 0.6), 1],
    [0.2, 0.2, 1, 1]
  );

  return (
    <motion.span
      style={{ opacity: localOpacity }}
      className="inline-block"
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
}
