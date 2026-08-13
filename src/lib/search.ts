import type { VideoEntry } from "./videos";
import { getAllVideos } from "./videos";

export interface SearchIndexItem {
  slug: string;
  title: string;
  tags: string[];
  description: string;
  cover: string;
  episodeCount: number;
}

export async function buildSearchIndex(): Promise<SearchIndexItem[]> {
  const videos = await getAllVideos();
  return videos.map((video) => ({
    slug: video.slug,
    title: video.data.title,
    tags: video.data.tags,
    description: video.data.description ?? "",
    cover: video.data.cover,
    episodeCount: video.data.episodes.length,
  }));
}

export function searchVideos(index: SearchIndexItem[], query: string): SearchIndexItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return index.filter((item) => {
    const haystack = [item.title, item.description, ...item.tags].join("\n").toLowerCase();
    return haystack.includes(q);
  });
}
