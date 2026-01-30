import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface ConnectionFlowProps {
  isVisible: boolean;
}

export function ConnectionFlow({ isVisible }: ConnectionFlowProps) {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    if (isVisible) {
      // Create 5 flowing particles
      setParticles([0, 1, 2, 3, 4]);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] pointer-events-none" style={{ height: 'calc(20rem - 40px)' }}>
      {/* Vertical connecting line with gradient */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        className="absolute inset-0 origin-top"
        style={{
          background: 'linear-gradient(180deg, rgba(97, 97, 255, 0.6) 0%, rgba(97, 97, 255, 0.3) 50%, rgba(97, 97, 255, 0.6) 100%)',
          boxShadow: '0 0 20px rgba(97, 97, 255, 0.5), 0 0 40px rgba(97, 97, 255, 0.3)',
        }}
      />

      {/* Pulsing glow effect */}
      <motion.div
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.8, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(97, 97, 255, 0.6) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
      />

      {/* Flowing particles */}
      {particles.map((i) => (
        <motion.div
          key={i}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: ['0%', '100%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2.5,
            delay: i * 0.5 + 0.5,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(97, 97, 255, 0.8) 50%, transparent 100%)',
            boxShadow: '0 0 10px rgba(97, 97, 255, 0.8), 0 0 20px rgba(97, 97, 255, 0.4)',
          }}
        />
      ))}

      {/* Top connection point (under subtitle) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(97, 97, 255, 1) 0%, rgba(97, 97, 255, 0.5) 70%, transparent 100%)',
          boxShadow: '0 0 15px rgba(97, 97, 255, 0.8), 0 0 30px rgba(97, 97, 255, 0.4)',
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'rgba(97, 97, 255, 0.6)',
            boxShadow: '0 0 20px rgba(97, 97, 255, 0.6)',
          }}
        />
      </motion.div>

      {/* Bottom connection point (above AI Work Platform) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(97, 97, 255, 1) 0%, rgba(97, 97, 255, 0.5) 70%, transparent 100%)',
          boxShadow: '0 0 15px rgba(97, 97, 255, 0.8), 0 0 30px rgba(97, 97, 255, 0.4)',
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'rgba(97, 97, 255, 0.6)',
            boxShadow: '0 0 20px rgba(97, 97, 255, 0.6)',
          }}
        />
      </motion.div>
    </div>
  );
}