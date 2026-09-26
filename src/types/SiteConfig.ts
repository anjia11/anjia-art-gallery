export interface SocialLink {
  name: string;
  url: string;
  icon?: string;
}

export interface SiteConfig {
  artistName: string;
  title: string;
  tagline: string;
  bio: string;
  statement: string;
  location: string;
  email: string;
  tools: string[];
  socialLinks: SocialLink[];
}
