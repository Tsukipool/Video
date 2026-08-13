const TAG_SLUG_MAP: Record<string, string> = {
  动画: "animation",
  科幻: "scifi",
  冒险: "adventure",
  纪录片: "documentary",
  奇幻: "fantasy",
  悬疑: "mystery",
  治愈: "healing",
  日常: "slice-of-life",
  热血: "action",
  旅行: "travel",
  自然: "nature",
  科普: "science",
};

const SLUG_TAG_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(TAG_SLUG_MAP).map(([name, slug]) => [slug, name])
);

export function isAsciiSlug(value: string): boolean {
  return /^[a-z0-9-]+$/.test(value);
}

export function tagSlug(name: string): string {
  const trimmed = name.trim();
  if (isAsciiSlug(trimmed)) return trimmed;
  const mapped = TAG_SLUG_MAP[trimmed];
  if (mapped) return mapped;
  let result = "";
  for (const char of trimmed) {
    if (isAsciiSlug(char)) {
      result += char.toLowerCase();
    } else {
      result += char
        .codePointAt(0)!
        .toString(16)
        .padStart(4, "0");
    }
  }
  return result || "tag";
}

export function tagNameFromSlug(slug: string): string | undefined {
  if (SLUG_TAG_MAP[slug]) return SLUG_TAG_MAP[slug];
  return slug;
}

export function videoSlugToTitleSlug(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}
