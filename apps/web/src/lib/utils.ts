import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Session } from "./authz/session";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hasAccess = (session: Session, slug: string) => session.workspaces.some((w) => w.slug === slug);