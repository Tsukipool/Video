import { defineCollection, z } from "astro:content";

const mediaUrl = z.string().refine(
  (value) => /^(https?:\/\/|\/)/.test(value),
  "媒体 URL 只允许 https://, http:// 或以 / 开头的本地路径"
);

const episodeSchema = z.object({
  id: z.string().min(1, "Episode 缺少 id"),
  title: z.string().min(1, "Episode 缺少 title"),
  source: mediaUrl,
});

const videoSchema = z.object({
  title: z.string().min(1, "缺少 title"),
  tags: z.array(z.string().min(1, "标签不能为空")).min(1, "缺少 tags"),
  cover: mediaUrl,
  description: z.string().optional(),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
  episodes: z.array(episodeSchema).min(1, "缺少 episodes"),
});

export const collections = {
  videos: defineCollection({
    type: "content",
    schema: videoSchema,
  }),
};
