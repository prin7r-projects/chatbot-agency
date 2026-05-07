import Link from "next/link";
import { ButtonAnchor } from "@/app/components/ui/button";
import { PricingCta } from "@/app/pricing-cta";

/**
 * [DISPATCH_LANDING] Single-page editorial-dispatch landing.
 *
 * Sections:
 *   #masthead → #hero → #proof → #days → #service → #pricing
 *   → #sched → #faq → #footer
 *
 * Copy is sourced from /docs/08-marketing-strategy.md and /docs/07-sales-strategy.md.
 * Visual tokens are sourced from /DESIGN.md sections 4-6.
 * NOWPayments wiring lives in /apps/landing/lib/nowpayments.ts and the two
 * API routes under /api/checkout and /api/webhooks.
 */

export default function Page() {
  return (
    <main className="bg-cream text-forest">
      <Masthead />
      <Hero />
      <ProofStripe />
      <DayByDay />
      <ServiceBlock />
      <Pricing />
      <SchedStrip />
      <Faq />
      <Footer />
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Masthead                                                                   */
/* -------------------------------------------------------------------------- */

function Masthead() {
  return (
    <header
      id="masthead"
      className="border-b border-forest/12 bg-cream sticky top-0 z-30 shadow-masthead"
    >
      <div className="mx-auto max-w-prose px-6 md:px-10 py-4 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-7" aria-label="primary">
          <a href="#days" className="kicker hover:text-forest transition-colors">Day-by-day</a>
          <a href="#pricing" className="kicker hover:text-forest transition-colors">Pricing</a>
          <a href="#faq" className="kicker hover:text-forest transition-colors">FAQ</a>
          <ButtonAnchor href="#pricing" className="ml-2">Take Growth →</ButtonAnchor>
        </nav>
        <div className="md:hidden">
          <ButtonAnchor href="#pricing" size="sm">Pricing →</ButtonAnchor>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <a href="#hero" className="flex items-center gap-3" aria-label="Dispatch — home">
      <span aria-hidden="true" className="inline-block">
        <svg width="34" height="34" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="64" height="64" rx="2" fill="#0F2A26" />
          <text x="32" y="42" textAnchor="middle"
                fontFamily="Fraunces, Georgia, serif" fontWeight="900" fontSize="32"
                fill="#F4EDE0">Dt</text>
          <rect x="14" y="51" width="36" height="2" fill="#C24656" />
        </svg>
      </span>
      <span className="font-mono text-[12px] tracking-ledger uppercase text-forest">
        dispatch<span className="text-carmine">.</span>
      </span>
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section id="hero" className="grain section">
      <div className="mx-auto max-w-prose px-6 md:px-10 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-9">
            <p className="kicker">A productized chatbot agency · est. 2026</p>
            <span className="eyebrow-rule" aria-hidden="true" />
            <h1 className="font-display font-black text-[56px] md:text-[88px] lg:text-[112px] leading-[0.96] tracking-tightest text-forest">
              Spec on Monday.<br />
              <span className="italic font-display font-normal text-graphite">Bot live by</span> Friday.
            </h1>
            <p className="mt-8 max-w-2xl font-display text-[22px] md:text-[26px] text-graphite leading-snug">
              One knowledge base, three channels, one bill. We build a multilingual chatbot
              for clinics, salons, brokerages, schools, and small shops — and we ship in
              five working days, not six weeks.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 items-center">
              <ButtonAnchor href="#pricing" size="lg" aria-label="See pricing tiers">
                See the three tiers →
              </ButtonAnchor>
              <ButtonAnchor
                href="mailto:desk@chatbot-agency.prin7r.com?subject=Brief%20for%20a%20chatbot%20build"
                size="lg"
                variant="ghost"
                aria-label="Email the dispatcher with your brief"
              >
                Talk to the dispatcher
              </ButtonAnchor>
            </div>
          </div>
          <aside
            className="md:col-span-3 flex justify-start md:justify-end"
            aria-hidden="true"
          >
            <div className="kickoff-stamp">
              <span className="pulse-dot" />
              <span>Kickoff Monday<br />09:30 local</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Proof stripe — quiet monoglyph row of channels                             */
/* -------------------------------------------------------------------------- */

function ProofStripe() {
  const channels: Array<{ glyph: string; label: string }> = [
    { glyph: "tg.", label: "Telegram Bot API" },
    { glyph: "wa.", label: "WhatsApp Cloud API" },
    { glyph: "dc.", label: "Discord Gateway" },
    { glyph: "web.", label: "embeddable web widget" }
  ];
  return (
    <section id="proof" aria-label="Channels we ship to" className="section bg-cream-2">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-12">
        <div className="carmine-rule" aria-hidden="true" />
        <ul className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-6 py-8" role="list">
          {channels.map(({ glyph, label }) => (
            <li key={glyph} className="flex items-baseline gap-3">
              <span className="font-display font-black text-[34px] md:text-[44px] tracking-tightest text-forest">
                {glyph}
              </span>
              <span className="kicker">{label}</span>
            </li>
          ))}
        </ul>
        <div className="carmine-rule" aria-hidden="true" />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Day-by-Day timeline                                                        */
/* -------------------------------------------------------------------------- */

type Day = { num: string; day: string; title: string; body: string };

function DayByDay() {
  const days: Day[] = [
    {
      num: "01",
      day: "Mon",
      title: "Kickoff",
      body: "30-min call. Single point of contact. KB ingest from your Notion, website, FAQ doc, or PDF — whichever you have."
    },
    {
      num: "02",
      day: "Tue",
      title: "Tone tuning",
      body: "Twenty sample answers in your real language and register, reviewed with you. We tune until it sounds like you wrote it."
    },
    {
      num: "03",
      day: "Wed",
      title: "Channels wired",
      body: "Telegram, WhatsApp Cloud API, Discord — wired in a staging tenant. We test 200 real DMs from your inbox archive."
    },
    {
      num: "04",
      day: "Thu",
      title: "Owner handoff",
      body: "Escalation rules locked: when the bot is unsure, it goes silent and pings you on Telegram. Tuning queue seeded."
    },
    {
      num: "05",
      day: "Fri",
      title: "Live by Friday",
      body: "Bot live on your real numbers. Dispatcher on call all weekend. First Tuesday tuning slot in your calendar before we hang up."
    }
  ];

  return (
    <section id="days" className="section">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-20 md:py-24">
        <SectionHeader
          eyebrow="The schedule"
          title="Five days, named."
          lede="No flow charts. No discovery sprint. No six-week SOW. We meet on Monday and your bot answers customers by Friday afternoon — same week."
        />
        <ol
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-forest/12 border border-forest/12"
          aria-label="Five-day delivery schedule"
        >
          {days.map((day) => (
            <li key={day.num} className="bg-cream p-6 flex flex-col gap-3 min-h-[260px]">
              <div className="flex items-baseline gap-3">
                <span className="font-display font-black text-[64px] leading-none tracking-tightest text-carmine">
                  {day.num}
                </span>
                <span className="font-mono text-[11px] tracking-ledger uppercase text-linen">
                  {day.day}
                </span>
              </div>
              <h3 className="font-display font-semibold text-[22px] tracking-tightest">{day.title}</h3>
              <p className="text-[15px] text-graphite leading-snug">{day.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Service block — what you actually get                                      */
/* -------------------------------------------------------------------------- */

function ServiceBlock() {
  type Item = { kicker: string; title: string; body: string };
  const items: Item[] = [
    {
      kicker: "kickoff doc",
      title: "A two-page brief, signed.",
      body:
        "Day-by-day plan, your single point of contact, refund clause, and the escalation runbook. Sent within 90 minutes of payment, before any building starts."
    },
    {
      kicker: "weekly call",
      title: "Tuesday tuning, 15 min.",
      body:
        "We review the unanswered list (typically 8-15 DMs the bot punted), promote KB entries, adjust tone, and ship the diff before Friday."
    },
    {
      kicker: "monthly report",
      title: "One-page accuracy PDF.",
      body:
        "Last Friday of the month: deflection rate, top intents, languages used, escalations, KB freshness. Numbered. No theme park dashboards."
    },
    {
      kicker: "escalation",
      title: "Owner handoff, by design.",
      body:
        "When confidence drops below threshold, the bot goes silent and pings you on Telegram. Your customer never gets a wrong answer in your name."
    },
    {
      kicker: "fallback",
      title: "Telegram in every contract.",
      body:
        "Meta tightens its WhatsApp policy; your bot keeps answering on Telegram. Single-channel agencies died in 2020 — we won't repeat that."
    },
    {
      kicker: "refund",
      title: "Setup fee on the line.",
      body:
        "Don't see a 30% drop in unanswered messages in month one? We refund the setup fee. One sentence in the kickoff doc, no procedural theatre."
    }
  ];

  return (
    <section id="service" className="section bg-cream-2">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-20 md:py-24">
        <SectionHeader
          eyebrow="What you get"
          title="A working studio, not a workspace."
          lede="The product is the delivery — the cadence, the artifacts, the human at the other end. The LLM is a tool we hold."
        />
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.kicker} className="dispatch-frame p-6">
              <p className="kicker">{item.kicker}</p>
              <h3 className="mt-4 font-display font-semibold text-[24px] tracking-tightest leading-tight">
                {item.title}
              </h3>
              <p className="mt-3 text-[15px] text-graphite leading-snug">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Pricing                                                                    */
/* -------------------------------------------------------------------------- */

type Tier = {
  id: "starter" | "growth" | "pro";
  name: string;
  setup: number;
  monthly: number;
  blurb: string;
  features: string[];
  featured?: boolean;
};

function Pricing() {
  const tiers: Tier[] = [
    {
      id: "starter",
      name: "Starter",
      setup: 299,
      monthly: 79,
      blurb: "The bare minimum we can ship and stand behind.",
      features: [
        "1 channel — Telegram or WhatsApp Business",
        "Core only · KB ingest, LLM router, owner handoff",
        "2,000 messages / month · overage $0.012/msg",
        "1 tuning hour / month · monthly accuracy report"
      ]
    },
    {
      id: "growth",
      name: "Growth",
      setup: 599,
      monthly: 199,
      blurb: "Most owners pick this.",
      features: [
        "2 channels (any of TG / WA / Discord)",
        "Core + 1 module — sales, support, or knowledge worker",
        "10,000 messages / month · overage $0.012/msg",
        "3 tuning hours / month · weekly call · monthly accuracy report"
      ],
      featured: true
    },
    {
      id: "pro",
      name: "Pro",
      setup: 1200,
      monthly: 449,
      blurb: "Three channels, web widget, all modules.",
      features: [
        "3 channels (TG + WA + Discord) plus a website widget",
        "Core + all 3 modules (sales, support, knowledge worker)",
        "40,000 messages / month · overage $0.012/msg",
        "8 tuning hours / month · weekly call · monthly accuracy report"
      ]
    }
  ];

  return (
    <section id="pricing" className="section">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-20 md:py-24">
        <SectionHeader
          eyebrow="Three tiers"
          title="Setup fees non-negotiable."
          lede="The setup fee is the qualifying signal and the team's labour for week one. Annual prepay (two months free) is the only discount we offer."
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <article key={tier.id} className={`tier ${tier.featured ? "featured" : ""}`} aria-label={`${tier.name} tier`}>
              {tier.featured ? (
                <span className="inline-flex w-fit rounded-full border border-carmine bg-cream px-2.5 py-1 font-mono text-[10px] tracking-ledger uppercase text-carmine">
                  Most popular
                </span>
              ) : (
                <span className="inline-flex w-fit font-mono text-[10px] tracking-ledger uppercase text-linen">
                  Tier {tier.id === "starter" ? "01" : tier.id === "growth" ? "02" : "03"}
                </span>
              )}
              <h3 className="tier-name">{tier.name}</h3>
              <p className="text-[14.5px] text-graphite leading-snug">{tier.blurb}</p>

              <div>
                <div className="tier-price">
                  ${tier.setup} <span className="font-sans font-normal text-[14px] uppercase tracking-ledger text-linen">setup</span>
                </div>
                <div className="tier-mo">
                  <span className="font-display font-semibold">${tier.monthly}</span>
                  <span className="text-graphite"> / month thereafter</span>
                </div>
              </div>

              <ul className="tier-features">
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <div className="mt-4">
                <PricingCta plan={tier.id} label={`Take ${tier.name} →`} fullWidth variant={tier.featured ? "default" : "default"} />
                <p className="mt-3 text-[12px] font-mono tracking-ledger uppercase text-linen">
                  Pay setup via NOWPayments · USDT / USDC
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-12 max-w-2xl font-display italic text-[19px] md:text-[22px] text-forest border-l-2 border-carmine pl-5">
          If you don&rsquo;t see a 30% drop in unanswered messages in month one, we refund the setup fee.
        </p>

        <div className="mt-12 dispatch-frame p-7 max-w-2xl">
          <p className="kicker">Resellers · white label</p>
          <h3 className="mt-3 font-display font-semibold text-[22px] tracking-tightest">
            Web studios &amp; marketing shops — 40% margin.
          </h3>
          <p className="mt-2 text-[15px] text-graphite">
            One-page partner agreement, contract minimum five seats over twelve months, joint kickoff
            on the first three referrals. Email the desk and we&rsquo;ll send the agreement back same day.
          </p>
          <a
            className="inline-block mt-4 font-mono text-[12px] tracking-ledger uppercase text-forest underline decoration-1 underline-offset-4 decoration-carmine hover:text-carmine"
            href="mailto:partners@chatbot-agency.prin7r.com?subject=Partner%20studio%20interest"
          >
            partners@chatbot-agency.prin7r.com →
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Sched strip — repeats the day-by-day promise as a footer-style band        */
/* -------------------------------------------------------------------------- */

function SchedStrip() {
  const cells = [
    { d: "Mon", c: "Kickoff" },
    { d: "Tue", c: "Tone" },
    { d: "Wed", c: "Channels" },
    { d: "Thu", c: "Handoff" },
    { d: "Fri", c: "Live" }
  ];
  return (
    <section id="sched" className="section bg-forest text-cream">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-14 md:py-16">
        <p className="font-mono text-[11px] tracking-ledger uppercase text-cream/70">A typical week</p>
        <div className="mt-6 grid grid-cols-5 gap-px bg-cream/15 border border-cream/15">
          {cells.map((cell, i) => (
            <div key={cell.d} className="bg-forest p-5 flex flex-col gap-2">
              <span className="font-mono text-[11px] tracking-ledger uppercase text-cream/60">
                Day 0{i + 1} · {cell.d}
              </span>
              <span className="font-display font-semibold text-[22px] md:text-[26px] tracking-tightest text-cream">
                {cell.c}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-2xl font-display italic text-[19px] text-cream/85">
          Plain dispatch. No theme park demos. No flow charts. No six-week SOW.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

function Faq() {
  const items: Array<{ q: string; a: string }> = [
    {
      q: "Why a $299 setup fee instead of a free trial?",
      a: "Because the build is real work — we ingest your KB, tune tone, wire three channels, and put a human on call for the weekend handoff. The setup fee covers that. It is also our refund clause: 30% drop in unanswered DMs in month one, or you get the setup back."
    },
    {
      q: "Why crypto checkout instead of a card?",
      a: "It is the cleanest cross-border rail and avoids 3-5% card-processing fees on the markets we serve. We invoice in USDT or USDC by default through NOWPayments. If you'd rather pay by Wise or Payoneer, ask the dispatcher and we'll hand-wire it."
    },
    {
      q: "I only need WhatsApp. Does Telegram fallback cost extra?",
      a: "No. Telegram fallback is baked into every contract for free. It costs us nothing to wire and it keeps your bot answering when Meta changes WhatsApp policy. Take Starter on WhatsApp; we'll set up Telegram silently so you have it the day Meta acts up."
    },
    {
      q: "What about my Russian, Spanish, or other non-English customers?",
      a: "Multilingual is the default. The router answers in the customer's input language. We test RU + ES + EN together every Friday before go-live. Other languages on request — Portuguese, Vietnamese, Indonesian, and Kazakh are all in production at peer studios."
    },
    {
      q: "Is this just a GPT wrapper?",
      a: "No. We route to GLM 5.1 Flash for >80% of replies, Claude 4.5 Haiku for the harder long tail, and Whisper for voice notes. We do not fine-tune; we tune the knowledge base. That keeps Starter gross-margin positive in cheap currencies — the routing is a strategic line, not an ops detail."
    },
    {
      q: "What happens after the Friday handoff?",
      a: "Tuesday tuning calls (15 minutes each). Monthly one-page accuracy report on the last Friday of every month. KB freshness is tracked — after 30 days un-edited the bot prefixes its replies with a quiet 'last updated …' note so your customer is never lied to. The subscription is the maintenance loop."
    }
  ];

  return (
    <section id="faq" className="section">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-20 md:py-24">
        <SectionHeader eyebrow="FAQ" title="Six questions, answered straight." />
        <div className="mt-12 max-w-2xl">
          {items.map((item) => (
            <details key={item.q} className="faq">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

function Footer() {
  return (
    <footer id="footer" className="bg-cream-2">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-14 md:py-16 grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-6 flex flex-col gap-4">
          <Logo />
          <p className="max-w-md text-[14.5px] text-graphite leading-snug">
            Dispatch is a productized chatbot agency. Spec on Monday, bot live by Friday. One
            knowledge base, three channels, one bill. Built in 2026 by the prin7r-projects
            studio.
          </p>
        </div>
        <nav className="md:col-span-3 flex flex-col gap-3" aria-label="footer">
          <p className="kicker">The desk</p>
          <a className="text-[14px] text-forest hover:text-carmine transition-colors" href="mailto:desk@chatbot-agency.prin7r.com">
            desk@chatbot-agency.prin7r.com
          </a>
          <a className="text-[14px] text-forest hover:text-carmine transition-colors" href="mailto:partners@chatbot-agency.prin7r.com">
            partners@chatbot-agency.prin7r.com
          </a>
        </nav>
        <nav className="md:col-span-3 flex flex-col gap-3" aria-label="resources">
          <p className="kicker">Repo · docs</p>
          <Link
            className="text-[14px] text-forest hover:text-carmine transition-colors"
            href="https://github.com/prin7r-projects/chatbot-agency"
          >
            github.com/prin7r-projects/chatbot-agency
          </Link>
          <Link
            className="text-[14px] text-forest hover:text-carmine transition-colors"
            href="https://github.com/prin7r-projects/chatbot-agency/tree/main/docs"
          >
            10 strategy docs
          </Link>
        </nav>
      </div>
      <div className="mx-auto max-w-prose px-6 md:px-10 pb-10 flex flex-col md:flex-row justify-between gap-3 border-t border-forest/12 pt-6">
        <p className="font-mono text-[11px] tracking-ledger uppercase text-linen">
          © 2026 prin7r-projects · MIT
        </p>
        <p className="font-mono text-[11px] tracking-ledger uppercase text-linen">
          Plain dispatch · no theme park demos
        </p>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/* Section header helper                                                      */
/* -------------------------------------------------------------------------- */

function SectionHeader({
  eyebrow,
  title,
  lede
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="kicker">{eyebrow}</p>
      <span className="eyebrow-rule" aria-hidden="true" />
      <h2 className="font-display font-semibold text-[40px] md:text-[56px] leading-[1.05] tracking-tightest">
        {title}
      </h2>
      {lede ? <p className="mt-5 text-[17px] md:text-[19px] text-graphite leading-snug">{lede}</p> : null}
    </div>
  );
}
