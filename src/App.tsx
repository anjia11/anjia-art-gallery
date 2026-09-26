import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { ScrollToTop } from './components/ScrollToTop';

import { Home } from './pages/Home/Home';
import { Gallery } from './pages/Gallery/Gallery';
import { Collections } from './pages/Collections/Collections';
import { CollectionDetail } from './pages/CollectionDetail/CollectionDetail';
import { ArtworkDetail } from './pages/ArtworkDetail/ArtworkDetail';
import { About } from './pages/About/About';

export const App: React.FC = () => {
  return (
    <div className="app-root">
      <ScrollToTop />
      <Navbar />
      <main className="app-main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:collectionId" element={<CollectionDetail />} />
          <Route path="/artwork/:artworkId" element={<ArtworkDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
