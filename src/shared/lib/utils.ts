import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isProd = process.env.NODE_ENV === "production";

if (!isProd) console.log("Rodando em dev 🛠️");
