import { notFound } from "next/navigation";

import { fetchTaskPostBySlug } from "@/lib/task-data";
import { getTaskConfig, type TaskKey } from "@/lib/site-config";
import type { SitePost } from "@/lib/site-connector";
import { TASK_DETAIL_PAGE_OVERRIDE_ENABLED, TaskDetailPageOverride } from "@/overrides/task-detail-page";
import { TaskDetailPageClient } from "@/components/tasks/task-detail-page-client";

// SERVER component: this module must NOT carry a "use client" directive.
// The directive applies to the whole module, so when it was at the top of this file the
// `await fetchTaskPostBySlug(...)` below ran in the visitor's browser. An async client
// component is re-invoked on every render attempt, so each page view fired that master-panel
// request over and over until Chrome ran out of sockets (thousands of requests, console full
// of net::ERR_INSUFFICIENT_RESOURCES, the tab pegging the CPU). Fetch once here on the server
// and hand the post to the client component for the interactive UI.
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
