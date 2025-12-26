'use client';
import {
  Children,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type CarouselContextType = {
  index: number;
  setIndex: (newIndex: number) => void;
  itemsCount: number;
  setItemsCount: (newItemsCount: number) => void;
  disableDrag: boolean;
};

const CarouselContext = createContext<CarouselContextType | undefined>(
  undefined
);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within an CarouselProvider');
  }
  return context;
}

export type CarouselProviderProps = {
  children: ReactNode;
  initialIndex?: number;
  onIndexChange?: (newIndex: number) => void;
  disableDrag?: boolean;
};

function CarouselProvider({
  children,
  initialIndex = 0,
  onIndexChange,
  disableDrag = false,
}: CarouselProviderProps) {
  const [index, setIndexState] = useState<number>(initialIndex);
  const [itemsCount, setItemsCount] = useState<number>(0);

  const setIndex = useCallback((newIndex: number) => {
    setIndexState(newIndex);
    onIndexChange?.(newIndex);
  }, [onIndexChange]);

  useEffect(() => {
    setIndexState(initialIndex);
  }, [initialIndex]);

  return (
    <CarouselContext.Provider
      value={{
        index,
        setIndex,
        itemsCount,
        setItemsCount,
        disableDrag,
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
}

export type CarouselProps = {
  children: ReactNode;
  className?: string;
  initialIndex?: number;
  index?: number;
  onIndexChange?: (newIndex: number) => void;
  disableDrag?: boolean;
};

function Carousel({
  children,
  className,
  initialIndex = 0,
  index: externalIndex,
  onIndexChange,
  disableDrag = false,
}: CarouselProps) {
  const [internalIndex, setInternalIndex] = useState<number>(initialIndex);
  const isControlled = externalIndex !== undefined;
  const currentIndex = isControlled ? externalIndex : internalIndex;

  const handleIndexChange = useCallback((newIndex: number) => {
    if (!isControlled) {
      setInternalIndex(newIndex);
    }
    onIndexChange?.(newIndex);
  }, [isControlled, onIndexChange]);

  return (
    <CarouselProvider
      initialIndex={currentIndex}
      onIndexChange={handleIndexChange}
      disableDrag={disableDrag}
    >
      <div className={cn('group/hover relative', className)}>
        <div className='overflow-hidden'>{children}</div>
      </div>
    </CarouselProvider>
  );
}

export type CarouselNavigationProps = {
  className?: string;
  classNameButton?: string;
  alwaysShow?: boolean;
};

function CarouselNavigation({
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
        type='button'
        aria-label='Previous slide'
        className={cn(
          'pointer-events-auto h-fit w-fit rounded-full bg-zinc-50 p-2 transition-opacity duration-300 dark:bg-zinc-950',
          alwaysShow
            ? 'opacity-100'
            : 'opacity-0 group-hover/hover:opacity-100',
          alwaysShow
            ? 'disabled:opacity-40'
            : 'group-hover/hover:disabled:opacity-40',
          classNameButton
        )}
        disabled={index === 0}
        onClick={() => {
          if (index > 0) {
            setIndex(index - 1);
          }
        }}
      >
        <ChevronLeft
          className='stroke-zinc-600 dark:stroke-zinc-50'
          size={16}
        />
      </button>
      <button
        type='button'
        className={cn(
          'pointer-events-auto h-fit w-fit rounded-full bg-zinc-50 p-2 transition-opacity duration-300 dark:bg-zinc-950',
          alwaysShow
            ? 'opacity-100'
            : 'opacity-0 group-hover/hover:opacity-100',
          alwaysShow
            ? 'disabled:opacity-40'
            : 'group-hover/hover:disabled:opacity-40',
          classNameButton
        )}
        aria-label='Next slide'
        disabled={index + 1 === itemsCount}
        onClick={() => {
          if (index < itemsCount - 1) {
            setIndex(index + 1);
          }
        }}
      >
        <ChevronRight
          className='stroke-zinc-600 dark:stroke-zinc-50'
          size={16}
        />
      </button>
    </div>
  );
}

export type CarouselIndicatorProps = {
  className?: string;
  classNameButton?: string;
};

function CarouselIndicator({
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
      <div className='flex space-x-2'>
        {Array.from({ length: itemsCount }, (_, i) => (
          <button
            key={i}
            type='button'
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              'h-2 w-2 rounded-full transition-opacity duration-300',
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
}

export type CarouselContentProps = {
  children: ReactNode;
  className?: string;
  transition?: { duration?: number; ease?: string };
};

function CarouselContent({
  children,
  className,
  transition,
}: CarouselContentProps) {
  const { index, setIndex, setItemsCount, disableDrag } = useCarousel();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsLength = Children.count(children);

  // Track visible items based on container width - calculate once on mount/resize
  const [visibleItems, setVisibleItems] = useState(1);

  // Drag state
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  // Calculate visible items based on actual rendered widths
  useLayoutEffect(() => {
    const calculateVisibleItems = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.parentElement?.offsetWidth || container.offsetWidth;
      const firstChild = container.children[0] as HTMLElement;

      if (firstChild) {
        const itemWidth = firstChild.offsetWidth;
        if (itemWidth > 0) {
          const visible = Math.round(containerWidth / itemWidth);
          setVisibleItems(Math.max(1, visible));
        }
      }
    };

    calculateVisibleItems();

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleItems();
    });

    if (containerRef.current?.parentElement) {
      resizeObserver.observe(containerRef.current.parentElement);
    }

    return () => resizeObserver.disconnect();
  }, [itemsLength]);

  // Set items count
  useEffect(() => {
    if (itemsLength) {
      setItemsCount(itemsLength);
    }
  }, [itemsLength, setItemsCount]);

  // Touch/Mouse handlers for drag
  const handleDragStart = useCallback((clientX: number) => {
    if (disableDrag) return;
    isDragging.current = true;
    dragStartX.current = clientX;
  }, [disableDrag]);

  const handleDragEnd = useCallback((clientX: number) => {
    if (!isDragging.current || disableDrag) return;
    isDragging.current = false;

    const diff = dragStartX.current - clientX;
    const threshold = 50;

    if (diff > threshold && index < itemsLength - 1) {
      setIndex(index + 1);
    } else if (diff < -threshold && index > 0) {
      setIndex(index - 1);
    }
  }, [disableDrag, index, itemsLength, setIndex]);

  // Calculate transform percentage
  const translateX = -index * (100 / visibleItems);
  const duration = transition?.duration ?? 0.25;
  const ease = transition?.ease ?? 'cubic-bezier(0.4, 0, 0.2, 1)';

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex items-center',
        !disableDrag && 'cursor-grab active:cursor-grabbing touch-pan-y',
        className
      )}
      style={{
        transform: `translate3d(${translateX}%, 0, 0)`,
        transition: `transform ${duration}s ${ease}`,
        willChange: 'transform',
      }}
      onMouseDown={(e) => handleDragStart(e.clientX)}
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
}

export type CarouselItemProps = {
  children: ReactNode;
  className?: string;
};

function CarouselItem({ children, className }: CarouselItemProps) {
  return (
    <div
      className={cn(
        'w-full min-w-0 shrink-0 grow-0 overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselNavigation,
  CarouselIndicator,
  CarouselItem,
  useCarousel,
};
