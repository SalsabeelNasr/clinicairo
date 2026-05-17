"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Breakpoint = "sm" | "md" | "lg";

type Props = {
  children: ReactNode;
  className?: string;
  scrollerClassName?: string;
  fadeFrom?: string;
  hideAffordancesFrom?: Breakpoint;
  scrollDir?: "ltr" | "auto";
  itemCount?: number;
  messagesNamespace?: "landing.carousel" | "landing.why.videos" | "information.videos";
  desktopArrows?: boolean;
};

function hideFromClass(bp: Breakpoint | undefined, base: string) {
  if (!bp) return cn(base, "md:hidden");
  return cn(base, `${bp}:hidden`);
}

export function HorizontalScrollCarousel({
  children,
  className,
  scrollerClassName,
  fadeFrom = "from-background",
  hideAffordancesFrom,
  scrollDir = "auto",
  itemCount = 2,
  messagesNamespace = "landing.carousel",
  desktopArrows = false,
}: Props) {
  const t = useTranslations(messagesNamespace);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(itemCount > 1);

  const mobileOnly = (classes: string) => hideFromClass(hideAffordancesFrom, classes);

  const desktopArrowClass = hideAffordancesFrom
    ? `hidden ${hideAffordancesFrom}:flex`
    : "hidden md:flex";

  const prevLabel =
    messagesNamespace === "landing.carousel" ? t("prev") : t("prevReel");
  const nextLabel =
    messagesNamespace === "landing.carousel" ? t("next") : t("nextReel");

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    const isScrollerRtl = scrollDir === "ltr" ? false : el.dir === "rtl";

    if (isScrollerRtl) {
      setCanScrollStart(Math.abs(scrollLeft) < maxScroll - 8);
      setCanScrollEnd(scrollLeft < -8);
    } else {
      setCanScrollStart(scrollLeft > 8);
      setCanScrollEnd(maxScroll > 8 && scrollLeft < maxScroll - 8);
    }
  }, [scrollDir]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState, itemCount]);

  const scrollByStep = useCallback((direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>("[data-carousel-slide]");
    const gap = parseFloat(getComputedStyle(el).columnGap || "16") || 16;
    const delta = slide?.offsetWidth
      ? slide.offsetWidth + gap
      : Math.min(360, el.clientWidth * 0.85);
    el.scrollBy({ left: direction * delta, behavior: "smooth" });
  }, []);

  const showAffordances = itemCount > 1;

  return (
    <div className={cn("relative", className)}>
      {desktopArrows && showAffordances && (
        <>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              desktopArrowClass,
              "absolute start-0 top-1/2 z-10 -translate-y-1/2 bg-background shadow-md",
              !canScrollStart && "pointer-events-none opacity-40",
            )}
            aria-label={prevLabel}
            onClick={() => scrollByStep(-1)}
          >
            <ChevronLeft className="size-5 rtl:-scale-x-100" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              desktopArrowClass,
              "absolute end-0 top-1/2 z-10 -translate-y-1/2 bg-background shadow-md",
              !canScrollEnd && "pointer-events-none opacity-40",
            )}
            aria-label={nextLabel}
            onClick={() => scrollByStep(1)}
          >
            <ChevronRight className="size-5 rtl:-scale-x-100" aria-hidden />
          </Button>
        </>
      )}

      {showAffordances && (
        <>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              mobileOnly(
                "absolute start-1 top-1/2 z-10 size-9 -translate-y-1/2 border-border/80 bg-background/95 shadow-md backdrop-blur-sm",
              ),
              !canScrollStart && "pointer-events-none opacity-0",
            )}
            aria-label={prevLabel}
            onClick={() => scrollByStep(-1)}
          >
            <ChevronLeft className="size-4 rtl:-scale-x-100" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              mobileOnly(
                "absolute end-1 top-1/2 z-10 size-9 -translate-y-1/2 border-border/80 bg-background/95 shadow-md backdrop-blur-sm",
              ),
              !canScrollEnd && "pointer-events-none opacity-0",
            )}
            aria-label={nextLabel}
            onClick={() => scrollByStep(1)}
          >
            <ChevronRight className="size-4 rtl:-scale-x-100" aria-hidden />
          </Button>

          <div
            aria-hidden
            className={cn(
              mobileOnly(
                "pointer-events-none absolute inset-y-0 start-0 z-[1] w-10 bg-gradient-to-r to-transparent transition-opacity duration-200",
              ),
              fadeFrom,
              canScrollStart ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            aria-hidden
            className={cn(
              mobileOnly(
                "pointer-events-none absolute inset-y-0 end-0 z-[1] w-14 bg-gradient-to-l to-transparent transition-opacity duration-200",
              ),
              fadeFrom,
              canScrollEnd ? "opacity-100" : "opacity-0",
            )}
          />
        </>
      )}

      <div
        ref={scrollerRef}
        dir={scrollDir === "ltr" ? "ltr" : undefined}
        className={cn(
          "scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden pb-2",
          scrollerClassName,
        )}
      >
        {children}
      </div>

    </div>
  );
}
