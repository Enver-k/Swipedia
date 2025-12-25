'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SWIPE_THRESHOLD, SWIPE_VELOCITY_THRESHOLD } from '@/lib/utils';

interface SwipeContainerProps {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp?: () => void;
  onTap?: () => void;
  disabled?: boolean;
  className?: string;
}

// Threshold for distinguishing tap from drag (in pixels)
const TAP_THRESHOLD = 10;

function SwipeContainer({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onTap,
  disabled = false,
  className,
}: SwipeContainerProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const hasDraggedRef = useRef(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Rotate card based on horizontal drag
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  
  // Opacity indicators for like/skip
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const skipOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info;
      
      // Check for swipe up (deep dive)
      if (onSwipeUp && offset.y < -SWIPE_THRESHOLD && Math.abs(offset.x) < SWIPE_THRESHOLD) {
        setExitDirection('up');
        setIsExiting(true);
        setTimeout(() => {
          onSwipeUp();
          setIsExiting(false);
          setExitDirection(null);
        }, 200);
        return;
      }
      
      // Check for horizontal swipes
      const shouldSwipe =
        Math.abs(offset.x) > SWIPE_THRESHOLD ||
        Math.abs(velocity.x) > SWIPE_VELOCITY_THRESHOLD;

      if (shouldSwipe) {
        const direction = offset.x > 0 ? 'right' : 'left';
        setExitDirection(direction);
        setIsExiting(true);
        
        setTimeout(() => {
          if (direction === 'right') {
            onSwipeRight();
          } else {
            onSwipeLeft();
          }
          setIsExiting(false);
          setExitDirection(null);
        }, 200);
      }
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp, onTap]
  );

  const exitVariants = {
    left: { x: -400, rotate: -20, opacity: 0 },
    right: { x: 400, rotate: 20, opacity: 0 },
    up: { y: -400, opacity: 0 },
  };

  return (
    <div className={cn('relative', className)}>
      {/* Like indicator */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        style={{ opacity: likeOpacity }}
      >
        <div className="px-6 py-2 border-4 border-green-500 rounded-lg rotate-[-20deg]">
          <span className="text-3xl font-bold text-green-500">LIKE</span>
        </div>
      </motion.div>

      {/* Skip indicator */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        style={{ opacity: skipOpacity }}
      >
        <div className="px-6 py-2 border-4 border-red-500 rounded-lg rotate-[20deg]">
          <span className="text-3xl font-bold text-red-500">SKIP</span>
        </div>
      </motion.div>

      {/* Draggable card */}
      <motion.div
        style={{ x, y, rotate }}
        drag={!disabled && !isExiting}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.9}
        onDragStart={() => {
          hasDraggedRef.current = false;
        }}
        onDrag={(_, info) => {
          // Mark as dragged if moved beyond tap threshold
          if (Math.abs(info.offset.x) > TAP_THRESHOLD || Math.abs(info.offset.y) > TAP_THRESHOLD) {
            hasDraggedRef.current = true;
          }
        }}
        onDragEnd={handleDragEnd}
        onClick={() => {
          // Only fire tap if we didn't drag
          if (!disabled && !hasDraggedRef.current && onTap) {
            onTap();
          }
        }}
        animate={
          isExiting && exitDirection
            ? exitVariants[exitDirection]
            : { x: 0, y: 0, rotate: 0 }
        }
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="cursor-pointer active:cursor-grabbing touch-none"
      >
        {children}
      </motion.div>
    </div>
  );
}

export { SwipeContainer };
