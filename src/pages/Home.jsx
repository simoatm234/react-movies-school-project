import React from 'react';
import { useSelector } from 'react-redux';
import Popular from '../component/Popular';
import Trending from '../component/Trending';
import HeroBaner from '../component/HeroBaner';

export default function Home() {
  const loading = useSelector((state) => state.loading);

  return (
    <div>
      <HeroBaner />
      <Trending />
      <Popular />
    </div>
  );
}
