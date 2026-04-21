import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  HelpCircle,
  LifeBuoy,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { mockFaqs } from '@/data/mock-data'
import type { FAQItem } from '@/types'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { MarketingFeatureCard, MarketingPublicShell, MarketingStatGrid } from '@/components/marketing/marketing-public-shell'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/help',
    title: `Help Center | ${SITE_CONFIG.name}`,
    description: 'Guides for profiles, bookmarks, collections, and account basics.',
    openGraphTitle: `Help Center | ${SITE_CONFIG.name}`,
    openGraphDescription: 'Answers and shortcuts for curators and profile owners.',
  })
}

const guides = [
  {
    icon: Bookmark,
    title: 'Bookmarks & collections',
    description: 'Save links with notes, group them on boards, and choose what stays private.',
    href: '/sbm',
    cta: 'Open bookmarks',
    tone: 'bg-[#fffbeb] border-amber-100' as const,
  },
  {
    icon: UserRound,
    title: 'Public profiles',
    description: 'Bio, highlights, and links to your shelves—so visitors understand you quickly.',
    href: '/profile',
    cta: 'Browse profiles',
    tone: 'bg-[#ede9fe] border-violet-100' as const,
  },
  {
    icon: ShieldCheck,
    title: 'Trust & verification',
    description: 'What verified means, how reviews work, and how to appeal a decision.',
    href: '/about',
    cta: 'Read our approach',
    tone: 'bg-[#fff1f2] border-rose-100' as const,
  },
  {
    icon: Search,
    title: 'Search & discovery',
    description: 'Find people and collections faster with filters and plain-language queries.',
    href: '/search',
    cta: 'Try search',
    tone: 'bg-neutral-50 border-neutral-200' as const,
  },
]

const playbooks = [
  {
    title: 'First week checklist',
    points: ['Complete your profile headline', 'Save 5 links with short notes', 'Publish one public collection'],
  },
  {
    title: 'For teams',
    points: ['Use shared collections for research', 'Pin a canonical “start here” board', 'Review privacy before going public'],
  },
]

const extraFaqs: FAQItem[] = [
  {
    id: 'help-export',
    question: 'Can I export my bookmarks?',
    answer: 'Yes. From Saved items or each collection, use export options where available to download a portable list. Program customers can request bulk exports from support.',
  },
  {
    id: 'help-profile-url',
    question: 'How do I share my profile?',
    answer: 'Open your profile, copy the public URL from the address bar, and paste it into bios, newsletters, or decks. Collections on your profile update automatically when you publish changes.',
  },
  {
    id: 'help-duplicate',
    question: 'Why was my link flagged as duplicate?',
    answer: 'We merge obvious duplicates inside the same collection to reduce noise. Add a different note or choose another shelf if you need both references visible.',
  },
]

const helpFaqs: FAQItem[] = [...mockFaqs, ...extraFaqs]

export default function HelpPage() {
  return (
    <MarketingPublicShell
      eyebrow="Support"
      title="Help Center"
      description={`Guides, shortcuts, and honest answers for ${SITE_CONFIG.name}—profiles, social bookmarking, and the calm spaces around them.`}
      actions={
        <>
          <Button asChild className="rounded-full bg-neutral-950 px-7 text-white hover:bg-neutral-800">
            <Link href="/contact">Contact support</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-neutral-300 bg-white px-7">
            <Link href="/search">Search the site</Link>
          </Button>
        </>
      }
    >
      <section className="mb-14">
        <MarketingStatGrid
          items={[
            { value: '< 5 min', label: 'Typical self-serve fix', hint: 'For account & saves' },
            { value: '48h', label: 'Email turnaround', hint: 'Studio+ median' },
            { value: '24/7', label: 'Status page', hint: 'Incidents & maintenance' },
            { value: '100%', label: 'Human escalation', hint: 'No chatbot wall on billing' },
          ]}
        />
      </section>

      <section className="mb-14 grid gap-6 lg:grid-cols-2">
        <MarketingFeatureCard
          tone="amber"
          title="New here?"
          description="Start with a profile line and one public collection. You can keep everything private until you are ready."
        >
          <Button asChild variant="outline" className="rounded-full border-amber-200 bg-white">
            <Link href="/register">Create an account</Link>
          </Button>
        </MarketingFeatureCard>
        <MarketingFeatureCard
          tone="violet"
          title="Stuck on something specific?"
          description="Send screenshots, links, and what you expected to happen—we reproduce issues before we reply."
        >
          <Button asChild variant="outline" className="rounded-full border-violet-200 bg-white">
            <Link href="/contact#message">Open a ticket</Link>
          </Button>
        </MarketingFeatureCard>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold tracking-[-0.02em] text-neutral-950">Guides by topic</h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">Jump to the surface you need—each card links to the live area of the product.</p>
      </section>

      <section className="mb-16 grid gap-5 sm:grid-cols-2">
        {guides.map((guide) => (
          <div key={guide.title} className={`flex flex-col rounded-[1.5rem] border p-6 shadow-sm transition hover:-translate-y-0.5 ${guide.tone}`}>
            <guide.icon className="h-6 w-6 text-neutral-800" />
            <h3 className="mt-4 text-lg font-semibold text-neutral-950">{guide.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-700">{guide.description}</p>
            <Button asChild variant="outline" className="mt-6 w-fit rounded-full border-neutral-300 bg-white">
              <Link href={guide.href} className="inline-flex items-center gap-2">
                {guide.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ))}
      </section>

      <section className="mb-16 grid gap-8 lg:grid-cols-[1fr_1fr]">
        {playbooks.map((block) => (
          <div key={block.title} className="rounded-[1.5rem] border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              <BookOpen className="h-4 w-4" />
              Playbook
            </div>
            <h3 className="mt-3 text-xl font-semibold text-neutral-950">{block.title}</h3>
            <ul className="mt-4 space-y-3 text-sm text-neutral-700">
              {block.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mb-16 grid gap-6 rounded-[1.75rem] border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-6 sm:grid-cols-3 sm:p-8">
        <div className="flex gap-3">
          <LifeBuoy className="h-5 w-5 shrink-0 text-neutral-600" />
          <div>
            <p className="text-sm font-semibold text-neutral-950">Product answers</p>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">How saves, visibility, and imports behave day to day.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <MessageCircle className="h-5 w-5 shrink-0 text-neutral-600" />
          <div>
            <p className="text-sm font-semibold text-neutral-950">Account & billing</p>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">Seats, invoices, and plan changes route to the same humans as sales.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <HelpCircle className="h-5 w-5 shrink-0 text-neutral-600" />
          <div>
            <p className="text-sm font-semibold text-neutral-950">Trust & safety</p>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">Spam, impersonation, and sensitive collections—see our policies in About.</p>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-neutral-100 pb-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-neutral-950">Frequently asked questions</h2>
            <p className="mt-2 text-sm text-neutral-600">Straight answers—expand a row for the full detail.</p>
          </div>
          <Button asChild variant="ghost" className="w-fit rounded-full text-neutral-700 hover:bg-neutral-100">
            <Link href="/blog">Read field notes</Link>
          </Button>
        </div>
        <Accordion type="single" collapsible className="mt-6 w-full">
          {helpFaqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="border-neutral-200">
              <AccordionTrigger className="text-left text-base font-medium text-neutral-950 hover:no-underline">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-neutral-600">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mt-14 flex flex-col items-center justify-between gap-6 rounded-[1.5rem] border border-neutral-200 bg-[#fffbeb] px-6 py-10 text-center sm:flex-row sm:text-left">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-900/80">Still stuck?</p>
          <p className="mt-2 text-lg font-semibold text-neutral-950">We reply faster when you include links and expected behavior.</p>
          <p className="mt-2 max-w-xl text-sm text-neutral-700">Tell us your workspace, browser, and whether the issue is on a public collection or a private save.</p>
        </div>
        <Button asChild className="shrink-0 rounded-full bg-neutral-950 px-8 text-white hover:bg-neutral-800">
          <Link href="/contact#message">Email the team</Link>
        </Button>
      </section>
    </MarketingPublicShell>
  )
}
