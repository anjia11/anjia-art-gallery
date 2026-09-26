import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Artwork } from '../../types/Artwork';
import { Maximize2 } from 'lucide-react';
import './ArtworkCard.css';

interface ArtworkCardProps {
  artwork: Artwork;
  priority?: boolean;
  onQuickView?: (artwork: Artwork) => void;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  priority = false,
  onQuickView
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(artwork);
    }
  };

  return (
    <article className="artwork-card">
      <Link
        to={`/artwork/${artwork.id}`}
        className="artwork-card-link"
        aria-label={`View artwork: ${artwork.title}`}
      >
        <div className={`artwork-image-wrapper ${imageLoaded ? 'loaded' : 'loading'}`}>
          <img
            src={artwork.images.thumbnail}
            alt={artwork.title}
            className="artwork-thumbnail"
            loading={priority ? 'eager' : 'lazy'}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Cinematic subtle gradient overlay */}
          <div className="artwork-card-overlay">
            <div className="artwork-card-details">
              <div className="artwork-meta-row">
                <span className="artwork-category">{artwork.category}</span>
                <span className="artwork-year">{artwork.year}</span>
              </div>
              <h3 className="artwork-card-title">{artwork.title}</h3>
            </div>

            {onQuickView && (
              <button
                type="button"
                className="quick-view-action"
                onClick={handleQuickViewClick}
                aria-label={`Quick view ${artwork.title} in Lightbox`}
                title="View in Fullscreen Lightbox"
              >
                <Maximize2 size={16} />
              </button>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};
