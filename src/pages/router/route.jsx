import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Home from '../Home';
import ShowMovie from '../ShowMovie';
import PopularMovie from '../PopularMovie';
import TopRatedMovie from '../TopRatedMovie';
import UpcomingMovie from '../UpcomingMovie';

export const route = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { element: <ShowMovie />, path: 'movie/:id' },
      { element: <PopularMovie />, path: '/movies/popular' },
      { element: <TopRatedMovie />, path: '/movies/top-rated' },
      { element: <UpcomingMovie />, path: '/movies/upcoming' },
    ],
  },
]);
