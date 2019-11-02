import { GET_CURRENT_MANGA } from "../actions/types";

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
    default:
      return state;
  }
};

export default mangaReducer;