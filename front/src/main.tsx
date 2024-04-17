import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import Main from './views/Main';

const container = document.getElementById('root');
const root = createRoot(container!);

const router = createBrowserRouter([
  { path: '/', element: <Main /> },
  { path: '/serwisy', element: <div /> },
  { path: '*', element: <Main /> },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
