import { Artwork, ArtworkFilterParams } from '../types/Artwork';
import { Collection } from '../types/Collection';
import { SiteConfig } from '../types/SiteConfig';

import artworksRaw from '../data/artworks.json';
import collectionsRaw from '../data/collections.json';
import siteRaw from '../data/site.json';

const artworksData: Artwork[] = artworksRaw as Artwork[];
const collectionsData: Collection[] = collectionsRaw as Collection[];
const siteData: SiteConfig = siteRaw as SiteConfig;

export class GalleryService {
  /**
   * Returns all artworks
   */
  public static getAllArtworks(): Artwork[] {
    return [...artworksData];
  }

  /**
   * Retrieves a specific artwork by ID
   */
  public static getArtworkById(id: string): Artwork | undefined {
    return artworksData.find((art) => art.id.toLowerCase() === id.toLowerCase());
  }

  /**
   * Returns featured artworks for the homepage showcase
   */
  public static getFeaturedArtworks(): Artwork[] {
    return artworksData.filter((art) => art.featured);
  }

  /**
   * Returns the most recent artworks, optionally limited
   */
  public static getLatestArtworks(limit?: number): Artwork[] {
    const sorted = [...artworksData].sort((a, b) => b.year - a.year);
    return limit ? sorted.slice(0, limit) : sorted;
  }

  /**
   * Returns artworks belonging to a specific collection
   */
  public static getArtworksByCollection(collectionId: string): Artwork[] {
    const target = collectionId.toLowerCase();
    return artworksData.filter((art) =>
      art.collections.some((c) => c.toLowerCase() === target)
    );
  }

  /**
   * Returns artworks belonging to a specific category
   */
  public static getArtworksByCategory(category: string): Artwork[] {
    if (!category || category === 'All') return this.getAllArtworks();
    const target = category.toLowerCase();
    return artworksData.filter((art) => art.category.toLowerCase() === target);
  }

  /**
   * Searches artworks by title, description, tags, category, or tools
   */
  public static searchArtworks(query: string): Artwork[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.getAllArtworks();

    return artworksData.filter((art) => {
      const matchTitle = art.title.toLowerCase().includes(q);
      const matchDesc = art.description.toLowerCase().includes(q);
      const matchCategory = art.category.toLowerCase().includes(q);
      const matchTags = art.tags.some((t) => t.toLowerCase().includes(q));
      const matchTools = art.tools.some((tool) => tool.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchCategory || matchTags || matchTools;
    });
  }

  /**
   * Multi-criteria filtering and sorting
   */
  public static filterArtworks(params: ArtworkFilterParams): Artwork[] {
    let result = [...artworksData];

    // Search query
    if (params.searchQuery && params.searchQuery.trim()) {
      const q = params.searchQuery.trim().toLowerCase();
      result = result.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          art.description.toLowerCase().includes(q) ||
          art.category.toLowerCase().includes(q) ||
          art.tags.some((t) => t.toLowerCase().includes(q)) ||
          art.tools.some((tool) => tool.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (params.category && params.category !== 'All') {
      const cat = params.category.toLowerCase();
      result = result.filter((art) => art.category.toLowerCase() === cat);
    }

    // Collection filter
    if (params.collectionId && params.collectionId !== 'all') {
      const col = params.collectionId.toLowerCase();
      result = result.filter((art) =>
        art.collections.some((c) => c.toLowerCase() === col)
      );
    }

    // Tag filter
    if (params.tag && params.tag !== 'all') {
      const targetTag = params.tag.toLowerCase();
      result = result.filter((art) =>
        art.tags.some((t) => t.toLowerCase() === targetTag)
      );
    }

    // Sorting
    if (params.sortBy === 'year-asc') {
      result.sort((a, b) => a.year - b.year);
    } else if (params.sortBy === 'year-desc') {
      result.sort((a, b) => b.year - a.year);
    } else if (params.sortBy === 'title-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }

  /**
   * Returns all collections augmented with real artwork counts
   */
  public static getAllCollections(): Collection[] {
    return collectionsData.map((col) => ({
      ...col,
      artworkCount: this.getArtworksByCollection(col.id).length
    }));
  }

  /**
   * Retrieves collection by ID with artwork count
   */
  public static getCollectionById(id: string): Collection | undefined {
    const col = collectionsData.find((c) => c.id.toLowerCase() === id.toLowerCase());
    if (!col) return undefined;
    return {
      ...col,
      artworkCount: this.getArtworksByCollection(col.id).length
    };
  }

  /**
   * Retrieves previous and next artworks for detail navigation
   */
  public static getAdjacentArtworks(currentId: string): {
    prev: Artwork | null;
    next: Artwork | null;
  } {
    const index = artworksData.findIndex(
      (art) => art.id.toLowerCase() === currentId.toLowerCase()
    );
    if (index === -1) {
      return { prev: null, next: null };
    }

    const prev = index > 0 ? artworksData[index - 1] : artworksData[artworksData.length - 1];
    const next = index < artworksData.length - 1 ? artworksData[index + 1] : artworksData[0];

    return { prev, next };
  }

  /**
   * Returns unique categories across all artworks
   */
  public static getAllCategories(): string[] {
    const categories = new Set<string>();
    artworksData.forEach((art) => categories.add(art.category));
    return Array.from(categories);
  }

  /**
   * Returns unique tags across all artworks
   */
  public static getAllTags(): string[] {
    const tags = new Set<string>();
    artworksData.forEach((art) => art.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }

  /**
   * Returns site and artist metadata
   */
  public static getSiteConfig(): SiteConfig {
    return { ...siteData };
  }
}
