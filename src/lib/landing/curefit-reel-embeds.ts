/**
 * Instagram reels/posts shown on the landing "Why curefit" section.
 * `embedPath` must match Instagram’s embed URL: instagram.com/{embedPath}/embed
 */
export type CurefitReelItem = {
  canonicalUrl: string;
  /** `reel/SHORTCODE` or `p/SHORTCODE` */
  embedPath: string;
};

export const CUREFIT_REEL_EMBEDS: readonly CurefitReelItem[] = [
  {
    canonicalUrl: "https://www.instagram.com/p/DWePwxVjwYg/",
    embedPath: "p/DWePwxVjwYg",
  },
  {
    canonicalUrl: "https://www.instagram.com/curefit1/reel/DVWx4S5AKF3/",
    embedPath: "reel/DVWx4S5AKF3",
  },
  {
    canonicalUrl: "https://www.instagram.com/p/DV5dnMSgNml/",
    embedPath: "p/DV5dnMSgNml",
  },
] as const;

export const INFORMATION_REEL_EMBEDS: readonly CurefitReelItem[] = [
  {
    canonicalUrl: "https://www.instagram.com/reel/DYWdrBDDYPw/",
    embedPath: "reel/DYWdrBDDYPw",
  },
  {
    canonicalUrl: "https://www.instagram.com/reel/DWQ4gUij2Vt/",
    embedPath: "reel/DWQ4gUij2Vt",
  },
  {
    canonicalUrl: "https://www.instagram.com/reel/DX6LKGnCG1T/",
    embedPath: "reel/DX6LKGnCG1T",
  },
  {
    canonicalUrl: "https://www.instagram.com/reel/DXtcBPljBL4/",
    embedPath: "reel/DXtcBPljBL4",
  },
] as const;

export function instagramEmbedSrc(embedPath: string): string {
  return `https://www.instagram.com/${embedPath}/embed`;
}
