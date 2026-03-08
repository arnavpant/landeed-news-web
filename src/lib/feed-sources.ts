import { FeedSource } from "./types";

export const feedSources: FeedSource[] = [
  {
    name: "ET Realty",
    url: "https://realty.economictimes.indiatimes.com/rss/topstories",
    category: "Residential",
  },
  {
    name: "ET Realty Latest",
    url: "https://realty.economictimes.indiatimes.com/rss/lateststories",
    category: "Commercial",
  },
  {
    name: "ET Property",
    url: "https://economictimes.indiatimes.com/industry/services/property-/-cstruction/rssfeeds/13358350.cms",
    category: "Residential",
  },
  {
    name: "Hindustan Times",
    url: "https://www.hindustantimes.com/feeds/rss/real-estate/rssfeed.xml",
    category: "Residential",
  },
  {
    name: "Times of India",
    url: "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms",
    category: "Residential",
  },
  {
    name: "Square Yards",
    url: "https://www.squareyards.com/blog/feed",
    category: "Residential",
  },
];
