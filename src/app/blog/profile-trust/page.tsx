import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { MarketingPublicShell } from '@/components/marketing/marketing-public-shell'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/blog/profile-trust',
    title: `Verification without drama | ${SITE_CONFIG.name}`,
    description: 'A lightweight review flow that answers authenticity, not fame.',
  })
}

export default function ProfileTrustArticlePage() {
  return (
    <MarketingPublicShell
      eyebrow="Essay · 8 min"
      title="Designing verification without the blue-check drama"
      description="Verification should communicate consistency and safety—not celebrity. Here is the checklist our reviewers actually use."
      actions={
        <Button asChild variant="outline" className="rounded-full border-neutral-300 bg-white px-6">
          <Link href="/blog">All field notes</Link>
        </Button>
      }
    >
      <article className="mx-auto max-w-3xl space-y-6 text-base leading-relaxed text-neutral-700">
        <p>
          We ask for proof of ownership across a couple of signals—domain control, references from established profiles, or documented work. Fame is not a criterion; <strong>consistency</strong>{' '}
          is.
        </p>
        <p>
          Badges stay small and informational. They never reorder search results or inject algorithmic boosts, because that is how platforms slide back into pay-to-play dynamics.
        </p>
        <p>
          Appeals are human-reviewed with written responses. If we decline, we explain which criterion missed so applicants can fix real issues instead of guessing.
        </p>
      </article>
    </MarketingPublicShell>
  )
}
