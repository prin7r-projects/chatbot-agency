"use client";

/**
 * [RELAYHOUSE_BUTTON] Round-2 redesign 2026-05-08 — OpenAI reference applied.
 *
 * Pill buttons (9999px radius) per the OpenAI design reference. Filled
 * variant: black fill, white text, near-invisible shadow. Ghost variant:
 * transparent with hairline border, hover surface = chalk.
 *
 * The source is owned by this repo per the Prin7r ShadCN-first baseline
 * (DESIGN.md §3). Re-themed against the Relayhouse round-2 tokens.
 */

import * as React from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "default" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-sans font-medium leading-none rounded-full transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-carmine disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]";

const variantClasses: Record<ButtonVariant, string> = {
  // Filled pill — OpenAI's "Try ChatGPT" pattern.
  default:
    "bg-void text-canvas border border-void hover:bg-[#1a1a1a] hover:border-[#1a1a1a] shadow-sm",
  // Ghost pill — transparent with hairline.
  ghost:
    "bg-transparent text-void border border-[rgba(0,0,0,0.12)] hover:bg-chalk"
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-11 px-5 text-[14px]",
  sm: "h-9 px-4 text-[13px]",
  lg: "h-12 px-6 text-[15px]"
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
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
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
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
});
