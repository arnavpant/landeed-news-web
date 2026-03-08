export interface Article {
  id: string;
  headline: string;
  author: string | null;
  summary: string;
  imageUrl: string | null;
  sourceUrl: string;
  sourceName: string;
  publishedAt: Date;
  categories: string[];
  landeedId: string;
  riskTags: string[];
  trendIndicators: string[];
  viewCount: number;
  locations: string[];
}

export interface FeedSource {
  name: string;
  url: string;
  category: string;
}
