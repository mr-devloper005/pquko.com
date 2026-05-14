import Link from 'next/link'
import { Sparkles, Users, Building2, Zap } from 'lucide-react'
import { CONTACT_PAGE_OVERRIDE_ENABLED, ContactPageOverride } from '@/overrides/contact-page'
import { MarketingPublicShell } from '@/components/marketing/marketing-public-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SITE_CONFIG } from '@/lib/site-config'
import { ContactLeadForm } from "@/components/shared/contact-lead-form";

const planOptions = [
  {
    title: 'Personal',
    description: 'For individuals who want to save and organize their bookmarks privately',
    icon: Users
  },
  {
    title: 'Team',
    description: 'For small teams collaborating on shared collections and resources',
    icon: Building2
  },
  {
    title: 'Enterprise',
    description: 'For large organizations with custom requirements and dedicated support',
    icon: Zap
  }
]

export default function ContactPage() {
  if (CONTACT_PAGE_OVERRIDE_ENABLED) {
    return <ContactPageOverride />
  }

  return (
    <MarketingPublicShell
      eyebrow="Pricing"
      title="Find the right plan for your needs"
      description={`Every team and individual has different needs. Let's find the perfect fit for your bookmark curation workflow on ${SITE_CONFIG.name}.`}
      actions={
        <>
          <Button asChild className="rounded-full bg-neutral-950 px-7 text-white hover:bg-neutral-800">
            <Link href="#contact-form">Discuss plans</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-neutral-300 bg-white px-7">
            <Link href="/register">Start free</Link>
          </Button>
        </>
      }
    >
      <section className="mb-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950">Choose your path</h2>
          <p className="mt-4 text-neutral-600">Whether you are an individual creator, a growing team, or an enterprise—we have the right solution for your bookmark curation needs.</p>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {planOptions.map((option) => (
            <div key={option.title} className="rounded-[1.75rem] border border-neutral-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5">
              <div className="inline-flex rounded-full bg-neutral-100 p-3 text-neutral-700">
                <option.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-neutral-950">{option.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{option.description}</p>
              <Button asChild className="mt-6 w-full rounded-full bg-neutral-950 text-white hover:bg-neutral-800">
                <Link href="#contact-form">Discuss this plan</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section id="contact-form" className="scroll-mt-28 rounded-[1.75rem] border border-neutral-200 bg-gradient-to-b from-white to-neutral-50 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <div className="mx-auto max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Plan Discussion
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-neutral-950">Let's find your perfect plan</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Tell us about your needs and we will help you choose the right plan. We respond personally to every inquiry.
          </p>
          <ContactLeadForm />
        </div>
      </section>
    </MarketingPublicShell>
  )
}
