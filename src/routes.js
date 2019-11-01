import React from 'react';

import Library from './components/Library/Library';
import MangaInfo from './components/MangaInfo/MangaInfo';

export const routes = [
  {
    path: '/manga-info/:id',
    component: <MangaInfo />
  },
  {
    path: '/',
    component: <Library />
  }
];