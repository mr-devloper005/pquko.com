'use client'

import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'

type MarketingPublicShellProps = {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
  /** Optional right column in the hero (e.g. search form) on large screens */
  heroAside?: ReactNode
  children: ReactNode
}

export function MarketingPublicShell({ eyebrow, title, description, actions, heroAside, children }: MarketingPublicShellProps) {
  const split = Boolean(heroAside)

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <Suspense fallback={<div className="h-20" />}>
        <Navbar />
      </Suspense>
      <header className="relative overflow-hidden border-b border-neutral-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_55%,#fff7ed_100%)]">
        <div className="pointer-events-none absolute left-[6%] top-20 hidden h-20 w-36 rounded-[1.25rem] bg-[#fde68a]/90 lg:block" />
        <div className="pointer-events-none absolute right-[8%] top-32 hidden h-24 w-40 rounded-[1.25rem] bg-[#e9d5ff]/90 lg:block" />
        <div className="pointer-events-none absolute bottom-16 left-[18%] hidden h-16 w-32 rounded-[1.25rem] bg-[#fecaca]/75 lg:block" />

        <div className={`relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20 ${split ? 'text-left' : 'text-center'}`}>
          <div className={split ? 'grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center' : ''}>
            <div className={split ? '' : 'mx-auto max-w-3xl'}>
              {eyebrow ? (
                <p className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-600">
                  {eyebrow}
                </p>
              ) : null}
              <h1 className={`mt-6 text-4xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-5xl ${split ? '' : ''}`}>{title}</h1>
              <p className={`mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg ${split ? 'max-w-xl' : 'mx-auto max-w-2xl'}`}>{description}</p>
              {actions ? <div className={`mt-8 flex flex-wrap gap-3 ${split ? '' : 'justify-center'}`}>{actions}</div> : null}
            </div>
            {heroAside ? <div className="flex justify-center lg:justify-end">{heroAside}</div> : null}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">{children}</div>

      <Footer />
    </div>
  )
}

/** Pastel feature card — matches home marketing blocks */
export function MarketingFeatureCard({
  tone,
  title,
  description,
  children,
}: {
  tone: 'amber' | 'violet' | 'rose' | 'neutral'
  title: string
  description: string
  children?: ReactNode
}) {
  const tones = {
    amber: 'bg-[#fef9c3] border-amber-100',
    violet: 'bg-[#ede9fe] border-violet-100',
    rose: 'bg-[#fff1f2] border-rose-100',
    neutral: 'bg-neutral-50 border-neutral-200',
  } as const

  return (
    <div className={`rounded-[1.75rem] border p-8 shadow-sm ${tones[tone]}`}>
      <h2 className="text-xl font-semibold text-neutral-950">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-neutral-700">{description}</p>
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  )
}

export function MarketingStatGrid({ items }: { items: { label: string; value: string; hint?: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-[1.25rem] border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-2xl font-semibold tracking-tight text-neutral-950">{item.value}</p>
          <p className="mt-1 text-sm font-medium text-neutral-800">{item.label}</p>
          {item.hint ? <p className="mt-1 text-xs text-neutral-500">{item.hint}</p> : null}
        </div>
      ))}
    </div>
  )
}
