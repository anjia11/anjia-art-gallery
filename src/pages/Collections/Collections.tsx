import React from 'react';
import { GalleryService } from '../../services/GalleryService';
import { CollectionCard } from '../../components/CollectionCard/CollectionCard';
import './Collections.css';

export const Collections: React.FC = () => {
  const collections = GalleryService.getAllCollections();

  return (
    <div className="collections-page fade-in">
      <div className="gallery-container section-padding">
        <div className="collections-header">
          <div className="eyebrow">Visual Categories</div>
          <h1 className="collections-title">Curated Collections</h1>
          <p className="collections-subtitle">
            Artworks organized by subject, world-building theme, and creative exploration.
          </p>
        </div>

        <div className="collections-full-grid">
          {collections.map((col) => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      </div>
    </div>
  );
};
