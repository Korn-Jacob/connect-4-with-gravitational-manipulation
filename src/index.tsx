import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import TitleScreen from "./TitleScreen.tsx"
import Game from './Game.tsx';
import Guide from './Guide.tsx';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <TitleScreen />
  },
  {
    path: "play",
    element: <Game />
  },
  {
    path: "how-to-play",
    element: <Guide />
  }
])

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
