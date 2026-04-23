import Link from 'next/link'
import { Bookmark, Check, Clock, HelpCircle, Mail, MapPin, MessageCircle, Sparkles } from 'lucide-react'
import { CONTACT_PAGE_OVERRIDE_ENABLED, ContactPageOverride } from '@/overrides/contact-page'
import { MarketingFeatureCard, MarketingPublicShell, MarketingStatGrid } from '@/components/marketing/marketing-public-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SITE_CONFIG } from '@/lib/site-config'

const plans = [
  {
    name: 'Starter',
    price: '$0',
    cadence: 'forever',
    blurb: 'Personal profile, unlimited private saves, and up to three public collections.',
    perks: ['Community support', 'Standard analytics', 'Weekly digest'],
    highlighted: false,
  },
  {
    name: 'Studio',
    price: '$18',
    cadence: 'per seat / month',
    blurb: 'Verified badge, collaborative boards, and branded collection pages.',
    perks: ['Shared drafts', 'Priority routing', 'Custom domains (beta)'],
    highlighted: true,
  },
  {
    name: 'Program',
    price: 'Let’s talk',
    cadence: 'annual',
    blurb: 'For research orgs and education teams distributing curated shelves at scale.',
    perks: ['Dedicated success partner', 'SLA-backed inbox', 'Private workshops'],
    highlighted: false,
  },
]

const comparison = [
  { feature: 'Public collections', starter: '3', studio: 'Unlimited', program: 'Unlimited + SSO' },
  { feature: 'Verified profile', starter: '—', studio: 'Included', program: 'Custom criteria' },
  { feature: 'Collaborators', starter: '1', studio: '10', program: 'Unlimited' },
  { feature: 'Support SLA', starter: 'Best effort', studio: '48h median', program: '4h business' },
]

const lanes = [
  {
    icon: Bookmark,
    title: 'Collection partnerships',
    body: 'Co-publish resource boards, sponsor quiet spotlights, or syndicate shelves to your members.',
    tone: 'bg-[#fffbeb] border-amber-100' as const,
  },
  {
    icon: Mail,
    title: 'Billing & plans',
    body: 'Questions about seats, invoices, or migrating from spreadsheets—we route you to finance in one thread.',
    tone: 'bg-[#ede9fe] border-violet-100' as const,
  },
  {
    icon: MessageCircle,
    title: 'Curator success',
    body: 'Profile polish, import help, and best practices for keeping notes kind and links trustworthy.',
    tone: 'bg-[#fff1f2] border-rose-100' as const,
  },
]

const faqs = [
  {
    q: 'Do you offer annual billing?',
    a: 'Yes—Studio and Program include annual options with two months free when paid upfront.',
  },
  {
    q: 'Can we import from Notion or spreadsheets?',
    a: 'Studio+ includes guided imports. Send a sample sheet and we will map columns to bookmarks and notes.',
  },
  {
    q: 'Where is data hosted?',
    a: 'Primary regions are US and EU with configurable residency for Program customers.',
  },
]

export default function ContactPage() {
  if (CONTACT_PAGE_OVERRIDE_ENABLED) {
    return <ContactPageOverride />
  }

  return (
    <MarketingPublicShell
      eyebrow="Pricing & contact"
      title="Plans that respect calm curation"
      description={`Whether you are sizing a team rollout or just need a human to answer a billing question, ${SITE_CONFIG.name} keeps the path short. Pick a plan, skim the comparison, then tell us what you are trying to ship.`}
      actions={
        <>
          <Button asChild className="rounded-full bg-neutral-950 px-7 text-white hover:bg-neutral-800">
            <Link href="#message">Send a message</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-neutral-300 bg-white px-7">
            <Link href="/register">Start free</Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-full text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950">
            <Link href="/help">Help center</Link>
          </Button>
        </>
      }
    >
      <section className="mb-14">
        <MarketingStatGrid
          items={[
            { value: '3', label: 'Public plans', hint: 'Mix and match seats later' },
            { value: '48h', label: 'Median reply', hint: 'Studio+ conversations' },
            { value: '99.9%', label: 'Bookmark uptime', hint: 'Measured at the edge' },
            { value: '∞', label: 'Private saves', hint: 'On every tier' },
          ]}
        />
      </section>

      <section className="mb-14 grid gap-6 lg:grid-cols-2">
        <MarketingFeatureCard
          tone="amber"
          title="Need something bespoke?"
          description="Program customers get architecture reviews, migration playbooks, and optional on-site workshops for research-heavy teams."
        >
          <Button asChild variant="outline" className="rounded-full border-amber-200 bg-white">
            <Link href="#message">Describe your rollout</Link>
          </Button>
        </MarketingFeatureCard>
        <MarketingFeatureCard
          tone="violet"
          title="Already on Starter?"
          description="Upgrade anytime—your private saves and collections carry over. We never hold your links hostage."
        >
          <Button asChild variant="outline" className="rounded-full border-violet-200 bg-white">
            <Link href="/login">Log in to upgrade</Link>
          </Button>
        </MarketingFeatureCard>
      </section>

      <section className="mb-6 text-center">
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950">Compare plans</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-neutral-600">Transparent limits, no surprise overages on bookmarks. Seats apply to collaborators on shared boards.</p>
      </section>

      <section className="mb-16 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col overflow-hidden rounded-[1.75rem] border p-8 shadow-sm transition hover:-translate-y-0.5 ${
              plan.highlighted ? 'border-neutral-950 bg-neutral-950 text-white ring-2 ring-neutral-950/10' : 'border-neutral-200 bg-white'
            }`}
          >
            {plan.highlighted ? (
              <span className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                Popular
              </span>
            ) : null}
            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${plan.highlighted ? 'text-white/70' : 'text-neutral-500'}`}>{plan.name}</p>
            <p className="mt-4 text-4xl font-semibold tracking-tight">{plan.price}</p>
            <p className={`text-sm ${plan.highlighted ? 'text-white/70' : 'text-neutral-500'}`}>{plan.cadence}</p>
            <p className={`mt-4 text-sm leading-relaxed ${plan.highlighted ? 'text-white/85' : 'text-neutral-600'}`}>{plan.blurb}</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {plan.perks.map((perk) => (
                <li key={perk} className={`flex items-start gap-2 ${plan.highlighted ? 'text-white/90' : 'text-neutral-700'}`}>
                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlighted ? 'text-emerald-300' : 'text-emerald-600'}`} />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              className={`mt-8 rounded-full ${plan.highlighted ? 'bg-white text-neutral-950 hover:bg-neutral-100' : 'bg-neutral-950 text-white hover:bg-neutral-800'}`}
            >
              <Link href={plan.name === 'Program' ? '#message' : '/register'}>{plan.name === 'Program' ? 'Book a walkthrough' : 'Choose plan'}</Link>
            </Button>
          </div>
        ))}
      </section>

      <section className="mb-16 overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-neutral-50">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-white">
                <th className="px-5 py-4 font-semibold text-neutral-950">Feature</th>
                <th className="px-5 py-4 font-semibold text-neutral-700">Starter</th>
                <th className="px-5 py-4 font-semibold text-neutral-950">Studio</th>
                <th className="px-5 py-4 font-semibold text-neutral-700">Program</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-b border-neutral-100 last:border-0">
                  <td className="px-5 py-3.5 font-medium text-neutral-900">{row.feature}</td>
                  <td className="px-5 py-3.5 text-neutral-600">{row.starter}</td>
                  <td className="px-5 py-3.5 bg-[#fffbeb] font-medium text-neutral-900">{row.studio}</td>
                  <td className="px-5 py-3.5 text-neutral-600">{row.program}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-16 grid gap-4 rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-sm sm:grid-cols-3 sm:p-8">
        <div className="flex gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-4">
          <Clock className="h-5 w-5 shrink-0 text-neutral-600" />
          <div>
            <p className="text-sm font-semibold text-neutral-950">Office hours</p>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">Tue & Thu, 9a–1p PT for live chat on Studio+.</p>
          </div>
        </div>
        <div className="flex gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-4">
          <MapPin className="h-5 w-5 shrink-0 text-neutral-600" />
          <div>
            <p className="text-sm font-semibold text-neutral-950">HQ & mail</p>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">Remote-first team · PO boxes in Portland & Berlin.</p>
          </div>
        </div>
        <div className="flex gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-4">
          <HelpCircle className="h-5 w-5 shrink-0 text-neutral-600" />
          <div>
            <p className="text-sm font-semibold text-neutral-950">Self-serve</p>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">
              <Link href="/help" className="font-semibold text-neutral-900 underline-offset-2 hover:underline">
                Help center
              </Link>{' '}
              for imports, privacy, and billing FAQs.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16 grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-neutral-950">How we route your note</h2>
          <p className="mt-2 text-sm text-neutral-600">Pick the lane that matches your ask—we read every message and reply with next steps, not auto-responders.</p>
          <div className="mt-8 space-y-4">
            {lanes.map((lane) => (
              <div key={lane.title} className={`rounded-[1.5rem] border p-6 shadow-sm ${lane.tone}`}>
                <lane.icon className="h-5 w-5 text-neutral-800" />
                <h3 className="mt-3 text-lg font-semibold text-neutral-950">{lane.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">{lane.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full border-neutral-300 bg-white">
              <Link href="/press">Press kit</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-neutral-300 bg-white">
              <Link href="/team">Meet the team</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-neutral-300 bg-white">
              <Link href="/careers">Careers</Link>
            </Button>
          </div>
        </div>

        <div id="message" className="scroll-mt-28 rounded-[1.75rem] border border-neutral-200 bg-gradient-to-b from-white to-neutral-50 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Inbox
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-neutral-950">Send a message</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Share context—links, timelines, team size—and we will respond with the right next step. No ticket soup: one thread, one owner.
          </p>
          <form className="mt-8 grid gap-5">
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contact-name" className="text-sm font-medium text-neutral-800">
                  Name
                </Label>
                <Input id="contact-name" name="name" autoComplete="name" placeholder="Alex Rivera" className="h-12 rounded-2xl border-neutral-200" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-email" className="text-sm font-medium text-neutral-800">
                  Work email
                </Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="h-12 rounded-2xl border-neutral-200"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-topic" className="text-sm font-medium text-neutral-800">
                Topic
              </Label>
              <Input id="contact-topic" name="topic" placeholder="Billing, partnership, migration, press…" className="h-12 rounded-2xl border-neutral-200" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-body" className="text-sm font-medium text-neutral-800">
                Details
              </Label>
              <Textarea
                id="contact-body"
                name="message"
                placeholder="What are you trying to launch or fix? Include links to collections or profiles if relevant."
                className="min-h-[168px] rounded-2xl border-neutral-200 text-sm leading-relaxed"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-neutral-500">By sending, you agree we may store this message to respond. See our privacy policy for retention.</p>
              <Button type="button" className="h-12 shrink-0 rounded-full bg-neutral-950 px-8 text-white hover:bg-neutral-800">
                Send message
              </Button>
            </div>
          </form>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-neutral-200 bg-white p-8 shadow-sm">
        <h2 className="text-center text-2xl font-semibold tracking-[-0.02em] text-neutral-950">Quick answers</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-neutral-600">Still deciding? These cover the questions we see before someone hits send.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {faqs.map((item) => (
            <div key={item.q} className="rounded-[1.25rem] border border-neutral-100 bg-neutral-50/90 p-5">
              <p className="text-sm font-semibold text-neutral-950">{item.q}</p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingPublicShell>
  )
}
