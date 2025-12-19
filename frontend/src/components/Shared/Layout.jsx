import React from 'react';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import './Shared.css';

function Layout({ children }) {
  const { user } = useAuth();

  return (
    <div className={user ? 'app-layout-with-sidebar' : 'app-layout'}>
      {!user && <Navigation />}
      {user && <Sidebar />}
      <main className={user ? 'main-content-with-sidebar' : 'main-content'}>
        {children}
      </main>
    </div>
  );
}

export default Layout;
