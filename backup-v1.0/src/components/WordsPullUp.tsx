import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface WordsPullUpProps {
  text: string;
  className?: string;
  wordClassName?: string;
  showAsterisk?: boolean;
  delay?: number;
}

export default function WordsPullUp({
  text,
  className = '',
  wordClassName = '',
  showAsterisk = false,
  delay = 0,
}: WordsPullUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const words = text.split(' ');

  return (
    <div ref={ref} className={className}>
      {words.map((word, i) => {
        const endsWithA = showAsterisk && i === words.length - 1 && word.toLowerCase().endsWith('a');

        return (
          <span
            key={i}
            className="inline-block overflow-hidden align-bottom mr-[0.2em] last:mr-0"
          >
            <motion.span
              initial={{ y: '120%', opacity: 0 }}
              animate={inView ? { y: '0%', opacity: 1 } : { y: '120%', opacity: 0 }}
              transition={{
                duration: 0.85,
                delay: delay + i * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`inline-block ${wordClassName}`}
            >
              {endsWithA ? (
                <>
                  {word.slice(0, -1)}
                  <span className="relative inline-block">
                    a
                    <span
                      className="absolute text-[0.31em] top-[0.65em] -right-[0.3em] font-medium"
                      style={{ color: '#ffffff' }}
                    >
                      *
                    </span>
                  </span>
                </>
              ) : (
                word
              )}
            </motion.span>
          </span>
        );
      })}
    </div>
  );
}
