"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

export const appleEase = [0.25, 0.46, 0.45, 0.94] as const;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = {
  duration: 0.4,
  ease: appleEase,
};

export const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: appleEase },
  },
};

type PageTransitionProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
};

export function PageTransition({ children, className, ...props }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
