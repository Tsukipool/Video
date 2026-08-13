export interface Episode {
  id: string;
  title: string;
  source: string;
}

export interface Video {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  cover: string;
  description?: string;
  publishedAt?: string;
  updatedAt?: string;
  episodes: Episode[];
  body: string;
}

export interface Tag {
  name: string;
  slug: string;
}
