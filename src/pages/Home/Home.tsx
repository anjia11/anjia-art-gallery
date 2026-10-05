import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { GalleryService } from '../../services/GalleryService';
import { ArtworkGrid } from '../../components/ArtworkGrid/ArtworkGrid';
import { CollectionCard } from '../../components/CollectionCard/CollectionCard';
import { Lightbox } from '../../components/Lightbox/Lightbox';
import { Artwork } from '../../types/Artwork';
import { ArrowRight, ArrowUpRight, Eye } from 'lucide-react';
import './Home.css';

const SLIDE_DURATION = 5500;

export const Home: React.FC = () => {
  const featuredArtworks = GalleryService.getFeaturedArtworks();
  const latestArtworks = GalleryService.getLatestArtworks(6);
  const collections = GalleryService.getAllCollections();
  const siteConfig = GalleryService.getSiteConfig();

  // Hero slideshow state
  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Lightbox state
  const [lightboxArtwork, setLightboxArtwork] = useState<Artwork | null>(null);

  // Touch swipe references for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const heroArtwork = featuredArtworks[selectedHeroIndex] || featuredArtworks[0];

  const nextSlide = useCallback(() => {
    if (featuredArtworks.length <= 1) return;
    setSelectedHeroIndex((prev) => (prev + 1) % featuredArtworks.length);
  }, [featuredArtworks.length]);

  const prevSlide = useCallback(() => {
    if (featuredArtworks.length <= 1) return;
    setSelectedHeroIndex((prev) => (prev - 1 + featuredArtworks.length) % featuredArtworks.length);
  }, [featuredArtworks.length]);

  const goToSlide = (index: number) => {
    setSelectedHeroIndex(index);
  };

  // Autoplay slideshow timer with pause-on-hover & fresh timer on manual change
  useEffect(() => {
    if (isPaused || featuredArtworks.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide, featuredArtworks.length, selectedHeroIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40;
    if (diff > threshold) {
      nextSlide();
    } else if (diff < -threshold) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  return (
    <div className="home-page fade-in">
      {/* Hero Section */}
      {heroArtwork && (
        <section
          className="hero-section"
          aria-label="Featured Artwork Showcase"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Ambient Crossfading Backdrop */}
          <div className="hero-bg-backdrop">
            {featuredArtworks.map((item, idx) => (
              <img
                key={item.id}
                src={item.images.full}
                alt=""
                className={`hero-backdrop-img ${idx === selectedHeroIndex ? 'active' : ''}`}
                aria-hidden="true"
              />
            ))}
            <div className="hero-backdrop-gradient" />
          </div>

          <div className="gallery-container hero-container">
            {/* 1. Header Block: Eyebrow, Title, Description */}
            <div className="hero-header-block">
              <div key={`header-${selectedHeroIndex}`} className="hero-animated-header">
                <div className="eyebrow">Featured Exhibition</div>
                <h1 className="hero-title">{heroArtwork.title}</h1>
                <p className="hero-description">{heroArtwork.description}</p>
              </div>
            </div>

            {/* 2. Visual Frame: Slideshow Artwork Images */}
            <div
              className="hero-visual-frame"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="hero-slideshow-track">
                {featuredArtworks.map((item, idx) => {
                  const isActive = idx === selectedHeroIndex;
                  return (
                    <div
                      key={item.id}
                      className={`hero-slide-item ${isActive ? 'active' : ''}`}
                      aria-hidden={!isActive}
                    >
                      <Link
                        to={`/artwork/${item.id}`}
                        className="hero-art-link"
                        tabIndex={isActive ? 0 : -1}
                        aria-label={`Explore ${item.title}`}
                      >
                        <img
                          src={item.images.preview}
                          alt={item.title}
                          className="hero-artwork-img"
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Slide Counter Badge */}
              {featuredArtworks.length > 1 && (
                <div
                  className="hero-slide-badge"
                  aria-label={`Slide ${selectedHeroIndex + 1} of ${featuredArtworks.length}`}
                >
                  <span className="badge-current">{String(selectedHeroIndex + 1).padStart(2, '0')}</span>
                  <span className="badge-sep">/</span>
                  <span className="badge-total">{String(featuredArtworks.length).padStart(2, '0')}</span>
                </div>
              )}
            </div>

            {/* 3. Details Block: Meta, CTA Group, and Switcher ("sisanya") */}
            <div className="hero-details-block">
              <div key={`details-${selectedHeroIndex}`} className="hero-animated-details">
                <div className="hero-meta-strip">
                  <span className="hero-tag-item">{heroArtwork.category}</span>
                  <span className="hero-separator">•</span>
                  <span className="hero-tag-item">{heroArtwork.year}</span>
                  <span className="hero-separator">•</span>
                  <span className="hero-tag-item">{heroArtwork.tools.join(', ')}</span>
                </div>

                <div className="hero-cta-group">
                  <Link to={`/artwork/${heroArtwork.id}`} className="hero-primary-btn">
                    <span>Explore Artwork</span>
                    <ArrowRight size={16} />
                  </Link>
                  <button
                    type="button"
                    className="hero-secondary-btn"
                    onClick={() => setLightboxArtwork(heroArtwork)}
                  >
                    <Eye size={16} />
                    <span>View Fullscreen</span>
                  </button>
                </div>
              </div>

              {/* Hero switcher for featured works */}
              {featuredArtworks.length > 1 && (
                <div className="hero-switcher" aria-label="Featured Artworks Selection">
                  <div className="switcher-top-row">
                    <span className="switcher-label">Featured Works</span>
                    <span className="switcher-autoplay-indicator">
                      {isPaused ? 'Paused' : 'Auto-playing'}
                    </span>
                  </div>
                  <div className="switcher-dots">
                    {featuredArtworks.map((item, idx) => {
                      const isActive = selectedHeroIndex === idx;
                      return (
                        <button
                          key={item.id}
                          className={`switcher-dot ${isActive ? 'active' : ''}`}
                          onClick={() => goToSlide(idx)}
                          aria-label={`Select ${item.title}`}
                        >
                          <span className="dot-index">{idx + 1}</span>
                          <span className="dot-title">{item.title}</span>
                          {isActive && !isPaused && (
                            <span className="dot-progress" key={`progress-${idx}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Latest Works Section */}
      <section className="section-padding latest-section">
        <div className="gallery-container">
          <div className="section-header-row">
            <div>
              <div className="eyebrow">Recent Additions</div>
              <h2 className="section-title">Latest Works</h2>
            </div>
            <Link to="/gallery" className="view-all-link">
              <span>View Full Gallery</span>
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <ArtworkGrid
            artworks={latestArtworks}
            onQuickView={(art) => setLightboxArtwork(art)}
          />
        </div>
      </section>

      {/* Collections Preview Section */}
      <section className="section-padding collections-preview-section">
        <div className="gallery-container">
          <div className="section-header-row">
            <div>
              <div className="eyebrow">Categorized Archives</div>
              <h2 className="section-title">Collections</h2>
            </div>
            <Link to="/collections" className="view-all-link">
              <span>All Collections</span>
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="collections-grid-preview">
            {collections.slice(0, 3).map((col) => (
              <CollectionCard key={col.id} collection={col} />
            ))}
          </div>
        </div>
      </section>

      {/* Short About Section */}
      <section className="section-padding short-about-section">
        <div className="gallery-container">
          <div className="short-about-card glass-panel">
            <div className="short-about-content">
              <div className="eyebrow">The Artist</div>
              <h2 className="about-lead-title">{siteConfig.artistName}</h2>
              <p className="about-lead-statement">"{siteConfig.statement}"</p>
              <p className="about-lead-bio">{siteConfig.bio}</p>

              <div className="about-action-row">
                <Link to="/about" className="hero-primary-btn">
                  <span>Read Full Biography</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxArtwork !== null}
        artwork={lightboxArtwork}
        artworksList={latestArtworks}
        onClose={() => setLightboxArtwork(null)}
        onNavigate={(art) => setLightboxArtwork(art)}
      />
    </div>
  );
};
