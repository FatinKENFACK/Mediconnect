import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Barre de navigation */}
      <Navbar />
      
      {/* Contenu principal avec marge pour la barre de navigation fixe */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      
      {/* Pied de page */}
      <Footer />
    </div>
  );
};

export default Layout;
