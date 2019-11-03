import { GET_CHAPTER_CONTENT, CHAPTER_CONTENT_LOADING, CHAPTER_CLEAR } from '../actions/types';

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
        chapter: {},
        loading: true
      };
    case CHAPTER_CLEAR:
      return initialState;
    default:
      return state;
  }
};

export default chapterReducer;