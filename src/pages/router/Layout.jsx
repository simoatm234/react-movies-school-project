import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../../component/NavBar';
import Footer from '../../component/Footer';

export default function Layout() {
  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}
