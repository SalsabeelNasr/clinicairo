"use client";

import type { DoctorVideo, VideoSource } from "@/types";
import { videoEmbedSrc } from "@/lib/data/videos";
import { cn } from "@/lib/utils";

type Props = {
  videos: DoctorVideo[];
  heading: string;
};

const SOURCE_LABEL: Record<VideoSource, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  facebook: "Facebook",
};

function isVertical(source: VideoSource): boolean {
  return source === "instagram" || source === "facebook";
}

export function DoctorVideoCarousel({ videos, heading }: Props) {
  if (!videos.length) return null;

  return (
    <section className="space-y-6 border-t border-border pt-10">
      <h2 className="text-2xl font-bold text-foreground">{heading}</h2>
      <div className="flex flex-wrap items-start justify-center gap-x-4 gap-y-8 sm:justify-start">
        {videos.map((v, idx) => {
          const vertical = isVertical(v.source);
          const narrowTile = v.source !== "youtube";
          return (
            <article
              key={v.id}
              className={cn(
                narrowTile
                  ? "w-[min(280px,100%)] shrink-0"
                  : "w-full min-w-0 max-w-3xl basis-full shrink-0",
              )}
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-border bg-muted shadow-sm",
                  vertical ? "aspect-[9/16]" : "aspect-video",
                )}
              >
                <iframe
                  src={videoEmbedSrc(v)}
                  title={v.caption ?? SOURCE_LABEL[v.source]}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  loading={idx < 2 ? "eager" : "lazy"}
                />
                <a
                  href={v.canonicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute end-3 top-3 rounded-md bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-md backdrop-blur transition hover:bg-background"
                >
                  {SOURCE_LABEL[v.source]}
                </a>
              </div>
              {v.caption && (
                <p className="mt-3 px-1 text-sm text-muted-foreground">
                  {v.caption}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
