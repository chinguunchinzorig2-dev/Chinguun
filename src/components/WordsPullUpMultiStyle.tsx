import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { TextSegment } from '../types';

interface WordsPullUpMultiStyleProps {
  segments: TextSegment[];
  className?: string;
  delayOffset?: number;
}

export function WordsPullUpMultiStyle({ segments, className = '', delayOffset = 0 }: WordsPullUpMultiStyleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  // Flatten segments into individual words, keeping their specific className and a global index.
  const allWords: { word: string; className?: string }[] = [];
  segments.forEach((seg) => {
    const wordsInSeg = seg.text.split(' ').filter(Boolean);
    wordsInSeg.forEach((w) => {
      allWords.push({ word: w, className: seg.className });
    });
  });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: delayOffset,
      },
    },
  };

  const wordVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className={`inline-flex flex-wrap justify-center ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {allWords.map((item, index) => (
        <span
          key={index}
          className="mr-[0.25em] last:mr-0 inline-block"
        >
          <motion.span
            variants={wordVariants}
            className={`inline-block ${item.className || ''}`}
          >
            {item.word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}
