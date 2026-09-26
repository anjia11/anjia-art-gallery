import React from 'react';
import { GalleryService } from '../../services/GalleryService';
import { Mail, MapPin, ExternalLink, Sparkles, Monitor, Palette } from 'lucide-react';
import './About.css';

export const About: React.FC = () => {
  const siteConfig = GalleryService.getSiteConfig();

  return (
    <div className="about-page fade-in">
      <div className="gallery-container section-padding">
        <div className="about-grid">
          {/* Main Biography Column */}
          <div className="about-main-content">
            <div className="eyebrow">Biography & Vision</div>
            <h1 className="about-artist-name">{siteConfig.artistName}</h1>
            <p className="about-artist-role">{siteConfig.title}</p>

            <blockquote className="about-quote">
              "{siteConfig.statement}"
            </blockquote>

            <div className="about-text-body">
              <p>{siteConfig.bio}</p>
              <p>
                My creative process starts with raw silhouettes and value structure before transitioning into chromatic richness and textural nuance. Every illustration explores mood, atmosphere, and identity through careful digital brushwork and cinematic framing.
              </p>
            </div>

            {/* Hardware & Software Tools */}
            <div className="about-tools-block">
              <h2 className="about-section-heading font-serif">
                <Palette size={20} className="heading-icon" />
                <span>Creative Toolkit</span>
              </h2>
              <div className="about-tools-grid">
                {siteConfig.tools.map((tool) => (
                  <div key={tool} className="toolkit-item">
                    <Sparkles size={14} className="tool-sparkle" />
                    <span>{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Details & Inquiries */}
          <aside className="about-sidebar">
            <div className="sidebar-card glass-panel">
              <h3 className="sidebar-card-title font-serif">Exhibition & Inquiries</h3>

              <div className="sidebar-meta-item">
                <span className="sidebar-meta-label">
                  <MapPin size={15} /> Location
                </span>
                <span className="sidebar-meta-value">{siteConfig.location}</span>
              </div>

              <div className="sidebar-meta-item">
                <span className="sidebar-meta-label">
                  <Mail size={15} /> Direct Contact
                </span>
                <a href={`mailto:${siteConfig.email}`} className="sidebar-email-link">
                  {siteConfig.email}
                </a>
              </div>

              <div className="sidebar-meta-item">
                <span className="sidebar-meta-label">
                  <Monitor size={15} /> Studio Presence
                </span>
                <ul className="sidebar-social-list">
                  {siteConfig.socialLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sidebar-social-link"
                      >
                        <span>{link.name}</span>
                        <ExternalLink size={13} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
