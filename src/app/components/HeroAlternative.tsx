import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import sidekickIcon from '@/assets/sidekick-icon.png';

export function HeroAlternative() {
  const fullText = "Welcome to the new world of work made by monday AI";
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  // Delay before typing starts (show star first)
  useEffect(() => {
    const startDelay = setTimeout(() => {
      setHasStartedTyping(true);
    }, 1000); // Show star for 1 second before typing starts
    return () => clearTimeout(startDelay);
  }, []);

  // Typing effect - only starts after delay
  useEffect(() => {
    if (!hasStartedTyping) return;
    if (displayedText.length < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      }, 45);
      return () => clearTimeout(timer);
    } else {
      setIsTypingComplete(true);
    }
  }, [displayedText, hasStartedTyping]);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Highlight "work made by monday AI" in the text with animated effect
  const renderText = () => {
    const highlightStart = fullText.indexOf("work made by");
    const currentLength = displayedText.length;
    
    if (currentLength <= highlightStart) {
      return (
        <span className="text-gray-900">
          {displayedText}
        </span>
      );
    }
    
    const beforeHighlight = displayedText.slice(0, highlightStart);
    const highlightPart = displayedText.slice(highlightStart);
    
    return (
      <>
        <span className="text-gray-900">{beforeHighlight}</span>
        <motion.span 
          className="relative inline-block"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated gradient text */}
          <motion.span
            className="relative z-10"
            style={{
              background: 'linear-gradient(90deg, #6161ff 0%, #9061ff 25%, #ff6b9d 50%, #ff9d6b 75%, #6161ff 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {highlightPart}
          </motion.span>
          
          {/* Glow effect behind text */}
          <motion.span
            className="absolute inset-0 blur-lg opacity-50 z-0"
            style={{
              background: 'linear-gradient(90deg, #6161ff 0%, #9061ff 25%, #ff6b9d 50%, #ff9d6b 75%, #6161ff 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {highlightPart}
          </motion.span>

          {/* Sparkle effects */}
          {isTypingComplete && (
            <>
              <motion.span
                className="absolute -top-2 -right-2 w-3 h-3"
                style={{
                  background: 'radial-gradient(circle, #fff 0%, transparent 70%)',
                  boxShadow: '0 0 10px #9061ff, 0 0 20px #6161ff',
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5,
                }}
              />
              <motion.span
                className="absolute -bottom-1 left-1/4 w-2 h-2"
                style={{
                  background: 'radial-gradient(circle, #fff 0%, transparent 70%)',
                  boxShadow: '0 0 8px #ff6b9d, 0 0 15px #ff6b9d',
                }}
                animate={{
                  scale: [0, 1.2, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: 1,
                }}
              />
              <motion.span
                className="absolute top-1/2 -left-3 w-2 h-2"
                style={{
                  background: 'radial-gradient(circle, #fff 0%, transparent 70%)',
                  boxShadow: '0 0 8px #6161ff, 0 0 15px #6161ff',
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: 1.5,
                }}
              />
            </>
          )}
        </motion.span>
      </>
    );
  };

  return (
    <section className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Animated background gradient mesh */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating orbs */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(97, 97, 255, 0.08) 0%, transparent 70%)',
            top: '-10%',
            right: '-10%',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 107, 157, 0.06) 0%, transparent 70%)',
            bottom: '-5%',
            left: '-5%',
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(144, 97, 255, 0.05) 0%, transparent 70%)',
            top: '40%',
            left: '30%',
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: i % 3 === 0 ? '#6161ff' : i % 3 === 1 ? '#9061ff' : '#ff6b9d',
              left: `${10 + (i * 7)}%`,
              top: `${20 + (i * 5) % 60}%`,
              opacity: 0.3,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-center max-w-6xl mx-auto relative z-10"
      >
        {/* Main Headline with Typing Effect */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-semibold leading-[1.1] tracking-tight">
            {renderText()}
            {/* Star - only before typing starts */}
            {!hasStartedTyping && (
              <img 
                src={sidekickIcon} 
                alt="" 
                className="inline-block w-8 h-8 ml-2 align-middle animate-pulse"
              />
            )}
          </h1>
        </div>

        {/* Subheadline - smaller */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: isTypingComplete ? 1 : 0, y: isTypingComplete ? 0 : 15 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-sm md:text-base text-gray-500 max-w-xl mx-auto tracking-wide"
        >
          Accelerate your business goals with the best AI work platform
        </motion.p>

        {/* Animated underline decoration */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ 
            scaleX: isTypingComplete ? 1 : 0, 
            opacity: isTypingComplete ? 1 : 0 
          }}
          transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
          className="mt-12 mx-auto w-32 h-1 rounded-full bg-gradient-to-r from-[#6161ff] via-[#9061ff] to-[#ff6b9d]"
          style={{ transformOrigin: 'center' }}
        />

        {/* Subtle scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isTypingComplete ? 1 : 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 mx-auto border-2 border-gray-300 rounded-full flex justify-center pt-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 bg-gray-400 rounded-full"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
