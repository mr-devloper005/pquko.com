import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { MarketingFeatureCard, MarketingPublicShell, MarketingStatGrid } from '@/components/marketing/marketing-public-shell'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/blog',
    title: `Field notes | ${SITE_CONFIG.name}`,
    description: 'Release notes, curation essays, and community stories from the team.',
    openGraphTitle: `Field notes | ${SITE_CONFIG.name}`,
    openGraphDescription: 'Ideas on identity, bookmarking, and building quiet software.',
  })
}

const posts = [
  {
    slug: 'calm-feeds',
    title: 'Why we refuse infinite feeds for bookmarks',
    excerpt: 'Feeds optimize for dwell time; collections optimize for return visits. Here is how we split the difference without building two apps.',
    date: 'Mar 18, 2026',
    read: '6 min read',
  },
  {
    slug: 'profile-trust',
    title: 'Designing verification without the blue-check drama',
    excerpt: 'Verification should answer “is this the person they say they are?”—not “are they famous?” We share our lightweight review flow.',
    date: 'Feb 02, 2026',
    read: '8 min read',
  },
  {
    slug: 'community-shelves',
    title: 'Community shelves: lessons from 50 beta curators',
    excerpt: 'What happens when researchers, librarians, and indie makers share the same taxonomy? Surprisingly little drama.',
    date: 'Jan 09, 2026',
    read: '5 min read',
  },
]

export default function BlogPage() {
  return (
    <MarketingPublicShell
      eyebrow="Company"
      title="Field notes"
      description="Longer writing from the team—release cadence, ethics of curation, and behind-the-scenes product decisions."
      actions={
        <>
          <Button asChild className="rounded-full bg-neutral-950 px-6 text-white hover:bg-neutral-800">
            <Link href="/sbm">Browse public collections</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-neutral-300 bg-white px-6">
            <Link href="/community">Join the community</Link>
          </Button>
        </>
      }
    >
      <section className="mb-12">
        <MarketingStatGrid
          items={[
            { value: 'Monthly', label: 'Essay cadence', hint: 'Sometimes more when ships land' },
            { value: 'Guest', label: 'Curator voices', hint: 'Pitch us with three links' },
            { value: 'RSS', label: 'Available', hint: 'Old school, still best' },
            { value: '0', label: 'Pop-up newsletters', hint: 'Unless you opt in' },
          ]}
        />
      </section>

      <div className="mb-12 grid gap-6 lg:grid-cols-2">
        <MarketingFeatureCard
          tone="violet"
          title="Editorial guidelines"
          description="We look for specificity: screenshots, honest tradeoffs, and links to the resources that informed your thinking."
        >
          <Button asChild variant="outline" className="rounded-full border-violet-200 bg-white">
            <Link href="/contact">Pitch a story</Link>
          </Button>
        </MarketingFeatureCard>
        <MarketingFeatureCard
          tone="amber"
          title="For press & analysts"
          description="Need facts, logos, or a walkthrough? Skip the blog and head to the press desk for structured assets."
        >
          <Button asChild variant="outline" className="rounded-full border-amber-200 bg-white">
            <Link href="/press">Open press kit</Link>
          </Button>
        </MarketingFeatureCard>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-neutral-950">Latest entries</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="flex flex-col rounded-[1.5rem] border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <Clock className="h-3.5 w-3.5" />
                {post.date} · {post.read}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-950">{post.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900">
                Keep reading
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </MarketingPublicShell>
  )
}
