import Link from 'next/link'
import {
  ArrowRight,
  Bookmark,
  Compass,
  Heart,
  Layers,
  Palette,
  Quote,
  Share2,
  ShieldCheck,
  Sparkles,
  UserRound,
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
  const people = profilePosts.slice(0, 3)
  const blogCards = bookmarkPosts.slice(0, 3)
  const leadProfile = profilePosts[0]

  return (
    <main className="bg-white text-neutral-950">
      <section className="relative overflow-hidden border-b border-neutral-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_55%,#fff7ed_100%)]">
        <div className="pointer-events-none absolute left-[8%] top-24 hidden h-24 w-40 rounded-[1.25rem] bg-[#fde68a]/90 blur-0 lg:block" />
        <div className="pointer-events-none absolute right-[10%] top-40 hidden h-28 w-44 rounded-[1.25rem] bg-[#e9d5ff]/90 lg:block" />
        <div className="pointer-events-none absolute bottom-24 left-[20%] hidden h-20 w-36 rounded-[1.25rem] bg-[#fecaca]/80 lg:block" />

        <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-16 text-center sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-600">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Profiles & social bookmarking
          </p>
          <h1 className="mt-8 text-4xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            Your central hub for identity, curation, and shared collections.
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
            <Link
              href="/profile"
              className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-300 bg-white px-8 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
            >
              Explore profiles
            </Link>
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="absolute left-2 top-[12%] z-10 hidden w-[min(100%,220px)] rounded-[1.25rem] border border-neutral-200/80 bg-white/95 p-4 shadow-sm backdrop-blur-sm lg:block">
            <p className="text-xs font-semibold text-neutral-500">Bookmarks saved</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">1k+</p>
            <p className="mt-1 text-xs text-neutral-500">Organized by topic and mood.</p>
          </div>
          <div className="absolute right-0 top-[8%] z-10 hidden w-[min(100%,200px)] rounded-[1.25rem] border border-neutral-200/80 bg-[#f5f3ff] p-4 shadow-sm lg:block">
            <p className="text-xs font-semibold text-violet-800/80">Verified presence</p>
            <p className="mt-1 text-lg font-semibold text-violet-950">Public profile</p>
            <p className="mt-1 text-xs text-violet-900/70">Share collections in one link.</p>
          </div>
          <div className="absolute bottom-[18%] left-[6%] z-10 hidden rounded-[1.25rem] border border-neutral-200/80 bg-[#fff7d6] px-4 py-3 text-left shadow-sm lg:block">
            <p className="text-xs font-medium text-amber-900/80">Top collections</p>
            <p className="text-sm font-semibold text-amber-950">Pinned this week</p>
          </div>

          <div className="relative mx-auto mt-4 max-w-md lg:max-w-lg">
            <div className="rounded-[2rem] border border-neutral-200 bg-neutral-950 p-3 shadow-[0_32px_80px_rgba(15,23,42,0.12)]">
              <div className="overflow-hidden rounded-[1.5rem] bg-neutral-100">
                <div className="relative aspect-[9/16] max-h-[420px] w-full bg-gradient-to-b from-white to-neutral-100">
                  {leadProfile ? (
                    <ContentImage src={getPostImage(leadProfile)} alt={leadProfile.title} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                      <UserRound className="h-12 w-12 text-neutral-400" />
                      <p className="text-sm font-medium text-neutral-600">Your profile & bookmark dashboard</p>
                      <p className="text-xs text-neutral-500">Collections, bio, and saved links in one calm surface.</p>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-6 pt-20">
                    <p className="text-left text-xs font-semibold uppercase tracking-wider text-white/80">Preview</p>
                    <p className="text-left text-lg font-semibold text-white">Curate in public or keep drafts private.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-neutral-50 py-10">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">Trusted by teams who live in links</p>
        <div className="mx-auto mt-6 flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 opacity-60 grayscale sm:px-6">
          {partnerLabels.map((name) => (
            <span key={name} className="text-sm font-semibold text-neutral-700">
              {name}
            </span>
          ))}
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
                <Palette className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-neutral-950">Profile customization</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-700">
                Present your story, highlights, and best collections with generous spacing and typography that keeps the focus on you.
              </p>
            </div>
            <Link href="/profile" className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-neutral-900 underline-offset-4 hover:underline">
              Learn more
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

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-8 lg:p-10">
            <Quote className="h-10 w-10 text-neutral-300" />
            <blockquote className="mt-6 text-2xl font-medium leading-snug text-neutral-900 sm:text-[1.65rem]">
              {SITE_CONFIG.name} finally made it feel natural to keep research, inspiration, and my public profile aligned—without juggling five tools.
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-neutral-200 bg-white">
                {leadProfile ? (
                  <ContentImage src={getPostImage(leadProfile)} alt={leadProfile.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-neutral-500">MK</div>
                )}
              </div>
              <div>
                <p className="font-semibold text-neutral-950">{leadProfile?.title || 'Morgan Kim'}</p>
                <p className="text-sm text-neutral-600">Product researcher & curator</p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-8 shadow-sm lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Summary</p>
            <h3 className="mt-3 text-xl font-semibold text-neutral-950">What changed after switching</h3>
            <ul className="mt-6 space-y-4 text-sm text-neutral-600">
              <li className="flex justify-between border-b border-neutral-100 pb-3">
                <span>Total followers</span>
                <span className="font-semibold text-neutral-950">12.4k</span>
              </li>
              <li className="flex justify-between border-b border-neutral-100 pb-3">
                <span>Public collections</span>
                <span className="font-semibold text-neutral-950">26</span>
              </li>
              <li className="flex justify-between border-b border-neutral-100 pb-3">
                <span>Weekly saves</span>
                <span className="font-semibold text-neutral-950">840</span>
              </li>
              <li className="flex justify-between pt-1">
                <span>Verified profile</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                  Active
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950">The latest from our community</h2>
              <p className="mt-2 text-neutral-600">Fresh collections and profiles worth a follow.</p>
            </div>
            <Link href="/sbm" className="inline-flex w-fit items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-100">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {(blogCards.length ? blogCards : [null, null, null]).map((post, index) => {
              const key = post?.id || `placeholder-${index}`
              const title = post?.title || ['Design systems reading list', 'Indie research shelf', 'Weekly inspiration board'][index % 3]
              const summary = post?.summary || 'A calm set of bookmarks with short notes so context never gets lost.'
              const image = post ? getPostImage(post) : '/placeholder.svg?height=600&width=900'
              const href = post ? getTaskHref(resolveTaskKey(post.task, 'sbm'), post.slug) : '/sbm'
              return (
                <article key={key} className="flex flex-col overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm">
                  <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-neutral-100">
                    <ContentImage src={image} alt={title} fill className="object-cover transition duration-500 hover:scale-[1.03]" />
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs text-neutral-500">Apr 12 · Community</p>
                    <Link href={href} className="mt-2 text-lg font-semibold text-neutral-950 hover:underline">
                      {title}
                    </Link>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{summary}</p>
                    <Link href={href} className="mt-4 text-sm font-semibold text-neutral-900 underline-offset-4 hover:underline">
                      Read more
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[1.75rem] border border-neutral-200 bg-white p-8 sm:flex-row sm:items-center lg:p-10">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">Still browsing as a guest?</h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-600">Create a free account to save bookmarks, publish your profile, and sync across devices.</p>
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

        {collections.length || people.length ? (
          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            {collections.length ? (
              <div>
                <h3 className="text-lg font-semibold text-neutral-950">Trending collections</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {collections.map((post) => (
                    <Link
                      key={post.id}
                      href={getTaskHref(resolveTaskKey(post.task, 'sbm'), post.slug)}
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
            {people.length ? (
              <div>
                <h3 className="text-lg font-semibold text-neutral-950">People to follow</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {people.map((post) => (
                    <Link key={post.id} href={`/profile/${post.slug}`} className="overflow-hidden rounded-[1.25rem] border border-neutral-200 bg-white">
                      <div className="relative h-32">
                        <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                      </div>
                      <div className="p-4">
                        <p className="font-semibold text-neutral-950">{post.title}</p>
                        <p className="mt-1 text-xs text-neutral-600">Public profile & collections</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  )
}
