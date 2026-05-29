"use client";

import { useTranslations } from "next-intl";
import type { CliniCairoReelItem } from "@/lib/landing/clinicairo-reel-embeds";
import { videoEmbedSrc } from "@/lib/landing/clinicairo-reel-embeds";
import { HorizontalScrollCarousel } from "@/components/ui/horizontal-scroll-carousel";
import { cn } from "@/lib/utils";

type Props = {
  items: readonly CliniCairoReelItem[];
  className?: string;
  messagesNamespace?: "landing.why.videos" | "information.videos";
  showDisclaimer?: boolean;
};

export function InstagramReelsCarousel({
  items,
  className,
  messagesNamespace = "landing.why.videos",
  showDisclaimer = false,
}: Props) {
  const t = useTranslations(messagesNamespace);

  const fadeFrom =
    messagesNamespace === "information.videos"
      ? "from-muted/30"
      : "from-background";

  return (
    <div className={cn("space-y-4", className)}>
      {showDisclaimer && (
        <p className="mx-auto max-w-2xl px-4 text-center text-[10px] leading-tight text-muted-foreground/70 sm:text-[11px]">
          {t("disclaimer")}
        </p>
      )}
      <HorizontalScrollCarousel
        itemCount={items.length}
        fadeFrom={fadeFrom}
        scrollDir="ltr"
        messagesNamespace={messagesNamespace}
        desktopArrows
        scrollerClassName={cn(
          "gap-4 px-1 pb-2 md:px-12 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          items.length === 1 && "justify-center md:px-0",
        )}
      >
        {items.map((item, index) => (
          <article
            key={item.embedRef}
            data-carousel-slide
            className={cn(
              "shrink-0 snap-center",
              items.length > 1
                ? "w-[min(82vw,20.5rem)] md:w-[20.5rem]"
                : "w-[min(100%,20.5rem)] md:w-[20.5rem]",
            )}
          >
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <iframe
                src={videoEmbedSrc(item)}
                title={`${t("iframeTitle")} ${index + 1}`}
                className="h-[min(40rem,78svh)] w-full max-w-full border-0 bg-muted"
                allowFullScreen
                loading={index < 2 ? "eager" : "lazy"}
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <a
              href={item.canonicalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-center text-sm font-medium text-primary underline-offset-4 hover:underline md:text-start"
            >
              {t("openSource")}
            </a>
          </article>
        ))}
      </HorizontalScrollCarousel>
    </div>
  );
}
