import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getCollection, type CollectionEntry } from "astro:content";

export type VideoEntry = CollectionEntry<"videos">;

const VIDEO_INDEX = new Map<string, VideoEntry>();

function contentDirPath(): string {
  return join(process.cwd(), "src", "content", "videos");
}

function parseFrontmatterKey(raw: string, key: string): string | null {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const line = match[1].split(/\r?\n/).find((l) => new RegExp(`^\\s*${key}\\s*:`).test(l));
  if (!line) return null;
  const value = line.replace(new RegExp(`^\\s*${key}\\s*:\\s*`), "").trim();
  return value.replace(/^["']|["']$/g, "");
}

export function assertNoDuplicateSlugs(entries: VideoEntry[]): void {
  const seen = new Map<string, VideoEntry>();
  for (const entry of entries) {
    if (seen.has(entry.slug)) {
      throw new Error(`Video slug 重复: "${entry.slug}" 同时出现在 ${seen.get(entry.slug)!.id} 和 ${entry.slug}`);
    }
    seen.set(entry.slug, entry);
  }
}

export function assertAllHaveSlug(entries: VideoEntry[]): void {
  const dir = contentDirPath();
  const seen = new Map<string, string>();
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    const raw = readFileSync(join(dir, file), "utf-8");
    const slug = parseFrontmatterKey(raw, "slug");
    if (!slug) {
      throw new Error(`缺少 slug: ${file} 的 Frontmatter 必须包含 slug 字段`);
    }
    if (seen.has(slug)) {
      throw new Error(`Video slug 重复: "${slug}" 同时出现在 ${seen.get(slug)} 和 ${file}`);
    }
    seen.set(slug, file);
  }
}

export function assertNoDuplicateEpisodeIds(entry: VideoEntry): void {
  const seen = new Set<string>();
  for (const episode of entry.data.episodes) {
    if (seen.has(episode.id)) {
      throw new Error(`Video "${entry.slug}" 的 Episode ID 重复: "${episode.id}"`);
    }
    seen.add(episode.id);
  }
}

export function validateAll(entries: VideoEntry[]): void {
  assertAllHaveSlug(entries);
  assertNoDuplicateSlugs(entries);
  for (const entry of entries) {
    assertNoDuplicateEpisodeIds(entry);
  }
}

export async function getAllVideos(): Promise<VideoEntry[]> {
  if (VIDEO_INDEX.size > 0) return [...VIDEO_INDEX.values()];

  const entries = (await getCollection("videos")).sort((a, b) => {
    const aDate = a.data.publishedAt ?? "";
    const bDate = b.data.publishedAt ?? "";
    if (aDate !== bDate) return aDate < bDate ? 1 : -1;
    return a.data.title.localeCompare(b.data.title, "zh");
  });

  validateAll(entries);

  for (const entry of entries) {
    VIDEO_INDEX.set(entry.slug, entry);
  }
  return entries;
}

export async function getVideo(slug: string): Promise<VideoEntry | undefined> {
  await getAllVideos();
  return VIDEO_INDEX.get(slug);
}

export function getEpisode(entry: VideoEntry, episodeId: string) {
  return entry.data.episodes.find((episode) => episode.id === episodeId);
}

export function getEpisodeIndex(entry: VideoEntry, episodeId: string): number {
  return entry.data.episodes.findIndex((episode) => episode.id === episodeId);
}
