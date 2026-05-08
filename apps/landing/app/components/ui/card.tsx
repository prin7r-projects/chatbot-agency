/**
 * [DISPATCH_CARD] Round-2 redesign 2026-05-08 — OpenAI reference applied.
 *
 * 6.08px border-radius (OpenAI's signature near-square radius), white
 * surface, fog-border hairline, no shadow. Vendored from shadcn/ui and
 * re-themed against the Dispatch round-2 tokens. The repo owns this source
 * per the Prin7r ShadCN-first baseline (DESIGN.md §3).
 */

import * as React from "react";
import { cn } from "@/lib/cn";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function Card(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-canvas border border-fog rounded-[6.08px] flex flex-col text-void",
        className
      )}
      {...props}
    />
  );
});

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardHeader(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={cn("flex flex-col gap-1.5 p-8", className)} {...props} />;
});

export const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardTitle(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn("font-display font-semibold text-[22px] leading-[1.21] tracking-tight", className)}
      {...props}
    />
  );
});

export const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardDescription({ className, ...props }, ref) {
    return <div ref={ref} className={cn("text-graphite text-[15px]", className)} {...props} />;
  }
);

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardContent(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={cn("px-8 pb-8", className)} {...props} />;
});

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardFooter(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={cn("flex items-center px-8 pb-8", className)} {...props} />;
});
