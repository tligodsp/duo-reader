import { GET_CHAPTER_CONTENT, CHAPTER_CONTENT_LOADING } from '../actions/types';

const initialState = {
  chapter: {},
  loading: false
};

const chapterReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CHAPTER_CONTENT:
      return {
        ...state,
        chapter: action.payload,
        loading: false
      };
    case CHAPTER_CONTENT_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};

export default chapterReducer;