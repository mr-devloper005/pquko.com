import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Phone, MapPin, Clock, Shield, Award, Users, Bookmark } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { MarketingFeatureCard, MarketingPublicShell, MarketingStatGrid } from '@/components/marketing/marketing-public-shell'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/about',
    title: `About Us | ${SITE_CONFIG.name}`,
    description: 'A curated platform for saving, organizing, and sharing the best links on the web.',
    openGraphTitle: `About Us | ${SITE_CONFIG.name}`,
    openGraphDescription: 'Discover, save, and share curated bookmarks with a community that values quality over quantity.',
  })
}

const stats = [
  { value: '12k+', label: 'Active Curators', hint: 'Saving and sharing links daily' },
  { value: '180k+', label: 'Bookmarks Saved', hint: 'Across all collections' },
  { value: '8.6k', label: 'Collections Live', hint: 'Organized with notes and tags' },
  { value: '36', label: 'Categories', hint: 'From tech to lifestyle and beyond' },
]

const values = [
  {
    title: 'Curation Over Noise',
    body: 'You decide what gets saved, grouped, and surfaced. Algorithms do not rewrite your intent.',
  },
  {
    title: 'Context With Every Link',
    body: 'Every bookmark includes notes and source links so the story behind your saves stays intact.',
  },
  {
    title: 'Share Without Lock-in',
    body: 'Collections export as links, not walled gardens—perfect for newsletters, research, and collaboration.',
  },
]

const history = [
  { year: '2022', title: 'Proof of Calm Discovery', body: 'We prototyped a feed that prioritized return visits over raw engagement.' },
  { year: '2024', title: 'SBM Platform Launch', body: 'Bookmark collections shipped as a focused, cohesive experience for curators.' },
  { year: '2025', title: 'Category Search', body: 'Added category-based filtering so users can find the right collections faster.' },
  { year: '2026', title: 'Community Scale', body: 'Thousands of curators publish public boards with notes and source links intact.' },
]

export default function AboutPage() {
  return (
    <MarketingPublicShell
      eyebrow="About Us"
      title="A quieter home for the best links on the web"
      description="We believe the best parts of the internet are still human-filtered. Pquko gives curators a calm space to save, organize, and share the links they stand behind."
      actions={
        <>
          <Button asChild className="rounded-full bg-neutral-950 px-6 text-white hover:bg-neutral-800">
            <Link href="/sbm">Browse Collections</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-neutral-300 bg-white px-6">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </>
      }
    >
      <section className="mb-16">
        <MarketingStatGrid items={stats} />
      </section>

      <section className="mb-16 grid gap-6 lg:grid-cols-3">
        {values.map((item) => (
          <MarketingFeatureCard key={item.title} tone="neutral" title={item.title} description={item.body} />
        ))}
      </section>

      <section className="mb-16 grid gap-8 rounded-[1.75rem] border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-8 lg:grid-cols-[1fr_1.1fr] lg:p-12">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950">Our Journey</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            Small releases, loud listening. Each milestone brought us closer to a platform that respects your time and your links.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-sm text-neutral-600">
              <MapPin className="h-5 w-5 text-neutral-400" />
              <span>Available worldwide, 100% online</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-600">
              <Clock className="h-5 w-5 text-neutral-400" />
              <span>Always on—save and browse anytime</span>
            </div>
          </div>
        </div>
        <div className="space-y-5">
          {history.map((m) => (
            <div key={m.year} className="rounded-[1.25rem] border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-semibold text-neutral-950">{m.title}</p>
              <p className="mt-2 text-sm text-neutral-600">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16 rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-8 lg:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950">Why Choose Pquko</h2>
          <p className="mt-4 text-neutral-600">
            We are not just another bookmarking tool—we are building a space where curated links carry context and collections carry meaning.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-[1.25rem] border border-neutral-200 bg-white p-6">
              <Shield className="mx-auto h-8 w-8 text-neutral-700" />
              <p className="mt-4 font-semibold text-neutral-950">Verified Links</p>
              <p className="mt-1 text-sm text-neutral-600">Every save includes source and context</p>
            </div>
            <div className="rounded-[1.25rem] border border-neutral-200 bg-white p-6">
              <Bookmark className="mx-auto h-8 w-8 text-neutral-700" />
              <p className="mt-4 font-semibold text-neutral-950">Smart Collections</p>
              <p className="mt-1 text-sm text-neutral-600">Organize by topic, tag, or project</p>
            </div>
            <div className="rounded-[1.25rem] border border-neutral-200 bg-white p-6">
              <Users className="mx-auto h-8 w-8 text-neutral-700" />
              <p className="mt-4 font-semibold text-neutral-950">Community Driven</p>
              <p className="mt-1 text-sm text-neutral-600">Discover what others curate and trust</p>
            </div>
          </div>
        </div>
      </section>
    </MarketingPublicShell>
  )
}
