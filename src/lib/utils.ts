import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { USD_TO_LYD_RATE } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatApproxLyd(usdAmount: number): string {
  const lyd = Math.round(usdAmount * USD_TO_LYD_RATE);
  return `≈ ${lyd} دينار ليبي`;
}
