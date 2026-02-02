import React from 'react';

import Popular from '../component/Popular';
import Trending from '../component/Trending';
import HeroBaner from '../component/HeroBaner';

export default function Home() {
  return (
    <div>
      <HeroBaner />
      <Trending />
      <Popular  />
    </div>
  );
}
