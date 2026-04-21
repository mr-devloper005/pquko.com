import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { MarketingPublicShell } from '@/components/marketing/marketing-public-shell'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/blog/calm-feeds',
    title: `Why we refuse infinite feeds | ${SITE_CONFIG.name}`,
    description: 'How bookmark collections stay focused on return visits instead of dwell time.',
  })
}

export default function CalmFeedsArticlePage() {
  return (
    <MarketingPublicShell
      eyebrow="Essay · 6 min"
      title="Why we refuse infinite feeds for bookmarks"
      description="Feeds optimize for time-on-site. Collections optimize for memory. Here is the product tension we navigate every sprint."
      actions={
        <Button asChild variant="outline" className="rounded-full border-neutral-300 bg-white px-6">
          <Link href="/blog">All field notes</Link>
        </Button>
      }
    >
      <article className="mx-auto max-w-3xl">
        <p className="text-base leading-relaxed text-neutral-700">
          Social feeds reward novelty—even when the novelty is shallow. Bookmarking products often inherit that pattern because the same UI kits are reused. We deliberately cap auto-loading and
          instead surface <strong>collections you chose to pin</strong>, so the homepage feels like a shelf you organized, not a slot machine.
        </p>
        <p className="mt-6 text-base leading-relaxed text-neutral-700">
          Return visits matter more than raw scroll depth. When someone opens a saved board, they usually need a specific link fast. Infinite scroll hides edges; bounded collections expose them.
        </p>
        <p className="mt-6 text-base leading-relaxed text-neutral-700">
          We still experiment with recommendations, but they arrive as optional modules—never as replacements for your own ordering. That stance costs short-term engagement metrics and buys long-term
          trust.
        </p>
      </article>
    </MarketingPublicShell>
  )
}
