"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "@/components/whatsapp-button";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const links = [
    { href: ROUTES.home, label: t("home") },
    { href: ROUTES.information, label: t("information") },
    { href: ROUTES.pricing, label: t("pricing") },
  ];

  return (
    <nav className="flex flex-col gap-1 md:flex-row md:items-center md:gap-1">
      {links.map(({ href, label }) => {
        const active =
          href === ROUTES.home
            ? pathname === "/" || pathname === ""
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "rounded-lg px-3 py-3 text-base font-medium transition-colors md:py-2 md:text-sm",
              active ? "text-primary" : "text-foreground hover:bg-muted",
            )}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={ROUTES.home}
          className="shrink-0 text-2xl font-black tracking-tight text-foreground sm:text-3xl"
        >
          {t("brand")}
        </Link>

        <div className="hidden md:flex md:items-center md:gap-6">
          <NavLinks />
          <WhatsAppButton className="hidden lg:inline-flex" />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <WhatsAppButton className="!h-9 !px-3 text-xs" />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

function MobileMenu() {
  const t = useTranslations("nav");

  return (
    <details className="group relative">
      <summary
        className="cursor-pointer list-none rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted [&::-webkit-details-marker]:hidden"
        aria-label={t("menu")}
      >
        {t("menu")}
      </summary>
      <div className="absolute end-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-lg">
        <NavLinks
          onNavigate={() => {
            const el = document.querySelector("details.group");
            if (el instanceof HTMLDetailsElement) el.open = false;
          }}
        />
      </div>
    </details>
  );
}
