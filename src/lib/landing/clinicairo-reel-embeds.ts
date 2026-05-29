/**
 * Instagram reels/posts shown on the landing "Why CliniCairo" section.
 * `embedPath` must match Instagram’s embed URL: instagram.com/{embedPath}/embed
 */
export type CliniCairoReelItem = {
  canonicalUrl: string;
  source: "instagram" | "facebook";
  /** For instagram: `reel/SHORTCODE` or `p/SHORTCODE`. For facebook: can be empty or same as canonicalUrl. */
  embedRef: string;
};

export const LANDING_REEL_EMBEDS: readonly CliniCairoReelItem[] = [
  {
    canonicalUrl: "https://www.facebook.com/reel/1505157787827193",
    source: "facebook",
    embedRef: "1505157787827193",
  },
  {
    canonicalUrl:
      "https://www.facebook.com/fananelrashaka/videos/1200199384415566/",
    source: "facebook",
    embedRef: "1200199384415566",
  },
  {
    canonicalUrl: "https://www.facebook.com/reel/1280644600201638/",
    source: "facebook",
    embedRef: "1280644600201638",
  },
] as const;

export const INFORMATION_REEL_EMBEDS: readonly CliniCairoReelItem[] = [
  {
    canonicalUrl: "https://www.facebook.com/reel/3989323871367839",
    source: "facebook",
    embedRef: "3989323871367839",
  },
  {
    canonicalUrl: "https://www.facebook.com/reel/964945756283541/",
    source: "facebook",
    embedRef: "964945756283541",
  },
  {
    canonicalUrl: "https://www.facebook.com/reel/971758708564246",
    source: "facebook",
    embedRef: "971758708564246",
  },
  {
    canonicalUrl: "https://www.facebook.com/reel/4199264373665226/",
    source: "facebook",
    embedRef: "4199264373665226",
  },
] as const;

export function videoEmbedSrc(item: CliniCairoReelItem): string {
  if (item.source === "facebook") {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(item.canonicalUrl)}&show_text=false`;
  }
  return `https://www.instagram.com/${item.embedRef}/embed`;
}
