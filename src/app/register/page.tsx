import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Bookmark, Check, Sparkles } from 'lucide-react'
import { RegisterForm } from '@/components/auth/register-form'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { REGISTER_PAGE_OVERRIDE_ENABLED, RegisterPageOverride } from '@/overrides/register-page'
import { Button } from '@/components/ui/button'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/register',
    title: `Create account | ${SITE_CONFIG.name}`,
    description: 'Join to build your profile, save bookmarks, and publish collections.',
    openGraphTitle: `Create account | ${SITE_CONFIG.name}`,
    openGraphDescription: 'Free starter plan—profiles and social bookmarking in one calm workspace.',
  })
}

const benefits = [
  'Public profile with space for your story and links',
  'Private saves plus shareable collections when you are ready',
  'Session kept on this device so you can pick up where you left off',
]

const steps = [
  { title: 'Tell us who you are', body: 'Name and email—we never sell your address.' },
  { title: 'Choose a password', body: 'Six characters minimum; use a manager if you can.' },
  { title: 'Land on the homepage', body: 'Explore bookmarks and profiles right away—no forced tour.' },
]

export default function RegisterPage() {
  if (REGISTER_PAGE_OVERRIDE_ENABLED) {
    return <RegisterPageOverride />
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)] text-neutral-950">
      <NavbarShell />
      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="pointer-events-none absolute left-[8%] top-32 hidden h-24 w-40 rounded-[1.25rem] bg-[#fde68a]/80 lg:block" />
        <div className="pointer-events-none absolute right-[10%] top-48 hidden h-28 w-44 rounded-[1.25rem] bg-[#e9d5ff]/80 lg:block" />

        <section className="relative grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-stretch lg:gap-12">
          <div className="flex flex-col justify-between rounded-[2rem] border border-amber-100 bg-[#fffbeb] p-8 shadow-sm lg:p-10">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-900/80">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                Join {SITE_CONFIG.name}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200 bg-white">
                  <Bookmark className="h-6 w-6 text-amber-700" />
                </div>
                <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-[2.35rem] lg:leading-tight">
                  Create an account built for curation—not noise.
                </h1>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-neutral-700 sm:text-base">
                One workspace for your public identity and the links you actually return to. No listings clutter, no forced feeds—just profiles and social bookmarking done quietly.
              </p>
              <ul className="mt-8 space-y-3">
                {benefits.map((line) => (
                  <li key={line} className="flex gap-3 text-sm text-neutral-800">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 grid gap-3 rounded-[1.5rem] border border-amber-100 bg-white/90 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">What happens next</p>
              <ol className="space-y-4">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-xs font-semibold text-white">{i + 1}</span>
                    <div>
                      <p className="text-sm font-semibold text-neutral-950">{step.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-neutral-600">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="outline" className="rounded-full border-neutral-300 bg-white">
                <Link href="/sbm" className="inline-flex items-center gap-2">
                  Browse first
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="rounded-full text-neutral-700 hover:bg-white/80">
                <Link href="/help">Help center</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Create account</p>
            <p className="mt-2 text-lg font-semibold text-neutral-950">Your details</p>
            <p className="mt-1 text-sm text-neutral-600">Already registered? Switch to sign in—your collections stay tied to this email.</p>
            <RegisterForm />
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-6 text-sm text-neutral-600">
              <span>Have an account?</span>
              <Link href="/login" className="inline-flex items-center gap-2 font-semibold text-neutral-950 hover:underline">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
