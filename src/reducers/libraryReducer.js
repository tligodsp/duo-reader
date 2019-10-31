import { GET_MANGAS } from '../actions/types';

const initialState = {
  mangas: [],
  loading: false
};

const libraryReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_MANGAS:
      return {
        ...state,
        mangas: action.payload
      };
    default:
      return state;
  }
};

export default libraryReducer;