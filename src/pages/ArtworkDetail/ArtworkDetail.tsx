import React, { useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { GalleryService } from '../../services/GalleryService';
import { Lightbox } from '../../components/Lightbox/Lightbox';
import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Wrench,
  Tag,
  FolderOpen,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import './ArtworkDetail.css';

export const ArtworkDetail: React.FC = () => {
  const { artworkId } = useParams<{ artworkId: string }>();
  const navigate = useNavigate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedProcessIndex, setSelectedProcessIndex] = useState<number | null>(null);

  if (!artworkId) {
    return <Navigate to="/gallery" replace />;
  }

  const artwork = GalleryService.getArtworkById(artworkId);
  const allArtworks = GalleryService.getAllArtworks();
  const adjacent = GalleryService.getAdjacentArtworks(artworkId);

  if (!artwork) {
    return (
      <div className="gallery-container section-padding artwork-not-found">
        <h2 className="font-serif">Artwork Not Found</h2>
        <p>The requested artwork piece could not be located in the exhibition.</p>
        <Link to="/gallery" className="hero-secondary-btn">
          <ArrowLeft size={16} />
          <span>Back to Gallery</span>
        </Link>
      </div>
    );
  }

  // Determine current active preview image (either process step or artwork preview)
  const activeImage =
    selectedProcessIndex !== null && artwork.process && artwork.process[selectedProcessIndex]
      ? artwork.process[selectedProcessIndex].image
      : artwork.images.preview;

  const activeImageTitle =
    selectedProcessIndex !== null && artwork.process && artwork.process[selectedProcessIndex]
      ? `${artwork.title} (${artwork.process[selectedProcessIndex].title})`
      : artwork.title;

  return (
    <div className="artwork-detail-page fade-in">
      {/* Background ambient glow */}
      <div className="detail-ambient-glow">
        <img src={artwork.images.preview} alt="" className="detail-ambient-img" aria-hidden="true" />
      </div>

      <div className="gallery-container detail-container">
        {/* Top Navigation Bar */}
        <div className="detail-nav-bar">
          <Link to="/gallery" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Gallery</span>
          </Link>

          <div className="adjacent-nav">
            {adjacent.prev && (
              <Link
                to={`/artwork/${adjacent.prev.id}`}
                className="adjacent-btn"
                title={`Previous: ${adjacent.prev.title}`}
              >
                <ArrowLeft size={15} />
                <span className="adjacent-label">Previous</span>
              </Link>
            )}
            {adjacent.next && (
              <Link
                to={`/artwork/${adjacent.next.id}`}
                className="adjacent-btn"
                title={`Next: ${adjacent.next.title}`}
              >
                <span className="adjacent-label">Next</span>
                <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </div>

        {/* Main Artwork Cinema Stage */}
        <div className="artwork-stage-wrapper">
          <div
            className="artwork-stage"
            onClick={() => setLightboxOpen(true)}
            role="button"
            tabIndex={0}
            aria-label={`Open fullscreen view of ${artwork.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setLightboxOpen(true);
            }}
          >
            <img
              src={activeImage}
              alt={activeImageTitle}
              className="artwork-primary-image"
            />
            <div className="stage-zoom-hint">
              <Maximize2 size={16} />
              <span>Fullscreen View</span>
            </div>
          </div>
        </div>

        {/* Process Steps Timeline if available */}
        {artwork.process && artwork.process.length > 0 && (
          <section className="process-section" aria-label="Creation Process Timeline">
            <div className="process-header">
              <Layers size={18} className="process-icon" />
              <h2 className="process-title font-serif">Creation Process</h2>
            </div>

            <div className="process-steps-track">
              {/* Step 0: Final */}
              <button
                type="button"
                className={`process-step-card ${selectedProcessIndex === null ? 'active' : ''}`}
                onClick={() => setSelectedProcessIndex(null)}
              >
                <div className="process-thumb-wrap">
                  <img src={artwork.images.thumbnail} alt={artwork.title} />
                </div>
                <span className="process-step-title">Final Artwork</span>
              </button>

              {/* Other Process Steps */}
              {artwork.process.map((step, idx) => (
                <button
                  key={step.title}
                  type="button"
                  className={`process-step-card ${selectedProcessIndex === idx ? 'active' : ''}`}
                  onClick={() => setSelectedProcessIndex(idx)}
                >
                  <div className="process-thumb-wrap">
                    <img src={step.image} alt={step.title} />
                  </div>
                  <span className="process-step-title">{step.title}</span>
                  {step.description && (
                    <span className="process-step-desc">{step.description}</span>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Artwork Information Grid */}
        <div className="artwork-info-grid">
          {/* Left Column: Description & Title */}
          <div className="info-main-col">
            <div className="eyebrow">
              <Sparkles size={13} />
              <span>{artwork.category}</span>
            </div>
            <h1 className="artwork-headline">{artwork.title}</h1>
            <p className="artwork-description-text">{artwork.description}</p>
          </div>

          {/* Right Column: Metadata Cards */}
          <aside className="info-meta-col glass-panel">
            <div className="meta-card-item">
              <span className="meta-item-label">
                <Calendar size={15} /> Year
              </span>
              <span className="meta-item-value">{artwork.year}</span>
            </div>

            <div className="meta-card-item">
              <span className="meta-item-label">
                <FolderOpen size={15} /> Collections
              </span>
              <div className="meta-pill-group">
                {artwork.collections.map((colId) => (
                  <Link
                    key={colId}
                    to={`/collections/${colId}`}
                    className="meta-collection-link"
                  >
                    {colId}
                  </Link>
                ))}
              </div>
            </div>

            <div className="meta-card-item">
              <span className="meta-item-label">
                <Wrench size={15} /> Tools & Software
              </span>
              <div className="meta-pill-group">
                {artwork.tools.map((tool) => (
                  <span key={tool} className="meta-tool-pill">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="meta-card-item">
              <span className="meta-item-label">
                <Tag size={15} /> Tags
              </span>
              <div className="meta-pill-group">
                {artwork.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/gallery?tag=${tag}`}
                    className="meta-tag-pill"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom Adjacent Navigation */}
        <div className="detail-bottom-nav">
          {adjacent.prev ? (
            <Link to={`/artwork/${adjacent.prev.id}`} className="adjacent-bottom-link prev">
              <span className="adjacent-nav-direction">
                <ArrowLeft size={14} /> Previous Artwork
              </span>
              <span className="adjacent-nav-title font-serif">{adjacent.prev.title}</span>
            </Link>
          ) : <div />}

          {adjacent.next && (
            <Link to={`/artwork/${adjacent.next.id}`} className="adjacent-bottom-link next">
              <span className="adjacent-nav-direction">
                Next Artwork <ArrowRight size={14} />
              </span>
              <span className="adjacent-nav-title font-serif">{adjacent.next.title}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <Lightbox
        isOpen={lightboxOpen}
        artwork={artwork}
        artworksList={allArtworks}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newArt) => {
          navigate(`/artwork/${newArt.id}`);
          setSelectedProcessIndex(null);
        }}
      />
    </div>
  );
};
