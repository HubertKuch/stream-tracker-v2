import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import Main from './views/Main';
import { Toaster } from 'react-hot-toast';
import Streams from './views/Streams';
import Viewers from './views/Viewers';
import Monitor from './views/Monitor';

const container = document.getElementById('root');
const root = createRoot(container!);

const router = createBrowserRouter([
  { path: '/', element: <Main /> },
  { path: '/streamy', element: <Streams /> },
  { path: '/ogladajacy', element: <Viewers /> },
  { path: '/monitor', element: <Monitor /> },
  { path: '*', element: <Main /> },
]);

root.render(
  <React.StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </React.StrictMode>,
);
