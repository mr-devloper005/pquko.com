import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { mockTeamMembers } from '@/data/mock-data'
import { SITE_CONFIG } from '@/lib/site-config'
import { MarketingFeatureCard, MarketingPublicShell, MarketingStatGrid } from '@/components/marketing/marketing-public-shell'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/about',
    title: `About | ${SITE_CONFIG.name}`,
    description: 'Mission, milestones, and the team building calmer profiles and bookmark collections.',
    openGraphTitle: `About | ${SITE_CONFIG.name}`,
    openGraphDescription: 'Why we optimize for return visits, trust, and human curation.',
  })
}

const milestones = [
  { year: '2022', title: 'Proof of calm discovery', body: 'We prototyped a feed that prioritized return visits over raw engagement.' },
  { year: '2024', title: 'Profiles meet shelves', body: 'Identity and bookmark collections shipped as one cohesive experience.' },
  { year: '2026', title: 'Community scale', body: 'Thousands of curators publish public boards with notes and source links intact.' },
]

const principles = [
  {
    title: 'Curation over noise',
    body: 'You decide what gets saved, grouped, and surfaced. Algorithms do not rewrite your intent.',
  },
  {
    title: 'Identity with context',
    body: 'Profiles explain who someone is while linking to the collections that prove their taste.',
  },
  {
    title: 'Sharing without lock-in',
    body: 'Collections export as links, not walled gardens—perfect for bios, newsletters, and decks.',
  },
]

export default function AboutPage() {
  return (
    <MarketingPublicShell
      eyebrow="About"
      title={`Why ${SITE_CONFIG.name} exists`}
      description={`We believe the best parts of the web are still human-filtered. ${SITE_CONFIG.name} gives curators a quiet stage for their identity and the links they stand behind.`}
      actions={
        <>
          <Button asChild className="rounded-full bg-neutral-950 px-6 text-white hover:bg-neutral-800">
            <Link href="/register">Create a profile</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-neutral-300 bg-white px-6">
            <Link href="/contact">Talk with us</Link>
          </Button>
        </>
      }
    >
      <section className="mb-16">
        <MarketingStatGrid
          items={[
            { value: '12k+', label: 'Active curators', hint: 'Publishing at least one public board' },
            { value: '180k', label: 'Bookmarks saved', hint: 'Across teams and solo creators' },
            { value: '8.6k', label: 'Collections live', hint: 'Shared with notes and tags' },
            { value: '42', label: 'Partner orgs', hint: 'Using boards for research & enablement' },
          ]}
        />
      </section>

      <section className="mb-16 grid gap-6 lg:grid-cols-3">
        {principles.map((item) => (
          <MarketingFeatureCard key={item.title} tone="neutral" title={item.title} description={item.body} />
        ))}
      </section>

      <section className="mb-16 grid gap-8 rounded-[1.75rem] border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-8 lg:grid-cols-[1fr_1.1fr] lg:p-12">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950">Our timeline</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">Small releases, loud listening. Each milestone tightened the loop between profiles and bookmark shelves.</p>
        </div>
        <div className="space-y-5">
          {milestones.map((m) => (
            <div key={m.year} className="rounded-[1.25rem] border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">{m.year}</p>
              <p className="mt-2 text-lg font-semibold text-neutral-950">{m.title}</p>
              <p className="mt-2 text-sm text-neutral-600">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950">People behind the product</h2>
            <p className="mt-2 text-neutral-600">Operators, designers, and community builders who obsess over trustworthy surfaces.</p>
          </div>
          <Button asChild variant="outline" className="w-fit rounded-full border-neutral-300">
            <Link href="/team">Meet everyone</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {mockTeamMembers.map((member) => (
            <div key={member.id} className="rounded-[1.5rem] border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14 border border-neutral-100">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-neutral-950">{member.name}</p>
                  <p className="text-xs text-neutral-500">{member.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600">{member.bio}</p>
              <p className="mt-3 text-xs text-neutral-400">{member.location}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingPublicShell>
  )
}
