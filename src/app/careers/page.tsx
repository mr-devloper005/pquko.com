import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { MarketingFeatureCard, MarketingPublicShell, MarketingStatGrid } from '@/components/marketing/marketing-public-shell'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/careers',
    title: `Careers | ${SITE_CONFIG.name}`,
    description: 'Join the team building calmer profiles and collaborative bookmarking.',
    openGraphTitle: `Careers | ${SITE_CONFIG.name}`,
    openGraphDescription: 'Remote-friendly roles across product, engineering, and community.',
  })
}

const roles = [
  { title: 'Product Designer', location: 'Remote (EU/US overlap)', type: 'Full-time', level: 'Mid', focus: 'Systems thinking for profiles + collections UI.' },
  { title: 'Frontend Engineer', location: 'New York / Remote', type: 'Full-time', level: 'Senior', focus: 'Next.js, accessibility, and motion that stays subtle.' },
  { title: 'Community Lead', location: 'Remote', type: 'Part-time', level: 'Mid', focus: 'Guides, onboarding, and curator storytelling.' },
]

const benefits = [
  'Remote-first with intentional travel weeks',
  'Learning budget for conferences & books',
  'Mental health stipend and async-friendly meetings',
  'Equity for every full-time hire',
]

const values = [
  { tone: 'amber' as const, title: 'Bias for clarity', description: 'If a flow needs a tooltip, we redesign the flow.' },
  { tone: 'violet' as const, title: 'Protect curators', description: 'We side with people who add context—not drive-by spam.' },
  { tone: 'rose' as const, title: 'Ship in slices', description: 'Small releases beat big-bang launches; customers feel every improvement.' },
]

export default function CareersPage() {
  return (
    <MarketingPublicShell
      eyebrow="Company"
      title="Careers"
      description={`Help us prove that ${SITE_CONFIG.name} can stay human at scale. We hire for taste, empathy, and the stubbornness to keep interfaces quiet.`}
      actions={
        <Button asChild className="rounded-full bg-neutral-950 px-6 text-white hover:bg-neutral-800">
          <Link href="/contact">Talk to recruiting</Link>
        </Button>
      }
    >
      <section className="mb-16">
        <MarketingStatGrid
          items={[
            { value: '18 mo', label: 'Median tenure', hint: 'People stick once they arrive' },
            { value: '4.8 / 5', label: 'Candidate NPS', hint: 'Rolling 6 months' },
            { value: '32h', label: 'Deep work goal', hint: 'Meetings capped for makers' },
            { value: '0', label: 'Buzzword OKRs', hint: 'We plan in outcomes, not acronyms' },
          ]}
        />
      </section>

      <section className="mb-16 grid gap-6 lg:grid-cols-3">
        {values.map((v) => (
          <MarketingFeatureCard key={v.title} tone={v.tone} title={v.title} description={v.description} />
        ))}
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-950">Open roles</h2>
          {roles.map((role) => (
            <div key={role.title} className="rounded-[1.5rem] border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default" className="rounded-full bg-neutral-950 text-white hover:bg-neutral-950">
                  {role.level}
                </Badge>
                <Badge variant="outline" className="rounded-full border-neutral-300">
                  {role.type}
                </Badge>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-neutral-950">{role.title}</h3>
              <p className="text-sm text-neutral-500">{role.location}</p>
              <p className="mt-3 text-sm text-neutral-600">{role.focus}</p>
              <Button asChild variant="outline" className="mt-4 rounded-full border-neutral-300">
                <Link href="/contact">Ask about this role</Link>
              </Button>
            </div>
          ))}
        </div>
        <div className="h-fit rounded-[1.5rem] border border-neutral-200 bg-[#fffbeb] p-6">
          <h3 className="text-lg font-semibold text-neutral-950">Benefits snapshot</h3>
          <ul className="mt-4 space-y-3 text-sm text-neutral-700">
            {benefits.map((benefit) => (
              <li key={benefit} className="rounded-xl border border-amber-100 bg-white/80 px-3 py-2">
                {benefit}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-neutral-500">We publish salary bands in the first recruiter email—no guessing games.</p>
        </div>
      </div>
    </MarketingPublicShell>
  )
}
