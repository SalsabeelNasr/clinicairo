import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { USD_TO_LYD_RATE } from "@/lib/constants";

// CliniCairo marketing helper (kept from the original repo)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatApproxLyd(usdAmount: number): string {
  const lyd = Math.round(usdAmount * USD_TO_LYD_RATE);
  return `≈ ${lyd} دينار ليبي`;
}

// ---- Tremor Raw helpers (used by ported CliniCairo components) ----

export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

export const focusInput = [
  "focus:ring-2",
  "focus:ring-primary-200",
  "focus:border-primary-500",
];

export const focusRing = [
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  "outline-primary-500 ",
];

export const hasErrorInput = [
  "ring-2",
  "border-red-500 ",
  "ring-red-200 ",
];

export const usNumberformatter = (number: number, decimals = 0) =>
  Intl.NumberFormat("us", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
    .format(Number(number))
    .toString();

export const percentageFormatter = (number: number, decimals = 1) => {
  const formattedNumber = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
  const symbol = number > 0 && number !== Infinity ? "+" : "";
  return `${symbol}${formattedNumber}`;
};

export const millionFormatter = (number: number, decimals = 1) => {
  const formattedNumber = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
  return `${formattedNumber}M`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatters: { [key: string]: any } = {
  currency: (number: number, currency: string = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(number),
  unit: (number: number) => `${usNumberformatter(number)}`,
};
