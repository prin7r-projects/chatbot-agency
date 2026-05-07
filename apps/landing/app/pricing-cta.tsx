"use client";

/**
 * [DISPATCH_PRICING_CTA] Client island for each pricing-tier "Take" button.
 *
 * Posts to /api/checkout/nowpayments and redirects to the hosted invoice URL.
 * Falls back to a mailto when JS is disabled (the <noscript> partner-CTA in
 * the footer covers that audience).
 */

import * as React from "react";
import type { PlanId } from "@/lib/nowpayments";

type Props = {
  plan: PlanId;
  label: string;
  variant?: "default" | "ghost";
  fullWidth?: boolean;
};

type State =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "error"; message: string };

export function PricingCta({ plan, label, variant = "default", fullWidth = false }: Props) {
  const [state, setState] = React.useState<State>({ kind: "idle" });

  async function takeTier() {
    if (state.kind === "pending") return;
    setState({ kind: "pending" });
    try {
      const response = await fetch("/api/checkout/nowpayments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan })
      });
      const data = (await response.json()) as { invoice_url?: string; message?: string };
      if (response.ok && data.invoice_url) {
        window.location.assign(data.invoice_url);
        return;
      }
      const message =
        data?.message ??
        "We couldn't open the invoice. Email desk@chatbot-agency.prin7r.com and the dispatcher will hand-wire it.";
      setState({ kind: "error", message });
    } catch {
      setState({
        kind: "error",
        message:
          "Network error. Try once more, or email desk@chatbot-agency.prin7r.com and the dispatcher will hand-wire it."
      });
    }
  }

  const baseClass =
    variant === "ghost"
      ? "inline-flex items-center justify-center gap-2 h-12 px-5 text-[15px] font-medium border border-forest text-forest bg-transparent hover:bg-forest hover:text-cream transition-colors duration-75 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-carmine rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
      : "inline-flex items-center justify-center gap-2 h-12 px-5 text-[15px] font-medium border border-forest bg-forest text-cream hover:bg-carmine hover:border-carmine transition-colors duration-75 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-carmine rounded-none disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className={fullWidth ? "w-full" : undefined}>
      <button
        type="button"
        onClick={takeTier}
        disabled={state.kind === "pending"}
        aria-label={`${label} — pay setup fee via NOWPayments hosted invoice`}
        className={`${baseClass} ${fullWidth ? "w-full" : ""}`}
      >
        {state.kind === "pending" ? "Opening invoice…" : label}
      </button>
      {state.kind === "error" ? (
        <p className="mt-3 text-[13px] text-carmine">
          {state.message}{" "}
          <a className="underline decoration-1 underline-offset-2" href="mailto:desk@chatbot-agency.prin7r.com">
            Email the dispatcher.
          </a>
        </p>
      ) : null}
    </div>
  );
}
