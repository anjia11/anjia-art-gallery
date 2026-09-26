import React from 'react';
import { Artwork } from '../../types/Artwork';
import { ArtworkCard } from '../ArtworkCard/ArtworkCard';
import './ArtworkGrid.css';

interface ArtworkGridProps {
  artworks: Artwork[];
  emptyMessage?: string;
  onQuickView?: (artwork: Artwork) => void;
}

export const ArtworkGrid: React.FC<ArtworkGridProps> = ({
  artworks,
  emptyMessage = 'No artworks found in this selection.',
  onQuickView
}) => {
  if (artworks.length === 0) {
    return (
      <div className="artwork-grid-empty">
        <p className="empty-title font-serif">No Works Found</p>
        <p className="empty-subtitle">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="artwork-grid">
      {artworks.map((artwork, index) => (
        <ArtworkCard
          key={artwork.id}
          artwork={artwork}
          priority={index < 4}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};
