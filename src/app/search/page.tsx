import Link from 'next/link'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG } from '@/lib/site-config'
import { TaskPostCard } from '@/components/shared/task-post-card'
import { MarketingFeatureCard, MarketingPublicShell, MarketingStatGrid } from '@/components/marketing/marketing-public-shell'
import { CATEGORY_OPTIONS } from '@/lib/categories'

export const revalidate = 3

const matchText = (value: string, query: string) => value.toLowerCase().includes(query)

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')

const compactText = (value: unknown) => {
  if (typeof value !== 'string') return ''
  return stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase()
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined,
  )
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
      ? []
      : SITE_CONFIG.tasks.flatMap((t) => getMockPostsForTask(t.key))

  const filtered = posts.filter((post) => {
    const content = post.content && typeof post.content === 'object' ? post.content : {}
    const typeText = compactText((content as Record<string, unknown>).type)
    if (typeText === 'comment') return false
    const description = compactText((content as Record<string, unknown>).description)
    const body = compactText((content as Record<string, unknown>).body)
    const excerpt = compactText((content as Record<string, unknown>).excerpt)
    const categoryText = compactText((content as Record<string, unknown>).category)
    const tags = Array.isArray(post.tags) ? post.tags.join(' ') : ''
    const tagsText = compactText(tags)
    const derivedCategory = categoryText || tagsText
    if (category && !derivedCategory.includes(category)) return false
    if (task && typeText && typeText !== task) return false
    if (!normalized.length) return true
    return (
      matchText(compactText(post.title || ''), normalized) ||
      matchText(compactText(post.summary || ''), normalized) ||
      matchText(description, normalized) ||
      matchText(body, normalized) ||
      matchText(excerpt, normalized) ||
      matchText(tagsText, normalized)
    )
  })

  const results = normalized.length > 0 ? filtered : filtered.slice(0, 24)

  const searchForm = (
    <div className="w-full max-w-md rounded-[1.5rem] border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Search</p>
      <form action="/search" className="mt-4 space-y-3">
        <input type="hidden" name="master" value="1" />
        {task ? <input type="hidden" name="task" value={task} /> : null}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input name="q" defaultValue={query} placeholder="Search collections and links…" className="h-12 rounded-2xl border-neutral-200 pl-10 text-neutral-950" />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Category</label>
          <select
            name="category"
            defaultValue={category || 'all'}
            className="mt-1 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-950 focus:border-neutral-400 focus:outline-none"
          >
            <option value="all">All categories</option>
            {CATEGORY_OPTIONS.map((item) => (
              <option key={item.slug} value={item.slug}>{item.name}</option>
            ))}
          </select>
        </div>
        <Button type="submit" className="h-11 w-full rounded-full bg-neutral-950 text-white hover:bg-neutral-800">
          Search
        </Button>
      </form>
      <p className="mt-4 text-xs text-neutral-500">Tip: select a category to filter results, or search by keyword.</p>
    </div>
  )

  return (
    <MarketingPublicShell
      eyebrow="Explore"
      title="Search the community"
      description={
        query
          ? `Showing matches for "${query}" across bookmark collections and resources.`
          : 'Find public collections and saved resources in one place—without switching tools.'
      }
      heroAside={searchForm}
    >
      <div className="mb-12">
        <MarketingStatGrid
          items={[
            { value: String(results.length), label: 'Results in view', hint: query ? 'For your current query' : 'Latest slice of the index' },
            { value: '1', label: 'Core format', hint: 'Bookmark collections & curated links' },
            { value: '< 200ms', label: 'Typical feel', hint: 'Lightweight cards and caching' },
            { value: '24/7', label: 'Self-serve discovery', hint: 'No gatekeeping on public boards' },
          ]}
        />
      </div>

      <div className="mb-10 grid gap-6 lg:grid-cols-2">
        <MarketingFeatureCard
          tone="amber"
          title="Prefer browsing shelves?"
          description="Jump straight into curated bookmarks with context and short notes attached to every link."
        >
          <Button asChild className="rounded-full bg-neutral-950 text-white hover:bg-neutral-800">
            <Link href="/sbm">Open bookmarks</Link>
          </Button>
        </MarketingFeatureCard>
        <MarketingFeatureCard
          tone="violet"
          title="Browse by category?"
          description="Filter collections by topic to find exactly what you are looking for—quick and easy."
        >
          <form action="/search" className="flex gap-2">
            <input type="hidden" name="master" value="1" />
            <select
              name="category"
              className="h-10 flex-1 rounded-full border border-neutral-300 bg-white px-3 text-sm"
            >
              <option value="">Select category</option>
              {CATEGORY_OPTIONS.slice(0, 6).map((item) => (
                <option key={item.slug} value={item.slug}>{item.name}</option>
              ))}
            </select>
            <Button type="submit" size="sm" className="rounded-full bg-neutral-950 text-white">
              Go
            </Button>
          </form>
        </MarketingFeatureCard>
      </div>

      <div className="rounded-[1.5rem] border border-dashed border-neutral-200 bg-neutral-50 px-8 py-14 text-center text-neutral-600">
        <p className="text-lg font-semibold text-neutral-900">Browse collections</p>
        <p className="mt-2 text-sm">Explore curated bookmarks and resources.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-full bg-neutral-950 text-white hover:bg-neutral-800">
            <Link href="/sbm">View bookmarks</Link>
          </Button>
        </div>
      </div>
    </MarketingPublicShell>
  )
}
