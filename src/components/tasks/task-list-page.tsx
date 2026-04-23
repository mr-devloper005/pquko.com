import Link from 'next/link'
import { ArrowRight, Bookmark, Building2, FileText, Image as ImageIcon, LayoutGrid, ShieldCheck, Sparkles, Tag, User } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { TaskListClient } from '@/components/tasks/task-list-client'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG, getTaskConfig, type TaskKey } from '@/lib/site-config'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { taskIntroCopy } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { TASK_LIST_PAGE_OVERRIDE_ENABLED, TaskListPageOverride } from '@/overrides/task-list-page'

const taskIcons: Record<TaskKey, any> = {
  listing: Building2,
  article: FileText,
  image: ImageIcon,
  profile: User,
  classified: Tag,
  sbm: LayoutGrid,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

const marketingUi = {
  muted: 'text-neutral-600',
  panel: 'rounded-[1.75rem] border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]',
  soft: 'inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50',
  input: 'rounded-2xl border border-neutral-200 bg-white px-3 text-sm text-neutral-950',
  button: 'inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800',
} as const

const variantShells = {
  'listing-directory': 'bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.08),transparent_24%),linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]',
  'listing-showcase': 'bg-[linear-gradient(180deg,#ffffff_0%,#f4f9ff_100%)]',
  'article-editorial': 'bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.08),transparent_20%),linear-gradient(180deg,#fff8ef_0%,#ffffff_100%)]',
  'article-journal': 'bg-[linear-gradient(180deg,#fffdf9_0%,#f7f1ea_100%)]',
  'image-masonry': 'bg-[linear-gradient(180deg,#09101d_0%,#111c2f_100%)] text-white',
  'image-portfolio': 'bg-[linear-gradient(180deg,#07111f_0%,#13203a_100%)] text-white',
  'profile-creator': 'bg-[linear-gradient(180deg,#0a1120_0%,#101c34_100%)] text-white',
  'profile-business': 'bg-[linear-gradient(180deg,#f6fbff_0%,#ffffff_100%)]',
  'classified-bulletin': 'bg-[linear-gradient(180deg,#edf3e4_0%,#ffffff_100%)]',
  'classified-market': 'bg-[linear-gradient(180deg,#f4f6ef_0%,#ffffff_100%)]',
  'sbm-curation': 'bg-[linear-gradient(180deg,#fff7ee_0%,#ffffff_100%)]',
  'sbm-library': 'bg-[linear-gradient(180deg,#f7f8fc_0%,#ffffff_100%)]',
} as const

export async function TaskListPage({
  task,
  category,
  appearance = 'default',
}: {
  task: TaskKey
  category?: string
  appearance?: 'default' | 'marketing'
}) {
  if (TASK_LIST_PAGE_OVERRIDE_ENABLED) {
    return await TaskListPageOverride({ task, category, appearance })
  }

  const taskConfig = getTaskConfig(task)
  const posts = await fetchTaskPosts(task, 30)
  const normalizedCategory = category ? normalizeCategory(category) : 'all'
  const intro = taskIntroCopy[task]
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, '')
  const schemaItems = posts.slice(0, 10).map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${baseUrl}${taskConfig?.route || '/posts'}/${post.slug}`,
    name: post.title,
  }))
  const { recipe } = getFactoryState()
  const layoutKey = recipe.taskLayouts[task as keyof typeof recipe.taskLayouts] || `${task}-${task === 'listing' ? 'directory' : 'editorial'}`
  const isMarketing = appearance === 'marketing' && (task === 'profile' || task === 'sbm')
  const shellClass = isMarketing
    ? 'min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)] text-neutral-950'
    : variantShells[layoutKey as keyof typeof variantShells] || 'bg-background'
  const Icon = taskIcons[task] || LayoutGrid

  const isDark = !isMarketing && ['image-masonry', 'image-portfolio', 'profile-creator'].includes(layoutKey)
  const ui = isMarketing
    ? marketingUi
    : isDark
      ? {
          muted: 'text-slate-300',
          panel: 'border border-white/10 bg-white/6',
          soft: 'border border-white/10 bg-white/5',
          input: 'border-white/10 bg-white/6 text-white',
          button: 'bg-white text-slate-950 hover:bg-slate-200',
        }
      : layoutKey.startsWith('article') || layoutKey.startsWith('sbm')
        ? {
            muted: 'text-[#72594a]',
            panel: 'border border-[#dbc6b6] bg-white/90',
            soft: 'border border-[#dbc6b6] bg-[#fff8ef]',
            input: 'border border-[#dbc6b6] bg-white text-[#2f1d16]',
            button: 'bg-[#2f1d16] text-[#fff4e4] hover:bg-[#452920]',
          }
        : {
            muted: 'text-slate-600',
            panel: 'border border-slate-200 bg-white',
            soft: 'border border-slate-200 bg-slate-50',
            input: 'border border-slate-200 bg-white text-slate-950',
            button: 'bg-slate-950 text-white hover:bg-slate-800',
          }

  return (
    <div className={`min-h-screen ${shellClass}`}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {task === 'listing' ? (
          <SchemaJsonLd
            data={[
              {
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Business Directory Listings',
                itemListElement: schemaItems,
              },
              {
                '@context': 'https://schema.org',
                '@type': 'LocalBusiness',
                name: SITE_CONFIG.name,
                url: `${baseUrl}/listings`,
                areaServed: 'Worldwide',
              },
            ]}
          />
        ) : null}
        {task === 'article' || task === 'classified' ? (
          <SchemaJsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: `${taskConfig?.label || task} | ${SITE_CONFIG.name}`,
              url: `${baseUrl}${taskConfig?.route || ''}`,
              hasPart: schemaItems,
            }}
          />
        ) : null}

        {layoutKey === 'listing-directory' || layoutKey === 'listing-showcase' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className={`rounded-[2rem] p-7 shadow-[0_24px_70px_rgba(15,23,42,0.07)] ${ui.panel}`}>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] opacity-70"><Icon className="h-4 w-4" /> {taskConfig?.label || task}</div>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-foreground">{taskConfig?.description || 'Latest posts'}</h1>
              <p className={`mt-4 max-w-2xl text-sm leading-7 ${ui.muted}`}>Built with a cleaner scan rhythm, stronger metadata grouping, and a structure designed for business discovery rather than editorial reading.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={taskConfig?.route || '#'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${ui.button}`}>Explore results <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/search" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${ui.soft}`}>Open search</Link>
              </div>
            </div>
            <form className={`grid gap-3 rounded-[2rem] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${ui.soft}`} action={taskConfig?.route || '#'}>
              <div>
                <label className={`text-xs uppercase tracking-[0.2em] ${ui.muted}`}>Category</label>
                <select name="category" defaultValue={normalizedCategory} className={`mt-2 h-11 w-full rounded-xl px-3 text-sm ${ui.input}`}>
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className={`h-11 rounded-xl text-sm font-medium ${ui.button}`}>Apply filters</button>
            </form>
          </section>
        ) : null}

        {layoutKey === 'article-editorial' || layoutKey === 'article-journal' ? (
          <section className="mb-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
              <h1 className="mt-3 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-foreground">{taskConfig?.description || 'Latest posts'}</h1>
              <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>This reading surface uses slower pacing, stronger typographic hierarchy, and more breathing room so long-form content feels intentional rather than squeezed into a generic feed.</p>
            </div>
            <div className={`rounded-[2rem] p-6 ${ui.panel}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${ui.muted}`}>Reading note</p>
              <p className={`mt-4 text-sm leading-7 ${ui.muted}`}>Use category filters to jump between topics without collapsing the page into the same repeated card rhythm used by other task types.</p>
              <form className="mt-5 flex items-center gap-3" action={taskConfig?.route || '#'}>
                <select name="category" defaultValue={normalizedCategory} className={`h-11 flex-1 rounded-xl px-3 text-sm ${ui.input}`}>
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>
                <button type="submit" className={`h-11 rounded-xl px-4 text-sm font-medium ${ui.button}`}>Apply</button>
              </form>
            </div>
          </section>
        ) : null}

        {layoutKey === 'image-masonry' || layoutKey === 'image-portfolio' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${ui.soft}`}>
                <Icon className="h-3.5 w-3.5" /> Visual feed
              </div>
              <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em]">{taskConfig?.description || 'Latest posts'}</h1>
              <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>This surface leans into stronger imagery, larger modules, and more expressive spacing so visual content feels materially different from reading and directory pages.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className={`min-h-[220px] rounded-[2rem] ${ui.panel}`} />
              <div className={`min-h-[220px] rounded-[2rem] ${ui.soft}`} />
              <div className={`col-span-2 min-h-[120px] rounded-[2rem] ${ui.panel}`} />
            </div>
          </section>
        ) : null}

        {!isMarketing && (layoutKey === 'profile-creator' || layoutKey === 'profile-business') ? (
          <section className={`mb-12 rounded-[2.2rem] p-8 shadow-[0_24px_70px_rgba(15,23,42,0.1)] ${ui.panel}`}>
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className={`min-h-[240px] rounded-[2rem] ${ui.soft}`} />
              <div>
                <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">Profiles with stronger identity, trust, and reputation cues.</h1>
                <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>This layout prioritizes the person or business surface first, then lets the feed continue below without borrowing the same visual logic used by articles or listings.</p>
              </div>
            </div>
          </section>
        ) : null}

        {isMarketing && task === 'profile' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-stretch">
            <div className={`p-8 lg:p-10 ${ui.panel}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${ui.muted}`}>Profiles</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-5xl">A calmer surface for who you are and what you curate.</h1>
              <p className={`mt-5 max-w-xl text-sm leading-relaxed sm:text-base ${ui.muted}`}>
                Bios, highlights, and links to your collections live together so visitors understand your work in one scroll—no noisy sidebars or mystery buttons.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register" className={ui.button}>
                  Build your profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/sbm" className={ui.soft}>
                  Browse collections
                </Link>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ['Trust-forward layout', 'Space for roles, proof points, and a short story.'],
                  ['Link-out friendly', 'Send people to boards or external work without losing context.'],
                  ['Readable in seconds', 'Large type, soft dividers, and plenty of air.'],
                ].map(([t, b]) => (
                  <div key={t} className="rounded-[1.25rem] border border-amber-100 bg-[#fffbeb] px-4 py-4">
                    <p className="text-sm font-semibold text-neutral-900">{t}</p>
                    <p className="mt-2 text-xs leading-relaxed text-neutral-600">{b}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-[1.5rem] border border-violet-100 bg-[#ede9fe] p-6">
                <ShieldCheck className="h-6 w-6 text-violet-800" />
                <p className="mt-4 text-sm font-semibold text-violet-950">Optional verification</p>
                <p className="mt-2 text-sm leading-relaxed text-violet-900/85">Show collaborators and followers that this profile is intentional—not a throwaway handle.</p>
              </div>
              <div className="rounded-[1.5rem] border border-rose-100 bg-[#fff1f2] p-6">
                <Sparkles className="h-6 w-6 text-rose-600" />
                <p className="mt-4 text-sm font-semibold text-rose-950">Discovery tiles</p>
                <p className="mt-2 text-sm leading-relaxed text-rose-900/85">Rotating highlights keep the top of the page fresh while the directory grid stays steady below.</p>
              </div>
              <form className={`rounded-[1.5rem] p-6 ${ui.panel}`} action={taskConfig?.route || '#'}>
                <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${ui.muted}`}>Narrow the grid</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <select name="category" defaultValue={normalizedCategory} className={`h-11 w-full flex-1 px-3 ${ui.input}`}>
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className={`h-11 shrink-0 rounded-full px-6 text-sm font-semibold ${ui.button}`}>
                    Apply
                  </button>
                </div>
              </form>
            </div>
          </section>
        ) : null}

        {layoutKey === 'classified-bulletin' || layoutKey === 'classified-market' ? (
          <section className="mb-12 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className={`rounded-[1.8rem] p-6 ${ui.panel}`}>
              <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">Fast-moving notices, offers, and responses in a compact board format.</h1>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {['Quick to scan', 'Shorter response path', 'Clearer urgency cues'].map((item) => (
                <div key={item} className={`rounded-[1.5rem] p-5 ${ui.soft}`}>
                  <p className="text-sm font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {!isMarketing && (layoutKey === 'sbm-curation' || layoutKey === 'sbm-library') ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">Curated resources arranged more like collections than a generic post feed.</h1>
              <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>Bookmarks, saved resources, and reference-style items need calmer grouping and lighter metadata. This variant gives them that separation.</p>
            </div>
            <div className={`rounded-[2rem] p-6 ${ui.panel}`}>
              <p className={`text-xs uppercase tracking-[0.24em] ${ui.muted}`}>Collection filter</p>
              <form className="mt-4 flex items-center gap-3" action={taskConfig?.route || '#'}>
                <select name="category" defaultValue={normalizedCategory} className={`h-11 flex-1 rounded-xl px-3 text-sm ${ui.input}`}>
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>
                <button type="submit" className={`h-11 rounded-xl px-4 text-sm font-medium ${ui.button}`}>Apply</button>
              </form>
            </div>
          </section>
        ) : null}

        {isMarketing && task === 'sbm' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <div className={`p-8 lg:p-10 ${ui.panel}`}>
              <p className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] ${ui.muted}`}>
                <Bookmark className="h-4 w-4 text-amber-500" />
                Social bookmarking
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-5xl">Collections that feel like shelves—not endless feeds.</h1>
              <p className={`mt-5 max-w-xl text-sm leading-relaxed sm:text-base ${ui.muted}`}>
                Save links with context, group them by theme, and publish boards your community can follow. Every card keeps the source visible so trust stays intact.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/sbm/submit" className={ui.button}>
                  Save a link
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/sbm/collections/new" className={ui.soft}>
                  Start a collection
                </Link>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.25rem] border border-violet-100 bg-[#ede9fe] p-5">
                  <p className="text-sm font-semibold text-violet-950">Share-ready layouts</p>
                  <p className="mt-2 text-xs leading-relaxed text-violet-900/80">One link to a whole shelf of resources—perfect for newsletters and bios.</p>
                </div>
                <div className="rounded-[1.25rem] border border-rose-100 bg-[#fff1f2] p-5">
                  <p className="text-sm font-semibold text-rose-950">Notes that stick</p>
                  <p className="mt-2 text-xs leading-relaxed text-rose-900/80">Short annotations remind your future self why a link mattered.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-[1.5rem] border border-neutral-200 bg-[#fef9c3] p-6">
                <p className="text-sm font-semibold text-neutral-900">Weekly spotlight</p>
                <p className="mt-2 text-sm text-neutral-700">Editors pick calm, high-signal boards to feature at the top of Explore.</p>
              </div>
              <form className={`flex flex-1 flex-col rounded-[1.5rem] p-6 ${ui.panel}`} action={taskConfig?.route || '#'}>
                <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${ui.muted}`}>Filter collections</p>
                <div className="mt-4 flex flex-1 flex-col gap-3">
                  <select name="category" defaultValue={normalizedCategory} className={`h-11 w-full px-3 ${ui.input}`}>
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className={`mt-auto h-11 rounded-full text-sm font-semibold ${ui.button}`}>
                    Apply filters
                  </button>
                </div>
              </form>
            </div>
          </section>
        ) : null}

        {intro && !isMarketing ? (
          <section className={`mb-12 rounded-[2rem] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8 ${ui.panel}`}>
            <h2 className="text-2xl font-semibold text-foreground">{intro.title}</h2>
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className={`mt-4 text-sm leading-7 ${ui.muted}`}>{paragraph}</p>
            ))}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {intro.links.map((link) => (
                <a key={link.href} href={link.href} className="font-semibold text-foreground hover:underline">{link.label}</a>
              ))}
            </div>
          </section>
        ) : null}

        <TaskListClient task={task} initialPosts={posts} category={normalizedCategory} />
      </main>
      <Footer />
    </div>
  )
}
