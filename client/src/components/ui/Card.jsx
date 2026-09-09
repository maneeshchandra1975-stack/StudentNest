import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function Card({ children, hover = false, className, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { type: 'spring', stiffness: 400, damping: 25 } } : undefined}
      className={cn(
        'sn-card backdrop-blur-md relative overflow-hidden',
        hover && 'sn-card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
