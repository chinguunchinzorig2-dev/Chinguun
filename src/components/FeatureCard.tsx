import { Check, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface FeatureCardProps {
  index: number;
  type: 'video' | 'content';
  videoUrl?: string;
  avatarUrl?: string;
  title?: string;
  number?: string;
  checklist?: string[];
  bottomText?: string;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (customIndex: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: customIndex * 0.15,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function FeatureCard({
  index,
  type,
  videoUrl,
  avatarUrl,
  title,
  number,
  checklist = [],
  bottomText,
}: FeatureCardProps) {
  if (type === 'video' && videoUrl) {
    return (
      <motion.div
        custom={index}
        variants={cardVariants}
        className="relative h-[360px] lg:h-full p-6 sm:p-8 flex flex-col justify-end overflow-hidden rounded-2xl md:rounded-[1.5rem] border border-white/5 shadow-xl group"
      >
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full absolute inset-0 z-0 select-none pointer-events-none"
        />
        <div className="bg-gradient-to-t from-black/80 via-black/20 to-transparent absolute inset-0 z-10" />
        <div className="relative z-20">
          <p className="text-[#E1E0CC] font-normal text-sm sm:text-base md:text-lg tracking-wide transform transition-transform duration-500 group-hover:translate-x-1">
            {bottomText || 'Your creative canvas.'}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      className="h-[360px] lg:h-full p-6 sm:p-8 bg-[#212121] rounded-2xl md:rounded-[1.5rem] border border-white/5 flex flex-col justify-between overflow-hidden relative group"
    >
      <div className="flex flex-col gap-4">
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={title || 'Icon'}
            referrerPolicy="no-referrer"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-white/10 select-none shadow-md"
          />
        )}
        <div>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-[#E1E0CC] font-bold text-lg sm:text-xl tracking-tight">
              {title}
            </h3>
            <span className="text-gray-500 font-mono text-xs sm:text-sm select-none">
              {number}
            </span>
          </div>
        </div>
      </div>

      <ul className="flex flex-col gap-3 my-4">
        {checklist.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
            <Check className="text-primary w-4 h-4 mt-0.5 shrink-0" />
            <span className="text-gray-400 font-light leading-snug">{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-2">
        <button
          type="button"
          className="flex items-center gap-1.5 text-primary/80 hover:text-[#E1E0CC] text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 group/btn select-none hover:underline underline-offset-4 cursor-pointer self-start"
        >
          <span>Learn more</span>
          <ArrowRight className="w-4 h-4 rotate-[-45deg] transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>
      </div>
    </motion.div>
  );
}
