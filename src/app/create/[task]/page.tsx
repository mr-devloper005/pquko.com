"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bookmark, Check, Plus, Save, Sparkles, UserRound } from "lucide-react";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { CATEGORY_OPTIONS } from "@/lib/categories";
import { SITE_CONFIG, type TaskKey } from "@/lib/site-config";
import { addLocalPost } from "@/lib/local-posts";
import { cn } from "@/lib/utils";

type Field = {
  key: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "url"
    | "number"
    | "tags"
    | "images"
    | "highlights"
    | "category"
    | "file";
  placeholder?: string;
  required?: boolean;
};

const FORM_CONFIG: Record<TaskKey, { title: string; description: string; fields: Field[] }> = {
  listing: {
    title: "Create Business Listing",
    description: "Add a local-only listing with business details.",
    fields: [
      { key: "title", label: "Listing title", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Full description", type: "textarea", required: true },
      { key: "category", label: "Category", type: "category", required: true },
      { key: "location", label: "Location", type: "text" },
      { key: "address", label: "Address", type: "text" },
      { key: "website", label: "Website URL", type: "url" },
      { key: "email", label: "Business email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "logo", label: "Logo URL", type: "url" },
      { key: "images", label: "Gallery images", type: "images" },
      { key: "highlights", label: "Highlights", type: "highlights" },
    ],
  },
  classified: {
    title: "Create Classified",
    description: "Add a local-only classified ad.",
    fields: [
      { key: "title", label: "Ad title", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Ad details", type: "textarea", required: true },
      { key: "category", label: "Category", type: "category", required: true },
      { key: "location", label: "Location", type: "text" },
      { key: "address", label: "Address", type: "text" },
      { key: "website", label: "Website URL", type: "url" },
      { key: "email", label: "Business email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "images", label: "Images", type: "images" },
      { key: "highlights", label: "Highlights", type: "highlights" },
    ],
  },
  article: {
    title: "Create Article",
    description: "Write a local-only article post.",
    fields: [
      { key: "title", label: "Article title", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Article content (HTML allowed)", type: "textarea", required: true },
      { key: "category", label: "Category", type: "category", required: true },
      { key: "images", label: "Cover images", type: "images" },
      { key: "tags", label: "Tags", type: "tags" },
    ],
  },
  image: {
    title: "Create Image Share",
    description: "Share image-only content locally.",
    fields: [
      { key: "title", label: "Image title", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Caption", type: "textarea" },
      { key: "category", label: "Category", type: "category" },
      { key: "images", label: "Images", type: "images", required: true },
      { key: "tags", label: "Tags", type: "tags" },
    ],
  },
  profile: {
    title: "Create a profile",
    description: "Shape how you appear in the directory—headline, bio, and a primary link visitors can trust.",
    fields: [
      { key: "brandName", label: "Display name", type: "text", required: true },
      { key: "summary", label: "One-line headline", type: "textarea", required: true },
      { key: "description", label: "Bio & what you curate", type: "textarea" },
      { key: "website", label: "Primary link (site, portfolio, or social)", type: "url", required: true },
      { key: "logo", label: "Avatar or logo image URL", type: "url", required: true },
      { key: "category", label: "Focus area", type: "category" },
    ],
  },
  social: {
    title: "Create Social Post",
    description: "Publish a local-only social update.",
    fields: [
      { key: "title", label: "Post title", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Post content", type: "textarea", required: true },
      { key: "category", label: "Category", type: "category" },
      { key: "images", label: "Images", type: "images" },
      { key: "tags", label: "Tags", type: "tags" },
    ],
  },
  sbm: {
    title: "Save a bookmark",
    description: "Capture a URL with a short takeaway and optional notes—perfect for shelves people return to.",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "website", label: "URL to save", type: "url", required: true },
      { key: "summary", label: "One-line takeaway", type: "textarea", required: true },
      { key: "description", label: "Notes (why it matters, who it is for)", type: "textarea" },
      { key: "category", label: "Shelf / topic", type: "category" },
      { key: "tags", label: "Tags (comma-separated)", type: "tags" },
    ],
  },
  pdf: {
    title: "Create PDF Entry",
    description: "Add a local-only PDF resource.",
    fields: [
      { key: "title", label: "PDF title", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "fileUrl", label: "PDF file URL", type: "file", required: true },
      { key: "category", label: "Category", type: "category", required: true },
      { key: "images", label: "Cover image", type: "images" },
    ],
  },
  org: {
    title: "Create Organization",
    description: "Create a local-only organization profile.",
    fields: [
      { key: "brandName", label: "Organization name", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "About the organization", type: "textarea" },
      { key: "website", label: "Website URL", type: "url" },
      { key: "logo", label: "Logo URL", type: "url" },
    ],
  },
  comment: {
    title: "Create Blog Comment",
    description: "Store a local-only blog comment entry.",
    fields: [
      { key: "title", label: "Comment title", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Comment body", type: "textarea", required: true },
      { key: "website", label: "Target post URL", type: "url", required: true },
      { key: "category", label: "Category", type: "category" },
    ],
  },
};

export default function CreateTaskPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const taskKey = params?.task as TaskKey;

  const taskConfig = useMemo(
    () => SITE_CONFIG.tasks.find((task) => task.key === taskKey && task.enabled),
    [taskKey]
  );
  const formConfig = FORM_CONFIG[taskKey];

  const [values, setValues] = useState<Record<string, string>>({});
  const [uploadingPdf, setUploadingPdf] = useState(false);

  if (!taskConfig || !formConfig) {
    return (
      <div className="min-h-screen bg-background">
        <NavbarShell />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Task not available</h1>
          <p className="mt-2 text-muted-foreground">
            This task is not enabled for the current site.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/">Back home</Link>
          </Button>
        </main>
      </div>
    );
  }

  const updateValue = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in before creating content.",
      });
      router.push("/login");
      return;
    }

    const missing = formConfig.fields.filter((field) => field.required && !values[field.key]);
    if (missing.length) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields before saving.",
      });
      return;
    }

    const title = values.title || values.brandName || "Untitled";
    const summary = values.summary || "";
    const contentType = taskConfig.contentType || taskKey;

    const content: Record<string, unknown> = {
      type: contentType,
    };

    if (values.category) content.category = values.category;
    if (values.description) content.description = values.description;
    if (values.website) content.website = values.website;
    if (values.email) content.email = values.email;
    if (values.phone) content.phone = values.phone;
    if (values.address) content.address = values.address;
    if (values.location) content.location = values.location;
    if (values.logo) content.logo = values.logo;
    if (values.fileUrl) content.fileUrl = values.fileUrl;
    if (values.brandName) content.brandName = values.brandName;

    const highlights = values.highlights
      ? values.highlights.split(",").map((item) => item.trim()).filter(Boolean)
      : [];
    if (highlights.length) content.highlights = highlights;

    const tags = values.tags
      ? values.tags.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    const images = values.images
      ? values.images.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    const post = addLocalPost({
      task: taskKey,
      title,
      summary,
      authorName: user.name,
      tags,
      content,
      media: images.map((url) => ({ url, type: "IMAGE" })),
      publishedAt: new Date().toISOString(),
    });

    toast({
      title: "Saved locally",
      description: "This post is stored only in your browser.",
    });

    router.push(`/local/${taskKey}/${post.slug}`);
  };

  const isEnhancedLayout = taskKey === "profile" || taskKey === "sbm";

  const inputClass = cn(
    "h-11 bg-white transition-shadow focus-visible:outline-none focus-visible:ring-2",
    isEnhancedLayout
      ? "rounded-2xl border border-neutral-200 px-4 text-neutral-950 focus-visible:ring-neutral-950/15"
      : "rounded-lg border-2 border-slate-200 px-3 focus-visible:ring-primary/30",
  );

  const textareaClass = cn(
    "bg-white transition-shadow focus-visible:outline-none focus-visible:ring-2",
    isEnhancedLayout
      ? "rounded-2xl border border-neutral-200 text-neutral-950 focus-visible:ring-neutral-950/15"
      : "rounded-lg border-2 border-slate-200 focus-visible:ring-primary/30",
  );

  const selectClass = cn(
    "h-11 bg-white text-sm focus-visible:outline-none focus-visible:ring-2",
    isEnhancedLayout
      ? "rounded-2xl border border-neutral-200 px-4 text-neutral-950 focus-visible:ring-neutral-950/15"
      : "rounded-lg border-2 border-slate-200 px-3 focus-visible:ring-primary/30",
  );

  const formCardClass = cn(
    "p-8 shadow-sm",
    isEnhancedLayout
      ? "rounded-[1.75rem] border border-neutral-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.06)]"
      : "rounded-3xl border border-border bg-card",
  );

  const profileTips = [
    "Lead with a clear headline—visitors decide in one line.",
    "Use a real avatar or logo URL so cards feel trustworthy.",
    "Pick a focus area so you surface next to similar curators.",
  ];

  const sbmTips = [
    "Paste the canonical URL (strip tracking params when you can).",
    "The takeaway line shows in lists; notes stay for people who open the card.",
    "Tags help search—use short, repeatable words.",
  ];

  const formBody = (
    <div className={formCardClass}>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className={isEnhancedLayout ? "rounded-full border-neutral-200 bg-neutral-100 text-neutral-800" : ""}>
          {taskConfig.label}
        </Badge>
        <Badge variant="outline" className={isEnhancedLayout ? "rounded-full border-neutral-200 text-neutral-600" : ""}>
          Local-only
        </Badge>
      </div>

      <div className="mt-6 grid gap-6">
        {formConfig.fields.map((field) => (
          <div key={field.key} className="grid gap-2">
            <Label className={isEnhancedLayout ? "text-sm font-medium text-neutral-800" : ""}>
              {field.label} {field.required ? <span className="text-red-500">*</span> : null}
            </Label>
            {field.type === "textarea" ? (
              <Textarea
                rows={field.key === "description" ? 5 : 4}
                placeholder={field.placeholder}
                value={values[field.key] || ""}
                onChange={(event) => updateValue(field.key, event.target.value)}
                className={textareaClass}
              />
            ) : field.type === "category" ? (
              <select
                value={values[field.key] || ""}
                onChange={(event) => updateValue(field.key, event.target.value)}
                className={selectClass}
              >
                <option value="">Select category</option>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.slug} value={option.slug}>
                    {option.name}
                  </option>
                ))}
              </select>
            ) : field.type === "file" ? (
              <div className="grid gap-3">
                <Input
                  type="file"
                  accept="application/pdf"
                  className={inputClass}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    if (file.type !== "application/pdf") {
                      toast({
                        title: "Invalid file",
                        description: "Please upload a PDF file.",
                      });
                      return;
                    }
                    const reader = new FileReader();
                    setUploadingPdf(true);
                    reader.onload = () => {
                      const result = typeof reader.result === "string" ? reader.result : "";
                      updateValue(field.key, result);
                      setUploadingPdf(false);
                      toast({
                        title: "PDF uploaded",
                        description: "File is stored locally.",
                      });
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                <Input
                  type="text"
                  placeholder="Or paste a PDF URL"
                  value={values[field.key] || ""}
                  onChange={(event) => updateValue(field.key, event.target.value)}
                  className={inputClass}
                />
                {uploadingPdf ? <p className="text-xs text-neutral-500">Uploading PDF…</p> : null}
              </div>
            ) : (
              <Input
                type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"}
                placeholder={
                  field.type === "images" || field.type === "tags" || field.type === "highlights"
                    ? "Separate values with commas"
                    : field.placeholder
                }
                value={values[field.key] || ""}
                onChange={(event) => updateValue(field.key, event.target.value)}
                className={inputClass}
              />
            )}
          </div>
        ))}
      </div>

      <div className={cn("mt-8 flex flex-wrap gap-3", isEnhancedLayout && "border-t border-neutral-100 pt-8")}>
        <Button
          onClick={handleSubmit}
          className={isEnhancedLayout ? "h-11 rounded-full bg-neutral-950 px-6 text-white hover:bg-neutral-800" : ""}
        >
          <Save className="mr-2 h-4 w-4" />
          Save locally
        </Button>
        <Button variant={isEnhancedLayout ? "outline" : "ghost"} asChild className={isEnhancedLayout ? "h-11 rounded-full border-neutral-300 bg-white" : ""}>
          <Link href={taskConfig.route} className="inline-flex items-center gap-2">
            View {taskConfig.label}
            {isEnhancedLayout ? <ArrowRight className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Link>
        </Button>
      </div>
    </div>
  );

  if (isEnhancedLayout) {
    const tips = taskKey === "profile" ? profileTips : sbmTips;
    const Icon = taskKey === "profile" ? UserRound : Bookmark;

    return (
      <div className="relative min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_55%,#fff7ed_100%)] text-neutral-950">
        <NavbarShell />
        <div className="pointer-events-none absolute left-[6%] top-28 hidden h-20 w-36 rounded-[1.25rem] bg-[#fde68a]/80 lg:block" />
        <div className="pointer-events-none absolute right-[8%] top-40 hidden h-24 w-40 rounded-[1.25rem] bg-[#e9d5ff]/75 lg:block" />

        <main className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild className="rounded-full border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50">
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Create
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{formConfig.title}</h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base">{formConfig.description}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
            <div className="space-y-6">
              <div className="rounded-[1.5rem] border border-amber-100 bg-[#fffbeb] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200 bg-white">
                    <Icon className="h-5 w-5 text-amber-800" />
                  </div>
                  <p className="text-sm font-semibold text-neutral-900">Before you publish</p>
                </div>
                <ul className="mt-4 space-y-3">
                  {tips.map((tip) => (
                    <li key={tip} className="flex gap-3 text-sm text-neutral-800">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[1.5rem] border border-violet-100 bg-[#ede9fe] p-6">
                <p className="text-sm font-semibold text-violet-950">What happens when you save</p>
                <p className="mt-2 text-sm leading-relaxed text-violet-900/85">
                  This draft is stored in your browser only. You can open it from your local posts link after save—perfect for demos and private sandboxes.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Shortcuts</p>
                <div className="mt-3 flex flex-col gap-2 text-sm">
                  <Link href="/help" className="font-medium text-neutral-900 underline-offset-2 hover:underline">
                    Help center
                  </Link>
                  <Link href={taskKey === "profile" ? "/profile" : "/sbm"} className="font-medium text-neutral-900 underline-offset-2 hover:underline">
                    {taskKey === "profile" ? "Explore profiles" : "Browse bookmarks"}
                  </Link>
                </div>
              </div>
            </div>

            {formBody}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavbarShell />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{formConfig.title}</h1>
            <p className="text-sm text-muted-foreground">{formConfig.description}</p>
          </div>
        </div>

        {formBody}
      </main>
    </div>
  );
}
