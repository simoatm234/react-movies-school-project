import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Home from '../Home';
import ShowMovie from '../ShowMovie';
import PopularMovie from '../PopularMovie';

export const route = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { element: <ShowMovie />, path: 'movie/:id' },
      { element: <PopularMovie />, path: '/movies/popular' },
    ],
  },
]);
