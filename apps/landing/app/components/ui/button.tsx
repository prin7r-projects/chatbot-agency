"use client";

/**
 * [DISPATCH_BUTTON] Vendored from shadcn/ui (Button) and re-themed against
 * the Dispatch tokens. Square edges, ink fill, carmine on hover. The source
 * is owned by this repo per the Prin7r ShadCN-first baseline (DESIGN.md §3).
 */

import * as React from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "default" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

// Wave 2 redesign 2026-05-08: dark canvas → primary button is bone-fill ink-text (inverse).
// Custom cubic-bezier per soft-skill — never `linear`/`ease-in-out`.
const baseClasses =
  "inline-flex items-center justify-center gap-2 font-sans font-medium leading-none transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-carmine disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-bone text-ink border border-bone hover:bg-carmine hover:text-bone hover:border-carmine hover:-translate-y-[1px]",
  ghost: "bg-transparent text-bone border border-bone/25 hover:bg-bone hover:text-ink hover:border-bone hover:-translate-y-[1px]"
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-12 px-5 text-[15px]",
  sm: "h-10 px-4 text-sm",
  lg: "h-14 px-6 text-[17px]"
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "default", size = "default", type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], "rounded-none", className)}
      {...props}
    />
  );
});

export type ButtonAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const ButtonAnchor = React.forwardRef<HTMLAnchorElement, ButtonAnchorProps>(function ButtonAnchor(
  { className, variant = "default", size = "default", ...props },
  ref
) {
  return (
    <a
      ref={ref}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], "rounded-none", className)}
      {...props}
    />
  );
});
