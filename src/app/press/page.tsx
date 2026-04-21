import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { mockPressAssets, mockPressCoverage } from '@/data/mock-data'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { MarketingFeatureCard, MarketingPublicShell, MarketingStatGrid } from '@/components/marketing/marketing-public-shell'
import { PressKitClient } from '@/components/marketing/press-kit-client'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/press',
    title: `Press | ${SITE_CONFIG.name}`,
    description: 'Media resources, coverage, and talking points about profiles and social bookmarking.',
    openGraphTitle: `Press | ${SITE_CONFIG.name}`,
    openGraphDescription: 'Download brand assets and read recent coverage.',
  })
}

export default function PressPage() {
  return (
    <MarketingPublicShell
      eyebrow="Company"
      title="Press"
      description="Everything you need to cover profiles, collaborative bookmarking, and the quieter side of social software."
      actions={
        <>
          <Button asChild className="rounded-full bg-neutral-950 px-6 text-white hover:bg-neutral-800">
            <Link href="mailto:press@example.com">Email press</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-neutral-300 bg-white px-6">
            <Link href="/contact">Book a briefing</Link>
          </Button>
        </>
      }
    >
      <section className="mb-12">
        <MarketingStatGrid
          items={[
            { value: '12', label: 'Logos & captures', hint: 'Vector + raster' },
            { value: '6', label: 'Story angles', hint: 'Pre-briefed talking points' },
            { value: '24h', label: 'Embargo support', hint: 'On request' },
            { value: 'Global', label: 'Languages', hint: 'EN-first, localization roadmap' },
          ]}
        />
      </section>

      <div className="mb-12 grid gap-6 lg:grid-cols-2">
        <MarketingFeatureCard
          tone="amber"
          title="Messaging guardrails"
          description="We lead with trust, curation, and creator control—not engagement hacks or opaque algorithms."
        />
        <MarketingFeatureCard
          tone="violet"
          title="Executive bios"
          description="Need a quote on the future of bookmarking? We can connect you with product or community leadership quickly."
        />
      </div>

      <PressKitClient assets={mockPressAssets} coverage={mockPressCoverage} />
    </MarketingPublicShell>
  )
}
