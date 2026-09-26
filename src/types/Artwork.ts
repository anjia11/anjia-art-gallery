export interface ArtworkImages {
  thumbnail: string;
  preview: string;
  full: string;
}

export interface ArtworkProcessStep {
  title: string;
  image: string;
  description?: string;
}

export interface Artwork {
  id: string;
  title: string;
  description: string;
  year: number;
  category: string;
  collections: string[];
  tags: string[];
  tools: string[];
  featured: boolean;
  images: ArtworkImages;
  process?: ArtworkProcessStep[];
}

export type SortOrder = 'year-desc' | 'year-asc' | 'title-asc';

export interface ArtworkFilterParams {
  category?: string;
  collectionId?: string;
  tag?: string;
  searchQuery?: string;
  sortBy?: SortOrder;
}
