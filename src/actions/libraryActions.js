import { GET_MANGAS } from './types';
// import { ipcRenderer } from 'electron';
const { ipcRenderer } = window.require("electron");

export const getMangas = () => dispatch => {
  ipcRenderer.send("library:getMangas");
  ipcRenderer.on("library:mangaList", (event, mangas) => {
    dispatch({
      type: GET_MANGAS,
      payload: mangas
    });
  });
};