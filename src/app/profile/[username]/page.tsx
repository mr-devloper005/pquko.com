import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/shared/footer";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { ContentImage } from "@/components/shared/content-image";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { Button } from "@/components/ui/button";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { buildPostUrl } from "@/lib/task-data";
import { buildPostMetadata, buildTaskMetadata } from "@/lib/seo";
import { fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG } from "@/lib/site-config";
import { Eye, Users } from "lucide-react";
import { ProfileActionBar } from "./profile-action-bar";

export const revalidate = 3;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeRichHtml = (html: string) =>
  html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\shref\s*=\s*(['"])javascript:.*?\1/gi, ' href="#"');

const formatRichHtml = (raw?: string | null, fallback = "Profile details will appear here once available.") => {
  const source = typeof raw === "string" ? raw.trim() : "";
  if (!source) return `<p>${escapeHtml(fallback)}</p>`;
  if (/<[a-z][\s\S]*>/i.test(source)) return sanitizeRichHtml(source);
  return source
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.replace(/\n/g, " ").trim())}</p>`)
    .join("");
};

export async function generateStaticParams() {
  const posts = await fetchTaskPosts("profile", 50);
  if (!posts.length) {
    return [{ username: "placeholder" }];
  }
  return posts.map((post) => ({ username: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  try {
    const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
    return post ? await buildPostMetadata("profile", post) : await buildTaskMetadata("profile");
  } catch (error) {
    console.warn("Profile metadata lookup failed", error);
    return await buildTaskMetadata("profile");
  }
}

export default async function ProfileDetailPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
  if (!post) {
    notFound();
  }
  const content = (post.content || {}) as Record<string, any>;
  const logoUrl = typeof content.logo === "string" ? content.logo : undefined;
  const brandName =
    (content.brandName as string | undefined) ||
    (content.companyName as string | undefined) ||
    (content.name as string | undefined) ||
    post.title;
  const website = content.website as string | undefined;
  const domain = website ? website.replace(/^https?:\/\//, "").replace(/\/.*$/, "") : undefined;
  const description =
    (content.description as string | undefined) ||
    post.summary ||
    "Profile details will appear here once available.";
  const descriptionHtml = formatRichHtml(description);
  const suggestedArticles = await fetchTaskPosts("article", 6);
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Profiles",
        item: `${baseUrl}/profile`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: brandName,
        item: `${baseUrl}/profile/${post.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <NavbarShell />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <SchemaJsonLd data={breadcrumbData} />
        
        {/* Hero Profile Card Section */}
        <section className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-b from-muted/50 to-background pb-12 pt-8">
          <div className="mx-auto max-w-3xl px-4">
            {/* Avatar and Brand */}
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-background bg-muted shadow-xl md:h-28 md:w-28">
                  {logoUrl ? (
                    <ContentImage 
                      src={logoUrl} 
                      alt={post.title} 
                      fill 
                      className="object-cover" 
                      sizes="112px" 
                      intrinsicWidth={112} 
                      intrinsicHeight={112} 
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary text-4xl font-bold text-primary-foreground">
                      {brandName.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Brand Name */}
              <p className="mt-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                {brandName}
              </p>
              
              {/* Main Title */}
              <h1 className="mt-2 text-2xl font-extrabold uppercase leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
                {post.title}
              </h1>
              
              {/* Description */}
              <article
                className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
              
              {/* Stats */}
              <div className="mt-5 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Eye className="h-3.5 w-3.5" />
                <span>10 Viewers</span>
                <span className="mx-2">•</span>
                <Users className="h-3.5 w-3.5" />
                <span>1 Follower</span>
              </div>
            </div>
          </div>
        </section>

        {/* Action Bar */}
        <ProfileActionBar website={website} />

        {/* Content Section */}
        <div className="mx-auto max-w-6xl pt-8">
          {suggestedArticles.length ? (
            <section>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-lg font-semibold text-foreground">More to explore</h2>
                <Link 
                  href="/articles" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  View all articles
                </Link>
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {suggestedArticles.slice(0, 6).map((article) => (
                  <TaskPostCard
                    key={article.id}
                    post={article}
                    href={buildPostUrl("article", article.slug)}
                    compact
                  />
                ))}
              </div>
            </section>
          ) : null}
          
          {/* Browse More Profiles */}
          <section className="mt-12">
            <div className="flex items-center justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-8"
                asChild
              >
                <Link href="/profile">
                  Browse all profiles
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
