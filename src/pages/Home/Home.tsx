import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GalleryService } from '../../services/GalleryService';
import { ArtworkGrid } from '../../components/ArtworkGrid/ArtworkGrid';
import { CollectionCard } from '../../components/CollectionCard/CollectionCard';
import { Lightbox } from '../../components/Lightbox/Lightbox';
import { Artwork } from '../../types/Artwork';
import { ArrowRight, ArrowUpRight, Eye } from 'lucide-react';
import './Home.css';

export const Home: React.FC = () => {
  const featuredArtworks = GalleryService.getFeaturedArtworks();
  const latestArtworks = GalleryService.getLatestArtworks(6);
  const collections = GalleryService.getAllCollections();
  const siteConfig = GalleryService.getSiteConfig();

  // Hero featured artwork selection
  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);
  const heroArtwork = featuredArtworks[selectedHeroIndex] || featuredArtworks[0];

  // Lightbox state
  const [lightboxArtwork, setLightboxArtwork] = useState<Artwork | null>(null);

  return (
    <div className="home-page fade-in">
      {/* Hero Section */}
      {heroArtwork && (
        <section className="hero-section" aria-label="Featured Artwork Showcase">
          <div className="hero-bg-backdrop">
            <img
              src={heroArtwork.images.full}
              alt=""
              className="hero-backdrop-img"
              aria-hidden="true"
            />
            <div className="hero-backdrop-gradient" />
          </div>

          <div className="gallery-container hero-container">
            <div className="hero-content">
              <div className="eyebrow">Featured Exhibition</div>
              <h1 className="hero-title">{heroArtwork.title}</h1>
              <p className="hero-description">{heroArtwork.description}</p>

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

              {/* Hero switcher if multiple featured */}
              {featuredArtworks.length > 1 && (
                <div className="hero-switcher" aria-label="Featured Artworks Selection">
                  <span className="switcher-label">Featured Works</span>
                  <div className="switcher-dots">
                    {featuredArtworks.map((item, idx) => (
                      <button
                        key={item.id}
                        className={`switcher-dot ${selectedHeroIndex === idx ? 'active' : ''}`}
                        onClick={() => setSelectedHeroIndex(idx)}
                        aria-label={`Select ${item.title}`}
                      >
                        <span className="dot-index">{idx + 1}</span>
                        <span className="dot-title">{item.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="hero-visual-frame">
              <Link to={`/artwork/${heroArtwork.id}`} className="hero-art-link">
                <img
                  src={heroArtwork.images.preview}
                  alt={heroArtwork.title}
                  className="hero-artwork-img"
                />
              </Link>
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
