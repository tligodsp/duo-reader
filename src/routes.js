import React from 'react';

import Library from './components/Library/Library';
import MangaInfo from './components/MangaInfo/MangaInfo';
import Reader from './components/Reader/Reader';
import Editor from './components/Editor/Editor';
import AddManga from './components/Editor/AddManga/AddManga';

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
    path: '/editor/add-manga',
    component: <AddManga />
  },
  {
    path: '/editor',
    component: <Editor />
  },
  {
    path: '/',
    component: <Library />
  }
];