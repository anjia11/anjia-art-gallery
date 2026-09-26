import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Layers } from 'lucide-react';
import { Artwork } from '../../types/Artwork';
import './Lightbox.css';

interface LightboxProps {
  artwork: Artwork | null;
  artworksList?: Artwork[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (artwork: Artwork) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  artwork: initialArtwork,
  artworksList = [],
  isOpen,
  onClose,
  onNavigate
}) => {
  const [currentArtwork, setCurrentArtwork] = useState<Artwork | null>(initialArtwork);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeProcessIndex, setActiveProcessIndex] = useState<number | null>(null);

  // Synchronize internal artwork whenever the prop changes or lightbox opens
  useEffect(() => {
    setCurrentArtwork(initialArtwork);
    setIsZoomed(false);
    setActiveProcessIndex(null);
  }, [initialArtwork, isOpen]);

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!currentArtwork || artworksList.length === 0) return;
      const currentIndex = artworksList.findIndex((item) => item.id === currentArtwork.id);
      if (currentIndex !== -1) {
        const nextIndex = (currentIndex + 1) % artworksList.length;
        const nextArt = artworksList[nextIndex];
        setCurrentArtwork(nextArt);
        setIsZoomed(false);
        setActiveProcessIndex(null);
        if (onNavigate) {
          onNavigate(nextArt);
        }
      }
    },
    [currentArtwork, artworksList, onNavigate]
  );

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!currentArtwork || artworksList.length === 0) return;
      const currentIndex = artworksList.findIndex((item) => item.id === currentArtwork.id);
      if (currentIndex !== -1) {
        const prevIndex = (currentIndex - 1 + artworksList.length) % artworksList.length;
        const prevArt = artworksList[prevIndex];
        setCurrentArtwork(prevArt);
        setIsZoomed(false);
        setActiveProcessIndex(null);
        if (onNavigate) {
          onNavigate(prevArt);
        }
      }
    },
    [currentArtwork, artworksList, onNavigate]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scroll while lightbox is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !currentArtwork || typeof document === 'undefined') return null;

  // Image source: if process step selected, display that process image; otherwise full image
  const currentImageSrc =
    activeProcessIndex !== null && currentArtwork.process && currentArtwork.process[activeProcessIndex]
      ? currentArtwork.process[activeProcessIndex].image
      : currentArtwork.images.full;

  const currentImageTitle =
    activeProcessIndex !== null && currentArtwork.process && currentArtwork.process[activeProcessIndex]
      ? `${currentArtwork.title} — ${currentArtwork.process[activeProcessIndex].title}`
      : currentArtwork.title;

  return createPortal(
    <div
      className="lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Lightbox view of ${currentArtwork.title}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top action bar */}
      <div className="lightbox-top-bar">
        <div className="lightbox-title-meta">
          <span className="lightbox-category">{currentArtwork.category}</span>
          <span className="lightbox-divider">•</span>
          <span className="lightbox-title font-serif">{currentImageTitle}</span>
        </div>

        <div className="lightbox-actions">
          <button
            type="button"
            className="lightbox-action-btn"
            onClick={() => setIsZoomed(!isZoomed)}
            title={isZoomed ? 'Fit to Screen' : 'Zoom to Actual Size'}
            aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
          >
            {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
          </button>
          <button
            type="button"
            className="lightbox-action-btn close-btn"
            onClick={onClose}
            title="Close (Esc)"
            aria-label="Close Lightbox"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Navigation Chevrons */}
      {artworksList.length > 1 && (
        <>
          <button
            type="button"
            className="lightbox-nav-btn prev-btn"
            onClick={handlePrev}
            title="Previous Artwork (Left Arrow)"
            aria-label="Previous Artwork"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            type="button"
            className="lightbox-nav-btn next-btn"
            onClick={handleNext}
            title="Next Artwork (Right Arrow)"
            aria-label="Next Artwork"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Image Stage */}
      <div
        className={`lightbox-stage ${isZoomed ? 'zoomed' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <img
          src={currentImageSrc}
          alt={currentImageTitle}
          className="lightbox-image"
          onClick={() => setIsZoomed(!isZoomed)}
        />
      </div>

      {/* Bottom Process Selector & Meta if available */}
      {currentArtwork.process && currentArtwork.process.length > 0 && (
        <div className="lightbox-process-bar">
          <span className="process-bar-label">
            <Layers size={14} /> Process Views:
          </span>
          <button
            type="button"
            className={`process-pill ${activeProcessIndex === null ? 'active' : ''}`}
            onClick={() => setActiveProcessIndex(null)}
          >
            Final Artwork
          </button>
          {currentArtwork.process.map((step, idx) => (
            <button
              key={step.title}
              type="button"
              className={`process-pill ${activeProcessIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveProcessIndex(idx)}
            >
              {step.title}
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
};
