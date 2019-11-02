import { combineReducers } from 'redux';

import libraryReducer from './libraryReducer';
import mangaReducer from './mangaReducer';

export default combineReducers({
  library: libraryReducer,
  manga: mangaReducer
});