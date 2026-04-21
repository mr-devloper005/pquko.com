import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { mockTeamMembers } from '@/data/mock-data'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { MarketingFeatureCard, MarketingPublicShell, MarketingStatGrid } from '@/components/marketing/marketing-public-shell'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/team',
    title: `Team | ${SITE_CONFIG.name}`,
    description: 'Meet the people designing calmer profiles and bookmark collections.',
    openGraphTitle: `Team | ${SITE_CONFIG.name}`,
    openGraphDescription: 'Operators, designers, and community builders behind the product.',
  })
}

const departments = [
  { title: 'Product & design', body: 'Owns the pace of releases, research cadence, and the pastel-heavy visual language you see across marketing pages.' },
  { title: 'Community', body: 'Runs curator office hours, onboarding experiments, and the guidelines that keep public boards trustworthy.' },
  { title: 'Infrastructure', body: 'Keeps saves fast, backups boring, and observability quiet so creators never think about servers.' },
]

export default function TeamPage() {
  return (
    <MarketingPublicShell
      eyebrow="Company"
      title="Team"
      description="We are a small group obsessed with thoughtful defaults: generous spacing, honest metadata, and flows that respect both readers and curators."
      actions={
        <>
          <Button asChild className="rounded-full bg-neutral-950 px-6 text-white hover:bg-neutral-800">
            <Link href="/careers">View open roles</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-neutral-300 bg-white px-6">
            <Link href="/contact">Partner with us</Link>
          </Button>
        </>
      }
    >
      <section className="mb-16">
        <MarketingStatGrid
          items={[
            { value: '28', label: 'Full-time folks', hint: 'Across 6 time zones' },
            { value: '11', label: 'Disciplines', hint: 'Design, eng, data, community' },
            { value: '62%', label: 'Remote-first', hint: 'Quarterly in-person weeks' },
            { value: '100%', label: 'Dog-friendly offsites', hint: 'When we do meet IRL' },
          ]}
        />
      </section>

      <section className="mb-16 grid gap-6 lg:grid-cols-3">
        {departments.map((dept) => (
          <MarketingFeatureCard key={dept.title} tone={dept.title.includes('Community') ? 'violet' : dept.title.includes('Infra') ? 'amber' : 'rose'} title={dept.title} description={dept.body} />
        ))}
      </section>

      <section>
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950">Faces you will see in demos</h2>
        <p className="mt-2 max-w-2xl text-neutral-600">Everyone listed below answers support rotations—no bait-and-switch with anonymous bots.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockTeamMembers.map((member) => (
            <div key={member.id} className="rounded-[1.5rem] border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border border-neutral-100">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold text-neutral-950">{member.name}</p>
                  <p className="text-sm text-neutral-500">{member.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600">{member.bio}</p>
              <p className="mt-3 text-xs text-neutral-400">{member.location}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingPublicShell>
  )
}
