import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';

export const route = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [{ index: true }],
  },
]);
