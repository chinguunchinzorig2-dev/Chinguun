import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';

interface AnimatedLetterProps {
  key?: React.Key;
  char: string;
  index: number;
  totalChars: number;
  progress: MotionValue<number>;
}

function AnimatedLetter({ char, index, totalChars, progress }: AnimatedLetterProps) {
  const charProgress = index / totalChars;

  // Active range mapping scroll progress to character opacity from 0.2 to 1
  const startRange = Math.max(0, charProgress - 0.1);
  const endRange = Math.min(1, charProgress + 0.05);

  // Avoid identical keys if startRange === endRange
  const safeStart = startRange;
  const safeEnd = endRange === startRange ? startRange + 0.0001 : endRange;

  const opacity = useTransform(
    progress,
    [safeStart, safeEnd],
    [0.2, 1]
  );

  return (
    <motion.span style={{ opacity }} className="inline">
      {char}
    </motion.span>
  );
}

interface ScrollRevealParagraphProps {
  text: string;
  className?: string;
}

export function ScrollRevealParagraph({ text, className = '' }: ScrollRevealParagraphProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.82', 'end 0.22'],
  });

  const characters = text.split('');
  const totalChars = characters.length;

  return (
    <p
      ref={containerRef}
      className={`${className} whitespace-pre-wrap tracking-wide leading-relaxed font-normal`}
    >
      {characters.map((char, index) => (
        <AnimatedLetter
          key={index}
          char={char}
          index={index}
          totalChars={totalChars}
          progress={scrollYProgress}
        />
      ))}
    </p>
  );
}
