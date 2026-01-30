import { motion, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';

interface CounterAnimationProps {
  value: number;
  duration?: number;
}

export function CounterAnimation({ value, duration = 1 }: CounterAnimationProps) {
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}
