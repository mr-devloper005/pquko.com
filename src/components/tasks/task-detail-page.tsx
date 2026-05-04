"use client";

import { ContentImage } from "@/components/shared/content-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Globe, Phone, Tag, Mail, Bookmark, Share2, Heart, ExternalLink, Calendar, User, Grid3x3, List, Copy, Check } from "lucide-react";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildPostUrl, fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG, getTaskConfig, type TaskKey } from "@/lib/site-config";
import type { SitePost } from "@/lib/site-connector";
import { TaskImageCarousel } from "@/components/tasks/task-image-carousel";
import { cn } from "@/lib/utils";
import { ArticleComments } from "@/components/tasks/article-comments";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { RichContent, formatRichHtml } from "@/components/shared/rich-content";
import { getFactoryState } from "@/design/factory/get-factory-state";
import { getProductKind } from "@/design/factory/get-product-kind";
import { DirectoryTaskDetailPage } from "@/design/products/directory/task-detail-page";
import { TASK_DETAIL_PAGE_OVERRIDE_ENABLED, TaskDetailPageOverride } from "@/overrides/task-detail-page";
import { useState, useEffect } from "react";

type PostContent = {
  category?: string;
  location?: string;
  address?: string;
  website?: string;
  phone?: string;
  email?: string;
  description?: string;
  body?: string;
  excerpt?: string;
  author?: string;
  highlights?: string[];
  logo?: string;
  images?: string[];
  latitude?: number | string;
  longitude?: number | string;
  bookmarks?: Array<{
    title: string;
    url: string;
    description?: string;
    tags?: string[];
  }>;
};

const isValidImageUrl = (value?: string | null) =>
  typeof value === "string" && (value.startsWith("/") || /^https?:\/\//i.test(value));

const absoluteUrl = (value?: string | null) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (!value.startsWith("/")) return null;
  return `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${value}`;
};

const getContent = (post: SitePost): PostContent => {
  const content = post.content && typeof post.content === "object" ? post.content : {};
  return content as PostContent;
};

const formatArticleHtml = (content: PostContent, post: SitePost) => {
  const raw =
    (typeof content.body === "string" && content.body.trim()) ||
    (typeof content.description === "string" && content.description.trim()) ||
    (typeof post.summary === "string" && post.summary.trim()) ||
    "";

  return formatRichHtml(raw, "Details coming soon.");
};

const getImageUrls = (post: SitePost, content: PostContent) => {
  const media = Array.isArray(post.media) ? post.media : [];
  const mediaImages = media
    .map((item) => item?.url)
    .filter((url): url is string => isValidImageUrl(url));
  const contentImages = Array.isArray(content.images)
    ? content.images.filter((url): url is string => isValidImageUrl(url))
    : [];
  const merged = [...mediaImages, ...contentImages];
  if (merged.length) return merged;
  if (isValidImageUrl(content.logo)) return [content.logo as string];
  return ["/placeholder.svg?height=900&width=1400"];
};

const toNumber = (value?: number | string) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const buildMapEmbedUrl = (
  latitude?: number | string,
  longitude?: number | string,
  address?: string
) => {
  const lat = toNumber(latitude);
  const lon = toNumber(longitude);
  const normalizedAddress = typeof address === "string" ? address.trim() : "";
  const googleMapsEmbedApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY?.trim();

  if (googleMapsEmbedApiKey) {
    const query = lat !== null && lon !== null ? `${lat},${lon}` : normalizedAddress;
    if (!query) return null;
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(
      googleMapsEmbedApiKey
    )}&q=${encodeURIComponent(query)}`;
  }

  if (lat !== null && lon !== null) {
    const delta = 0.01;
    const left = lon - delta;
    const right = lon + delta;
    const bottom = lat - delta;
    const top = lat + delta;
    const bbox = `${left},${bottom},${right},${top}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
      bbox
    )}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lon}`)}`;
  }

  if (normalizedAddress) {
    return `https://www.google.com/maps?q=${encodeURIComponent(normalizedAddress)}&output=embed`;
  }

  return null;
};

// Client component wrapper for SBM detail page
function TaskDetailPageClient({ task, slug, post, taskConfig }: { 
  task: TaskKey; 
  slug: string; 
  post: SitePost; 
  taskConfig: any;
}) {
  const content = getContent(post);
  const isClassified = task === "classified";
  const isArticle = task === "article";
  const category = content.category || post.tags?.[0] || taskConfig?.label || task;
  const description = content.description || post.summary || "Details coming soon.";
  const descriptionHtml = !isArticle ? formatRichHtml(description, "Details coming soon.") : "";
  const articleHtml = isArticle ? formatArticleHtml(content, post) : "";
  const articleSummary =
    post.summary ||
    (typeof content.excerpt === "string" ? content.excerpt : "") ||
    "";
  const articleAuthor =
    (typeof content.author === "string" && content.author.trim()) ||
    post.authorName ||
    "Editorial Team";
  const articleDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const postTags = Array.isArray(post.tags) ? post.tags.filter((tag) => typeof tag === "string") : [];
  const location = content.address || content.location;
  const images = getImageUrls(post, content);
  const mapEmbedUrl = buildMapEmbedUrl(content.latitude, content.longitude, location);
  const isBookmark = task === "sbm" || task === "social";
  const hideSidebar = isClassified || isArticle || task === "image" || isBookmark;
  const articleUrl = `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${taskConfig?.route || "/articles"}/${post.slug}`;
  const articleImage = absoluteUrl(images[0]) || absoluteUrl(SITE_CONFIG.defaultOgImage);
  const articleSchema = isArticle
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: articleSummary || description,
        image: articleImage ? [articleImage] : [],
        author: {
          "@type": "Person",
          name: articleAuthor,
        },
        datePublished: post.publishedAt || undefined,
        dateModified: post.publishedAt || undefined,
        articleSection: category,
        keywords: postTags.join(", "),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
      }
    : null;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_CONFIG.baseUrl.replace(/\/$/, ""),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: taskConfig?.label || "Posts",
        item: `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${taskConfig?.route || "/"}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${taskConfig?.route || "/posts"}/${post.slug}`,
      },
    ],
  };
  const schemaPayload = articleSchema ? [articleSchema, breadcrumbSchema] : breadcrumbSchema;

  
  // Fetch related posts on client side
  const [related, setRelated] = useState<SitePost[]>([]);
  
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const relatedPosts = await fetchTaskPosts(task, 6);
        const filtered = relatedPosts
          .filter((item) => item.slug !== post.slug)
          .filter((item) => {
            if (!content.category) return true;
            const itemContent = getContent(item);
            return itemContent.category === content.category;
          })
          .slice(0, 3);
        setRelated(filtered);
      } catch (error) {
        console.warn("Failed to fetch related posts", error);
      }
    };
    
    fetchRelated();
  }, [task, post.slug, content.category]);

  return (
    <div className="min-h-screen bg-background">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SchemaJsonLd data={schemaPayload} />
        <Link
          href={taskConfig?.route || "/"}
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to {taskConfig?.label || "posts"}
        </Link>

        <div
          className={cn(
            "grid gap-10",
            hideSidebar ? "lg:grid-cols-1" : "lg:grid-cols-[2fr_1fr]"
          )}
        >
          <div className={cn(isClassified ? "space-y-8" : "")}>
            {isArticle ? (
              <div className="mx-auto w-full max-w-4xl space-y-6">
                <h1 className="text-4xl font-semibold leading-tight text-foreground">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span>By {articleAuthor}</span>
                  {articleDate ? <span>{articleDate}</span> : null}
                  <Badge variant="secondary" className="inline-flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    {category}
                  </Badge>
                </div>
                {postTags.length ? (
                  <div className="flex flex-wrap gap-2">
                    {postTags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
                {articleSummary ? (
                  <p className="text-base leading-7 text-muted-foreground">{articleSummary}</p>
                ) : null}
                {images[0] ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border bg-muted">
                    <ContentImage
                      src={images[0]}
                      alt={`${post.title} featured image`}
                      fill
                      className="object-cover"
                      intrinsicWidth={1600}
                      intrinsicHeight={900}
                    />
                  </div>
                ) : null}
                <RichContent html={articleHtml} className="leading-8 prose-p:my-6 prose-h2:my-8 prose-h3:my-6 prose-ul:my-6" />
                <ArticleComments slug={post.slug} />
              </div>
            ) : null}

            {!isArticle ? (
              <>
                {isBookmark ? (
                  <div className="space-y-8">
                    {/* Enhanced Header Section */}
                    <div className="rounded-3xl bg-gradient-to-br from-neutral-50 to-neutral-100 p-8 border border-neutral-200">
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <Badge variant="secondary" className="inline-flex items-center gap-1">
                              <Bookmark className="h-3.5 w-3.5" />
                              {category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              by {post.authorName || 'Anonymous'}
                            </span>
                          </div>
                          <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>
                          <RichContent html={descriptionHtml} className="text-base leading-relaxed max-w-3xl" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={cn(isClassified ? "w-full" : "")}>
                    <TaskImageCarousel images={images} />
                  </div>
                )}

                {!isBookmark && (
                  <div className={cn(isClassified ? "mx-auto w-full max-w-4xl" : "mt-6")}>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <Badge variant="secondary" className="inline-flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5" />
                        {category}
                      </Badge>
                      {location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {location}
                        </span>
                      )}
                    </div>
                    <h1 className="mt-4 text-3xl font-semibold text-foreground">{post.title}</h1>
                    <RichContent html={descriptionHtml} className="mt-3 max-w-3xl" />
                  </div>
                )}
              </>
            ) : null}

            {isClassified ? (
              <div className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">Business details</h2>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {content.website && (
                    <div className="flex items-start gap-2">
                      <Globe className="mt-0.5 h-4 w-4" />
                      <a
                        href={content.website}
                        className="break-all text-foreground hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {content.website}
                      </a>
                    </div>
                  )}
                  {content.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4" />
                      <span>{content.phone}</span>
                    </div>
                  )}
                  {content.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="mt-0.5 h-4 w-4" />
                      <a
                        href={`mailto:${content.email}`}
                        className="break-all text-foreground hover:underline"
                      >
                        {content.email}
                      </a>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {content.highlights?.length && !isArticle ? (
              <div className={cn("mt-8 rounded-2xl border border-border bg-card p-6", isClassified ? "mx-auto w-full max-w-4xl" : "")}>
                <h2 className="text-lg font-semibold text-foreground">Highlights</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {content.highlights.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {isClassified && mapEmbedUrl ? (
              <div className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">Location map</p>
                <div className="mt-4 overflow-hidden rounded-xl border border-border">
                  <iframe
                    title="Business location map"
                    src={mapEmbedUrl}
                    className="h-56 w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}

          </div>

          {!hideSidebar ? (
            <aside className="space-y-6">
              {isBookmark ? (
                <>
                  {/* Collection Info Card */}
                  <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Collection Info</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-neutral-600" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{post.authorName || 'Anonymous'}</div>
                          <div className="text-sm text-muted-foreground">Collection Creator</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-neutral-600" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            }) : 'No date'}
                          </div>
                          <div className="text-sm text-muted-foreground">Created</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                          <Bookmark className="h-5 w-5 text-neutral-600" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{content.bookmarks?.length || 0}</div>
                          <div className="text-sm text-muted-foreground">Total Bookmarks</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags Card */}
                  {postTags.length > 0 && (
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                      <h2 className="text-lg font-semibold text-foreground mb-4">Tags</h2>
                      <div className="flex flex-wrap gap-2">
                        {postTags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                                  </>
              ) : (
                <>
                  {/* Original sidebar for non-bookmark content */}
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold text-foreground">Listing details</h2>
                      <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                        {content.website && (
                          <div className="flex items-start gap-2">
                            <Globe className="mt-0.5 h-4 w-4" />
                            <a
                              href={content.website}
                              className="break-all text-foreground hover:underline"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {content.website}
                            </a>
                          </div>
                        )}
                        {content.phone && (
                          <div className="flex items-start gap-2">
                            <Phone className="mt-0.5 h-4 w-4" />
                            <span>{content.phone}</span>
                          </div>
                        )}
                        {content.email && (
                          <div className="flex items-start gap-2">
                            <Mail className="mt-0.5 h-4 w-4" />
                            <a
                              href={`mailto:${content.email}`}
                              className="break-all text-foreground hover:underline"
                            >
                              {content.email}
                            </a>
                          </div>
                        )}
                        {location && (
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4" />
                            <span>{location}</span>
                          </div>
                        )}
                      </div>
                    {content.website ? (
                      <Button className="mt-5 w-full" asChild>
                        <a href={content.website} target="_blank" rel="noreferrer">
                          Visit Website
                        </a>
                      </Button>
                    ) : null}
                  </div>

                  {mapEmbedUrl ? (
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <p className="text-sm font-semibold text-foreground">Location map</p>
                      <div className="mt-4 overflow-hidden rounded-xl border border-border">
                        <iframe
                          title="Business location map"
                          src={mapEmbedUrl}
                          className="h-56 w-full"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </aside>
          ) : null}
        </div>

        <section className="mt-16">
          {related.length ? (
            <div className="rounded-3xl bg-gradient-to-br from-neutral-50 to-neutral-100 p-8 border border-neutral-200">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">
                    Related Collections
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Discover more bookmark collections in {category}
                  </p>
                </div>
                {taskConfig?.route && (
                  <Link
                    href={taskConfig.route}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
                  >
                    View all
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <div key={item.id} className="group rounded-2xl bg-white p-6 border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                        <Bookmark className="h-4 w-4 text-neutral-600" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.tags?.[0] || category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      <Link href={buildPostUrl(task, item.slug)} className="block">
                        {item.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {item.summary || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {item.authorName || 'Anonymous'}
                      </span>
                      <Link 
                        href={buildPostUrl(task, item.slug)} 
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        View collection →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <nav className="mt-6 rounded-2xl border border-border bg-card/60 p-4">
            <p className="text-sm font-semibold text-foreground">Related links</p>
            <ul className="mt-2 space-y-2 text-sm">
              {related.map((item) => (
                <li key={`link-${item.id}`}>
                  <Link
                    href={buildPostUrl(task, item.slug)}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              {taskConfig?.route ? (
                <li>
                  <Link
                    href={taskConfig.route}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Browse all {taskConfig.label}
                  </Link>
                </li>
              ) : null}
            </ul>
          </nav>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// Server component for data fetching
export async function TaskDetailPage({ task, slug }: { task: TaskKey; slug: string }) {
  if (TASK_DETAIL_PAGE_OVERRIDE_ENABLED) {
    return await TaskDetailPageOverride({ task, slug });
  }

  const taskConfig = getTaskConfig(task);
  let post: SitePost | null = null;
  try {
    post = await fetchTaskPostBySlug(task, slug);
  } catch (error) {
    console.warn("Failed to load post detail", error);
  }

  if (!post) {
    notFound();
  }

  return <TaskDetailPageClient task={task} slug={slug} post={post} taskConfig={taskConfig} />;
}
