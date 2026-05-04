import Link from 'next/link'
import {
  ArrowRight,
  Bookmark,
  Compass,
  Heart,
  Layers,
  Share2,
  Sparkles,
} from 'lucide-react'
import { ContentImage } from '@/components/shared/content-image'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { siteContent } from '@/config/site.content'
import type { SitePost } from '@/lib/site-connector'

type EnabledTask = (typeof SITE_CONFIG.tasks)[number]

function resolveTaskKey(value: unknown, fallback: TaskKey): TaskKey {
  if (value === 'listing' || value === 'classified' || value === 'article' || value === 'image' || value === 'profile' || value === 'sbm') return value
  return fallback
}

function getTaskHref(task: TaskKey, slug: string) {
  const route = SITE_CONFIG.tasks.find((item) => item.key === task)?.route || `/${task}`
  return `${route}/${slug}`
}

function getPostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const contentImage =
    typeof post?.content === 'object' && post?.content && Array.isArray((post.content as Record<string, unknown>).images)
      ? (post.content as { images?: string[] }).images?.find((url: unknown) => typeof url === 'string' && url)
      : null
  const logo =
    typeof post?.content === 'object' && post?.content && typeof (post.content as Record<string, unknown>).logo === 'string'
      ? ((post.content as Record<string, unknown>).logo as string)
      : null
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

const partnerLabels = ['CurateLab', 'Northwind', 'Brightstack', 'Atlas', 'Kindred', 'Frame & Co']

export function CurationMarketingHome({
  primaryTask,
  bookmarkPosts,
  profilePosts,
}: {
  primaryTask?: EnabledTask
  bookmarkPosts: SitePost[]
  profilePosts: SitePost[]
}) {
  const collections = bookmarkPosts.slice(0, 4)
  const blogCards = bookmarkPosts.slice(0, 3)

  return (
    <main className="bg-white text-neutral-950">
      <section className="relative overflow-hidden border-b border-neutral-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_55%,#fff7ed_100%)]">
        <div className="pointer-events-none absolute left-[8%] top-24 hidden h-24 w-40 rounded-[1.25rem] bg-[#fde68a]/90 blur-0 lg:block" />
        <div className="pointer-events-none absolute right-[10%] top-40 hidden h-28 w-44 rounded-[1.25rem] bg-[#e9d5ff]/90 lg:block" />
        <div className="pointer-events-none absolute bottom-24 left-[20%] hidden h-20 w-36 rounded-[1.25rem] bg-[#fecaca]/80 lg:block" />

        <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-16 text-center sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-600">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Social bookmarking platform
          </p>
          <h1 className="mt-8 text-4xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            Your central hub for curation and shared bookmark collections.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            {siteContent.hero.description}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={primaryTask?.route || '/sbm'}
              className="inline-flex h-12 items-center justify-center rounded-full bg-neutral-950 px-8 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Get started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-4xl">Built for identity and calm curation</h2>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-600">
            Shape how you appear online, save what matters, and share shelves without the noise of generic feeds.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col justify-between rounded-[1.75rem] bg-[#fef9c3] p-8 lg:p-10">
            <div>
              <div className="inline-flex rounded-full bg-white/80 p-3 text-amber-900">
                <Bookmark className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-neutral-950">Curated collections</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-700">
                Organize your favorite links into themed collections with generous spacing and typography that keeps the focus on content.
              </p>
            </div>
            <Link href="/sbm" className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-neutral-900 underline-offset-4 hover:underline">
              Browse collections
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-col justify-between rounded-[1.75rem] bg-[#ede9fe] p-8 lg:p-10">
            <div>
              <div className="inline-flex rounded-full bg-white/80 p-3 text-violet-900">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-neutral-950">Seamless social sharing</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-violet-950/80">
                Turn saved links into shareable boards collaborators can follow without losing context or source quality.
              </p>
            </div>
            <Link href="/sbm" className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-violet-950 underline-offset-4 hover:underline">
              Browse bookmarks
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-[#fff5f5] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-4xl">
            Achieving growth with {SITE_CONFIG.name}
          </h2>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Bookmark, stat: '500+', label: 'Links organized daily', tone: 'bg-white' },
              { icon: Layers, stat: '120+', label: 'Public collections', tone: 'bg-white' },
              { icon: Heart, stat: '4.9', label: 'Avg. curator satisfaction', tone: 'bg-white' },
              { icon: Compass, stat: '38', label: 'Discovery communities', tone: 'bg-white' },
            ].map((item) => (
              <div key={item.label} className={`rounded-[1.5rem] border border-rose-100 p-6 ${item.tone} shadow-sm`}>
                <item.icon className="h-5 w-5 text-rose-600" />
                <p className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950">{item.stat}</p>
                <p className="mt-1 text-sm text-neutral-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[1.75rem] border border-neutral-200 bg-white p-8 sm:flex-row sm:items-center lg:p-10">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">Still browsing as a guest?</h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-600">Create a free account to save bookmarks and sync across devices.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/register" className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white hover:bg-neutral-800">
              Join now
            </Link>
            <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-300 bg-white px-6 text-sm font-semibold text-neutral-900 hover:bg-neutral-50">
              Log in
            </Link>
          </div>
        </div>

        {collections.length ? (
          <div className="mt-16">
            <h3 className="text-lg font-semibold text-neutral-950">Trending collections</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {collections.map((post) => (
                <Link
                  key={post.id}
                  href={`/sbm/${post.slug}`}
                  className="rounded-[1.25rem] border border-neutral-200 bg-[#fafafa] p-5 transition hover:border-neutral-300 hover:bg-white"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Collection</p>
                  <p className="mt-2 text-lg font-semibold text-neutral-950">{post.title}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{post.summary || 'Curated links with context for quick return visits.'}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  )
}
