import { combineReducers } from 'redux';

import libraryReducer from './libraryReducer';
import mangaReducer from './mangaReducer';
import chapterReducer from './chapterReducer';

export default combineReducers({
  library: libraryReducer,
  manga: mangaReducer,
  chapter: chapterReducer
});