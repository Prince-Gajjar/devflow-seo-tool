import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple URL Validator
export function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`);
    // Check if there is a domain name with at least one dot and characters after it
    const parts = parsed.hostname.split(".");
    return parts.length >= 2 && parts[parts.length - 1].length >= 2;
  } catch {
    return false;
  }
}

// Format URLs consistently (adds https:// if missing, removes trailing slash)
export function formatUrl(url: string): string {
  if (!url) return "";
  let cleanUrl = url.trim().toLowerCase();
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = `https://${cleanUrl}`;
  }
  try {
    const parsed = new URL(cleanUrl);
    let hostname = parsed.hostname;
    if (hostname.startsWith("www.")) {
      hostname = hostname.substring(4);
    }
    return hostname;
  } catch {
    return cleanUrl;
  }
}

// Deterministic seed-based pseudo-random generator
// Enables the mock data to remain identical when entering the same keyword or URL
export function createSeedRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return function() {
    let t = h += 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Format numbers like 50000 to "50K" or with commas "50,000"
export function formatNumber(num: number, compact = false): string {
  if (compact) {
    return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(num);
  }
  return new Intl.NumberFormat("en-US").format(num);
}
