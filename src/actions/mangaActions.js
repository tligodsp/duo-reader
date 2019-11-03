import { GET_CURRENT_MANGA, CLEAR_CURRENT_MANGA } from './types';
const { ipcRenderer } = window.require("electron");

export const getCurrentManga = (id) => dispatch => {
  ipcRenderer.send("manga:getCurrent", id);
  ipcRenderer.on("manga:current", (event, manga) => {
    dispatch({
      type: GET_CURRENT_MANGA,
      payload: manga
    });
  });
};

export const clearCurrentManga = () => {
  return {
    type: CLEAR_CURRENT_MANGA
  };
};