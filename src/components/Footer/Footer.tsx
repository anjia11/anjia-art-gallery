import React from 'react';
import { Link } from 'react-router-dom';
import { GalleryService } from '../../services/GalleryService';
import './Footer.css';

export const Footer: React.FC = () => {
  const siteConfig = GalleryService.getSiteConfig();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-root">
      <div className="gallery-container footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h3 className="footer-logo">{siteConfig.artistName.toUpperCase()}</h3>
            <p className="footer-tagline">{siteConfig.tagline}</p>
          </div>

          <div className="footer-nav-group">
            <span className="footer-heading">Exhibition</span>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/collections">Collections</Link></li>
              <li><Link to="/about">About the Artist</Link></li>
            </ul>
          </div>

          <div className="footer-social-group">
            <span className="footer-heading">Connect</span>
            <ul className="footer-links">
              {siteConfig.socialLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} {siteConfig.artistName}. All artworks and visual concepts reserved.
          </p>
          <div className="footer-aesthetic-note">
            <span>Digital Art Gallery</span>
            <span className="separator">•</span>
            <span>Minimalist Exhibition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
