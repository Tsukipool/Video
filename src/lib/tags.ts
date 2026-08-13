import type { VideoEntry } from "./videos";
import { getAllVideos } from "./videos";
import { tagSlug, tagNameFromSlug } from "./slug";

export interface TagInfo {
  name: string;
  slug: string;
  count: number;
}

export async function getAllTags(): Promise<TagInfo[]> {
  const videos = await getAllVideos();
  const counts = new Map<string, number>();
  for (const video of videos) {
    for (const tag of video.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: tagSlug(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh"));
}

export async function getVideosByTagName(tagName: string): Promise<VideoEntry[]> {
  const videos = await getAllVideos();
  return videos.filter((video) => video.data.tags.includes(tagName));
}

export async function getVideosByTagSlug(slug: string): Promise<VideoEntry[]> {
  const name = tagNameFromSlug(slug);
  if (!name) return [];
  return getVideosByTagName(name);
}
