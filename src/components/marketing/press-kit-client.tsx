'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import type { PressAsset, PressCoverage } from '@/types'

export function PressKitClient({ assets, coverage }: { assets: PressAsset[]; coverage: PressCoverage[] }) {
  const { toast } = useToast()
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null)
  const activeAsset = assets.find((asset) => asset.id === activeAssetId)

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-neutral-950">Press kit</h2>
          <p className="mt-2 text-sm text-neutral-600">Logos, UI captures, and narrative snippets for profiles & bookmarking coverage.</p>
          <div className="mt-6 grid gap-3">
            {assets.map((asset) => (
              <div key={asset.id} className="rounded-[1.25rem] border border-neutral-100 bg-neutral-50 px-4 py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{asset.title}</p>
                    <p className="text-xs text-neutral-500">{asset.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="rounded-full">
                      {asset.fileType}
                    </Badge>
                    <Button size="sm" variant="outline" className="rounded-full border-neutral-300" onClick={() => setActiveAssetId(asset.id)}>
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="rounded-full bg-neutral-950 text-white hover:bg-neutral-800"
                      onClick={() =>
                        toast({
                          title: 'Download started',
                          description: `${asset.title} is downloading.`,
                        })
                      }
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {coverage.map((item) => (
            <div key={item.id} className="rounded-[1.5rem] border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">{item.outlet}</div>
              <p className="mt-2 text-sm font-medium text-neutral-900">{item.headline}</p>
              <p className="mt-2 text-xs text-neutral-500">{item.date}</p>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={Boolean(activeAsset)} onOpenChange={() => setActiveAssetId(null)}>
        <DialogContent className="max-w-3xl border-neutral-200">
          <DialogHeader>
            <DialogTitle>{activeAsset?.title}</DialogTitle>
          </DialogHeader>
          {activeAsset?.previewUrl ? (
            <div className="relative aspect-video overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
              <Image src={activeAsset.previewUrl} alt={activeAsset.title} fill className="object-cover" />
            </div>
          ) : null}
          <p className="text-sm text-neutral-600">{activeAsset?.description}</p>
          <DialogFooter>
            <Button variant="outline" className="rounded-full border-neutral-300" onClick={() => setActiveAssetId(null)}>
              Close
            </Button>
            <Button
              className="rounded-full bg-neutral-950 text-white hover:bg-neutral-800"
              onClick={() =>
                toast({
                  title: 'Download started',
                  description: `${activeAsset?.title} is downloading.`,
                })
              }
            >
              Download {activeAsset?.fileType}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
