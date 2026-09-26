import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Music2, VolumeX } from 'lucide-react';
import { GalleryService } from '../../services/GalleryService';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const siteConfig = GalleryService.getSiteConfig();
  const location = useLocation();

  useEffect(() => {
    const audio = new Audio('/music/NOCTURNE - kaizanblu.mp3');
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const fadeTo = useCallback((targetVolume: number, onComplete?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    const step = 0.02;
    const intervalMs = 40;
    fadeIntervalRef.current = window.setInterval(() => {
      const current = audio.volume;
      if (targetVolume > current) {
        audio.volume = Math.min(current + step, targetVolume);
      } else {
        audio.volume = Math.max(current - step, targetVolume);
      }
      if (Math.abs(audio.volume - targetVolume) < 0.001) {
        audio.volume = targetVolume;
        clearInterval(fadeIntervalRef.current!);
        fadeIntervalRef.current = null;
        onComplete?.();
      }
    }, intervalMs);
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMusicPlaying) {
      fadeTo(0, () => audio.pause());
      setIsMusicPlaying(false);
    } else {
      audio.volume = 0;
      audio.play();
      fadeTo(1);
      setIsMusicPlaying(true);
    }
  }, [isMusicPlaying, fadeTo]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="gallery-container navbar-container">
        <Link to="/" className="navbar-logo" aria-label="Go to Homepage">
          <span className="logo-symbol">
            <Sparkles size={16} />
          </span>
          <span className="logo-text">{siteConfig.artistName.toUpperCase()}</span>
          <span className="logo-sub">STUDIO</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          {/* Music Toggle - Desktop: left of Home */}
          <button
            id="music-toggle-desktop"
            className={`music-btn ${isMusicPlaying ? 'playing' : ''}`}
            onClick={toggleMusic}
            aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
            title={isMusicPlaying ? 'Pause music' : 'Play music'}
          >
            {isMusicPlaying ? <Music2 size={17} /> : <VolumeX size={17} />}
            <span className="music-btn-ripple" />
          </button>
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/gallery"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Gallery
          </NavLink>
          <NavLink
            to="/collections"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Collections
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            About
          </NavLink>
        </nav>

        {/* Mobile Right Controls */}
        <div className="mobile-controls">
          {/* Music Toggle - Mobile: left of toggle button */}
          <button
            id="music-toggle-mobile"
            className={`music-btn ${isMusicPlaying ? 'playing' : ''}`}
            onClick={toggleMusic}
            aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
            title={isMusicPlaying ? 'Pause music' : 'Play music'}
          >
            {isMusicPlaying ? <Music2 size={17} /> : <VolumeX size={17} />}
            <span className="music-btn-ripple" />
          </button>
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      <div className={`mobile-nav-panel ${mobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/gallery"
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
          >
            Gallery
          </NavLink>
          <NavLink
            to="/collections"
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
          >
            Collections
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
          >
            About
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
