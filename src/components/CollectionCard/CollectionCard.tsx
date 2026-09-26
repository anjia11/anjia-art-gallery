import React from 'react';
import { Link } from 'react-router-dom';
import { Collection } from '../../types/Collection';
import { ArrowUpRight } from 'lucide-react';
import './CollectionCard.css';

interface CollectionCardProps {
  collection: Collection;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  return (
    <article className="collection-card">
      <Link
        to={`/collections/${collection.id}`}
        className="collection-card-link"
        aria-label={`View collection: ${collection.name}`}
      >
        <div className="collection-cover-wrapper">
          <img
            src={collection.coverImage}
            alt={collection.name}
            className="collection-cover"
            loading="lazy"
          />
          <div className="collection-overlay" />
          
          <div className="collection-count-badge">
            {collection.artworkCount ?? 0} {collection.artworkCount === 1 ? 'Work' : 'Works'}
          </div>

          <div className="collection-arrow-indicator">
            <ArrowUpRight size={18} />
          </div>
        </div>

        <div className="collection-info">
          <h3 className="collection-name">{collection.name}</h3>
          <p className="collection-desc">{collection.description}</p>
        </div>
      </Link>
    </article>
  );
};
