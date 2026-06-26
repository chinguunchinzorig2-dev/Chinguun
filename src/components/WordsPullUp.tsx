import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
}

export function WordsPullUp({ text, className = '', showAsterisk = false }: WordsPullUpProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  const words = text.split(' ').filter(Boolean);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
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
        ease: [0.16, 1, 0.3, 1], // Custom cinematic ease
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
      {words.map((word, wordIdx) => {
        const isLastWord = wordIdx === words.length - 1;
        return (
          <span key={wordIdx} className="mr-[0.25em] last:mr-0 inline-block">
            <motion.span
              variants={wordVariants}
              className="inline-block relative"
            >
              {isLastWord && showAsterisk ? (
                <>
                  <span>{word}</span>
                  <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] select-none text-[#E1E0CC] font-sans">
                    *
                  </span>
                </>
              ) : (
                word
              )}
            </motion.span>
          </span>
        );
      })}
    </motion.div>
  );
}
