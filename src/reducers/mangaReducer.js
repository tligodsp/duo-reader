import { GET_CURRENT_MANGA, CLEAR_CURRENT_MANGA } from "../actions/types";

const initalState = {
  manga: {}
};

const mangaReducer = (state = initalState, action) => {
  switch (action.type) {
    case GET_CURRENT_MANGA:
      return {
        ...state,
        manga: action.payload
      };
    case CLEAR_CURRENT_MANGA:
      return initalState;
    default:
      return state;
  }
};

export default mangaReducer;