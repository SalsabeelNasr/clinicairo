import { BRAND_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <span
      dir="ltr"
      className={cn(
        "inline-flex items-center gap-1 font-medium tracking-tight text-foreground",
        className,
      )}
    >
      {BRAND_NAME}
      <span
        className="size-[0.45em] shrink-0 rounded-full bg-primary"
        aria-hidden
      />
    </span>
  );
}
