import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { MarketingPublicShell } from '@/components/marketing/marketing-public-shell'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/blog/community-shelves',
    title: `Community shelves beta | ${SITE_CONFIG.name}`,
    description: 'What we learned pairing researchers, librarians, and makers on shared taxonomies.',
  })
}

export default function CommunityShelvesArticlePage() {
  return (
    <MarketingPublicShell
      eyebrow="Essay · 5 min"
      title="Community shelves: lessons from 50 beta curators"
      description="Shared taxonomies sound fragile. Our beta showed the opposite—when everyone can fork a shelf, arguments turn into pull requests, not flame wars."
      actions={
        <Button asChild variant="outline" className="rounded-full border-neutral-300 bg-white px-6">
          <Link href="/blog">All field notes</Link>
        </Button>
      }
    >
      <article className="mx-auto max-w-3xl space-y-6 text-base leading-relaxed text-neutral-700">
        <p>
          We gave every cohort the same starter tags, then watched how groups bent them. The winning pattern was <strong>fork + rename</strong>: keep lineage visible, but let each team adapt language
          to their domain.
        </p>
        <p>
          Librarians pushed for stricter source metadata; indie makers wanted faster saves. The compromise is optional fields with smart defaults—never blocking saves, but nudging completeness when
          you publish publicly.
        </p>
        <p>
          Drama was rare because moderation tools were baked into the shelf itself: comments stay attached to individual links, not global shouting threads.
        </p>
      </article>
    </MarketingPublicShell>
  )
}
