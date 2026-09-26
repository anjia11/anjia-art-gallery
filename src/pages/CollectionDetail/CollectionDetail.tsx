import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { GalleryService } from '../../services/GalleryService';
import { ArtworkGrid } from '../../components/ArtworkGrid/ArtworkGrid';
import { Lightbox } from '../../components/Lightbox/Lightbox';
import { Artwork } from '../../types/Artwork';
import { ArrowLeft } from 'lucide-react';
import './CollectionDetail.css';

export const CollectionDetail: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const [lightboxArtwork, setLightboxArtwork] = useState<Artwork | null>(null);

  if (!collectionId) {
    return <Navigate to="/collections" replace />;
  }

  const collection = GalleryService.getCollectionById(collectionId);
  const artworks = GalleryService.getArtworksByCollection(collectionId);

  if (!collection) {
    return (
      <div className="gallery-container section-padding collection-not-found">
        <h2 className="font-serif">Collection Not Found</h2>
        <p>The requested collection could not be located in the gallery archives.</p>
        <Link to="/collections" className="hero-secondary-btn">
          <ArrowLeft size={16} />
          <span>Back to Collections</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="collection-detail-page fade-in">
      <div className="collection-hero-banner">
        <div className="banner-bg">
          <img src={collection.coverImage} alt="" className="banner-img" aria-hidden="true" />
          <div className="banner-gradient" />
        </div>

        <div className="gallery-container banner-container">
          <Link to="/collections" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Collections</span>
          </Link>

          <div className="collection-header-meta">
            <div className="eyebrow">Collection Archive</div>
            <h1 className="collection-title">{collection.name}</h1>
            <p className="collection-description">{collection.description}</p>
            <div className="collection-stats">
              <span className="stats-count">{artworks.length}</span>
              <span className="stats-label">{artworks.length === 1 ? 'Artwork' : 'Artworks'} in this collection</span>
            </div>
          </div>
        </div>
      </div>

      <div className="gallery-container section-padding">
        <ArtworkGrid
          artworks={artworks}
          emptyMessage="No artworks currently filed in this collection."
          onQuickView={(art) => setLightboxArtwork(art)}
        />
      </div>

      {/* Fullscreen Lightbox */}
      <Lightbox
        isOpen={lightboxArtwork !== null}
        artwork={lightboxArtwork}
        artworksList={artworks}
        onClose={() => setLightboxArtwork(null)}
        onNavigate={(art) => setLightboxArtwork(art)}
      />
    </div>
  );
};
