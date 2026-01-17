import React, { useEffect, useState } from 'react';

import { api } from './app/Api';

export default function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const response = await api.fetchTrendingMovies();
      setData(response.data.results);
    };
    fetch();
  }, []);
  return <div>{JSON.stringify(data)}</div>;
}
