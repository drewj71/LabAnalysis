import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtDecode } from "jwt-decode";
import type { AuthUser } from "../types/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function decodeUser(token: string): AuthUser {
  const decoded: any = jwtDecode(token);

  return {
    id: decoded.sub,
    email: decoded.email,
    emailConfirmed: decoded.emailConfirmed === "True",
  };
}