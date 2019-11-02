import React from 'react';

import Library from './components/Library/Library';
import MangaInfo from './components/MangaInfo/MangaInfo';
import Reader from './components/Reader/Reader';

export const routes = [
  {
    path: '/manga-info/:id',
    component: <MangaInfo />
  },
  {
    path: '/reader/:mangaId/:chapterId',
    component: <Reader />
  },
  {
    path: '/',
    component: <Library />
  }
];