'use client';
import {
  Children,
  ReactNode,
  createContext,
  useContext,
  useRef,
  memo,
} from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Simple context for carousel state
type CarouselContextType = {
  index: number;
  setIndex: (newIndex: number) => void;
  itemsCount: number;
};

const CarouselContext = createContext<CarouselContextType | undefined>(undefined);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a Carousel');
  }
  return context;
}

export type CarouselProps = {
  children: ReactNode;
  className?: string;
  index: number;
  onIndexChange: (newIndex: number) => void;
  itemsCount?: number;
};

// Main Carousel component - simplified, no internal state management
function Carousel({
  children,
  className,
  index,
  onIndexChange,
  itemsCount = 4,
}: CarouselProps) {
  return (
    <CarouselContext.Provider
      value={{
        index,
        setIndex: onIndexChange,
        itemsCount,
      }}
    >
      <div className={cn('group/hover relative', className)}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </CarouselContext.Provider>
  );
}

export type CarouselNavigationProps = {
  className?: string;
  classNameButton?: string;
  alwaysShow?: boolean;
};

const CarouselNavigation = memo(function CarouselNavigation({
  className,
  classNameButton,
  alwaysShow,
}: CarouselNavigationProps) {
  const { index, setIndex, itemsCount } = useCarousel();

  return (
    <div
      className={cn(
        'pointer-events-none absolute left-[-12.5%] top-1/2 flex w-[125%] -translate-y-1/2 justify-between px-2',
        className
      )}
    >
      <button
        type="button"
        aria-label="Previous slide"
        className={cn(
          'pointer-events-auto h-fit w-fit rounded-full bg-zinc-50 p-2 transition-opacity duration-200 dark:bg-zinc-950',
          alwaysShow ? 'opacity-100' : 'opacity-0 group-hover/hover:opacity-100',
          alwaysShow ? 'disabled:opacity-40' : 'group-hover/hover:disabled:opacity-40',
          classNameButton
        )}
        disabled={index === 0}
        onClick={() => index > 0 && setIndex(index - 1)}
      >
        <ChevronLeft className="stroke-zinc-600 dark:stroke-zinc-50" size={16} />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        className={cn(
          'pointer-events-auto h-fit w-fit rounded-full bg-zinc-50 p-2 transition-opacity duration-200 dark:bg-zinc-950',
          alwaysShow ? 'opacity-100' : 'opacity-0 group-hover/hover:opacity-100',
          alwaysShow ? 'disabled:opacity-40' : 'group-hover/hover:disabled:opacity-40',
          classNameButton
        )}
        disabled={index + 1 === itemsCount}
        onClick={() => index < itemsCount - 1 && setIndex(index + 1)}
      >
        <ChevronRight className="stroke-zinc-600 dark:stroke-zinc-50" size={16} />
      </button>
    </div>
  );
});

export type CarouselIndicatorProps = {
  className?: string;
  classNameButton?: string;
};

const CarouselIndicator = memo(function CarouselIndicator({
  className,
  classNameButton,
}: CarouselIndicatorProps) {
  const { index, itemsCount, setIndex } = useCarousel();

  return (
    <div
      className={cn(
        'absolute bottom-0 z-10 flex w-full items-center justify-center',
        className
      )}
    >
      <div className="flex space-x-2">
        {Array.from({ length: itemsCount }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              'h-2 w-2 rounded-full transition-colors duration-150',
              index === i
                ? 'bg-zinc-950 dark:bg-zinc-50'
                : 'bg-zinc-900/50 dark:bg-zinc-100/50',
              classNameButton
            )}
          />
        ))}
      </div>
    </div>
  );
});

export type CarouselContentProps = {
  children: ReactNode;
  className?: string;
};

// Ultra-simplified content - no dynamic calculations, just CSS
const CarouselContent = memo(function CarouselContent({
  children,
  className,
}: CarouselContentProps) {
  const { index, setIndex, itemsCount } = useCarousel();
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  // Calculate translation based on index
  // On mobile (basis-full), each item is 100%
  // This will be overridden by CSS for responsive layouts
  const translateX = -index * 100;

  const handleDragStart = (clientX: number) => {
    isDragging.current = true;
    dragStartX.current = clientX;
  };

  const handleDragEnd = (clientX: number) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const diff = dragStartX.current - clientX;
    const threshold = 50;

    if (diff > threshold && index < itemsCount - 1) {
      setIndex(index + 1);
    } else if (diff < -threshold && index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex cursor-grab touch-pan-y active:cursor-grabbing',
        className
      )}
      style={{
        transform: `translateX(${translateX}%)`,
        // Ultra-fast, snappy transition
        transition: 'transform 150ms cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        handleDragStart(e.clientX);
      }}
      onMouseUp={(e) => handleDragEnd(e.clientX)}
      onMouseLeave={(e) => {
        if (isDragging.current) handleDragEnd(e.clientX);
      }}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
    >
      {children}
    </div>
  );
});

export type CarouselItemProps = {
  children: ReactNode;
  className?: string;
};

const CarouselItem = memo(function CarouselItem({ children, className }: CarouselItemProps) {
  return (
    <div className={cn('w-full shrink-0 grow-0', className)}>
      {children}
    </div>
  );
});

export {
  Carousel,
  CarouselContent,
  CarouselNavigation,
  CarouselIndicator,
  CarouselItem,
  useCarousel,
};
