export interface RedirectData {
  title: string;
  desc: string;
  url: string;
  image: string;
  keywords: string;
  site_name: string;
  type: string;
  canonical?: string;
  author?: string;
  published_time?: string;
  modified_time?: string;
  clicks?: number;
  created_at?: string;
  updated_at?: string;
}

export interface RedirectForm {
  slug: string;
  title: string;
  desc: string;
  url: string;
  image: string;
  keywords: string;
  site_name: string;
  type: string;
  canonical?: string;
  author?: string;
}