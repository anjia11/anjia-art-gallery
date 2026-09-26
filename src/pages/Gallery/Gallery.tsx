import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GalleryService } from '../../services/GalleryService';
import { ArtworkGrid } from '../../components/ArtworkGrid/ArtworkGrid';
import { Lightbox } from '../../components/Lightbox/Lightbox';
import { Artwork, SortOrder } from '../../types/Artwork';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import './Gallery.css';

export const Gallery: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronization
  const initialCategory = searchParams.get('category') || 'All';
  const initialCollection = searchParams.get('collection') || 'all';
  const initialTag = searchParams.get('tag') || 'all';
  const initialSearch = searchParams.get('q') || '';
  const initialSort = (searchParams.get('sort') as SortOrder) || 'year-desc';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCollection, setSelectedCollection] = useState(initialCollection);
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [sortBy, setSortBy] = useState<SortOrder>(initialSort);

  // Lightbox state
  const [lightboxArtwork, setLightboxArtwork] = useState<Artwork | null>(null);

  // Metadata options
  const allCategories = useMemo(() => ['All', ...GalleryService.getAllCategories()], []);
  const allCollections = useMemo(() => GalleryService.getAllCollections(), []);
  const allTags = useMemo(() => GalleryService.getAllTags(), []);

  // Filter artworks using GalleryService
  const filteredArtworks = useMemo(() => {
    return GalleryService.filterArtworks({
      searchQuery,
      category: selectedCategory,
      collectionId: selectedCollection,
      tag: selectedTag,
      sortBy
    });
  }, [searchQuery, selectedCategory, selectedCollection, selectedTag, sortBy]);

  // Update query params
  const updateFilter = (
    newCategory: string,
    newCollection: string,
    newTag: string,
    newSearch: string,
    newSort: SortOrder
  ) => {
    setSelectedCategory(newCategory);
    setSelectedCollection(newCollection);
    setSelectedTag(newTag);
    setSearchQuery(newSearch);
    setSortBy(newSort);

    const params = new URLSearchParams();
    if (newCategory !== 'All') params.set('category', newCategory);
    if (newCollection !== 'all') params.set('collection', newCollection);
    if (newTag !== 'all') params.set('tag', newTag);
    if (newSearch) params.set('q', newSearch);
    if (newSort !== 'year-desc') params.set('sort', newSort);
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    updateFilter('All', 'all', 'all', '', 'year-desc');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedCollection !== 'all' ||
    selectedTag !== 'all' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'year-desc';

  return (
    <div className="gallery-page fade-in">
      <div className="gallery-container section-padding">
        {/* Page Header */}
        <div className="gallery-header">
          <div className="eyebrow">Digital Exhibition</div>
          <h1 className="gallery-title">Complete Gallery</h1>
          <p className="gallery-subtitle">
            Explore original paintings, dynamic character sheets, creature designs, and anatomy studies.
          </p>
        </div>

        {/* Filter & Controls Bar */}
        <div className="gallery-controls-card glass-panel">
          {/* Top Row: Search & Sort */}
          <div className="controls-top-row">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search by title, tag, creature, or tool..."
                value={searchQuery}
                onChange={(e) =>
                  updateFilter(selectedCategory, selectedCollection, selectedTag, e.target.value, sortBy)
                }
                className="gallery-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() =>
                    updateFilter(selectedCategory, selectedCollection, selectedTag, '', sortBy)
                  }
                  aria-label="Clear Search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="sort-wrapper">
              <ArrowUpDown size={16} className="sort-icon" />
              <select
                value={sortBy}
                onChange={(e) =>
                  updateFilter(
                    selectedCategory,
                    selectedCollection,
                    selectedTag,
                    searchQuery,
                    e.target.value as SortOrder
                  )
                }
                className="gallery-sort-select"
                aria-label="Sort artworks"
              >
                <option value="year-desc">Year: Newest First</option>
                <option value="year-asc">Year: Oldest First</option>
                <option value="title-asc">Title: A to Z</option>
              </select>
            </div>
          </div>

          {/* Category Pills Row */}
          <div className="categories-pill-row">
            <span className="filter-pill-label">Category:</span>
            <div className="pills-scroll-container">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() =>
                    updateFilter(cat, selectedCollection, selectedTag, searchQuery, sortBy)
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filters Row: Collection & Tag */}
          <div className="controls-secondary-row">
            <div className="filter-dropdown-group">
              <label htmlFor="collection-filter" className="filter-dropdown-label">
                Collection:
              </label>
              <select
                id="collection-filter"
                value={selectedCollection}
                onChange={(e) =>
                  updateFilter(selectedCategory, e.target.value, selectedTag, searchQuery, sortBy)
                }
                className="gallery-filter-select"
              >
                <option value="all">All Collections</option>
                {allCollections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name} ({col.artworkCount})
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-dropdown-group">
              <label htmlFor="tag-filter" className="filter-dropdown-label">
                Tag:
              </label>
              <select
                id="tag-filter"
                value={selectedTag}
                onChange={(e) =>
                  updateFilter(selectedCategory, selectedCollection, e.target.value, searchQuery, sortBy)
                }
                className="gallery-filter-select"
              >
                <option value="all">All Tags</option>
                {allTags.map((t) => (
                  <option key={t} value={t}>
                    #{t}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="reset-filters-btn"
                onClick={handleResetFilters}
              >
                <SlidersHorizontal size={14} />
                <span>Reset Filters</span>
              </button>
            )}

            <div className="results-counter">
              <span>{filteredArtworks.length}</span> {filteredArtworks.length === 1 ? 'artwork' : 'artworks'} found
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <ArtworkGrid
          artworks={filteredArtworks}
          emptyMessage="No artworks match your selected filters. Try resetting the filters to view all pieces."
          onQuickView={(art) => setLightboxArtwork(art)}
        />

        {/* Fullscreen Lightbox */}
        <Lightbox
          isOpen={lightboxArtwork !== null}
          artwork={lightboxArtwork}
          artworksList={filteredArtworks}
          onClose={() => setLightboxArtwork(null)}
          onNavigate={(art) => setLightboxArtwork(art)}
        />
      </div>
    </div>
  );
};
