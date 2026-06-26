/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, RefObject } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Trophy } from 'lucide-react';
import { WordsPullUp } from './components/WordsPullUp';
import { WordsPullUpMultiStyle } from './components/WordsPullUpMultiStyle';
import { ScrollRevealParagraph } from './components/ScrollRevealParagraph';
import { FeatureCard } from './components/FeatureCard';
import { ArcadeGame } from './components/ArcadeGame';
import { SunoAudioPlayer } from './components/SunoAudioPlayer';
// @ts-ignore
import prismaAlbumCover from './assets/images/prisma_album_cover_1782439945149.jpg';

export default function App() {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [arcadeInitialTab, setArcadeInitialTab] = useState<'menu' | 'shooter' | 'runner' | 'clicker' | 'game3d'>('menu');

  // References for scroll navigation anchor targets
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  // InView detectors for triggering page components
  const featuresInViewRef = useRef<HTMLDivElement>(null);
  const featuresInView = useInView(featuresInViewRef, { once: true, margin: '-100px' });

  const mediaInViewRef = useRef<HTMLDivElement>(null);
  const mediaInView = useInView(mediaInViewRef, { once: true, margin: '-100px' });

  const navItems = [
    { label: 'Our story', target: aboutRef },
    { label: 'Creative Life', target: featuresRef },
    { label: 'Spotlight', target: mediaRef },
  ];

  const handleNavClick = (targetRef: RefObject<HTMLDivElement | null>) => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const aboutHeadingSegments = [
    { text: 'Sain baina uu, namaig Chinguun gedeg. ', className: 'font-normal text-[#E1E0CC]' },
    { text: 'Bi 14 nastэй, ', className: 'italic font-serif text-primary' },
    { text: '40-р сургуулийн сурагч бөгөөд спортоор хичээллэж, дуу хөгжим сонирхдог.', className: 'font-normal text-[#E1E0CC]' },
  ];

  const featuresHeadingLine1 = [
    { text: 'Daily lifestyles, favorite movies, and urban beats.', className: 'text-primary' },
  ];

  const featuresHeadingLine2 = [
    { text: 'Curating energy. Driven by action.', className: 'text-gray-500' },
  ];

  return (
    <div className="bg-black text-[#E1E0CC] min-h-screen selection:bg-primary selection:text-black">
      {/* SECTION 1: HERO */}
      <section
        ref={heroRef}
        className="h-screen w-full p-4 md:p-6 relative box-border flex flex-col"
        id="hero"
      >
        <div className="w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden relative bg-black flex flex-col justify-end shadow-2xl">
          {/* Background Cinematic Video */}
          <video
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0"
          />

          {/* Fractal Noise Overlay */}
          <div className="absolute inset-0 noise-overlay opacity-[0.7] mix-blend-overlay pointer-events-none z-10" />

          {/* Cinematic Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none z-20" />

          {/* NAVBAR - Embedded inside Hero Container */}
          <nav className="absolute top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
            <div className="bg-black/95 backdrop-blur-md rounded-b-2xl md:rounded-b-3xl px-4 py-2 sm:px-6 sm:py-2.5 md:px-10 md:py-3.5 flex items-center justify-center shadow-lg border-b border-x border-white/5">
              <div className="flex items-center gap-3 sm:gap-6 md:gap-10 lg:gap-12 flex-wrap justify-center">
                {navItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavClick(item.target)}
                    onMouseEnter={() => setHoveredNav(item.label)}
                    onMouseLeave={() => setHoveredNav(null)}
                    style={{
                      color: hoveredNav === item.label ? '#E1E0CC' : 'rgba(225, 224, 204, 0.8)',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className="text-[10px] sm:text-xs md:text-sm font-medium tracking-widest uppercase cursor-pointer whitespace-nowrap outline-none hover:opacity-100 focus-visible:ring-1 focus-visible:ring-primary/50 rounded-sm py-0.5"
                  >
                    {item.label}
                  </button>
                ))}
                
                {/* Special Arcade Play button */}
                <button
                  onClick={() => {
                    setArcadeInitialTab('menu');
                    setIsArcadeOpen(true);
                  }}
                  onMouseEnter={() => setHoveredNav('arcade')}
                  onMouseLeave={() => setHoveredNav(null)}
                  style={{
                    color: hoveredNav === 'arcade' ? '#DEDBC8' : 'rgba(222, 219, 200, 0.85)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="text-[9px] sm:text-[10px] md:text-xs font-bold tracking-widest uppercase cursor-pointer whitespace-nowrap outline-none hover:scale-105 rounded-full px-2.5 py-1 bg-primary/10 border border-primary/30 flex items-center gap-1 transition-transform"
                >
                  <span className="animate-pulse">🕹️</span>
                  <span>Тоглоом тоглох</span>
                </button>
              </div>
            </div>
          </nav>

          {/* HERO CONTENT: Bottom-Aligned Row Grid */}
          <div className="relative z-30 p-6 sm:p-8 md:p-12 lg:p-16 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
              
              {/* Giant Left Title "Prisma" */}
              <div className="lg:col-span-8 flex flex-col items-start leading-[0.8] w-full">
                <WordsPullUp
                  text="Prisma"
                  showAsterisk={true}
                  className="text-[24vw] sm:text-[22vw] md:text-[20vw] lg:text-[19vw] xl:text-[18vw] font-medium leading-[0.85] tracking-[-0.07em] text-[#E1E0CC] select-none"
                />
              </div>

              {/* Description & CTA on Right */}
              <div className="lg:col-span-4 flex flex-col items-start gap-5 sm:gap-6 md:gap-8 xl:pl-4">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.5,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-primary/70 text-xs sm:text-sm md:text-base leading-snug font-sans tracking-wide"
                >
                  Namaig Chinguun gedeg. Bi 14 nastai. Prisma is my creative workspace and digital canvas, built to fuse cinematic action, urban music, and interactive web aesthetics.
                </motion.p>

                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.7,
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onClick={() => handleNavClick(mediaRef)}
                    className="inline-flex items-center gap-2 bg-primary text-black rounded-full pl-5 pr-1.5 py-1.5 sm:pl-6 sm:pr-2 sm:py-2 hover:gap-3 transition-all duration-300 group select-none font-semibold text-xs sm:text-sm cursor-pointer shadow-lg shadow-primary/10 hover:shadow-primary/20"
                  >
                    <span>Watch Spotlight</span>
                    <div className="bg-black rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0">
                      <ArrowRight className="text-primary w-4 h-4" />
                    </div>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.8,
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onClick={() => {
                      setArcadeInitialTab('menu');
                      setIsArcadeOpen(true);
                    }}
                    className="inline-flex items-center gap-2 bg-[#212121] border border-white/10 hover:border-primary/40 text-[#E1E0CC] rounded-full px-5 py-2 hover:bg-black transition-all duration-300 select-none font-semibold text-xs sm:text-sm cursor-pointer shadow-md"
                  >
                    <span>🕹️ Play Arcade Game</span>
                  </motion.button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT */}
      <section
        ref={aboutRef}
        className="py-24 px-4 sm:px-6 md:px-12 flex flex-col items-center justify-center bg-black min-h-[90vh]"
        id="about"
      >
        <div className="bg-[#101010] border border-white/5 rounded-[2rem] p-8 sm:p-12 md:p-16 lg:p-20 w-full max-w-6xl text-center flex flex-col items-center gap-6 sm:gap-8 shadow-2xl relative overflow-hidden">
          {/* Subtle noise grid accent inside cards */}
          <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none mix-blend-overlay" />

          {/* Category Pill Tag */}
          <span className="text-primary text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase select-none relative z-10 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            About me / Танилцуулга
          </span>

          {/* Interactive Multi-Style Staggered heading */}
          <div className="max-w-4xl mx-auto my-4 relative z-10">
            <WordsPullUpMultiStyle
              segments={aboutHeadingSegments}
              className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl xl:text-6xl max-w-3xl mx-auto leading-[1.05] sm:leading-[1.1] text-center tracking-tight"
            />
          </div>

          {/* Scroll reveal Character paragraph with progressive opacity */}
          <div className="max-w-2xl mx-auto mt-4 relative z-10">
            <ScrollRevealParagraph
              text="40-р сургуулийн сурагч миний бие чөлөөт цагаа спорт болон дуу хөгжимд зориулдаг. Сагсан бөмбөг тоглох, унадаг дугуй унах дуртай бөгөөд кино урлагийн ертөнцөөс Спайдермен (Spider-Man)-ий гайхалтай түүхүүдэд маш их дуртай. Мөн Vandebo, Tamir зэрэг хамтлагуудын уран бүтээлийг сонсож урам зориг авдаг билээ."
              className="text-[#DEDBC8] text-xs sm:text-sm md:text-base text-center leading-relaxed font-light"
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES */}
      <section
        ref={featuresRef}
        className="min-h-screen bg-black relative py-20 px-4 sm:px-6 md:px-12 flex flex-col justify-center overflow-hidden"
        id="features"
      >
        {/* Subtle Background Noise Overlay */}
        <div className="absolute inset-0 bg-noise opacity-[0.14] pointer-events-none mix-blend-overlay z-0" />

        {/* Header containing multi-style headers with delay staggers */}
        <div className="flex flex-col items-center gap-3 text-center mb-16 md:mb-20 max-w-4xl mx-auto relative z-10">
          <WordsPullUpMultiStyle
            segments={featuresHeadingLine1}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight"
          />
          <WordsPullUpMultiStyle
            segments={featuresHeadingLine2}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight"
            delayOffset={0.3}
          />
        </div>

        {/* 4-Column Feature Card Grid */}
        <motion.div
          ref={featuresInViewRef}
          initial="hidden"
          animate={featuresInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:h-[480px] gap-4 lg:gap-3 max-w-7xl mx-auto w-full relative z-10"
        >
          {/* Card 1: Live Video Card */}
          <FeatureCard
            index={0}
            type="video"
            videoUrl="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
            bottomText="Your creative canvas."
          />

          {/* Card 2: Sports & Hobbies */}
          <FeatureCard
            index={1}
            type="content"
            avatarUrl="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85"
            title="Sports & Hobbies."
            number="01"
            checklist={[
              'Basketball drills & team matches',
              'Sagsan bombog togloh',
              'Cycling & city exploration',
              'Unadag dugui unah дуртай',
            ]}
          />

          {/* Card 3: Favorite Artists */}
          <FeatureCard
            index={2}
            type="content"
            avatarUrl="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85"
            title="Sonic Inspiration."
            number="02"
            checklist={[
              'Vandebo hit soundtracks',
              'Tamir energetic rap music',
              'Rhythm & audio aesthetics',
              'Energetic beat syncing',
            ]}
          />

          {/* Card 4: Academics */}
          <FeatureCard
            index={3}
            type="content"
            avatarUrl="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85"
            title="Academics."
            number="03"
            checklist={[
              '40-р сургуулийн сурагч',
              'Creative arts & computer science',
              'UI/UX design exploration',
              'Visionary thinking',
            ]}
          />
        </motion.div>
      </section>

      {/* SECTION 4: MEDIA SPOTLIGHT SHOWCASE */}
      <section
        ref={mediaRef}
        className="py-24 px-4 sm:px-6 md:px-12 bg-black border-t border-white/5 relative"
        id="spotlight"
      >
        <div className="absolute inset-0 bg-noise opacity-[0.06] pointer-events-none mix-blend-overlay z-0" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center gap-2 text-center mb-16">
            <span className="text-primary text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10 select-none">
              Media Spotlight // Сонгомол контент
            </span>
            <WordsPullUp
              text="Cinematic Inspirations"
              className="text-2xl sm:text-3xl md:text-5xl font-normal text-[#E1E0CC] tracking-tight mt-2"
            />
          </div>

          <motion.div
            ref={mediaInViewRef}
            initial={{ opacity: 0, y: 30 }}
            animate={mediaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
          >
            {/* Spider-Man Image Showcase */}
            <div className="lg:col-span-6 bg-[#101010] border border-white/5 rounded-[1.5rem] p-6 flex flex-col justify-between group shadow-xl">
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] w-full border border-white/10 flex items-center justify-center bg-black">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEjhz1NkrsFaWOi3DwKlU6oQ6ZiPi-QhT3t2FPMPGReQ&s=10"
                  alt="Spider-Man cinematic reference"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[10px] font-mono uppercase bg-black/90 px-2 py-0.5 rounded text-primary/80 border border-white/10 tracking-widest leading-none select-none">
                  Reference: Spider-Man
                </span>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-[#E1E0CC] text-base font-medium">Heroism & Visual Art</h4>
                  <span className="text-gray-500 font-mono text-[10px]">SPIDEY-01</span>
                </div>
                <p className="text-gray-400 text-xs font-light leading-relaxed">
                  Кино урлагийн сор бүтээл болох Spider-Man нь миний хамгийн дуртай бүтээлүүдийн нэг юм. Энэхүү түүх, өнгө аяс, дүр дүрслэл нь надад шинэ зүйлийг туршиж үзэх урам зоригийг өгдөг.
                </p>
              </div>
            </div>

            {/* Suno Embed Player Showcase */}
            <div className="lg:col-span-6 bg-[#101010] border border-white/5 rounded-[1.5rem] p-6 flex flex-col justify-between group shadow-xl">
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] w-full border border-white/10 flex items-center justify-center bg-black">
                {/* Custom Generated Album Cover Image */}
                <img
                  src={prismaAlbumCover}
                  alt="Suno Anthem Album Cover"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[10px] font-mono uppercase bg-black/90 px-2 py-0.5 rounded text-primary/80 border border-white/10 tracking-widest leading-none select-none">
                  Suno AI Song Cover
                </span>
              </div>
              
              <div className="mt-6 flex flex-col gap-4">
                {/* Custom Audio Player that streams directly without iframe block or 404 */}
                <SunoAudioPlayer songId="6PQx90KN2jNKqSrs" songTitle="My Suno Anthem" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PERSISTENT MINIMAL CINEMATIC FOOTER */}
      <footer className="py-12 bg-black border-t border-white/5 text-center flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 max-w-7xl mx-auto w-full gap-4 relative z-10 text-xs text-gray-500 font-light">
        <div className="flex items-center gap-2">
          <span className="font-medium text-primary select-none font-mono">P R I S M A</span>
          <span>© 2026 Chinguun. All rights preserved.</span>
        </div>
        <div className="flex gap-6">
          <a href="#hero" className="hover:text-primary transition-colors">Back to top</a>
          <span className="text-gray-800">|</span>
          <span className="select-none text-[10px] bg-primary/5 border border-primary/10 rounded px-2 py-0.5 text-primary/70">LABS 2.0</span>
        </div>
      </footer>

      {/* Retro Arcade Game Overlay Modal */}
      <ArcadeGame isOpen={isArcadeOpen} onClose={() => setIsArcadeOpen(false)} initialTab={arcadeInitialTab} />
    </div>
  );
}
